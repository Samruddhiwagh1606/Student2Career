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