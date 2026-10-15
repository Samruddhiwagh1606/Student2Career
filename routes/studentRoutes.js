const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

console.log("STUDENT ROUTES LOADED");


// =====================================================
// REGISTER STUDENT
// =====================================================

router.post("/register", async (req, res) => {

    try {

        const {
            email,
            password,
            name,
            phone,
            department,
            gpa
        } = req.body;


        // -----------------------------
        // REQUIRED FIELDS
        // -----------------------------

        if (!email || !password || !name || !department) {

            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });

        }


        // -----------------------------
        // EMAIL VALIDATION
        // -----------------------------

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.trim())) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });

        }


        // -----------------------------
        // PASSWORD VALIDATION
        // -----------------------------

        if (password.length < 8) {

            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters."
            });

        }


        // -----------------------------
        // PHONE VALIDATION
        // -----------------------------

        if (
            phone &&
            !/^\d{10,15}$/.test(phone)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Phone number must contain 10 to 15 digits."
            });

        }


        // -----------------------------
        // GPA VALIDATION
        // -----------------------------

        let gpaValue = null;

        if (
            gpa !== undefined &&
            gpa !== null &&
            gpa !== ""
        ) {

            gpaValue = Number(gpa);

            if (
                Number.isNaN(gpaValue) ||
                gpaValue < 0 ||
                gpaValue > 10
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "CGPA must be between 0.00 and 10.00."
                });

            }
            gpaValue = Math.round(gpaValue * 100) / 100;

        }


        // -----------------------------
        // CHECK DUPLICATE EMAIL
        // -----------------------------

        const [existingUser] =
            await db.query(
                "SELECT user_id FROM users WHERE email = ?",
                [email.trim()]
            );


        if (existingUser.length > 0) {

            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });

        }


        // -----------------------------
        // INSERT USER
        // -----------------------------

        const [userResult] =
            await db.query(
                `
                INSERT INTO users
                    (email, password, role)
                VALUES
                    (?, ?, 'student')
                `,
                [
                    email.trim(),
                    password
                ]
            );


        const userId =
            userResult.insertId;


        // -----------------------------
        // INSERT STUDENT
        // -----------------------------

        const [studentResult] =
            await db.query(
                `
                INSERT INTO students
                    (
                        user_id,
                        name,
                        phone,
                        department,
                        gpa
                    )
                VALUES
                    (?, ?, ?, ?, ?)
                `,
                [
                    userId,
                    name.trim(),
                    phone || null,
                    department.trim(),
                    gpaValue
                ]
            );


        res.status(201).json({

            success: true,

            message:
                "Student registered successfully!",

            student_id:
                studentResult.insertId

        });


    } catch (error) {

        console.error(
            "Student registration error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Registration failed.",

            error:
                error.message

        });

    }

});


