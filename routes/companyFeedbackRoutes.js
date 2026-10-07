const express = require("express");
const db = require("../db");

const router = express.Router();

console.log("COMPANY FEEDBACK ROUTES LOADED");

// =====================================================
// GET APPLICATIONS ELIGIBLE FOR COMPANY FEEDBACK
// =====================================================

router.get("/company/:companyId/eligible", async (req, res) => {
    try {
        const companyId = Number(req.params.companyId);

        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Invalid company ID."
            });
        }

        const [applications] = await db.query(`
            SELECT
                a.application_id,
                a.student_id,
                s.name AS student_name,
                s.department,
                s.gpa,

                i.internship_id,
                i.title AS internship_title,

                c.company_id,
                c.name AS company_name,

                csf.feedback_id

            FROM applications a

            JOIN students s
                ON a.student_id = s.student_id

            JOIN internships i
                ON a.internship_id = i.internship_id

            JOIN companies c
                ON i.company_id = c.company_id

            LEFT JOIN company_student_feedback csf
                ON a.application_id = csf.application_id

            WHERE c.company_id = ?
            AND a.status = 'accepted'

            ORDER BY a.application_id DESC
        `, [companyId]);

        res.json({
            success: true,
            applications
        });

    } catch (error) {
        console.error("Company feedback eligible error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load eligible students.",
            error: error.message
        });
    }
});


// =====================================================
// GET COMPANY FEEDBACK
// =====================================================

router.get("/company/:companyId", async (req, res) => {
    try {
        const companyId = Number(req.params.companyId);

        const [feedback] = await db.query(`
            SELECT
                csf.*,
                s.name AS student_name,
                i.title AS internship_title,
                c.name AS company_name

            FROM company_student_feedback csf

            JOIN students s
                ON csf.student_id = s.student_id

            JOIN internships i
                ON csf.application_id = (
                    SELECT application_id
                    FROM applications
                    WHERE application_id = csf.application_id
                )

            JOIN companies c
                ON csf.company_id = c.company_id

            WHERE csf.company_id = ?

            ORDER BY csf.feedback_id DESC
        `, [companyId]);

        res.json({
            success: true,
            feedback
        });

    } catch (error) {
        console.error("Company feedback fetch error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load company feedback."
        });
    }
});


// =====================================================
// SUBMIT COMPANY FEEDBACK
// =====================================================

router.post("/", async (req, res) => {
    try {
        const {
            application_id,
            company_id,
            student_id,
            technical_skills,
            soft_skills,
            punctuality,
            responsibility,
            teamwork,
            learning_ability,
            likelihood_to_hire,
            comments
        } = req.body;

        const scores = [
            technical_skills,
            soft_skills,
            punctuality,
            responsibility,
            teamwork,
            learning_ability,
            likelihood_to_hire
        ];

        if (
            !application_id ||
            !company_id ||
            !student_id
        ) {
            return res.status(400).json({
                success: false,
                message: "Application, company and student are required."
            });
        }

        if (
            scores.some(
                score =>
                    !Number.isInteger(Number(score)) ||
                    Number(score) < 1 ||
                    Number(score) > 5
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "All ratings must be between 1 and 5."
            });
        }

        const [application] = await db.query(`
            SELECT
                a.application_id,
                a.student_id,
                a.status,
                i.company_id

            FROM applications a

            JOIN internships i
                ON a.internship_id = i.internship_id

            WHERE a.application_id = ?
        `, [application_id]);

        if (application.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Application not found."
            });
        }

        const record = application[0];

        if (Number(record.student_id) !== Number(student_id)) {
            return res.status(403).json({
                success: false,
                message: "Student does not match application."
            });
        }

        if (Number(record.company_id) !== Number(company_id)) {
            return res.status(403).json({
                success: false,
                message: "Company does not own this internship."
            });
        }

        if (record.status !== "accepted") {
            return res.status(400).json({
                success: false,
                message: "Only accepted applications can be rated."
            });
        }

        const [existing] = await db.query(`
            SELECT feedback_id
            FROM company_student_feedback
            WHERE application_id = ?
        `, [application_id]);

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Feedback has already been submitted."
            });
        }

        await db.query(`
            INSERT INTO company_student_feedback
            (
                application_id,
                company_id,
                student_id,
                technical_skills,
                soft_skills,
                punctuality,
                responsibility,
                teamwork,
                learning_ability,
                likelihood_to_hire,
                comments
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            application_id,
            company_id,
            student_id,
            technical_skills,
            soft_skills,
            punctuality,
            responsibility,
            teamwork,
            learning_ability,
            likelihood_to_hire,
            comments || null
        ]);

        res.status(201).json({
            success: true,
            message: "Student performance feedback submitted successfully."
        });

    } catch (error) {
        console.error("Company feedback submit error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to submit company feedback.",
            error: error.message
        });
    }
});


module.exports = router;