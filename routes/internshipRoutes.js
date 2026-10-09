const express = require("express");
const db = require("../db");

const router = express.Router();

console.log("INTERNSHIP ROUTES LOADED");


// ======================================================
// GET ALL APPROVED INTERNSHIPS
// STUDENTS CAN ONLY SEE APPROVED INTERNSHIPS
// ======================================================

router.get("/", async (req, res) => {

    try {

        const [internships] = await db.query(`
            SELECT
                i.internship_id,
                i.title,
                i.description,
                i.domain,
                i.duration_weeks,
                i.stipend,
                i.start_date,
                i.end_date,
                i.application_deadline,
                i.status,

                c.company_id,
                c.name AS company_name,
                c.location,
                c.contact_person,
                c.contact_email

            FROM internships i

            JOIN companies c
                ON i.company_id = c.company_id

            WHERE i.status = 'approved'

            ORDER BY i.application_deadline ASC
        `);


        res.json({

            success: true,

            internships: internships

        });


    } catch (error) {

        console.error(
            "Internship fetch error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to fetch internships.",

            error:
                error.message

        });

    }

});


// ======================================================
// SMART SKILL MATCHING & RECOMMENDATIONS (PHASE 6A)
// ======================================================

// GET RECOMMENDATIONS FOR STUDENT (SORTED BY SKILL MATCH)
router.get("/recommendations/:studentId", async (req, res) => {
    try {
        const studentId = Number(req.params.studentId);
        if (!studentId) {
            return res.status(400).json({ success: false, message: "Invalid student ID." });
        }

        // 1. Fetch Student Skills
        const [studentSkills] = await db.query(
            `SELECT s.skill_id, s.skill_name 
             FROM skills s 
             JOIN student_skills ss ON s.skill_id = ss.skill_id 
             WHERE ss.student_id = ?`,
            [studentId]
        );
        const studentSkillNames = new Set(studentSkills.map((sk) => sk.skill_name));

        // 2. Fetch Approved Internships
        const [internships] = await db.query(
            `SELECT 
               i.internship_id,
               i.title,
               i.description,
               i.domain,
               i.duration_weeks,
               i.stipend,
               i.start_date,
               i.end_date,
               i.application_deadline,
               i.status,
               i.posted_by,
               c.company_id,
               c.name AS company_name,
               c.location,
               c.contact_person,
               c.contact_email
             FROM internships i
             JOIN companies c ON i.company_id = c.company_id
             WHERE i.status = 'approved'
             ORDER BY i.application_deadline ASC`
        );

        // 3. Enrich each internship with real skill match statistics
        const enriched = await Promise.all(
            internships.map(async (internship) => {
                const [reqSkills] = await db.query(
                    `SELECT s.skill_id, s.skill_name 
                     FROM skills s 
                     JOIN internship_skills isk ON s.skill_id = isk.skill_id 
                     WHERE isk.internship_id = ?`,
                    [internship.internship_id]
                );

                const requiredSkillNames = reqSkills.map((s) => s.skill_name);
                const matchingSkills = requiredSkillNames.filter((s) => studentSkillNames.has(s));
                const missingSkills = requiredSkillNames.filter((s) => !studentSkillNames.has(s));

                const totalRequired = requiredSkillNames.length;
                const matchedCount = matchingSkills.length;
                const available = totalRequired > 0;
                const matchPercentage = available ? Math.round((matchedCount / totalRequired) * 100) : null;

                return {
                    ...internship,
                    is_verified: internship.status === "approved" || internship.posted_by !== null,
                    verification_label: "Verified by Institution",
                    skill_match: {
                        available,
                        match_percentage: matchPercentage,
                        total_required: totalRequired,
                        matched_count: matchedCount,
                        matching_skills: matchingSkills,
                        missing_skills: missingSkills,
                        required_skills: requiredSkillNames,
                    },
                };
            })
        );

        // Sort by match_percentage descending (place internships with calculated match percentage at top)
        enriched.sort((a, b) => {
            const pctA = a.skill_match.match_percentage ?? -1;
            const pctB = b.skill_match.match_percentage ?? -1;
            return pctB - pctA;
        });

        res.json({
            success: true,
            recommendations: enriched,
        });
    } catch (error) {
        console.error("Recommendations fetch error:", error);
        res.status(500).json({ success: false, message: "Unable to fetch recommendations.", error: error.message });
    }
});

