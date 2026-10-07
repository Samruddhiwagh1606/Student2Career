const express = require("express");
const db = require("../db");

const router = express.Router();

console.log("COMPANY ROUTES LOADED");


// =====================================================
// GET ALL COMPANIES
// =====================================================

router.get("/", async (req, res) => {

    try {

        const [companies] = await db.query(`
            SELECT
                c.company_id,
                c.name,
                c.registration_number,
                c.location,
                c.contact_person,
                c.contact_email,
                COUNT(i.internship_id) AS internship_count
            FROM companies c
            LEFT JOIN internships i
                ON c.company_id = i.company_id
            GROUP BY
                c.company_id,
                c.name,
                c.registration_number,
                c.location,
                c.contact_person,
                c.contact_email
            ORDER BY c.company_id DESC
        `);

        res.json({
            success: true,
            companies
        });

    } catch (error) {

        console.error("Company fetch error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch companies.",
            error: error.message
        });

    }

});


// =====================================================
// GET SINGLE COMPANY
// =====================================================

router.get("/:companyId", async (req, res) => {

    try {

        const companyId =
            Number(req.params.companyId);

        const [companies] =
            await db.query(`
                SELECT
                    company_id,
                    name,
                    registration_number,
                    location,
                    contact_person,
                    contact_email
                FROM companies
                WHERE company_id = ?
            `, [companyId]);

        if (companies.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Company not found."
            });

        }

        res.json({
            success: true,
            company: companies[0]
        });

    } catch (error) {

        console.error("Company details error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch company.",
            error: error.message
        });

    }

});


// =====================================================
// CREATE COMPANY
// =====================================================

router.post("/", async (req, res) => {

    try {

        const {
            name,
            registration_number,
            location,
            contact_person,
            contact_email
        } = req.body;


        if (!name || !name.trim()) {

            return res.status(400).json({
                success: false,
                message: "Company name is required."
            });

        }


        if (
            !registration_number ||
            !registration_number.trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Registration number is required."
            });

        }


        if (
            contact_email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(contact_email)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid contact email."
            });

        }


        // Check duplicate registration number

        const [existing] =
            await db.query(`
                SELECT company_id
                FROM companies
                WHERE registration_number = ?
            `, [
                registration_number.trim()
            ]);


        if (existing.length > 0) {

            return res.status(400).json({
                success: false,
                message:
                    "Registration number already exists."
            });

        }


        const [result] =
            await db.query(`
                INSERT INTO companies
                (
                    name,
                    registration_number,
                    location,
                    contact_person,
                    contact_email
                )
                VALUES (?, ?, ?, ?, ?)
            `, [
                name.trim(),
                registration_number.trim(),
                location || null,
                contact_person || null,
                contact_email || null
            ]);


        res.status(201).json({

            success: true,

            message:
                "Company added successfully.",

            company_id:
                result.insertId

        });

    } catch (error) {

        console.error(
            "Company creation error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to create company.",

            error:
                error.message

        });

    }

});


// =====================================================
// UPDATE COMPANY
// =====================================================

router.patch("/:companyId", async (req, res) => {

    try {

        const companyId =
            Number(req.params.companyId);

        const {
            name,
            registration_number,
            location,
            contact_person,
            contact_email
        } = req.body;


        if (!name || !name.trim()) {

            return res.status(400).json({
                success: false,
                message:
                    "Company name is required."
            });

        }


        if (
            !registration_number ||
            !registration_number.trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Registration number is required."
            });

        }


        if (
            contact_email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(contact_email)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid contact email."
            });

        }


        // Check company

        const [company] =
            await db.query(`
                SELECT company_id
                FROM companies
                WHERE company_id = ?
            `, [companyId]);


        if (company.length === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "Company not found."
            });

        }


        // Check duplicate registration number

        const [duplicate] =
            await db.query(`
                SELECT company_id
                FROM companies
                WHERE registration_number = ?
                AND company_id != ?
            `, [
                registration_number.trim(),
                companyId
            ]);


        if (duplicate.length > 0) {

            return res.status(400).json({
                success: false,
                message:
                    "Registration number already exists."
            });

        }


        await db.query(`
            UPDATE companies
            SET
                name = ?,
                registration_number = ?,
                location = ?,
                contact_person = ?,
                contact_email = ?
            WHERE company_id = ?
        `, [
            name.trim(),
            registration_number.trim(),
            location || null,
            contact_person || null,
            contact_email || null,
            companyId
        ]);


        res.json({
            success: true,
            message:
                "Company updated successfully."
        });

    } catch (error) {

        console.error(
            "Company update error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to update company.",
            error:
                error.message
        });

    }

});


// =====================================================
// DELETE COMPANY
// =====================================================

router.delete("/:companyId", async (req, res) => {

    try {

        const companyId =
            Number(req.params.companyId);


        // Check internships first

        const [internships] =
            await db.query(`
                SELECT internship_id
                FROM internships
                WHERE company_id = ?
                LIMIT 1
            `, [companyId]);


        if (internships.length > 0) {

            return res.status(400).json({

                success: false,

                message:
                    "This company cannot be deleted because internships are linked to it."

            });

        }


        const [result] =
            await db.query(`
                DELETE FROM companies
                WHERE company_id = ?
            `, [companyId]);


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "Company not found."
            });

        }


        res.json({
            success: true,
            message:
                "Company deleted successfully."
        });

    } catch (error) {

        console.error(
            "Company deletion error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to delete company.",
            error:
                error.message
        });

    }

});


module.exports = router;