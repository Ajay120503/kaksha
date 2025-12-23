/**
 * Role-based Access Middleware
 * Usage: roleMiddleware("teacher", "admin")
 */
module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized - Login required"
        });
      }

      const userRole = req.user.role;

      // Optional: Super Admin override
      if (userRole === "admin") return next();

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Access denied",
          allowed: allowedRoles,
          yourRole: userRole
        });
      }

      next();
    } catch (error) {
      console.error("Role Middleware Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
};
