const express = require("express");
const router = express.Router();

const db = require("../db");

// =====================================================
// CREATE INTERVIEW
// =====================================================

router.post("/", async (req, res) => {

    try {

        const {
            application_id,
            faculty_id,
            interview_date,
            interview_time,
            interviewer_name
        } = req.body;

        // -----------------------------
        // Basic validation
        // -----------------------------

        if (
            !application_id ||
            !faculty_id ||
            !interview_date ||
            !interview_time ||
            !interviewer_name
        ) {
            return res.status(400).json({
                success: false,
                message: "All interview details are required."
            });
        }

        // -----------------------------
        // Check application
        // -----------------------------

        const [applications] = await db.query(
            `
            SELECT
                a.application_id,
                a.status,
                i.internship_id,
                i.posted_by,
                i.application_deadline,
                i.title,
                s.name AS student_name
            FROM applications a
            JOIN internships i
                ON a.internship_id = i.internship_id
            JOIN students s
                ON a.student_id = s.student_id
            WHERE a.application_id = ?
            `,
            [application_id]
        );

        if (applications.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Application not found."
            });
        }

        const application = applications[0];

        // -----------------------------
        // Faculty authorization
        // -----------------------------

        if (
            Number(application.posted_by) !==
            Number(faculty_id)
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to schedule an interview for this application."
            });
        }

        // -----------------------------
        // Only shortlisted/accepted
        // applications can be interviewed
        // -----------------------------

        if (
            application.status !== "shortlisted" &&
            application.status !== "accepted"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Interview can only be scheduled for shortlisted or accepted applications."
            });
        }

        // -----------------------------
        // Prevent duplicate interview
        // -----------------------------

        const [existing] = await db.query(
            `
            SELECT interview_id
            FROM interviews
            WHERE application_id = ?
            `,
            [application_id]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message:
                    "An interview is already scheduled for this application."
            });
        }

        // -----------------------------
        // Date/time validation
        // -----------------------------

        const interviewDateTime =
            new Date(
                `${interview_date}T${interview_time}`
            );

        if (isNaN(interviewDateTime.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid interview date or time."
            });
        }

        const now = new Date();

        // Must be at least 24 hours in future
        const minimumNotice =
            new Date(
                now.getTime() +
                24 * 60 * 60 * 1000
            );

        if (interviewDateTime < minimumNotice) {
            return res.status(400).json({
                success: false,
                message:
                    "Interview must be scheduled at least 24 hours in advance."
            });
        }

        // -----------------------------
        // Interview cannot be after
        // application deadline
        // -----------------------------

        const deadline =
            new Date(
                `${application.application_deadline}T23:59:59`
            );

        if (interviewDateTime > deadline) {
            return res.status(400).json({
                success: false,
                message:
                    "Interview cannot be scheduled after the application deadline."
            });
        }

        // -----------------------------
        // Insert interview
        // -----------------------------

        const [result] = await db.query(
            `
            INSERT INTO interviews
            (
                application_id,
                interview_date,
                interview_time,
                interviewer_name
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                application_id,
                interview_date,
                interview_time,
                interviewer_name.trim()
            ]
        );

        res.status(201).json({
            success: true,
            message:
                "Interview scheduled successfully.",
            interview_id:
                result.insertId
        });

    } catch (error) {

        console.error(
            "Create interview error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to schedule interview.",
            error:
                error.message
        });
    }
});


// =====================================================
// FACULTY - VIEW INTERVIEWS
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

            const [interviews] =
                await db.query(
                    `
                    SELECT
                        i.interview_id,
                        i.application_id,
                        i.interview_date,
                        i.interview_time,
                        i.interviewer_name,
                        i.result,
                        i.feedback,

                        a.status AS application_status,

                        s.student_id,
                        s.name AS student_name,
                        s.department,
                        s.gpa,

                        ins.internship_id,
                        ins.title AS internship_title,

                        c.name AS company_name

                    FROM interviews i

                    JOIN applications a
                        ON i.application_id =
                           a.application_id

                    JOIN students s
                        ON a.student_id =
                           s.student_id

                    JOIN internships ins
                        ON a.internship_id =
                           ins.internship_id

                    JOIN companies c
                        ON ins.company_id =
                           c.company_id

                    WHERE ins.posted_by = ?

                    ORDER BY
                        i.interview_date ASC,
                        i.interview_time ASC
                    `,
                    [facultyId]
                );

            res.json({
                success: true,
                interviews: interviews
            });

        } catch (error) {

            console.error(
                "Faculty interview fetch error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Unable to fetch interviews.",
                error:
                    error.message
            });
        }
    }
);


// =====================================================
// STUDENT - VIEW INTERVIEWS
// =====================================================

router.get(
    "/student/:studentId",
    async (req, res) => {

        try {

            const studentId =
                Number(req.params.studentId);

            if (!studentId) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid student ID."
                });
            }

            const [interviews] =
                await db.query(
                    `
                    SELECT
                        i.interview_id,
                        i.application_id,
                        i.interview_date,
                        i.interview_time,
                        i.interviewer_name,
                        i.result,
                        i.feedback,

                        a.status AS application_status,

                        ins.title AS internship_title,
                        ins.domain,

                        c.name AS company_name,
                        c.location AS company_location

                    FROM interviews i

                    JOIN applications a
                        ON i.application_id =
                           a.application_id

                    JOIN internships ins
                        ON a.internship_id =
                           ins.internship_id

                    JOIN companies c
                        ON ins.company_id =
                           c.company_id

                    WHERE a.student_id = ?

                    ORDER BY
                        i.interview_date ASC,
                        i.interview_time ASC
                    `,
                    [studentId]
                );

            res.json({
                success: true,
                interviews: interviews
            });

        } catch (error) {

            console.error(
                "Student interview fetch error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Unable to fetch student interviews.",
                error:
                    error.message
            });
        }
    }
);


// =====================================================
// UPDATE INTERVIEW
// Reschedule + Result + Feedback
// =====================================================

router.patch(
    "/:interviewId",
    async (req, res) => {

        try {

            const interviewId =
                Number(req.params.interviewId);

            const {
                faculty_id,
                interview_date,
                interview_time,
                interviewer_name,
                result,
                feedback
            } = req.body;

            if (!interviewId || !faculty_id) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Interview ID and Faculty ID are required."
                });
            }

            // -----------------------------
            // Find interview
            // -----------------------------

            const [interviews] =
                await db.query(
                    `
                    SELECT
                        i.interview_id,
                        i.application_id,
                        ins.posted_by,
                        ins.application_deadline
                    FROM interviews i

                    JOIN applications a
                        ON i.application_id =
                           a.application_id

                    JOIN internships ins
                        ON a.internship_id =
                           ins.internship_id

                    WHERE i.interview_id = ?
                    `,
                    [interviewId]
                );

            if (interviews.length === 0) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Interview not found."
                });
            }

            const interview =
                interviews[0];

            // -----------------------------
            // Authorization
            // -----------------------------

            if (
                Number(interview.posted_by) !==
                Number(faculty_id)
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        "You are not authorized to update this interview."
                });
            }

            // -----------------------------
            // Build update fields
            // -----------------------------

            const fields = [];
            const values = [];

            if (
                interview_date &&
                interview_time
            ) {

                const newDateTime =
                    new Date(
                        `${interview_date}T${interview_time}`
                    );

                if (
                    isNaN(
                        newDateTime.getTime()
                    )
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Invalid interview date or time."
                    });
                }

                const now = new Date();

                const minimumNotice =
                    new Date(
                        now.getTime() +
                        24 * 60 * 60 * 1000
                    );

                if (
                    newDateTime <
                    minimumNotice
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Interview must be scheduled at least 24 hours in advance."
                    });
                }

                const deadline =
                    new Date(
                        `${interview.application_deadline}T23:59:59`
                    );

                if (
                    newDateTime >
                    deadline
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Interview cannot be scheduled after the application deadline."
                    });
                }

                fields.push(
                    "interview_date = ?"
                );
                values.push(
                    interview_date
                );

                fields.push(
                    "interview_time = ?"
                );
                values.push(
                    interview_time
                );
            }

            if (interviewer_name !== undefined) {
                fields.push(
                    "interviewer_name = ?"
                );
                values.push(
                    interviewer_name.trim()
                );
            }

            if (result !== undefined) {
                fields.push(
                    "result = ?"
                );
                values.push(result);
            }

            if (feedback !== undefined) {
                fields.push(
                    "feedback = ?"
                );
                values.push(feedback);
            }

            if (fields.length === 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        "No changes provided."
                });
            }

            values.push(interviewId);

            await db.query(
                `
                UPDATE interviews
                SET ${fields.join(", ")}
                WHERE interview_id = ?
                `,
                values
            );

            res.json({
                success: true,
                message:
                    "Interview updated successfully."
            });

        } catch (error) {

            console.error(
                "Update interview error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Unable to update interview.",
                error:
                    error.message
            });
        }
    }
);


// =====================================================
// DELETE / CANCEL INTERVIEW
// =====================================================

router.delete(
    "/:interviewId",
    async (req, res) => {

        try {

            const interviewId =
                Number(req.params.interviewId);

            const facultyId =
                Number(req.body.faculty_id);

            if (!interviewId || !facultyId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Interview ID and Faculty ID are required."
                });
            }

            const [interviews] =
                await db.query(
                    `
                    SELECT
                        i.interview_id,
                        ins.posted_by
                    FROM interviews i

                    JOIN applications a
                        ON i.application_id =
                           a.application_id

                    JOIN internships ins
                        ON a.internship_id =
                           ins.internship_id

                    WHERE i.interview_id = ?
                    `,
                    [interviewId]
                );

            if (interviews.length === 0) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Interview not found."
                });
            }

            if (
                Number(interviews[0].posted_by) !==
                facultyId
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        "You are not authorized to cancel this interview."
                });
            }

            await db.query(
                `
                DELETE FROM interviews
                WHERE interview_id = ?
                `,
                [interviewId]
            );

            res.json({
                success: true,
                message:
                    "Interview cancelled successfully."
            });

        } catch (error) {

            console.error(
                "Delete interview error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Unable to cancel interview.",
                error:
                    error.message
            });
        }
    }
);


module.exports = router;