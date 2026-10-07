const express = require("express");
const db = require("../db");

const router = express.Router();

console.log("FACULTY ROUTES LOADED");

// =====================================================
// FACULTY REPORTS
// =====================================================

router.get("/:facultyId/reports", async (req, res) => {

    try {

        const facultyId = Number(req.params.facultyId);

        if (!facultyId) {
            return res.status(400).json({
                success: false,
                message: "Invalid faculty ID."
            });
        }


        // ---------------------------------------------
        // SUMMARY
        // ---------------------------------------------

        const [[internships]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM internships
            WHERE posted_by = ?
        `, [facultyId]);


        const [[applications]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications a
            INNER JOIN internships i
                ON a.internship_id = i.internship_id
            WHERE i.posted_by = ?
        `, [facultyId]);


        const [[pending]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications a
            INNER JOIN internships i
                ON a.internship_id = i.internship_id
            WHERE i.posted_by = ?
            AND a.status = 'pending'
        `, [facultyId]);


        const [[shortlisted]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications a
            INNER JOIN internships i
                ON a.internship_id = i.internship_id
            WHERE i.posted_by = ?
            AND a.status = 'shortlisted'
        `, [facultyId]);


        const [[accepted]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications a
            INNER JOIN internships i
                ON a.internship_id = i.internship_id
            WHERE i.posted_by = ?
            AND a.status = 'accepted'
        `, [facultyId]);


        const [[rejected]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM applications a
            INNER JOIN internships i
                ON a.internship_id = i.internship_id
            WHERE i.posted_by = ?
            AND a.status = 'rejected'
        `, [facultyId]);


        const [[interviews]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM interviews iv
            INNER JOIN applications a
                ON iv.application_id = a.application_id
            INNER JOIN internships i
                ON a.internship_id = i.internship_id
            WHERE i.posted_by = ?
        `, [facultyId]);


        const [[evaluations]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM evaluations e
            INNER JOIN applications a
                ON e.application_id = a.application_id
            INNER JOIN internships i
                ON a.internship_id = i.internship_id
            WHERE i.posted_by = ?
        `, [facultyId]);


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

                COUNT(DISTINCT a.application_id)
                    AS application_count,

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
        // RESPONSE
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
                "Unable to load faculty reports.",

            error:
                error.message

        });

    }

});
// =====================================================
// ADMIN - GET ALL FACULTY
// =====================================================

router.get("/admin/all", async (req, res) => {

    try {

        const [faculty] = await db.query(`
            SELECT
                f.faculty_id,
                f.user_id,
                f.name,
                f.department,
                u.email,
                u.created_at,

                COUNT(
                    DISTINCT i.internship_id
                ) AS internship_count,

                COUNT(
                    DISTINCT a.application_id
                ) AS application_count

            FROM faculty f

            INNER JOIN users u
                ON f.user_id = u.user_id

            LEFT JOIN internships i
                ON f.faculty_id = i.posted_by

            LEFT JOIN applications a
                ON i.internship_id = a.internship_id

            WHERE u.role = 'faculty'

            GROUP BY
                f.faculty_id,
                f.user_id,
                f.name,
                f.department,
                u.email,
                u.created_at

            ORDER BY f.faculty_id DESC
        `);


        res.json({

            success: true,

            faculty

        });


    } catch (error) {

        console.error(
            "Get faculty error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to load faculty.",

            error:
                error.message

        });

    }

});


// =====================================================
// ADMIN - GET SINGLE FACULTY
// =====================================================

