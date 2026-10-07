const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");

const router = express.Router();

console.log("APPLICATION ROUTES LOADED");


// =====================================================
// RESUME UPLOAD FOLDER
// =====================================================

const uploadDirectory = path.join(
    __dirname,
    "..",
    "uploads",
    "resumes"
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true
    });
}


// =====================================================
// MULTER CONFIGURATION
// =====================================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }

});


const upload = multer({

    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: function (req, file, cb) {

        const extension =
            path.extname(file.originalname).toLowerCase();

        if (
            extension !== ".pdf" ||
            file.mimetype !== "application/pdf"
        ) {

            return cb(
                new Error("Only PDF resumes are allowed.")
            );
        }

        cb(null, true);
    }

});


// =====================================================
// SUBMIT APPLICATION
// =====================================================

router.post(
    "/",
    upload.single("resume"),
    async (req, res) => {

        try {

            const {
                student_id,
                internship_id,
                cover_letter,
                qualifications
            } = req.body;


            // -----------------------------
            // BASIC VALIDATION
            // -----------------------------

            if (!student_id || !internship_id) {

                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }

                return res.status(400).json({
                    success: false,
                    message:
                        "Student and internship are required."
                });
            }


            if (!req.file) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Please upload a PDF resume."
                });
            }


            if (
                !cover_letter ||
                !cover_letter.trim()
            ) {

                fs.unlinkSync(req.file.path);

                return res.status(400).json({
                    success: false,
                    message:
                        "Cover letter is required."
                });
            }


            if (
                !qualifications ||
                !qualifications.trim()
            ) {

                fs.unlinkSync(req.file.path);

                return res.status(400).json({
                    success: false,
                    message:
                        "Qualifications are required."
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
                    [student_id]
                );


            if (students.length === 0) {

                fs.unlinkSync(req.file.path);

                return res.status(404).json({
                    success: false,
                    message:
                        "Student not found."
                });
            }


            // -----------------------------
            // CHECK INTERNSHIP
            // -----------------------------

            const [internships] =
                await db.query(
                    `
                    SELECT
                        internship_id,
                        status,
                        application_deadline
                    FROM internships
                    WHERE internship_id = ?
                    `,
                    [internship_id]
                );


            if (internships.length === 0) {

                fs.unlinkSync(req.file.path);

                return res.status(404).json({
                    success: false,
                    message:
                        "Internship not found."
                });
            }


            const internship =
                internships[0];


            // -----------------------------
            // APPROVAL CHECK
            // -----------------------------

            if (internship.status !== "approved") {

                fs.unlinkSync(req.file.path);

                return res.status(400).json({
                    success: false,
                    message:
                        "Applications are only allowed for approved internships."
                });
            }


            // -----------------------------
            // DEADLINE CHECK
            // -----------------------------

            if (
                internship.application_deadline &&
                new Date(internship.application_deadline) < new Date()
            ) {

                fs.unlinkSync(req.file.path);

                return res.status(400).json({
                    success: false,
                    message:
                        "The application deadline has passed."
                });
            }


            // -----------------------------
            // DUPLICATE APPLICATION CHECK
            // -----------------------------

            const [existingApplications] =
                await db.query(
                    `
                    SELECT application_id
                    FROM applications
                    WHERE student_id = ?
                    AND internship_id = ?
                    `,
                    [
                        student_id,
                        internship_id
                    ]
                );


            if (existingApplications.length > 0) {

                fs.unlinkSync(req.file.path);

                return res.status(409).json({
                    success: false,
                    message:
                        "You have already applied for this internship."
                });
            }


            // -----------------------------
            // SAVE APPLICATION
            // -----------------------------

            const resumePath =
                `/uploads/resumes/${req.file.filename}`;


            const [result] =
                await db.query(
                    `
                    INSERT INTO applications
                    (
                        student_id,
                        internship_id,
                        resume,
                        cover_letter,
                        qualifications,
                        status
                    )
                    VALUES (?, ?, ?, ?, ?, 'pending')
                    `,
                    [
                        student_id,
                        internship_id,
                        resumePath,
                        cover_letter.trim(),
                        qualifications.trim()
                    ]
                );


            // -----------------------------
            // SUCCESS
            // -----------------------------

            res.status(201).json({

                success: true,

                message:
                    "Application submitted successfully.",

                application_id:
                    result.insertId

            });

        } catch (error) {

            console.error(
                "Application submission error:",
                error
            );


            if (req.file) {

                try {

                    if (
                        fs.existsSync(req.file.path)
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


            if (
                error.code === "ER_DUP_ENTRY"
            ) {

                return res.status(409).json({
                    success: false,
                    message:
                        "You have already applied for this internship."
                });
            }


            res.status(500).json({

                success: false,

                message:
                    "Unable to submit application.",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// GET STUDENT APPLICATIONS
// =====================================================

router.get(
    "/student/:studentId",
    async (req, res) => {

        try {

            const studentId =
                req.params.studentId;


            const [applications] =
                await db.query(
                    `
                    SELECT
                        a.application_id,
                        a.student_id,
                        a.internship_id,
                        a.resume,
                        a.cover_letter,
                        a.qualifications,
                        a.status,
                        a.applied_at,

                        i.title,
                        i.domain,
                        i.start_date,
                        i.end_date,
                        i.application_deadline,

                        c.name AS company_name,
                        c.location

                    FROM applications a

                    JOIN internships i
                        ON a.internship_id =
                           i.internship_id

                    JOIN companies c
                        ON i.company_id =
                           c.company_id

                    WHERE a.student_id = ?

                    ORDER BY a.applied_at DESC
                    `,
                    [studentId]
                );


            res.json({

                success: true,

                applications:
                    applications

            });

        } catch (error) {

            console.error(
                "Application fetch error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to fetch applications.",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// FACULTY - GET APPLICATIONS FOR THEIR INTERNSHIPS
// =====================================================

router.get(
    "/faculty/:facultyId",
    async (req, res) => {

        try {

            const facultyId =
                Number(req.params.facultyId);


            if (!facultyId) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid faculty ID."
                });

            }


            const [applications] =
                await db.query(
                    `
                    SELECT

                        a.application_id,
                        a.student_id,
                        a.internship_id,

                        a.resume,
                        a.cover_letter,
                        a.qualifications,
                        a.status,
                        a.applied_at,

                        s.name AS student_name,
                        s.phone AS student_phone,
                        s.department AS student_department,
                        s.gpa AS student_gpa,

                        i.title AS internship_title,
                        i.domain,
                        i.duration_weeks,
                        i.stipend,

                        c.name AS company_name

                    FROM applications a

                    JOIN students s
                        ON a.student_id = s.student_id

                    JOIN internships i
                        ON a.internship_id = i.internship_id

                    JOIN companies c
                        ON i.company_id = c.company_id

                    WHERE i.posted_by = ?

                    ORDER BY a.applied_at DESC
                    `,
                    [facultyId]
                );


            res.json({

                success: true,

                applications:
                    applications

            });


        } catch (error) {

            console.error(
                "Faculty application fetch error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to fetch faculty applications.",

                error:
                    error.message

            });

        }

    }
);



// =====================================================
// FACULTY - UPDATE APPLICATION STATUS
// =====================================================

router.patch(
    "/faculty/:applicationId/status",
    async (req, res) => {

        try {

            const applicationId =
                Number(req.params.applicationId);

            const {
                faculty_id,
                status
            } = req.body;


            // -----------------------------
            // VALIDATION
            // -----------------------------

            if (!applicationId || !faculty_id) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Application ID and Faculty ID are required."

                });

            }


            const allowedStatuses = [
                "shortlisted",
                "rejected",
                "accepted"
            ];


            if (!allowedStatuses.includes(status)) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid application status."

                });

            }


            // -----------------------------
            // CHECK APPLICATION
            // -----------------------------

            const [applications] =
                await db.query(
                    `
                    SELECT

                        a.application_id,
                        a.status,
                        i.posted_by

                    FROM applications a

                    JOIN internships i
                        ON a.internship_id =
                           i.internship_id

                    WHERE a.application_id = ?
                    `,
                    [applicationId]
                );


            if (applications.length === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Application not found."

                });

            }


            const application =
                applications[0];


            // -----------------------------
            // FACULTY OWNERSHIP CHECK
            // -----------------------------

            if (
                Number(application.posted_by) !==
                Number(faculty_id)
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "You are not authorized to update this application."

                });

            }


            // -----------------------------
            // UPDATE STATUS
            // -----------------------------

            await db.query(
                `
                UPDATE applications

                SET status = ?

                WHERE application_id = ?
                `,
                [
                    status,
                    applicationId
                ]
            );


            res.json({

                success: true,

                message:
                    `Application ${status} successfully.`,

                status:
                    status

            });


        } catch (error) {

            console.error(
                "Faculty application status error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to update application status.",

                error:
                    error.message

            });

        }

    }
);