// GET DETAILED SKILL MATCH FOR SPECIFIC INTERNSHIP AND STUDENT
router.get("/:internshipId/skill-match/:studentId", async (req, res) => {
    try {
        const internshipId = Number(req.params.internshipId);
        const studentId = Number(req.params.studentId);

        if (!internshipId || !studentId) {
            return res.status(400).json({ success: false, message: "Invalid internship or student ID." });
        }

        // 1. Fetch Student Details & Skills
        const [[student]] = await db.query(
            `SELECT s.student_id, s.name, s.department, s.gpa, s.resume 
             FROM students s 
             WHERE s.student_id = ?`,
            [studentId]
        );

        if (!student) {
            return res.status(404).json({ success: false, message: "Student record not found." });
        }

        const [studentSkillsRows] = await db.query(
            `SELECT s.skill_id, s.skill_name 
             FROM skills s 
             JOIN student_skills ss ON s.skill_id = ss.skill_id 
             WHERE ss.student_id = ?`,
            [studentId]
        );

        const studentSkills = studentSkillsRows.map((s) => s.skill_name);
        const studentSkillsSet = new Set(studentSkills);

        // 2. Fetch Internship Details
        const [[internship]] = await db.query(
            `SELECT i.*, c.name AS company_name, c.location AS company_location
             FROM internships i
             JOIN companies c ON i.company_id = c.company_id
             WHERE i.internship_id = ?`,
            [internshipId]
        );

        if (!internship) {
            return res.status(404).json({ success: false, message: "Internship record not found." });
        }

        // 3. Fetch Internship Required Skills
        const [reqSkillsRows] = await db.query(
            `SELECT s.skill_id, s.skill_name 
             FROM skills s 
             JOIN internship_skills isk ON s.skill_id = isk.skill_id 
             WHERE isk.internship_id = ?`,
            [internshipId]
        );

        const requiredSkills = reqSkillsRows.map((s) => s.skill_name);
        const matchingSkills = requiredSkills.filter((s) => studentSkillsSet.has(s));
        const missingSkills = requiredSkills.filter((s) => !studentSkillsSet.has(s));

        const totalRequired = requiredSkills.length;
        const matchedCount = matchingSkills.length;
        const available = totalRequired > 0;
        const matchPercentage = available ? Math.round((matchedCount / totalRequired) * 100) : null;

        // 4. Calculate Application Fit
        const todayStr = new Date().toISOString().split("T")[0];
        const deadlineStr = internship.application_deadline
            ? new Date(internship.application_deadline).toISOString().split("T")[0]
            : null;

        const departmentMatch = Boolean(
            student.department &&
            internship.domain &&
            (student.department.toLowerCase().includes(internship.domain.toLowerCase()) ||
                internship.domain.toLowerCase().includes(student.department.toLowerCase()) ||
                (student.department.toLowerCase().includes("computer") && internship.domain.toLowerCase().includes("software")))
        );

        const deadlineOpen = deadlineStr ? deadlineStr >= todayStr : true;
        const resumeAvailable = Boolean(student.resume && student.resume.trim() !== "");

        res.json({
            success: true,
            internship_id: internshipId,
            student_id: studentId,
            available,
            match_percentage: matchPercentage,
            total_required: totalRequired,
            matched_count: matchedCount,
            matching_skills: matchingSkills,
            missing_skills: missingSkills,
            student_skills: studentSkills,
            required_skills: requiredSkills,
            is_verified: internship.status === "approved" || internship.status === "faculty_verified",
            verification_label: "Verified by Institution",
            application_fit: {
                department_match: departmentMatch,
                student_department: student.department,
                internship_domain: internship.domain,
                deadline_open: deadlineOpen,
                deadline_date: deadlineStr,
                resume_available: resumeAvailable,
                gpa_available: Boolean(student.gpa),
                student_gpa: student.gpa,
            },
        });
    } catch (error) {
        console.error("Skill match calculation error:", error);
        res.status(500).json({ success: false, message: "Unable to calculate skill match.", error: error.message });
    }
});



// ======================================================
// GET ONE APPROVED INTERNSHIP
// STUDENTS CANNOT DIRECTLY ACCESS UNAPPROVED INTERNSHIPS
// ======================================================

