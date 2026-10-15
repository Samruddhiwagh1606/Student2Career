const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

// ================================
// ROUTE IMPORTS
// ================================

const studentRoutes = require("./routes/studentRoutes");
const internshipRoutes = require("./routes/internshipRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const evaluationRoutes = require("./routes/evaluationRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const companyRoutes = require("./routes/companyRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const companyFeedbackRoutes = require("./routes/companyFeedbackRoutes");
const offCampusRoutes = require("./routes/offCampusRoutes");
const auditRoutes = require("./routes/auditRoutes");
const { generateToken, authenticate, authorizeRoles } = require("./middleware/auth");

// ================================
// CREATE APP
// ================================

const app = express();

// ================================
// MIDDLEWARE
// ================================

app.use(cors());
app.use(express.json());


// =====================================================
// FACULTY REPORTS
// IMPORTANT:
// This route MUST come before /api/faculty
// =====================================================

app.get("/api/faculty/:facultyId/reports", async (req, res) => {

    try {

        const facultyId = Number(req.params.facultyId);

        if (!facultyId) {
            return res.status(400).json({
                success: false,
                message: "Invalid faculty ID."
            });
        }

        // ---------------------------------------------
        // TOTAL INTERNSHIPS
        // ---------------------------------------------

        const [[internships]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM internships
            WHERE posted_by = ?
        `, [facultyId]);


        // ---------------------------------------------
        // TOTAL APPLICATIONS
        // ---------------------------------------------

        const [[applications]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications a
            INNER JOIN internships i
                ON a.internship_id = i.internship_id
            WHERE i.posted_by = ?
        `, [facultyId]);


        // ---------------------------------------------
        // PENDING APPLICATIONS
        // ---------------------------------------------

        const [[pending]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications a
            INNER JOIN internships i
                ON a.internship_id = i.internship_id
            WHERE i.posted_by = ?
            AND a.status = 'pending'
        `, [facultyId]);


        // ---------------------------------------------
        // SHORTLISTED APPLICATIONS
        // ---------------------------------------------

        const [[shortlisted]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications a
            INNER JOIN internships i
                ON a.internship_id = i.internship_id
            WHERE i.posted_by = ?
            AND a.status = 'shortlisted'
        `, [facultyId]);


        // ---------------------------------------------
        // ACCEPTED APPLICATIONS
        // ---------------------------------------------

        const [[accepted]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications a
            INNER JOIN internships i
                ON a.internship_id = i.internship_id
            WHERE i.posted_by = ?
            AND a.status = 'accepted'
        `, [facultyId]);


        // ---------------------------------------------
        // REJECTED APPLICATIONS
        // ---------------------------------------------

        const [[rejected]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications a
            INNER JOIN internships i
                ON a.internship_id = i.internship_id
            WHERE i.posted_by = ?
            AND a.status = 'rejected'
        `, [facultyId]);


        // ---------------------------------------------
        // INTERVIEWS
        // ---------------------------------------------

        const [[interviews]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM interviews iv
            INNER JOIN applications a
                ON iv.application_id = a.application_id
            INNER JOIN internships i
                ON a.internship_id = i.internship_id
            WHERE i.posted_by = ?
        `, [facultyId]);


        // ---------------------------------------------
        // EVALUATIONS
        // ---------------------------------------------

        const [[evaluations]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM evaluations e
            INNER JOIN applications a
                ON e.application_id = a.application_id
            INNER JOIN internships i
                ON a.internship_id = i.internship_id
            WHERE i.posted_by = ?
        `, [facultyId]);


        // ---------------------------------------------
        // AVERAGE EVALUATION
        // ---------------------------------------------

        const [[averageEvaluation]] = await db.query(`
            SELECT
                ROUND(
                    AVG(
                        (
                            technical_score +
                            communication_score +
                            teamwork_score +
                            punctuality_score
                        ) / 4
                    ),
                    2
                ) AS average
            FROM evaluations e
            INNER JOIN applications a
                ON e.application_id = a.application_id
            INNER JOIN internships i
                ON a.internship_id = i.internship_id
            WHERE i.posted_by = ?
        `, [facultyId]);


        // ---------------------------------------------
        // INTERNSHIP-WISE STATISTICS
        // ---------------------------------------------

        const [internshipStats] = await db.query(`
            SELECT
                i.internship_id,
                i.title,
                i.status,
                c.name AS company_name,

                COUNT(
                    DISTINCT a.application_id
                ) AS application_count,

                COUNT(
                    DISTINCT CASE
                        WHEN a.status = 'shortlisted'
                        THEN a.application_id
                    END
                ) AS shortlisted_count,

                COUNT(
                    DISTINCT CASE
                        WHEN a.status = 'accepted'
                        THEN a.application_id
                    END
                ) AS accepted_count

            FROM internships i

            INNER JOIN companies c
                ON i.company_id = c.company_id

            LEFT JOIN applications a
                ON i.internship_id = a.internship_id

            WHERE i.posted_by = ?

            GROUP BY
                i.internship_id,
                i.title,
                i.status,
                c.name

            ORDER BY i.internship_id DESC
        `, [facultyId]);


        // ---------------------------------------------
        // FINAL RESPONSE
        // ---------------------------------------------

        res.json({

            success: true,

            summary: {
                internships: internships.total,
                applications: applications.total,
                pending: pending.total,
                shortlisted: shortlisted.total,
                accepted: accepted.total,
                rejected: rejected.total,
                interviews: interviews.total,
                evaluations: evaluations.total,
                averageEvaluation:
                    averageEvaluation.average || 0
            },

            internshipStats

        });


    } catch (error) {

        console.error(
            "Faculty reports error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to generate faculty reports.",

            error:
                error.message

        });

    }

});


// ================================
// NORMAL ROUTE REGISTRATION
// ================================

// Backend home route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "College2Career Backend is Running!",
        status: "OK"
    });
});