// =====================================================
// EXPORT ROUTER
// =====================================================
// =====================================================
// STUDENT: WITHDRAW APPLICATION
// =====================================================

router.patch(
    "/:applicationId/withdraw",
    async (req, res) => {

        try {

            const applicationId =
                Number(req.params.applicationId);

            const { student_id } = req.body;


            if (!student_id) {

                return res.status(400).json({
                    success: false,
                    message: "Student ID is required."
                });

            }


            // Check application belongs to student
            const [applications] =
                await db.query(
                    `
                    SELECT
                        application_id,
                        student_id,
                        status
                    FROM applications
                    WHERE application_id = ?
                    AND student_id = ?
                    `,
                    [
                        applicationId,
                        student_id
                    ]
                );


            if (applications.length === 0) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Application not found or unauthorized."
                });

            }


            const application =
                applications[0];


            // Cannot withdraw already finalized application
            if (
                application.status === "accepted" ||
                application.status === "rejected" ||
                application.status === "withdrawn"
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Application cannot be withdrawn because its status is ${application.status}.`
                });

            }


            // Withdraw
            await db.query(
                `
                UPDATE applications
                SET status = 'withdrawn'
                WHERE application_id = ?
                AND student_id = ?
                `,
                [
                    applicationId,
                    student_id
                ]
            );


            res.json({
                success: true,
                message:
                    "Application withdrawn successfully."
            });


        } catch (error) {

            console.error(
                "Withdraw application error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Unable to withdraw application.",
                error:
                    error.message
            });

        }

    }
);
module.exports = router;