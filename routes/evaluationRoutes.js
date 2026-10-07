const express = require("express");
const router = express.Router();

const db = require("../db");


// =====================================================
// CREATE EVALUATION
// =====================================================

router.post("/", async (req, res) => {

    try {

        const {
            application_id,
            faculty_id,
            technical_score,
            communication_score,
            teamwork_score,
            punctuality_score,
            comments
        } = req.body;


        // ---------------------------------------------
        // Basic validation
        // ---------------------------------------------

        if (
            !application_id ||
            !faculty_id ||
            technical_score === undefined ||
            communication_score === undefined ||
            teamwork_score === undefined ||
            punctuality_score === undefined
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Application, faculty and all evaluation scores are required."
            });

        }


        // ---------------------------------------------
        // Convert scores to numbers
        // ---------------------------------------------

        const technical =
            Number(technical_score);

        const communication =
            Number(communication_score);

        const teamwork =
            Number(teamwork_score);

        const punctuality =
            Number(punctuality_score);


        // ---------------------------------------------
        // Validate 1–5 rating
        // ---------------------------------------------

        const scores = [
            technical,
            communication,
            teamwork,
            punctuality
        ];


        const invalidScore =
            scores.some(
                score =>
                    !Number.isInteger(score) ||
                    score < 1 ||
                    score > 5
            );


        if (invalidScore) {

            return res.status(400).json({
                success: false,
                message:
                    "All evaluation scores must be integers between 1 and 5."
            });

        }


        // ---------------------------------------------
        // Check application
        // ---------------------------------------------

        const [applications] =
            await db.query(
                `
                SELECT
                    a.application_id,
                    a.status,
                    i.posted_by,
                    i.title AS internship_title,
                    s.name AS student_name
                FROM applications a

                JOIN internships i
                    ON a.internship_id =
                       i.internship_id

                JOIN students s
                    ON a.student_id =
                       s.student_id

                WHERE a.application_id = ?
                `,
                [application_id]
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


        // ---------------------------------------------
        // Faculty authorization
        // ---------------------------------------------

        if (
            Number(application.posted_by) !==
            Number(faculty_id)
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to evaluate this student."
            });

        }


        // ---------------------------------------------
        // Only shortlisted / accepted
        // ---------------------------------------------

        if (
            application.status !== "shortlisted" &&
            application.status !== "accepted"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Evaluation can only be created for shortlisted or accepted applications."
            });

        }


        // ---------------------------------------------
        // Prevent duplicate evaluation
        // ---------------------------------------------

        const [existing] =
            await db.query(
                `
                SELECT evaluation_id
                FROM evaluations
                WHERE application_id = ?
                `,
                [application_id]
            );


        if (existing.length > 0) {

            return res.status(409).json({
                success: false,
                message:
                    "An evaluation already exists for this application."
            });

        }


        // ---------------------------------------------
        // Insert evaluation
        // ---------------------------------------------

        const [result] =
            await db.query(
                `
                INSERT INTO evaluations
                (
                    application_id,
                    technical_score,
                    communication_score,
                    teamwork_score,
                    punctuality_score,
                    comments
                )
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    application_id,
                    technical,
                    communication,
                    teamwork,
                    punctuality,
                    comments || null
                ]
            );


        res.status(201).json({

            success: true,

            message:
                "Evaluation created successfully.",

            evaluation_id:
                result.insertId

        });


    } catch (error) {

        console.error(
            "Create evaluation error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to create evaluation.",

            error:
                error.message

        });

    }

});



// =====================================================
// FACULTY - GET EVALUATIONS
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

                    message:
                        "Invalid faculty ID."

                });

            }


            const [evaluations] =
                await db.query(
                    `
                    SELECT

                        e.evaluation_id,
                        e.application_id,

                        e.technical_score,
                        e.communication_score,
                        e.teamwork_score,
                        e.punctuality_score,

                        e.comments,

                        a.status AS application_status,

                        s.student_id,
                        s.name AS student_name,
                        s.department,
                        s.gpa,

                        i.internship_id,
                        i.title AS internship_title,
                        i.domain,

                        c.name AS company_name

                    FROM evaluations e

                    JOIN applications a
                        ON e.application_id =
                           a.application_id

                    JOIN students s
                        ON a.student_id =
                           s.student_id

                    JOIN internships i
                        ON a.internship_id =
                           i.internship_id

                    JOIN companies c
                        ON i.company_id =
                           c.company_id

                    WHERE i.posted_by = ?

                    ORDER BY e.evaluation_id DESC
                    `,
                    [facultyId]
                );


            res.json({

                success: true,

                evaluations:
                    evaluations

            });


        } catch (error) {

            console.error(
                "Faculty evaluation fetch error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to fetch evaluations.",

                error:
                    error.message

            });

        }

    }
);



// =====================================================
// STUDENT - GET EVALUATIONS
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

                    message:
                        "Invalid student ID."

                });

            }


            const [evaluations] =
                await db.query(
                    `
                    SELECT

                        e.evaluation_id,
                        e.application_id,

                        e.technical_score,
                        e.communication_score,
                        e.teamwork_score,
                        e.punctuality_score,

                        e.comments,

                        a.status AS application_status,

                        i.title AS internship_title,
                        i.domain,

                        c.name AS company_name

                    FROM evaluations e

                    JOIN applications a
                        ON e.application_id =
                           a.application_id

                    JOIN internships i
                        ON a.internship_id =
                           i.internship_id

                    JOIN companies c
                        ON i.company_id =
                           c.company_id

                    WHERE a.student_id = ?

                    ORDER BY e.evaluation_id DESC
                    `,
                    [studentId]
                );


            res.json({

                success: true,

                evaluations:
                    evaluations

            });


        } catch (error) {

            console.error(
                "Student evaluation fetch error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to fetch student evaluations.",

                error:
                    error.message

            });

        }

    }
);



// =====================================================
// UPDATE EVALUATION
// =====================================================

router.patch(
    "/:evaluationId",
    async (req, res) => {

        try {

            const evaluationId =
                Number(req.params.evaluationId);


            const {
                faculty_id,
                technical_score,
                communication_score,
                teamwork_score,
                punctuality_score,
                comments
            } = req.body;


            if (
                !evaluationId ||
                !faculty_id
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Evaluation ID and Faculty ID are required."

                });

            }


            // -----------------------------------------
            // Find evaluation + faculty ownership
            // -----------------------------------------

            const [evaluations] =
                await db.query(
                    `
                    SELECT
                        e.evaluation_id,
                        i.posted_by
                    FROM evaluations e

                    JOIN applications a
                        ON e.application_id =
                           a.application_id

                    JOIN internships i
                        ON a.internship_id =
                           i.internship_id

                    WHERE e.evaluation_id = ?
                    `,
                    [evaluationId]
                );


            if (evaluations.length === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Evaluation not found."

                });

            }


            const evaluation =
                evaluations[0];


            // -----------------------------------------
            // Authorization
            // -----------------------------------------

            if (
                Number(evaluation.posted_by) !==
                Number(faculty_id)
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "You are not authorized to update this evaluation."

                });

            }


            // -----------------------------------------
            // Validate provided scores
            // -----------------------------------------

            const fields = [];
            const values = [];


            const scoreFields = [
                [
                    "technical_score",
                    technical_score
                ],
                [
                    "communication_score",
                    communication_score
                ],
                [
                    "teamwork_score",
                    teamwork_score
                ],
                [
                    "punctuality_score",
                    punctuality_score
                ]
            ];


            for (
                const [field, value]
                of scoreFields
            ) {

                if (value !== undefined) {

                    const score =
                        Number(value);


                    if (
                        !Number.isInteger(score) ||
                        score < 1 ||
                        score > 5
                    ) {

                        return res.status(400).json({

                            success: false,

                            message:
                                `${field} must be an integer between 1 and 5.`

                        });

                    }


                    fields.push(
                        `${field} = ?`
                    );

                    values.push(score);

                }

            }


            if (
                comments !== undefined
            ) {

                fields.push(
                    "comments = ?"
                );

                values.push(
                    comments
                );

            }


            if (fields.length === 0) {

                return res.status(400).json({

                    success: false,

                    message:
                        "No changes provided."

                });

            }


            values.push(
                evaluationId
            );


            await db.query(
                `
                UPDATE evaluations

                SET ${fields.join(", ")}

                WHERE evaluation_id = ?
                `,
                values
            );


            res.json({

                success: true,

                message:
                    "Evaluation updated successfully."

            });


        } catch (error) {

            console.error(
                "Update evaluation error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to update evaluation.",

                error:
                    error.message

            });

        }

    }
);



// =====================================================
// DELETE / ARCHIVE EVALUATION
// =====================================================

router.delete(
    "/:evaluationId",
    async (req, res) => {

        try {

            const evaluationId =
                Number(req.params.evaluationId);


            const facultyId =
                Number(req.body.faculty_id);


            if (
                !evaluationId ||
                !facultyId
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Evaluation ID and Faculty ID are required."

                });

            }


            // -----------------------------------------
            // Find evaluation
            // -----------------------------------------

            const [evaluations] =
                await db.query(
                    `
                    SELECT
                        e.evaluation_id,
                        i.posted_by
                    FROM evaluations e

                    JOIN applications a
                        ON e.application_id =
                           a.application_id

                    JOIN internships i
                        ON a.internship_id =
                           i.internship_id

                    WHERE e.evaluation_id = ?
                    `,
                    [evaluationId]
                );


            if (evaluations.length === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Evaluation not found."

                });

            }


            // -----------------------------------------
            // Authorization
            // -----------------------------------------

            if (
                Number(
                    evaluations[0].posted_by
                ) !== facultyId
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "You are not authorized to delete this evaluation."

                });

            }


            await db.query(
                `
                DELETE FROM evaluations
                WHERE evaluation_id = ?
                `,
                [evaluationId]
            );


            res.json({

                success: true,

                message:
                    "Evaluation removed successfully."

            });


        } catch (error) {

            console.error(
                "Delete evaluation error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to delete evaluation.",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;