// ADMIN: GET FACULTY-VERIFIED INTERNSHIPS
router.get("/admin/review", async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT
                i.internship_id,
                i.title,
                i.description,
                i.domain,
                i.duration_weeks,
                i.stipend,
                i.start_date,
                i.end_date,
                i.application_deadline,
                i.status,
                c.name AS company_name,
                f.name AS faculty_name
            FROM internships i
            JOIN companies c
                ON i.company_id = c.company_id
            LEFT JOIN faculty f
                ON i.posted_by = f.faculty_id
            WHERE i.status = 'faculty_verified'
            ORDER BY i.internship_id DESC
        `);

        res.json(rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to load internship requests."
        });
    }
});


// ADMIN: APPROVE / REJECT INTERNSHIP
router.patch("/:id/status", async (req, res) => {

    try {

        const internshipId = Number(req.params.id);
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {

            return res.status(400).json({
                message: "Invalid status."
            });
        }

        const [result] = await db.query(
            `
            UPDATE internships
            SET status = ?
            WHERE internship_id = ?
            AND status = 'faculty_verified'
            `,
            [status, internshipId]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Internship request not found."
            });
        }

        res.json({
            success: true,
            message:
                status === "approved"
                    ? "Internship approved successfully."
                    : "Internship rejected successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update internship status."
        });
    }
});



// ======================================================
// FACULTY - CREATE INTERNSHIP
//
// Faculty verifies academic suitability.
// Internship enters faculty_verified status.
//
// Admin will later perform institutional approval.
// Only approved internships are visible to students.
// ======================================================

router.post("/", async (req, res) => {

    try {

        const {

            company_id,
            posted_by,
            title,
            description,
            domain,
            duration_weeks,
            stipend,
            start_date,
            end_date,
            application_deadline,
            faculty_verified

        } = req.body;



        // ==================================================
        // REQUIRED FIELDS
        // ==================================================

        if (
            !company_id ||
            !posted_by ||
            !title ||
            !description ||
            !domain ||
            !duration_weeks ||
            !start_date ||
            !end_date ||
            !application_deadline
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please fill all required fields."

            });

        }



        // ==================================================
        // FACULTY VERIFICATION
        // ==================================================

        if (faculty_verified !== true) {

            return res.status(400).json({

                success: false,

                message:
                    "Faculty academic verification is required."

            });

        }



        // ==================================================
        // DURATION VALIDATION
        // 4 WEEKS TO 26 WEEKS
        // ==================================================

        const duration =
            Number(duration_weeks);


        if (
            !Number.isInteger(duration) ||
            duration < 4 ||
            duration > 26
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Internship duration must be between 4 and 26 weeks."

            });

        }



        // ==================================================
        // DATE VALIDATION
        // ==================================================

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        if (start_date <= today) {

            return res.status(400).json({

                success: false,

                message:
                    "Internship start date must be in the future."

            });

        }


        if (application_deadline <= today) {

            return res.status(400).json({

                success: false,

                message:
                    "Application deadline must be in the future."

            });

        }


        if (
            new Date(start_date) >=
            new Date(end_date)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "End date must be after start date."

            });

        }


        if (
            new Date(application_deadline) >=
            new Date(start_date)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Application deadline must be before internship start date."

            });

        }



        // ==================================================
        // CHECK FACULTY
        // ==================================================

        const [faculty] =
            await db.query(
                `
                SELECT
                    faculty_id,
                    name,
                    department

                FROM faculty

                WHERE faculty_id = ?
                `,
                [posted_by]
            );


        if (faculty.length === 0) {

            return res.status(403).json({

                success: false,

                message:
                    "Faculty account not found."

            });

        }



        // ==================================================
        // CHECK COMPANY
        // ==================================================

        const [company] =
            await db.query(
                `
                SELECT
                    company_id,
                    name

                FROM companies

                WHERE company_id = ?
                `,
                [company_id]
            );


        if (company.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Company not found."

            });

        }



        // ==================================================
        // INSERT INTERNSHIP
        //
        // IMPORTANT:
        // faculty_verified = faculty has checked it
        //
        // Admin approval comes next.
        // ==================================================

        const [result] =
            await db.query(
                `
                INSERT INTO internships
                (
                    company_id,
                    posted_by,
                    title,
                    description,
                    domain,
                    duration_weeks,
                    stipend,
                    start_date,
                    end_date,
                    application_deadline,
                    status
                )

                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    'faculty_verified'
                )
                `,
                [

                    company_id,
                    posted_by,
                    title,
                    description,
                    domain,
                    duration,
                    stipend || 0,
                    start_date,
                    end_date,
                    application_deadline

                ]
            );



        // ==================================================
        // SUCCESS
        // ==================================================

        res.status(201).json({

            success: true,

            message:
                "Internship successfully verified by faculty and submitted for Admin approval.",

            internship_id:
                result.insertId,

            status:
                "faculty_verified"

        });


    }

    catch (error) {

        console.error(
            "FACULTY INTERNSHIP ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to create internship.",

            error:
                error.message

        });

    }

});



// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;