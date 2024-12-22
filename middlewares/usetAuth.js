import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    // Get token from cookies
    const { userToken } = req.cookies;

    console.log(userToken)

    // Check if any token exists
    if (!userToken) {
      return res
        .status(401)
        .json({
          success: false,
          message: "User not authorized: No token provided",
        });
    }

    // Verify token asynchronously
    jwt.verify(userToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
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
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return res
      .status(400)
      .json({
        success: false,
        message: "Authentication failed",
        error: error.message,
      });
  }
};

export { userAuth };
