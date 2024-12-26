import jwt from "jsonwebtoken";

const sellerAuth = async (req, res, next) => {
  try {
    // Get token from cookies
    const { sellerToken } = req.cookies;
    // Check if any token exists
    if (!sellerAuth) {
      return res.status(401).json({
        success: false,
        message: "Seller not authorized: No token provided",
      });
    }
    // Verify token asynchronously
    jwt.verify(sellerToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
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
      req.seller = decoded;
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

export { sellerAuth };