app.use("/api/students", studentRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/company-feedback", companyFeedbackRoutes);
app.use("/api/off-campus", offCampusRoutes);
app.use("/api/admin/audit", auditRoutes);


// ================================
// DATABASE TEST
// ================================

app.get("/api/test-db", async (req, res) => {

    try {

        const [result] = await db.query(
            "SELECT 1 AS test"
        );

        res.json({
            success: true,
            message:
                "Student2Career database connected successfully!",
            result: result
        });

    } catch (error) {

        console.error(
            "Database error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Database connection failed",
            error: error.message
        });

    }

});


// ================================
// DATABASE INTERNSHIP DEBUG
// ================================

app.get("/api/debug-internships", async (req, res) => {

    try {

        const [tables] = await db.query(
            "SHOW TABLES"
        );

        const [internships] = await db.query(
            "SELECT * FROM internships"
        );

        res.json({

            database:
                process.env.DB_NAME,

            tables:
                tables,

            internship_count:
                internships.length,

            internships:
                internships

        });

    } catch (error) {

        console.error(
            "DEBUG ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            error:
                error.message

        });

    }

});


// ================================
// LOGIN API
// ================================

app.post("/api/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required."
            });

        }


        const [users] = await db.query(
            `
            SELECT
                user_id,
                email,
                password,
                role
            FROM users
            WHERE email = ?
            `,
            [email]
        );


        if (users.length === 0) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password."
            });

        }


        const user = users[0];


        if (user.password !== password) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password."
            });

        }


        let profile = null;


        // ---------------------------------------------
        // STUDENT PROFILE
        // ---------------------------------------------

        if (user.role === "student") {

            const [students] = await db.query(
                `
                SELECT
                    student_id,
                    name,
                    phone,
                    department,
                    gpa,
                    resume
                FROM students
                WHERE user_id = ?
                `,
                [user.user_id]
            );

            profile =
                students[0] || null;

        }


        // ---------------------------------------------
        // FACULTY PROFILE
        // ---------------------------------------------

        if (user.role === "faculty") {

            const [faculty] = await db.query(
                `
                SELECT
                    faculty_id,
                    name,
                    department
                FROM faculty
                WHERE user_id = ?
                `,
                [user.user_id]
            );

            profile =
                faculty[0] || null;

        }


        // ---------------------------------------------
        // TOKEN GENERATION & LOGIN RESPONSE
        // ---------------------------------------------

        const tokenPayload = {
            user_id: user.user_id,
            email: user.email,
            role: user.role,
            student_id: profile?.student_id || null,
            faculty_id: profile?.faculty_id || null,
            department: profile?.department || null
        };

        const token = generateToken(tokenPayload);

        res.json({

            success: true,

            message:
                "Login successful.",

            token:
                token,

            user: {

                user_id:
                    user.user_id,

                email:
                    user.email,

                role:
                    user.role,

                student_id:
                    profile?.student_id || null,

                faculty_id:
                    profile?.faculty_id || null,

                department:
                    profile?.department || null,

                token:
                    token,

                profile:
                    profile

            }

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Login failed.",

            error:
                error.message

        });

    }

});


