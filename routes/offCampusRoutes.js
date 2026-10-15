const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// =====================================================
// EVIDENCE UPLOAD DIRECTORY & CONFIG
// =====================================================
const evidenceDir = path.join(__dirname, "..", "uploads", "evidence");
if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir, { recursive: true });
}

const evidenceStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, evidenceDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  }
});

const uploadEvidence = multer({
  storage: evidenceStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error("Only PDF, JPG, and PNG evidence documents are permitted."));
    }
    cb(null, true);
  }
});

// =====================================================
// 1. SUBMIT OFF-CAMPUS RECORD (STUDENT)
// =====================================================
router.post(
  "/",
  authenticate,
  authorizeRoles("student"),
  uploadEvidence.single("evidence"),
  async (req, res) => {
    const connection = await db.getConnection();
    try {
      const studentId = req.user.student_id;
      if (!studentId) {
        return res.status(403).json({ success: false, message: "Student profile not found." });
      }

      const { company_name, job_title, role_title, record_type, start_date, end_date, details, description } = req.body;
      const title = (job_title || role_title || "").trim();
      const det = (details || description || "").trim();

      if (!company_name || !company_name.trim()) {
        return res.status(400).json({ success: false, message: "Company name is required." });
      }
      if (!title) {
        return res.status(400).json({ success: false, message: "Job/Internship title is required." });
      }

      const validTypes = ["internship", "full_time_placement"];
      const recType = validTypes.includes(record_type) ? record_type : "internship";

      const evidenceFile = req.file ? req.file.filename : null;

      await connection.beginTransaction();

      // Insert submission
      const [result] = await connection.query(
        `INSERT INTO off_campus_submissions 
         (student_id, company_name, job_title, record_type, start_date, end_date, details, evidence_file, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          studentId,
          company_name.trim(),
          title,
          recType,
          start_date || null,
          end_date || null,
          det || null,
          evidenceFile
        ]
      );

      const submissionId = result.insertId;

      // Record in audit_logs
      await connection.query(
        `INSERT INTO audit_logs 
         (entity_type, entity_id, actor_id, actor_role, action, previous_status, new_status, comments) 
         VALUES ('off_campus_submission', ?, ?, 'student', 'SUBMITTED', NULL, 'pending', ?)`,
        [submissionId, req.user.user_id, `Off-campus ${recType} request submitted by student.`]
      );

      await connection.commit();

      res.status(201).json({
        success: true,
        message: "Off-campus placement request submitted successfully. Pending institutional T&P review.",
        submission_id: submissionId,
        submission: {
          id: submissionId,
          status: "pending"
        }
      });
    } catch (err) {
      await connection.rollback();
      console.error("Off-campus submission error:", err);
      res.status(500).json({ success: false, message: "Unable to submit off-campus record.", error: err.message });
    } finally {
      connection.release();
    }
  }
);

// =====================================================
// 2. GET STUDENT'S OWN SUBMISSIONS (STUDENT)
// =====================================================
router.get("/my", authenticate, authorizeRoles("student"), async (req, res) => {
  try {
    const studentId = req.user.student_id;
    if (!studentId) {
      return res.status(403).json({ success: false, message: "Student profile not found." });
    }

    const [submissions] = await db.query(
      `SELECT 
         sub.submission_id,
         sub.student_id,
         sub.company_name,
         sub.job_title,
         sub.record_type,
         sub.start_date,
         sub.end_date,
         sub.details,
         sub.evidence_file,
         sub.status,
         sub.reviewer_notes,
         sub.reviewed_at,
         sub.submitted_at,
         u.email AS reviewer_email
       FROM off_campus_submissions sub
       LEFT JOIN users u ON sub.reviewed_by = u.user_id
       WHERE sub.student_id = ?
       ORDER BY sub.submitted_at DESC`,
      [studentId]
    );

    res.json({ success: true, submissions });
  } catch (err) {
    console.error("Fetch student submissions error:", err);
    res.status(500).json({ success: false, message: "Unable to retrieve submissions." });
  }
});

// =====================================================
// 3. RESUBMIT INFORMATION (STUDENT)
// =====================================================
router.put(
  "/:id/resubmit",
  authenticate,
  authorizeRoles("student"),
  uploadEvidence.single("evidence"),
  async (req, res) => {
    const connection = await db.getConnection();
    try {
      const submissionId = Number(req.params.id);
      const studentId = req.user.student_id;

      const [existingRows] = await connection.query(
        "SELECT * FROM off_campus_submissions WHERE submission_id = ?",
        [submissionId]
      );

      if (existingRows.length === 0) {
        return res.status(404).json({ success: false, message: "Submission not found." });
      }

      const existing = existingRows[0];

      // Ownership check
      if (existing.student_id !== studentId) {
        return res.status(403).json({ success: false, message: "Unauthorized record access." });
      }

      // Must be in needs_more_info status
      if (existing.status !== "needs_more_info") {
        return res.status(400).json({
          success: false,
          message: `Cannot resubmit request with status '${existing.status}'. Resubmission is only allowed when status is 'needs_more_info'.`
        });
      }

      const { details } = req.body;
      const newEvidenceFile = req.file ? req.file.filename : existing.evidence_file;

      await connection.beginTransaction();

      await connection.query(
        `UPDATE off_campus_submissions 
         SET details = ?, evidence_file = ?, status = 'pending', updated_at = NOW() 
         WHERE submission_id = ?`,
        [details ? details.trim() : existing.details, newEvidenceFile, submissionId]
      );

      await connection.query(
        `INSERT INTO audit_logs 
         (entity_type, entity_id, actor_id, actor_role, action, previous_status, new_status, comments) 
         VALUES ('off_campus_submission', ?, ?, 'student', 'RESUBMITTED', 'needs_more_info', 'pending', ?)`,
        [submissionId, req.user.user_id, "Student provided additional requested information."]
      );

      await connection.commit();

      res.json({
        success: true,
        message: "Information resubmitted successfully. Request returned to T&P queue.",
        submission: { id: submissionId, status: "pending" }
      });
    } catch (err) {
      await connection.rollback();
      console.error("Resubmit error:", err);
      res.status(500).json({ success: false, message: "Resubmission failed.", error: err.message });
    } finally {
      connection.release();
    }
  }
);

// =====================================================
// 4. ADMIN QUEUE (T&P / ADMIN)
// =====================================================
router.get("/admin/queue", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const { status, search } = req.query;

    let sql = `
      SELECT 
        sub.submission_id,
        sub.student_id,
        sub.company_name,
        sub.job_title,
        sub.record_type,
        sub.start_date,
        sub.end_date,
        sub.details,
        sub.evidence_file,
        sub.status,
        sub.reviewer_notes,
        sub.reviewed_at,
        sub.submitted_at,
        s.name AS student_name,
        s.department AS student_department,
        s.gpa AS student_gpa,
        u.email AS student_email,
        reviewer.email AS reviewer_email
      FROM off_campus_submissions sub
      JOIN students s ON sub.student_id = s.student_id
      JOIN users u ON s.user_id = u.user_id
      LEFT JOIN users reviewer ON sub.reviewed_by = reviewer.user_id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== "all") {
      sql += " AND sub.status = ?";
      params.push(status);
    }

    if (search && search.trim()) {
      sql += " AND (s.name LIKE ? OR sub.company_name LIKE ? OR sub.job_title LIKE ? OR s.department LIKE ?)";
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    sql += " ORDER BY sub.submitted_at DESC";

    const [queue] = await db.query(sql, params);

    res.json({ success: true, count: queue.length, queue, submissions: queue });
  } catch (err) {
    console.error("Admin queue error:", err);
    res.status(500).json({ success: false, message: "Unable to retrieve off-campus queue." });
  }
});

// =====================================================
// 5. ADMIN DECISION: APPROVE / REJECT / REQUEST MORE INFO
// =====================================================
router.patch("/admin/:id/decision", authenticate, authorizeRoles("admin"), async (req, res) => {
  const connection = await db.getConnection();
  try {
    const submissionId = Number(req.params.id);
    const action = req.body.action || (req.body.status === "approved" ? "approve" : req.body.status === "rejected" ? "reject" : req.body.status === "needs_more_info" ? "request_info" : null);
    const notes = req.body.notes !== undefined ? req.body.notes : req.body.comments;

    if (!["approve", "reject", "request_info"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Permitted: 'approve', 'reject', 'request_info'."
      });
    }

    // PART 7 D / PART 16: Rejection requires a mandatory reason
    if (action === "reject" && (!notes || !notes.trim())) {
      return res.status(400).json({
        success: false,
        message: "Rejection requires an explicit reason explaining why the submission was rejected."
      });
    }

    if (action === "request_info" && (!notes || !notes.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please describe what additional information or evidence is required."
      });
    }

    const [existingRows] = await connection.query(
      "SELECT * FROM off_campus_submissions WHERE submission_id = ?",
      [submissionId]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ success: false, message: "Submission not found." });
    }

    const existing = existingRows[0];
    const previousStatus = existing.status;

    let newStatus = "pending";
    if (action === "approve") newStatus = "approved";
    if (action === "reject") newStatus = "rejected";
    if (action === "request_info") newStatus = "needs_more_info";

    await connection.beginTransaction();

    await connection.query(
      `UPDATE off_campus_submissions 
       SET status = ?, reviewer_notes = ?, reviewed_by = ?, reviewed_at = NOW() 
       WHERE submission_id = ?`,
      [newStatus, notes ? notes.trim() : null, req.user.user_id, submissionId]
    );

    // Append-only audit record
    await connection.query(
      `INSERT INTO audit_logs 
       (entity_type, entity_id, actor_id, actor_role, action, previous_status, new_status, comments) 
       VALUES ('off_campus_submission', ?, ?, 'admin', ?, ?, ?, ?)`,
      [
        submissionId,
        req.user.user_id,
        `DECISION_${action.toUpperCase()}`,
        previousStatus,
        newStatus,
        notes ? notes.trim() : `Decision: ${newStatus}`
      ]
    );

    await connection.commit();

    res.json({
      success: true,
      message: `Off-campus request has been ${newStatus}.`,
      submission_id: submissionId,
      previous_status: previousStatus,
      new_status: newStatus,
      submission: {
        id: submissionId,
        status: newStatus
      }
    });
  } catch (err) {
    await connection.rollback();
    console.error("Decision error:", err);
    res.status(500).json({ success: false, message: "Failed to process decision.", error: err.message });
  } finally {
    connection.release();
  }
});

