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

app.use("/api/students", studentRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/company-feedback", companyFeedbackRoutes);


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
        // LOGIN RESPONSE
        // ---------------------------------------------

        res.json({

            success: true,

            message:
                "Login successful.",

            user: {

                user_id:
                    user.user_id,

                email:
                    user.email,

                role:
                    user.role,

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
// ADMIN REPORTS
// =====================================================

// MAIN ADMIN REPORT
app.get("/api/admin/reports", async (req, res) => {

    try {

        // -----------------------------
        // BASIC COUNTS
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
        // ACCEPTED APPLICATIONS
        // -----------------------------

        const [[accepted]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications
            WHERE status = 'accepted'
        `);


        // -----------------------------
        // SHORTLISTED APPLICATIONS
        // -----------------------------

        const [[shortlisted]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications
            WHERE status = 'shortlisted'
        `);


        // -----------------------------
        // REJECTED APPLICATIONS
        // -----------------------------

        const [[rejected]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications
            WHERE status = 'rejected'
        `);


        // -----------------------------
        // PENDING APPLICATIONS
        // -----------------------------

        const [[pending]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications
            WHERE status = 'pending'
        `);


        // -----------------------------
        // WITHDRAWN APPLICATIONS
        // -----------------------------

        const [[withdrawn]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications
            WHERE status = 'withdrawn'
        `);


        // -----------------------------
        // DEPARTMENT-WISE STUDENTS
        // -----------------------------

        const [departmentStats] = await db.query(`
            SELECT
                COALESCE(
                    department,
                    'Not Specified'
                ) AS department,
                COUNT(*) AS total_students
            FROM students
            GROUP BY department
            ORDER BY total_students DESC
        `);


        // -----------------------------
        // COMPANY-WISE INTERNSHIPS
        // -----------------------------

        const [companyStats] = await db.query(`
            SELECT
                c.name AS company_name,
                COUNT(i.internship_id)
                    AS total_internships
            FROM companies c
            LEFT JOIN internships i
                ON c.company_id = i.company_id
            GROUP BY
                c.company_id,
                c.name
            ORDER BY total_internships DESC
        `);


        // -----------------------------
        // INTERNSHIP STATUS
        // -----------------------------

        const [internshipStatus] = await db.query(`
            SELECT
                status,
                COUNT(*) AS total
            FROM internships
            GROUP BY status
            ORDER BY total DESC
        `);


        // -----------------------------
        // APPLICATION STATUS
        // -----------------------------

        const [applicationStatus] = await db.query(`
            SELECT
                status,
                COUNT(*) AS total
            FROM applications
            GROUP BY status
            ORDER BY total DESC
        `);


        // -----------------------------
        // INTERVIEW COUNT
        // -----------------------------

        const [[interviews]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM interviews
        `);


        // -----------------------------
        // EVALUATION COUNT
        // -----------------------------

        const [[evaluations]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM evaluations
        `);


        // -----------------------------
        // FINAL RESPONSE
        // -----------------------------

        res.json({

            success: true,

            summary: {

                students:
                    students.total,

                faculty:
                    faculty.total,

                companies:
                    companies.total,

                internships:
                    internships.total,

                applications:
                    applications.total,

                accepted:
                    accepted.total,

                shortlisted:
                    shortlisted.total,

                rejected:
                    rejected.total,

                pending:
                    pending.total,

                withdrawn:
                    withdrawn.total,

                interviews:
                    interviews.total,

                evaluations:
                    evaluations.total

            },

            departmentStats,

            companyStats,

            internshipStatus,

            applicationStatus

        });


    } catch (error) {

        console.error(
            "Admin reports error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to generate admin reports.",

            error:
                error.message

        });

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

const PORT = 5000;


const server = app.listen(
    PORT,
    () => {

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

    }
);


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