// =====================================================
// STUDENT LOGIN
// =====================================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // -----------------------------
        // REQUIRED FIELDS
        // -----------------------------

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required."

            });

        }


        // -----------------------------
        // FIND USER + STUDENT
        // -----------------------------

        const [users] =
            await db.query(
                `
                SELECT
                    u.user_id,
                    u.email,
                    u.password,
                    u.role,

                    s.student_id,
                    s.name,
                    s.phone,
                    s.department,
                    s.gpa,
                    s.resume

                FROM users u

                JOIN students s
                    ON u.user_id = s.user_id

                WHERE u.email = ?
                  AND u.role = 'student'
                `,
                [email.trim()]
            );


        // -----------------------------
        // USER NOT FOUND
        // -----------------------------

        if (users.length === 0) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        const user =
            users[0];


        // -----------------------------
        // PASSWORD CHECK
        // -----------------------------

        if (user.password !== password) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        // -----------------------------
        // SUCCESS
        // -----------------------------

        res.json({

            success: true,

            message:
                "Login successful!",

            student: {

                student_id:
                    user.student_id,

                user_id:
                    user.user_id,

                name:
                    user.name,

                email:
                    user.email,

                phone:
                    user.phone,

                department:
                    user.department,

                gpa:
                    user.gpa,

                resume:
                    user.resume

            }

        });


    } catch (error) {

        console.error(
            "Student login error:",
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
// STUDENT PROFILE UPDATE
// =====================================================

router.put("/:studentId", authenticate, async (req, res) => {

    try {

        const studentId =
            Number(req.params.studentId);

        // Faculty is strictly read-only
        if (req.user.role === "faculty") {
            return res.status(403).json({
                success: false,
                message: "Access denied: Faculty members have read-only access and cannot modify student profiles."
            });
        }

        // Student can only update their own record
        if (req.user.role === "student" && req.user.student_id !== studentId) {
            return res.status(403).json({
                success: false,
                message: "Access denied: You can only modify your own profile."
            });
        }


        const {
            name,
            phone,
            department,
            gpa
        } = req.body;


        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (!studentId) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid student ID."

            });

        }


        if (!name || !name.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Name is required."

            });

        }


        if (
            phone &&
            !/^\d{10,15}$/.test(phone)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Phone number must contain 10 to 15 digits."

            });

        }


        const gpaNumber =
            Number(gpa);


        if (
            Number.isNaN(gpaNumber) ||
            gpaNumber < 0 ||
            gpaNumber > 10
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "CGPA must be between 0.00 and 10.00."

            });

        }


        // -----------------------------
        // CHECK STUDENT
        // -----------------------------

        const [students] =
            await db.query(
                `
                SELECT student_id
                FROM students
                WHERE student_id = ?
                `,
                [studentId]
            );


        if (students.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Student not found."

            });

        }


        // -----------------------------
        // UPDATE PROFILE
        // -----------------------------

        await db.query(
            `
            UPDATE students

            SET
                name = ?,
                phone = ?,
                department = ?,
                gpa = ?

            WHERE student_id = ?
            `,
            [
                name.trim(),
                phone || null,
                department || null,
                gpaNumber,
                studentId
            ]
        );


        res.json({

            success: true,

            message:
                "Profile updated successfully."

        });


    } catch (error) {

        console.error(
            "Student profile update error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to update profile.",

            error:
                error.message

        });

    }

});


// =====================================================
// RESUME UPLOAD CONFIGURATION
// =====================================================

const resumeDirectory =
    path.join(
        __dirname,
        "..",
        "uploads",
        "resumes"
    );


if (!fs.existsSync(resumeDirectory)) {

    fs.mkdirSync(
        resumeDirectory,
        {
            recursive: true
        }
    );

}


// =====================================================
// RESUME STORAGE
// =====================================================

const resumeStorage =
    multer.diskStorage({

        destination:
            function (
                req,
                file,
                cb
            ) {

                cb(
                    null,
                    resumeDirectory
                );

            },


        filename:
            function (
                req,
                file,
                cb
            ) {

                const uniqueName =
                    Date.now() +
                    "-" +
                    Math.round(
                        Math.random() * 1E9
                    ) +
                    path.extname(
                        file.originalname
                    );

                cb(
                    null,
                    uniqueName
                );

            }

    });


// =====================================================
// RESUME UPLOAD
// =====================================================

const resumeUpload =
    multer({

        storage:
            resumeStorage,

        limits: {

            fileSize:
                5 * 1024 * 1024

        },

        fileFilter:
            function (
                req,
                file,
                cb
            ) {

                const extension =
                    path
                        .extname(
                            file.originalname
                        )
                        .toLowerCase();


                if (
                    extension !== ".pdf" ||
                    file.mimetype !==
                    "application/pdf"
                ) {

                    return cb(
                        new Error(
                            "Only PDF files are allowed."
                        )
                    );

                }


                cb(
                    null,
                    true
                );

            }

    });


// =====================================================
// STUDENT RESUME UPLOAD / UPDATE
// =====================================================