// =====================================================
// ADMIN REPORTS (RECONCILED PLACEMENT & SYSTEM ANALYTICS)
// =====================================================

app.get("/api/admin/reports", authenticate, authorizeRoles("admin"), async (req, res) => {

    try {

        // -----------------------------
        // BASIC INSTITUTIONAL COUNTS
        // -----------------------------

        const [[students]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM students
        `);

        const [[faculty]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM faculty
        `);

        const [[companies]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM companies
        `);

        const [[internships]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM internships
        `);

        const [[applications]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications
        `);

        // -----------------------------
        // APPLICATION STATUSES (RAW)
        // -----------------------------

        const [[accepted]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications
            WHERE status = 'accepted'
        `);

        const [[shortlisted]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications
            WHERE status = 'shortlisted'
        `);

        const [[rejected]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications
            WHERE status = 'rejected'
        `);

        const [[pending]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications
            WHERE status = 'pending'
        `);

        const [[withdrawn]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications
            WHERE status = 'withdrawn'
        `);

        // -----------------------------
        // OFF-CAMPUS OUTCOMES
        // -----------------------------

        const [[offCampusApproved]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM off_campus_submissions
            WHERE status = 'approved'
        `);

        const [[offCampusPending]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM off_campus_submissions
            WHERE status = 'pending'
        `);

        const [[offCampusNeedsInfo]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM off_campus_submissions
            WHERE status = 'needs_more_info'
        `);

        const [[offCampusRejected]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM off_campus_submissions
            WHERE status = 'rejected'
        `);

        const [[offCampusTotal]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM off_campus_submissions
        `);

        // -----------------------------
        // RECONCILED UNIQUE PLACED STUDENTS
        // (A student with multiple offers or both campus & off-campus is counted ONCE)
        // -----------------------------

        const [[uniquePlacedResult]] = await db.query(`
            SELECT COUNT(DISTINCT student_id) AS total
            FROM (
                SELECT student_id FROM applications WHERE status = 'accepted'
                UNION
                SELECT student_id FROM off_campus_submissions WHERE status = 'approved'
            ) AS placed_students
        `);
        const uniquePlaced = Number(uniquePlacedResult.total);

        const [[campusUniquePlaced]] = await db.query(`
            SELECT COUNT(DISTINCT student_id) AS total
            FROM applications WHERE status = 'accepted'
        `);

        const [[offCampusUniquePlaced]] = await db.query(`
            SELECT COUNT(DISTINCT student_id) AS total
            FROM off_campus_submissions WHERE status = 'approved'
        `);

        const placementRate = students.total > 0
            ? Number(((uniquePlaced / students.total) * 100).toFixed(1))
            : 0;

        // -----------------------------
        // RECONCILED DEPARTMENT-WISE PLACEMENT BREAKDOWN
        // -----------------------------

        const [departmentStats] = await db.query(`
            SELECT 
                COALESCE(s.department, 'Not Specified') AS department,
                COUNT(DISTINCT s.student_id) AS total_students,
                COUNT(DISTINCT CASE WHEN a.status = 'accepted' THEN s.student_id END) AS campus_placed_students,
                COUNT(DISTINCT CASE WHEN sub.status = 'approved' THEN s.student_id END) AS off_campus_placed_students,
                COUNT(DISTINCT CASE WHEN a.status = 'accepted' OR sub.status = 'approved' THEN s.student_id END) AS unique_placed_students,
                COUNT(DISTINCT a.application_id) AS total_applications
            FROM students s
            LEFT JOIN applications a ON s.student_id = a.student_id
            LEFT JOIN off_campus_submissions sub ON s.student_id = sub.student_id
            GROUP BY COALESCE(s.department, 'Not Specified')
            ORDER BY total_students DESC
        `);

        const enrichedDeptStats = departmentStats.map(d => ({
            ...d,
            placement_percentage: d.total_students > 0
                ? Number(((d.unique_placed_students / d.total_students) * 100).toFixed(1))
                : 0
        }));

        // -----------------------------
        // COMPANY-WISE INTERNSHIPS
        // -----------------------------

        const [companyStats] = await db.query(`
            SELECT
                c.name AS company_name,
                COUNT(i.internship_id) AS total_internships
            FROM companies c
            LEFT JOIN internships i
                ON c.company_id = i.company_id
            GROUP BY
                c.company_id,
                c.name
            ORDER BY total_internships DESC
        `);

        // -----------------------------
        // STATUS ARRAYS & COUNTS
        // -----------------------------

        const [internshipStatus] = await db.query(`
            SELECT
                status,
                COUNT(*) AS total
            FROM internships
            GROUP BY status
            ORDER BY total DESC
        `);

        const [applicationStatus] = await db.query(`
            SELECT
                status,
                COUNT(*) AS total
            FROM applications
            GROUP BY status
            ORDER BY total DESC
        `);

        const [[interviews]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM interviews
        `);

        const [[evaluations]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM evaluations
        `);

        // -----------------------------
        // FINAL RECONCILED RESPONSE
        // -----------------------------

        res.json({
            success: true,
            summary: {
                students: students.total,
                faculty: faculty.total,
                companies: companies.total,
                internships: internships.total,
                applications: applications.total,
                accepted: accepted.total,
                shortlisted: shortlisted.total,
                rejected: rejected.total,
                pending: pending.total,
                withdrawn: withdrawn.total,
                interviews: interviews.total,
                evaluations: evaluations.total,
                // Reconciled Placement Metrics
                unique_placed_students: uniquePlaced,
                campus_unique_placed: Number(campusUniquePlaced.total),
                off_campus_unique_placed: Number(offCampusUniquePlaced.total),
                placement_rate: placementRate,
                // Off-Campus Breakdown
                off_campus_total: offCampusTotal.total,
                off_campus_approved: offCampusApproved.total,
                off_campus_pending: offCampusPending.total,
                off_campus_needs_info: offCampusNeedsInfo.total,
                off_campus_rejected: offCampusRejected.total,
                // Verification distinction
                verified_outcomes: uniquePlaced,
                unverified_pending_or_rejected: offCampusPending.total + offCampusNeedsInfo.total + offCampusRejected.total
            },
            departmentStats: enrichedDeptStats,
            companyStats,
            internshipStatus,
            applicationStatus
        });

    } catch (error) {
        console.error("Admin reports error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to generate admin reports.",
            error: error.message
        });
    }

});


// =====================================================
// EXCEL / CSV REPORT EXPORT (AUTHORIZED T&P / ADMIN)
// =====================================================

app.get("/api/admin/reports/export", authenticate, authorizeRoles("admin"), async (req, res) => {

    try {

        const [[students]] = await db.query("SELECT COUNT(*) AS total FROM students");
        const [[applications]] = await db.query("SELECT COUNT(*) AS total FROM applications");

        const [[uniquePlacedResult]] = await db.query(`
            SELECT COUNT(DISTINCT student_id) AS total
            FROM (
                SELECT student_id FROM applications WHERE status = 'accepted'
                UNION
                SELECT student_id FROM off_campus_submissions WHERE status = 'approved'
            ) AS placed
        `);
        const uniquePlaced = Number(uniquePlacedResult.total);

        const [[campusOffers]] = await db.query("SELECT COUNT(*) AS total FROM applications WHERE status = 'accepted'");
        const [[offCampusApproved]] = await db.query("SELECT COUNT(*) AS total FROM off_campus_submissions WHERE status = 'approved'");
        const [[offCampusPending]] = await db.query("SELECT COUNT(*) AS total FROM off_campus_submissions WHERE status = 'pending'");
        const [[offCampusNeedsInfo]] = await db.query("SELECT COUNT(*) AS total FROM off_campus_submissions WHERE status = 'needs_more_info'");
        const [[offCampusRejected]] = await db.query("SELECT COUNT(*) AS total FROM off_campus_submissions WHERE status = 'rejected'");

        const placementRate = students.total > 0 ? ((uniquePlaced / students.total) * 100).toFixed(1) : 0;

        let csv = "COLLEGE2CAREER - INSTITUTIONAL RECONCILED PLACEMENT & INTERNSHIP REPORT\r\n";
        csv += `Export Timestamp,${new Date().toISOString()}\r\n`;
        csv += `Authorized By,Training & Placement Cell (T&P Admin)\r\n\r\n`;

        csv += "1. INSTITUTION-WIDE RECONCILED SUMMARY\r\n";
        csv += "Metric,Count,Audit Note / Verification Rule\r\n";
        csv += `Total Registered Students,${students.total},Total student records enrolled\r\n`;
        csv += `Unique Placed Students,${uniquePlaced},Distinct students with verified placement (no double-counting)\r\n`;
        csv += `Overall Placement Rate,${placementRate}%,(Unique Placed Students / Total Registered Students) * 100\r\n`;
        csv += `Campus Accepted Offers,${campusOffers.total},Direct college-managed recruitment offers\r\n`;
        csv += `Approved Off-Campus Placements,${offCampusApproved.total},Institutionally verified independent placement outcomes\r\n`;
        csv += `Total Applications Submitted,${applications.total},Total applications tracked (distinct from placed students)\r\n`;
        csv += `Pending Off-Campus Submissions,${offCampusPending.total},Awaiting T&P review (excluded from verified placements)\r\n`;
        csv += `Needs More Info Submissions,${offCampusNeedsInfo.total},Returned to students for evidence\r\n`;
        csv += `Rejected Submissions,${offCampusRejected.total},Denied by T&P cell with audit reason\r\n\r\n`;

        csv += "2. DEPARTMENT-WISE PLACEMENT BREAKDOWN\r\n";
        csv += "Department,Total Students,Unique Placed Students,Campus Offers,Approved Off-Campus,Total Applications,Placement Rate (%)\r\n";

        const [depts] = await db.query(`
            SELECT 
                COALESCE(s.department, 'Not Specified') AS department,
                COUNT(DISTINCT s.student_id) AS total_students,
                COUNT(DISTINCT CASE WHEN a.status = 'accepted' THEN s.student_id END) AS campus_placed_students,
                COUNT(DISTINCT CASE WHEN sub.status = 'approved' THEN s.student_id END) AS off_campus_placed_students,
                COUNT(DISTINCT CASE WHEN a.status = 'accepted' OR sub.status = 'approved' THEN s.student_id END) AS unique_placed_students,
                COUNT(DISTINCT a.application_id) AS total_applications
            FROM students s
            LEFT JOIN applications a ON s.student_id = a.student_id
            LEFT JOIN off_campus_submissions sub ON s.student_id = sub.student_id
            GROUP BY COALESCE(s.department, 'Not Specified')
            ORDER BY total_students DESC
        `);

        for (const d of depts) {
            const dRate = d.total_students > 0 ? ((d.unique_placed_students / d.total_students) * 100).toFixed(1) : 0;
            csv += `"${d.department}",${d.total_students},${d.unique_placed_students},${d.campus_placed_students},${d.off_campus_placed_students},${d.total_applications},${dRate}%\r\n`;
        }

        csv += "\r\n3. VERIFIED PLACED STUDENTS REGISTER\r\n";
        csv += "Student ID,Student Name,Department,CGPA (0.00-10.00),Placement Pathway,Company / Partner,Role / Designation\r\n";

        const [placedRecords] = await db.query(`
            SELECT 
                s.student_id,
                s.name,
                s.department,
                s.gpa,
                'On-Campus' AS source,
                c.name AS company,
                i.title AS role_title
            FROM students s
            JOIN applications a ON s.student_id = a.student_id
            JOIN internships i ON a.internship_id = i.internship_id
            JOIN companies c ON i.company_id = c.company_id
            WHERE a.status = 'accepted'
            UNION ALL
            SELECT 
                s.student_id,
                s.name,
                s.department,
                s.gpa,
                'Off-Campus (Approved)' AS source,
                sub.company_name AS company,
                sub.job_title AS role_title
            FROM students s
            JOIN off_campus_submissions sub ON s.student_id = sub.student_id
            WHERE sub.status = 'approved'
            ORDER BY student_id ASC
        `);

        for (const p of placedRecords) {
            const cgpaFormatted = p.gpa ? Number(p.gpa).toFixed(2) : "N/A";
            csv += `${p.student_id},"${p.name}","${p.department}",${cgpaFormatted},"${p.source}","${p.company}","${p.role_title}"\r\n`;
        }

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", 'attachment; filename="C2C_Reconciled_Placement_Report.csv"');
        res.send(csv);

    } catch (err) {
        console.error("Export error:", err);
        res.status(500).json({ success: false, message: "Export failed.", error: err.message });
    }

});


// =====================================================
// SYSTEM FEEDBACK
// =====================================================

app.post("/api/system-feedback", async (req, res) => {

    try {

        const {
            user_id,
            feedback_type,
            message
        } = req.body;


        // ---------------------------------------------
        // REQUIRED FIELDS
        // ---------------------------------------------

        if (
            !user_id ||
            !feedback_type ||
            !message
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All fields are required."

            });

        }


        // ---------------------------------------------
        // VALID FEEDBACK TYPES
        // ---------------------------------------------

        if (
            ![
                "suggestion",
                "bug",
                "improvement"
            ].includes(feedback_type)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid feedback type."

            });

        }


        // ---------------------------------------------
        // INSERT FEEDBACK
        // ---------------------------------------------

        await db.query(
            `
            INSERT INTO system_feedback
            (
                user_id,
                feedback_type,
                message
            )
            VALUES (?, ?, ?)
            `,
            [
                user_id,
                feedback_type,
                message.trim()
            ]
        );


        // ---------------------------------------------
        // SUCCESS
        // ---------------------------------------------

        res.status(201).json({

            success: true,

            message:
                "Feedback submitted successfully."

        });


    } catch (error) {

        console.error(
            "System feedback error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to submit feedback."

        });

    }

});


// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

        console.log("");

        console.log(
            "======================================"
        );

        console.log(
            "Student2Career Backend Started"
        );

        console.log(
            "======================================"
        );

        console.log(
            `Database: ${process.env.DB_NAME}`
        );

        console.log(
            `Server: http://localhost:${PORT}`
        );

        console.log(
            "======================================"
        );

        console.log("");

    



// ================================
// SERVER ERROR HANDLING
// ================================

server.on("error", (error) => {

    console.error(
        "SERVER ERROR:",
        error
    );

});


process.on("uncaughtException", (error) => {

    console.error(
        "UNCAUGHT EXCEPTION:",
        error
    );

});


process.on("unhandledRejection", (error) => {

    console.error(
        "UNHANDLED REJECTION:",
        error
    );

});