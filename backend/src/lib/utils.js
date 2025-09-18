import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
const{JWT_SECRET}=process.env;
if(!JWT_SECRET){
  throw new console.error("JWT_SECRET is not configured");
  
}



  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    httpOnly: true, // prevent XSS attacks
    sameSite: "strict", // CSRF protection
    secure: process.env.NODE_ENV === "production", // only secure on HTTPS
  });

  return token;
};

// http://localhost
// https://somedomain.com
