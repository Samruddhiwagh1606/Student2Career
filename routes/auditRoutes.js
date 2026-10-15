const express = require("express");
const db = require("../db");
const { authenticate, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/admin/audit
 * View centralized append-only audit trail
 * T&P / Admin access only
 */
router.get("/", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const { entity_type, limit = 50, offset = 0 } = req.query;

    let sql = `
      SELECT 
        log.log_id,
        log.entity_type,
        log.entity_id,
        log.actor_id,
        log.actor_role,
        log.action,
        log.previous_status,
        log.new_status,
        log.comments,
        log.created_at,
        u.email AS actor_email
      FROM audit_logs log
      JOIN users u ON log.actor_id = u.user_id
      WHERE 1=1
    `;
    const params = [];

    if (entity_type) {
      sql += " AND log.entity_type = ?";
      params.push(entity_type);
    }

    sql += " ORDER BY log.created_at DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), Number(offset));

    const [logs] = await db.query(sql, params);

    const [[{ total }]] = await db.query(
      "SELECT COUNT(*) AS total FROM audit_logs" + (entity_type ? " WHERE entity_type = ?" : ""),
      entity_type ? [entity_type] : []
    );

    res.json({ success: true, total, logs, audit_logs: logs });
  } catch (err) {
    console.error("Audit log error:", err);
    res.status(500).json({ success: false, message: "Unable to retrieve audit trail." });
  }
});

module.exports = router;