router.get(
    "/admin/:facultyId",
    async (req, res) => {

        try {

            const facultyId =
                Number(
                    req.params.facultyId
                );


            if (!facultyId) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Invalid faculty ID."

                    });

            }


            const [facultyRows] =
                await db.query(`
                    SELECT
                        f.faculty_id,
                        f.user_id,
                        f.name,
                        f.department,
                        u.email,
                        u.created_at

                    FROM faculty f

                    INNER JOIN users u
                        ON f.user_id =
                           u.user_id

                    WHERE
                        f.faculty_id = ?

                    AND
                        u.role = 'faculty'
                `,
                [
                    facultyId
                ]);


            if (
                facultyRows.length === 0
            ) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "Faculty member not found."

                    });

            }


            const faculty =
                facultyRows[0];


            // -------------------------------------
            // FACULTY INTERNSHIPS
            // -------------------------------------

            const [internships] =
                await db.query(`
                    SELECT
                        i.internship_id,
                        i.title,
                        i.domain,
                        i.status,
                        i.duration_weeks,
                        i.stipend,
                        i.application_deadline,

                        c.name AS company_name,

                        COUNT(
                            DISTINCT a.application_id
                        ) AS application_count

                    FROM internships i

                    INNER JOIN companies c
                        ON i.company_id =
                           c.company_id

                    LEFT JOIN applications a
                        ON i.internship_id =
                           a.internship_id

                    WHERE
                        i.posted_by = ?

                    GROUP BY
                        i.internship_id,
                        i.title,
                        i.domain,
                        i.status,
                        i.duration_weeks,
                        i.stipend,
                        i.application_deadline,
                        c.name

                    ORDER BY
                        i.internship_id DESC
                `,
                [
                    facultyId
                ]);


            res.json({

                success: true,

                faculty,

                internships

            });


        } catch (error) {

            console.error(
                "Faculty details error:",
                error
            );


            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Unable to load faculty details.",

                    error:
                        error.message

                });

        }

    }
);


// =====================================================
// ADMIN - CREATE FACULTY
// =====================================================

router.post(
    "/admin",
    async (req, res) => {

        let connection;

        try {

            const {

                name,
                email,
                password,
                department

            } = req.body;


            // -------------------------------------
            // REQUIRED FIELDS
            // -------------------------------------

            if (
                !name ||
                !email ||
                !password ||
                !department
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Name, email, password and department are required."

                    });

            }


            // -------------------------------------
            // EMAIL VALIDATION
            // -------------------------------------

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
                    email.trim()
                )
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Please enter a valid email address."

                    });

            }


            // -------------------------------------
            // PASSWORD VALIDATION
            // Minimum 8
            // uppercase
            // lowercase
            // number
            // special character
            // -------------------------------------

            const passwordPattern =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;


            if (
                !passwordPattern.test(
                    password
                )
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Password must be at least 8 characters and contain uppercase, lowercase, number and special character."

                    });

            }


            // -------------------------------------
            // DUPLICATE EMAIL
            // -------------------------------------

            const [existing] =
                await db.query(`
                    SELECT user_id
                    FROM users
                    WHERE email = ?
                `,
                [
                    email.trim()
                ]);


            if (
                existing.length > 0
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "This email is already registered."

                    });

            }


            // -------------------------------------
            // TRANSACTION
            // -------------------------------------

            connection =
                await db.getConnection();


            await connection
                .beginTransaction();


            // CREATE USER

            const [userResult] =
                await connection.query(`
                    INSERT INTO users
                    (
                        email,
                        password,
                        role
                    )

                    VALUES
                    (
                        ?,
                        ?,
                        'faculty'
                    )
                `,
                [
                    email.trim(),
                    password
                ]);


            const userId =
                userResult.insertId;


            // CREATE FACULTY

            const [facultyResult] =
                await connection.query(`
                    INSERT INTO faculty
                    (
                        user_id,
                        name,
                        department
                    )

                    VALUES
                    (
                        ?,
                        ?,
                        ?
                    )
                `,
                [
                    userId,
                    name.trim(),
                    department.trim()
                ]);


            await connection.commit();


            res
                .status(201)
                .json({

                    success: true,

                    message:
                        "Faculty member created successfully.",

                    faculty_id:
                        facultyResult.insertId

                });


        } catch (error) {

            if (connection) {

                try {

                    await connection
                        .rollback();

                } catch (
                    rollbackError
                ) {

                    console.error(
                        rollbackError
                    );

                }

            }


            console.error(
                "Create faculty error:",
                error
            );


            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Unable to create faculty member.",

                    error:
                        error.message

                });


        } finally {

            if (connection) {

                connection.release();

            }

        }

    }
);


