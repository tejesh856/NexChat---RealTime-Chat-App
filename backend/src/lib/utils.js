import jwt from "jsonwebtoken";
export const generateAuthToken = (userId, res) => {
  const payload = { userId };
  const secret = process.env.AUTH_SECRET;
  const expiresIn = "7d";

  // Generate the token
  const token = jwt.sign(payload, secret, { expiresIn });

  // Send the token as a response (optional: store it in a cookie)
  res.cookie("authToken", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return token;
};
export function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}
