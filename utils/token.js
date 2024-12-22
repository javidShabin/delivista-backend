import jwt from "jsonwebtoken";

// Generate user token
const generateUserToken = ({ _id, email, role }) => {
  try {
    const token = jwt.sign(
      {
        id: _id,
        email: email,
        role: role || "user",
      },
      process.env.JWT_SECRET_KEY
    );
    return token;
  } catch (error) {
    console.error("Error generating user token:", error);
    return null; // Optional: return null to indicate failure
  }
};

// Generate admin token
const generateAdminToken = ({ _id, email, role }) => {
  try {
    const token = jwt.sign(
      {
        id: _id,
        email: email,
        role: role || "admin",
      },
      process.env.JWT_SECRET_KEY
    );
    return token;
  } catch (error) {
    console.error("Error generating admin token:", error);
    return null; // Optional: return null to indicate failure
  }
};

// Generate seller token
const generateSellerToken = ({ _id, email, role }) => {
  try {
    const token = jwt.sign(
      {
        id: _id,
        email: email,
        role: role || "seller",
      },
      process.env.JWT_SECRET_KEY
    );
    return token;
  } catch (error) {
    console.error("Error generating seller token:", error);
    return null; // Optional: return null to indicate failure
  }
};

export { generateUserToken, generateAdminToken, generateSellerToken };