// =====================================================
// 6. AUDIT HISTORY FOR SUBMISSION
// =====================================================
router.get("/:id/history", authenticate, async (req, res) => {
  try {
    const submissionId = Number(req.params.id);

    // Validate access
    const [subRows] = await db.query(
      "SELECT student_id FROM off_campus_submissions WHERE submission_id = ?",
      [submissionId]
    );

    if (subRows.length === 0) {
      return res.status(404).json({ success: false, message: "Submission not found." });
    }

    const sub = subRows[0];
    if (req.user.role === "student" && req.user.student_id !== sub.student_id) {
      return res.status(403).json({ success: false, message: "Unauthorized access to audit history." });
    }

    const [logs] = await db.query(
      `SELECT 
         log.log_id,
         log.entity_id,
         log.action,
         log.previous_status,
         log.new_status,
         log.comments,
         log.created_at,
         u.email AS actor_email,
         log.actor_role
       FROM audit_logs log
       JOIN users u ON log.actor_id = u.user_id
       WHERE log.entity_type = 'off_campus_submission' AND log.entity_id = ?
       ORDER BY log.created_at ASC`,
      [submissionId]
    );

    res.json({ success: true, history: logs });
  } catch (err) {
    console.error("Audit history error:", err);
    res.status(500).json({ success: false, message: "Unable to retrieve audit history." });
  }
});

// =====================================================
// 7. SECURE EVIDENCE DOWNLOAD / STREAMING
// =====================================================
router.get("/evidence/:filename", authenticate, async (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(evidenceDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Evidence file not found." });
    }

    // Verify user authorization: student owner or admin or faculty in student's department
    const [subRows] = await db.query(
      `SELECT sub.student_id, s.department 
       FROM off_campus_submissions sub
       JOIN students s ON sub.student_id = s.student_id
       WHERE sub.evidence_file = ?`,
      [filename]
    );

    if (subRows.length > 0) {
      const rec = subRows[0];
      if (req.user.role === "student" && req.user.student_id !== rec.student_id) {
        return res.status(403).json({ success: false, message: "Unauthorized file access." });
      }
      if (req.user.role === "faculty" && req.user.department !== rec.department) {
        return res.status(403).json({ success: false, message: "Unauthorized cross-department file access." });
      }
    } else if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized file access." });
    }

    res.sendFile(filePath);
  } catch (err) {
    console.error("Evidence file stream error:", err);
    res.status(500).json({ success: false, message: "Unable to download evidence." });
  }
});

module.exports = router;
