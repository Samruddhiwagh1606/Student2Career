const express = require("express");
const db = require("../db");

const router = express.Router();

console.log("FACULTY ROUTES LOADED");

const { authenticate, authorizeRoles } = require("../middleware/auth");

/**
 * Helper to derive trusted faculty department from server database record.
 * Any client-supplied query/body department is strictly ignored for faculty.
 */
async function getFacultyDepartment(req) {
    if (req.user && req.user.role === "faculty") {
        const [rows] = await db.query(
            "SELECT faculty_id, name, department FROM faculty WHERE user_id = ?",
            [req.user.user_id]
        );
        if (rows.length > 0 && rows[0].department) {
            return { faculty: rows[0], department: rows[0].department };
        }
    }
    if (req.user && req.user.role === "admin") {
        return { faculty: null, department: req.query.department || "Computer Science" };
    }
    return null;
}

// =====================================================
// 1. DEPARTMENT SUMMARY (READ-ONLY)
// =====================================================
router.get("/department/summary", authenticate, authorizeRoles("faculty", "admin"), async (req, res) => {
    try {
        const deptInfo = await getFacultyDepartment(req);
        if (!deptInfo || !deptInfo.department) {
            return res.status(403).json({ success: false, message: "Faculty department not assigned." });
        }
        const dept = deptInfo.department;

        const [[{ total_students }]] = await db.query(
            "SELECT COUNT(*) AS total_students FROM students WHERE department = ?",
            [dept]
        );

        const [[{ avg_cgpa }]] = await db.query(
            "SELECT ROUND(AVG(gpa), 2) AS avg_cgpa FROM students WHERE department = ? AND gpa IS NOT NULL",
            [dept]
        );

        const [[{ campus_placed }]] = await db.query(`
            SELECT COUNT(DISTINCT s.student_id) AS campus_placed
            FROM students s
            JOIN applications a ON s.student_id = a.student_id
            WHERE s.department = ? AND a.status = 'accepted'
        `, [dept]);

        const [[{ off_campus_placed }]] = await db.query(`
            SELECT COUNT(DISTINCT s.student_id) AS off_campus_placed
            FROM students s
            JOIN off_campus_submissions sub ON s.student_id = sub.student_id
            WHERE s.department = ? AND sub.status = 'approved'
        `, [dept]);

        const [[{ unique_placed }]] = await db.query(`
            SELECT COUNT(DISTINCT student_id) AS unique_placed
            FROM (
                SELECT s.student_id
                FROM students s
                JOIN applications a ON s.student_id = a.student_id
                WHERE s.department = ? AND a.status = 'accepted'
                UNION
                SELECT s.student_id
                FROM students s
                JOIN off_campus_submissions sub ON s.student_id = sub.student_id
                WHERE s.department = ? AND sub.status = 'approved'
            ) AS dept_placed
        `, [dept, dept]);

        const [[{ pending_off_campus }]] = await db.query(`
            SELECT COUNT(*) AS pending_off_campus
            FROM students s
            JOIN off_campus_submissions sub ON s.student_id = sub.student_id
            WHERE s.department = ? AND sub.status = 'pending'
        `, [dept]);

        const [[{ active_applications }]] = await db.query(`
            SELECT COUNT(*) AS active_applications
            FROM students s
            JOIN applications a ON s.student_id = a.student_id
            WHERE s.department = ?
        `, [dept]);

        const placementRate = total_students > 0 ? ((unique_placed / total_students) * 100).toFixed(1) : 0;

        res.json({
            success: true,
            department: dept,
            faculty_name: deptInfo.faculty?.name || "Faculty Coordinator",
            summary: {
                total_students: Number(total_students),
                unique_placed: Number(unique_placed),
                campus_placed: Number(campus_placed),
                off_campus_placed: Number(off_campus_placed),
                pending_off_campus: Number(pending_off_campus),
                active_applications: Number(active_applications),
                average_cgpa: avg_cgpa ? Number(avg_cgpa).toFixed(2) : "N/A",
                placement_rate: `${placementRate}%`
            }
        });
    } catch (err) {
        console.error("Department summary error:", err);
        res.status(500).json({ success: false, message: "Unable to retrieve department summary." });
    }
});

