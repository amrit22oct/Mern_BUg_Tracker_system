import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * Middleware: Protect routes
 * - Verifies JWT
 * - Attaches the authenticated user to req.user
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from decoded token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found, invalid token" });
    }

    // Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    res.status(401).json({ message: "Not authorized, token failed or expired" });
  }
};

/**
 * Middleware: Authorize specific roles
 * - Restricts access based on user role
 * - Example: authorisedRoles("Admin", "ProjectManager")
 */
export const authorisedRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user missing" });
    }

    // Match role exactly
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: requires one of the following roles: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

/**
 * Middleware: Admin or ProjectManager only
 * - Convenient helper for routes where both are allowed
 */
export const adminOrProjectManager = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (req.user.role !== "Admin" && req.user.role !== "ProjectManager") {
    return res.status(403).json({ message: "Access denied: Admin or ProjectManager only" });
  }

  next();
};