// =====================================================
// ADMIN - UPDATE FACULTY
// =====================================================

router.patch(
    "/admin/:facultyId",
    async (req, res) => {

        let connection;

        try {

            const facultyId =
                Number(
                    req.params.facultyId
                );


            const {

                name,
                email,
                department

            } = req.body;


            if (!facultyId) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Invalid faculty ID."

                    });

            }


            if (
                !name ||
                !email ||
                !department
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Name, email and department are required."

                    });

            }


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
                    email.trim()
                )
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Please enter a valid email address."

                    });

            }


            // -------------------------------------
            // FIND FACULTY
            // -------------------------------------

            const [facultyRows] =
                await db.query(`
                    SELECT
                        faculty_id,
                        user_id

                    FROM faculty

                    WHERE
                        faculty_id = ?
                `,
                [
                    facultyId
                ]);


            if (
                facultyRows.length === 0
            ) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "Faculty member not found."

                    });

            }


            const userId =
                facultyRows[0].user_id;


            // -------------------------------------
            // DUPLICATE EMAIL
            // -------------------------------------

            const [duplicateEmail] =
                await db.query(`
                    SELECT
                        user_id

                    FROM users

                    WHERE
                        email = ?

                    AND
                        user_id <> ?
                `,
                [
                    email.trim(),
                    userId
                ]);


            if (
                duplicateEmail.length > 0
            ) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "This email is already used by another account."

                    });

            }


            connection =
                await db.getConnection();


            await connection
                .beginTransaction();


            // UPDATE USER EMAIL

            await connection.query(`
                UPDATE users

                SET
                    email = ?

                WHERE
                    user_id = ?
            `,
            [
                email.trim(),
                userId
            ]);


            // UPDATE FACULTY

            await connection.query(`
                UPDATE faculty

                SET
                    name = ?,
                    department = ?

                WHERE
                    faculty_id = ?
            `,
            [
                name.trim(),
                department.trim(),
                facultyId
            ]);


            await connection.commit();


            res.json({

                success: true,

                message:
                    "Faculty member updated successfully."

            });


        } catch (error) {

            if (connection) {

                try {

                    await connection
                        .rollback();

                } catch (
                    rollbackError
                ) {

                    console.error(
                        rollbackError
                    );

                }

            }


            console.error(
                "Update faculty error:",
                error
            );


            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Unable to update faculty member.",

                    error:
                        error.message

                });


        } finally {

            if (connection) {

                connection.release();

            }

        }

    }
);


// =====================================================
// ADMIN - DELETE FACULTY
// =====================================================

router.delete(
    "/admin/:facultyId",
    async (req, res) => {

        try {

            const facultyId =
                Number(
                    req.params.facultyId
                );


            if (!facultyId) {

                return res
                    .status(400)
                    .json({

                        success: false,

                        message:
                            "Invalid faculty ID."

                    });

            }


            const [facultyRows] =
                await db.query(`
                    SELECT
                        faculty_id,
                        user_id,
                        name

                    FROM faculty

                    WHERE
                        faculty_id = ?
                `,
                [
                    facultyId
                ]);


            if (
                facultyRows.length === 0
            ) {

                return res
                    .status(404)
                    .json({

                        success: false,

                        message:
                            "Faculty member not found."

                    });

            }


            const userId =
                facultyRows[0].user_id;


            /*
                faculty.user_id
                uses ON DELETE CASCADE.

                internships.posted_by
                uses ON DELETE SET NULL.

                Therefore deleting the faculty user
                keeps existing internship records.
            */

            await db.query(`
                DELETE FROM users

                WHERE
                    user_id = ?

                AND
                    role = 'faculty'
            `,
            [
                userId
            ]);


            res.json({

                success: true,

                message:
                    "Faculty member deleted successfully."

            });


        } catch (error) {

            console.error(
                "Delete faculty error:",
                error
            );


            res
                .status(500)
                .json({

                    success: false,

                    message:
                        "Unable to delete faculty member.",

                    error:
                        error.message

                });

        }

    }
);


module.exports = router;