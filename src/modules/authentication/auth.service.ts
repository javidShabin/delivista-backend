
import bcrypt from "bcrypt";
const otpGenerator = require('otp-generator');


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


// Generate a 6-digit numeric OTP
export const generateOTP = (): string => {
  return otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};