// =====================================================
// 2. DEPARTMENT STUDENTS (READ-ONLY)
// =====================================================
router.get("/department/students", authenticate, authorizeRoles("faculty", "admin"), async (req, res) => {
    try {
        const deptInfo = await getFacultyDepartment(req);
        if (!deptInfo || !deptInfo.department) {
            return res.status(403).json({ success: false, message: "Faculty department not assigned." });
        }
        const dept = deptInfo.department;
        const { search, status_filter } = req.query;

        let sql = `
            SELECT 
                s.student_id,
                s.name,
                s.phone,
                s.department,
                s.gpa,
                s.resume,
                u.email,
                (SELECT COUNT(*) FROM applications a WHERE a.student_id = s.student_id AND a.status = 'accepted') AS campus_offers,
                (SELECT COUNT(*) FROM off_campus_submissions sub WHERE sub.student_id = s.student_id AND sub.status = 'approved') AS off_campus_approved,
                (SELECT COUNT(*) FROM off_campus_submissions sub WHERE sub.student_id = s.student_id AND sub.status = 'pending') AS off_campus_pending,
                (SELECT COUNT(*) FROM applications a WHERE a.student_id = s.student_id) AS total_applications
            FROM students s
            JOIN users u ON s.user_id = u.user_id
            WHERE s.department = ?
        `;
        const params = [dept];

        if (search && search.trim()) {
            sql += " AND (s.name LIKE ? OR u.email LIKE ? OR s.phone LIKE ?)";
            const term = `%${search.trim()}%`;
            params.push(term, term, term);
        }

        sql += " ORDER BY s.name ASC";

        const [students] = await db.query(sql, params);

        const enriched = await Promise.all(
            students.map(async (st) => {
                const [skills] = await db.query(`
                    SELECT sk.skill_id, sk.skill_name 
                    FROM student_skills ss
                    JOIN skills sk ON ss.skill_id = sk.skill_id
                    WHERE ss.student_id = ?
                `, [st.student_id]);

                let placementStatus = "Seeking";
                if (st.campus_offers > 0 && st.off_campus_approved > 0) {
                    placementStatus = "Placed (Campus & Off-Campus)";
                } else if (st.campus_offers > 0) {
                    placementStatus = "Placed (On-Campus)";
                } else if (st.off_campus_approved > 0) {
                    placementStatus = "Placed (Off-Campus)";
                } else if (st.total_applications > 0 || st.off_campus_pending > 0) {
                    placementStatus = "In Review";
                }

                const fields = [st.name, st.email, st.phone, st.department, st.gpa, st.resume, skills.length > 0];
                const completeness = Math.round((fields.filter(Boolean).length / fields.length) * 100);

                return {
                    ...st,
                    cgpa: st.gpa !== null ? Number(st.gpa).toFixed(2) : "N/A",
                    skills: skills.map(s => s.skill_name),
                    placement_status: placementStatus,
                    profile_completeness: completeness
                };
            })
        );

        let filtered = enriched;
        if (status_filter === "placed") {
            filtered = enriched.filter(s => s.placement_status.startsWith("Placed"));
        } else if (status_filter === "seeking") {
            filtered = enriched.filter(s => s.placement_status === "Seeking");
        }

        res.json({
            success: true,
            department: dept,
            total: filtered.length,
            students: filtered
        });
    } catch (err) {
        console.error("Department students error:", err);
        res.status(500).json({ success: false, message: "Unable to load department students." });
    }
});

// =====================================================
// 3. DEPARTMENT CAREER READINESS MONITORING (READ-ONLY)
// =====================================================
router.get("/department/readiness", authenticate, authorizeRoles("faculty", "admin"), async (req, res) => {
    try {
        const deptInfo = await getFacultyDepartment(req);
        if (!deptInfo || !deptInfo.department) {
            return res.status(403).json({ success: false, message: "Faculty department not assigned." });
        }
        const dept = deptInfo.department;

        const [students] = await db.query(
            "SELECT student_id, name, gpa, resume FROM students WHERE department = ?",
            [dept]
        );

        const totalStudents = students.length;
        const withResume = students.filter(s => Boolean(s.resume)).length;
        const withCgpa = students.filter(s => s.gpa !== null).length;

        const [deptSkillsRows] = await db.query(`
            SELECT sk.skill_name, COUNT(ss.student_id) AS student_count
            FROM student_skills ss
            JOIN skills sk ON ss.skill_id = sk.skill_id
            JOIN students s ON ss.student_id = s.student_id
            WHERE s.department = ?
            GROUP BY sk.skill_name
            ORDER BY student_count DESC
        `, [dept]);

        const [reqSkillsRows] = await db.query(`
            SELECT sk.skill_name, COUNT(isk.internship_id) AS demand_count
            FROM internship_skills isk
            JOIN skills sk ON isk.skill_id = sk.skill_id
            JOIN internships i ON isk.internship_id = i.internship_id
            WHERE i.status = 'approved'
            GROUP BY sk.skill_name
            ORDER BY demand_count DESC
        `);

        const studentSkillCounts = Object.fromEntries(
            deptSkillsRows.map(r => [r.skill_name, Number(r.student_count)])
        );

        const missingSkillsAnalysis = reqSkillsRows.map(reqSk => {
            const haveCount = studentSkillCounts[reqSk.skill_name] || 0;
            const lackingCount = Math.max(0, totalStudents - haveCount);
            return {
                skill_name: reqSk.skill_name,
                industry_demand_count: Number(reqSk.demand_count),
                students_with_skill: haveCount,
                students_lacking_skill: lackingCount,
                coverage_pct: totalStudents > 0 ? Math.round((haveCount / totalStudents) * 100) : 0
            };
        }).sort((a, b) => b.students_lacking_skill - a.students_lacking_skill);

        res.json({
            success: true,
            department: dept,
            total_students: totalStudents,
            profile_completeness: {
                with_resume: withResume,
                resume_pct: totalStudents > 0 ? Math.round((withResume / totalStudents) * 100) : 0,
                with_cgpa: withCgpa,
                cgpa_pct: totalStudents > 0 ? Math.round((withCgpa / totalStudents) * 100) : 0
            },
            skills_acquired: deptSkillsRows,
            missing_skills_analysis: missingSkillsAnalysis,
            practical_guidance: [
                "Prioritize department workshops on top in-demand skills with low student coverage.",
                "Conduct resume review sessions for students without uploaded credentials.",
                "Advise students on eligibility benchmarks and off-campus offer submissions."
            ]
        });
    } catch (err) {
        console.error("Department readiness error:", err);
        res.status(500).json({ success: false, message: "Unable to calculate department career readiness." });
    }
});

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