
import bcrypt from "bcrypt";

// Hashes a plain text password with a salt round of 10
export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

// Compare the user password using bcrypt
export const comparePassword = async (
  password: string,
  userPassword: string
) => {
  return bcrypt.compareSync(password, userPassword);
};
