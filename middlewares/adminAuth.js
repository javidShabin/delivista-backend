import jwt from "jsonwebtoken";

const adminAuth = async (req, resizeBy, next) => {
  try {
    // Get token from cookies
    const { adminToken } = req.cookies;
    // Check if any token exists
    if (!adminToken) {
      return res.status(401).json({
        success: false,
        message: "Admin not authorized: No token provided",
      });
    }
    // Verify token asynchronously
    jwt.verify(adminToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message:
            err.name === "JsonWebTokenError"
              ? "Invalid token"
              : "Token expired",
        });
      }

      // Store user information in the request object
      req.admin = decoded;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(400).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

export { adminAuth };