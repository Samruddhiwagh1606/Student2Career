const crypto = require("crypto");
const db = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "c2c_krypta_secret_key_2026";

/**
 * Generate a cryptographically signed HMAC token
 */
function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const claims = Buffer.from(JSON.stringify({
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  })).toString("base64url");
  
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${claims}`)
    .digest("base64url");

  return `${header}.${claims}.${signature}`;
}

/**
 * Verify and decode HMAC token
 */
function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, claims, signature] = parts;
  const expectedSig = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${claims}`)
    .digest("base64url");

  if (signature !== expectedSig) return null;

  try {
    const data = JSON.parse(Buffer.from(claims, "base64url").toString("utf8"));
    if (data.exp && Date.now() > data.exp) return null; // Expired
    return data;
  } catch (err) {
    return null;
  }
}

/**
 * Express Authentication Middleware: enforces valid Bearer token
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in."
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session. Please log in again."
    });
  }

  // Attach verified user payload
  req.user = decoded;
  next();
}

/**
 * Role Authorization Middleware
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access denied for role '${req.user.role}'.`
      });
    }

    next();
  };
}

/**
 * Student Ownership or Admin access check
 */
function requireStudentOwner(paramName = "studentId") {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    if (req.user.role === "admin") {
      return next(); // Admins have full access
    }

    const targetStudentId = Number(req.params[paramName] || req.body[paramName] || req.query[paramName]);
    if (req.user.role === "student" && req.user.student_id === targetStudentId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Forbidden: You do not have permission to access another student's records."
    });
  };
}

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  authorizeRoles,
  requireStudentOwner
};
