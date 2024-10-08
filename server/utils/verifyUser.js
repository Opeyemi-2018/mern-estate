import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export let verifyToken = (req, res, next) => {
  let token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) return next(errorHandler(403, "Forbidden"));

    req.user = user;
    next();
  });
};
