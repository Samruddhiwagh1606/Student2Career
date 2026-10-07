const express = require("express");
const db = require("../db");

const router = express.Router();

console.log("FEEDBACK ROUTES LOADED");


// =====================================================
// GET STUDENT FEEDBACK-ELIGIBLE APPLICATIONS
// =====================================================

router.get(
    "/student/:studentId/eligible",
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


            const [applications] = await db.query(`

                SELECT

                    a.application_id,

                    a.student_id,

                    a.internship_id,

                    a.status,

                    i.title AS internship_title,

                    i.domain,

                    i.start_date,

                    i.end_date,

                    c.company_id,

                    c.name AS company_name,

                    f.feedback_id,

                    f.overall_rating,

                    f.created_at AS feedback_date

                FROM applications a

                INNER JOIN internships i
                    ON a.internship_id =
                       i.internship_id

                INNER JOIN companies c
                    ON i.company_id =
                       c.company_id

                LEFT JOIN internship_feedback f
                    ON a.application_id =
                       f.application_id

                WHERE a.student_id = ?

                AND a.status = 'accepted'

                ORDER BY
                    a.applied_at DESC

            `, [studentId]);


            res.json({

                success: true,

                applications

            });


        } catch (error) {

            console.error(
                "Feedback eligible error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to load feedback opportunities.",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// GET STUDENT FEEDBACK
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


            const [feedback] =
                await db.query(`

                    SELECT

                        f.feedback_id,

                        f.application_id,

                        f.student_id,

                        f.internship_id,

                        f.culture_rating,

                        f.mentorship_rating,

                        f.technical_learning_rating,

                        f.environment_rating,

                        f.overall_rating,

                        f.comments,

                        f.created_at,

                        i.title AS internship_title,

                        i.domain,

                        c.name AS company_name,

                        c.location AS company_location

                    FROM internship_feedback f

                    INNER JOIN internships i
                        ON f.internship_id =
                           i.internship_id

                    INNER JOIN companies c
                        ON i.company_id =
                           c.company_id

                    WHERE f.student_id = ?

                    ORDER BY
                        f.created_at DESC

                `, [studentId]);


            res.json({

                success: true,

                feedback

            });


        } catch (error) {

            console.error(
                "Student feedback error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to load feedback.",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// SUBMIT STUDENT FEEDBACK
// =====================================================

router.post(
    "/student",
    async (req, res) => {

        try {

            const {

                student_id,
                application_id,

                culture_rating,
                mentorship_rating,
                technical_learning_rating,
                environment_rating,
                overall_rating,

                comments

            } = req.body;


            // -----------------------------------------
            // REQUIRED FIELDS
            // -----------------------------------------

            if (
                !student_id ||
                !application_id ||
                !culture_rating ||
                !mentorship_rating ||
                !technical_learning_rating ||
                !environment_rating ||
                !overall_rating
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please provide all required ratings."

                });

            }


            const studentId =
                Number(student_id);

            const applicationId =
                Number(application_id);


            // -----------------------------------------
            // RATING VALIDATION
            // -----------------------------------------

            const ratings = [

                culture_rating,

                mentorship_rating,

                technical_learning_rating,

                environment_rating,

                overall_rating

            ];


            for (
                const rating of ratings
            ) {

                const number =
                    Number(rating);


                if (
                    !Number.isInteger(number) ||
                    number < 1 ||
                    number > 5
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "All ratings must be between 1 and 5."

                    });

                }

            }


            // -----------------------------------------
            // CHECK APPLICATION
            // -----------------------------------------

            const [applications] =
                await db.query(`

                    SELECT

                        a.application_id,

                        a.student_id,

                        a.internship_id,

                        a.status

                    FROM applications a

                    WHERE
                        a.application_id = ?

                    AND
                        a.student_id = ?

                `, [
                    applicationId,
                    studentId
                ]);


            if (
                applications.length === 0
            ) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Application not found."

                });

            }


            const application =
                applications[0];


            // -----------------------------------------
            // ONLY ACCEPTED APPLICATION
            // -----------------------------------------

            if (
                application.status !==
                "accepted"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Feedback can only be submitted for an accepted internship."

                });

            }


            // -----------------------------------------
            // CHECK EXISTING FEEDBACK
            // -----------------------------------------

            const [existing] =
                await db.query(`

                    SELECT feedback_id

                    FROM internship_feedback

                    WHERE application_id = ?

                `, [
                    applicationId
                ]);


            if (
                existing.length > 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Feedback has already been submitted for this internship."

                });

            }


            // -----------------------------------------
            // INSERT
            // -----------------------------------------

            const [result] =
                await db.query(`

                    INSERT INTO internship_feedback

                    (
                        application_id,
                        student_id,
                        internship_id,

                        culture_rating,
                        mentorship_rating,
                        technical_learning_rating,
                        environment_rating,
                        overall_rating,

                        comments
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

                        ?
                    )

                `, [

                    applicationId,

                    studentId,

                    application.internship_id,

                    Number(culture_rating),

                    Number(mentorship_rating),

                    Number(
                        technical_learning_rating
                    ),

                    Number(
                        environment_rating
                    ),

                    Number(
                        overall_rating
                    ),

                    comments
                        ? comments.trim()
                        : null

                ]);


            res.status(201).json({

                success: true,

                message:
                    "Feedback submitted successfully.",

                feedback_id:
                    result.insertId

            });


        } catch (error) {

            console.error(
                "Submit feedback error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to submit feedback.",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// GET COMPANY FEEDBACK SUMMARY
// =====================================================

router.get(
    "/company/:companyId/summary",
    async (req, res) => {

        try {

            const companyId =
                Number(req.params.companyId);


            if (!companyId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid company ID."

                });

            }


            const [[summary]] =
                await db.query(`

                    SELECT

                        COUNT(f.feedback_id)
                            AS total_feedback,

                        ROUND(
                            AVG(
                                f.culture_rating
                            ),
                            2
                        ) AS culture_average,

                        ROUND(
                            AVG(
                                f.mentorship_rating
                            ),
                            2
                        ) AS mentorship_average,

                        ROUND(
                            AVG(
                                f.technical_learning_rating
                            ),
                            2
                        ) AS technical_learning_average,

                        ROUND(
                            AVG(
                                f.environment_rating
                            ),
                            2
                        ) AS environment_average,

                        ROUND(
                            AVG(
                                f.overall_rating
                            ),
                            2
                        ) AS overall_average

                    FROM internship_feedback f

                    INNER JOIN internships i
                        ON f.internship_id =
                           i.internship_id

                    WHERE i.company_id = ?

                `, [
                    companyId
                ]);


            res.json({

                success: true,

                summary

            });


        } catch (error) {

            console.error(
                "Company feedback summary error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to load company feedback summary.",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;