router.patch(
    "/:studentId/resume",
    resumeUpload.single("resume"),

    async (req, res) => {

        try {

            const studentId =
                Number(req.params.studentId);


            // -----------------------------
            // CHECK FILE
            // -----------------------------

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please upload a PDF resume."

                });

            }


            // -----------------------------
            // CHECK STUDENT
            // -----------------------------

            const [students] =
                await db.query(
                    `
                    SELECT
                        student_id,
                        resume
                    FROM students
                    WHERE student_id = ?
                    `,
                    [studentId]
                );


            if (students.length === 0) {

                try {

                    fs.unlinkSync(
                        req.file.path
                    );

                } catch (error) {

                    console.error(
                        "Uploaded file cleanup error:",
                        error.message
                    );

                }


                return res.status(404).json({

                    success: false,

                    message:
                        "Student not found."

                });

            }


            const oldResume =
                students[0].resume;


            // -----------------------------
            // NEW RESUME PATH
            // -----------------------------

            const resumePath =
                `/uploads/resumes/${req.file.filename}`;


            // -----------------------------
            // UPDATE DATABASE
            // -----------------------------

            await db.query(
                `
                UPDATE students

                SET resume = ?

                WHERE student_id = ?
                `,
                [
                    resumePath,
                    studentId
                ]
            );


            // -----------------------------
            // DELETE OLD RESUME
            // -----------------------------

            if (oldResume) {

                const oldFile =
                    path.join(
                        __dirname,
                        "..",
                        oldResume.replace(
                            "/uploads/",
                            "uploads/"
                        )
                    );


                if (
                    fs.existsSync(oldFile)
                ) {

                    try {

                        fs.unlinkSync(
                            oldFile
                        );

                    } catch (deleteError) {

                        console.log(
                            "Old resume could not be deleted:",
                            deleteError.message
                        );

                    }

                }

            }


            res.json({

                success: true,

                message:
                    "Resume uploaded successfully.",

                resume:
                    resumePath

            });


        } catch (error) {

            console.error(
                "Resume upload error:",
                error
            );


            // Delete newly uploaded file
            if (req.file) {

                try {

                    if (
                        fs.existsSync(
                            req.file.path
                        )
                    ) {

                        fs.unlinkSync(
                            req.file.path
                        );

                    }

                } catch (cleanupError) {

                    console.error(
                        "Resume cleanup error:",
                        cleanupError
                    );

                }

            }


            // Multer file-size error
            if (
                error.code ===
                "LIMIT_FILE_SIZE"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Resume must be 5 MB or smaller."

                });

            }


            res.status(400).json({

                success: false,

                message:
                    error.message ||
                    "Unable to upload resume.",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// ADMIN - GET ALL STUDENTS
// =====================================================

router.get("/admin/all", async (req, res) => {

    try {

        const [students] =
            await db.query(
                `
                SELECT

                    s.student_id,
                    s.user_id,
                    s.name,
                    s.phone,
                    s.department,
                    s.gpa,
                    s.resume,

                    u.email,
                    u.created_at,

                    COUNT(
                        DISTINCT a.application_id
                    ) AS application_count

                FROM students s

                INNER JOIN users u
                    ON s.user_id = u.user_id

                LEFT JOIN applications a
                    ON s.student_id = a.student_id

                WHERE u.role = 'student'

                GROUP BY

                    s.student_id,
                    s.user_id,
                    s.name,
                    s.phone,
                    s.department,
                    s.gpa,
                    s.resume,
                    u.email,
                    u.created_at

                ORDER BY
                    s.student_id DESC
                `
            );


        res.json({

            success: true,

            students

        });


    } catch (error) {

        console.error(
            "Admin get students error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to load students.",

            error:
                error.message

        });

    }

});


// =====================================================
// ADMIN - GET SINGLE STUDENT
// =====================================================

router.get(
    "/admin/:studentId",
    async (req, res) => {

        try {

            const studentId =
                Number(req.params.studentId);


            if (!studentId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid student ID."

                });

            }


            // -----------------------------
            // STUDENT DETAILS
            // -----------------------------

            const [students] =
                await db.query(
                    `
                    SELECT

                        s.student_id,
                        s.user_id,
                        s.name,
                        s.phone,
                        s.department,
                        s.gpa,
                        s.resume,

                        u.email,
                        u.created_at

                    FROM students s

                    INNER JOIN users u
                        ON s.user_id = u.user_id

                    WHERE s.student_id = ?

                      AND u.role = 'student'
                    `,
                    [studentId]
                );


            if (students.length === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Student not found."

                });

            }


            const student =
                students[0];


            // -----------------------------
            // STUDENT APPLICATIONS
            // -----------------------------

            const [applications] =
                await db.query(
                    `
                    SELECT

                        a.application_id,
                        a.status,
                        a.applied_at,

                        i.title AS internship_title,

                        c.name AS company_name

                    FROM applications a

                    INNER JOIN internships i
                        ON a.internship_id =
                           i.internship_id

                    INNER JOIN companies c
                        ON i.company_id =
                           c.company_id

                    WHERE a.student_id = ?

                    ORDER BY
                        a.applied_at DESC
                    `,
                    [studentId]
                );


            res.json({

                success: true,

                student,

                applications

            });


        } catch (error) {

            console.error(
                "Admin student details error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to load student details.",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// ADMIN - UPDATE STUDENT
// =====================================================

router.patch(
    "/admin/:studentId",
    async (req, res) => {

        try {

            const studentId =
                Number(req.params.studentId);


            const {
                name,
                email,
                phone,
                department,
                gpa
            } = req.body;


            // -----------------------------
            // BASIC VALIDATION
            // -----------------------------

            if (!studentId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid student ID."

                });

            }


            if (
                !name ||
                !name.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Student name is required."

                });

            }


            if (
                !email ||
                !email.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email is required."

                });

            }


            // -----------------------------
            // EMAIL VALIDATION
            // -----------------------------

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
                    email.trim()
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please enter a valid email address."

                });

            }


            // -----------------------------
            // PHONE VALIDATION
            // -----------------------------

            if (
                phone &&
                !/^\d{10,15}$/.test(phone)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Phone number must contain 10 to 15 digits."

                });

            }


            // -----------------------------
            // GPA VALIDATION
            // -----------------------------

            const gpaNumber =
                Number(gpa);


            if (
                Number.isNaN(gpaNumber) ||
                gpaNumber < 0 ||
                gpaNumber > 10
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "CGPA must be between 0.00 and 10.00."

                });

            }


            // -----------------------------
            // FIND STUDENT
            // -----------------------------

            const [students] =
                await db.query(
                    `
                    SELECT

                        s.student_id,
                        s.user_id

                    FROM students s

                    INNER JOIN users u
                        ON s.user_id =
                           u.user_id

                    WHERE s.student_id = ?

                      AND u.role = 'student'
                    `,
                    [studentId]
                );


            if (students.length === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Student not found."

                });

            }


            const userId =
                students[0].user_id;


            // -----------------------------
            // CHECK DUPLICATE EMAIL
            // -----------------------------

            const [existingEmail] =
                await db.query(
                    `
                    SELECT user_id

                    FROM users

                    WHERE email = ?

                      AND user_id <> ?
                    `,
                    [
                        email.trim(),
                        userId
                    ]
                );


            if (
                existingEmail.length > 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "This email is already used by another account."

                });

            }


            // -----------------------------
            // UPDATE USERS
            // -----------------------------

            await db.query(
                `
                UPDATE users

                SET email = ?

                WHERE user_id = ?
                `,
                [
                    email.trim(),
                    userId
                ]
            );


            // -----------------------------
            // UPDATE STUDENT
            // -----------------------------

            await db.query(
                `
                UPDATE students

                SET

                    name = ?,
                    phone = ?,
                    department = ?,
                    gpa = ?

                WHERE student_id = ?
                `,
                [
                    name.trim(),
                    phone || null,
                    department || null,
                    gpaNumber,
                    studentId
                ]
            );


            res.json({

                success: true,

                message:
                    "Student updated successfully."

            });


        } catch (error) {

            console.error(
                "Admin update student error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to update student.",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// ADMIN - DELETE STUDENT
// =====================================================

router.delete(
    "/admin/:studentId",
    async (req, res) => {

        try {

            const studentId =
                Number(req.params.studentId);


            if (!studentId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid student ID."

                });

            }


            // -----------------------------
            // FIND STUDENT
            // -----------------------------

            const [students] =
                await db.query(
                    `
                    SELECT

                        student_id,
                        user_id

                    FROM students

                    WHERE student_id = ?
                    `,
                    [studentId]
                );


            if (students.length === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Student not found."

                });

            }


            const userId =
                students[0].user_id;


            // -----------------------------
            // DELETE USER
            //
            // students.user_id has
            // ON DELETE CASCADE
            //
            // applications.student_id also
            // has ON DELETE CASCADE
            // -----------------------------

            await db.query(
                `
                DELETE FROM users

                WHERE user_id = ?

                  AND role = 'student'
                `,
                [userId]
            );


            res.json({

                success: true,

                message:
                    "Student deleted successfully."

            });


        } catch (error) {

            console.error(
                "Admin delete student error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to delete student.",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;