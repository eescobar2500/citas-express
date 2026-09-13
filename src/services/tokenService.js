import jwt from "jsonwebtoken";
import env from "../config/env.js";

export function generateToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwt.secret);
}
