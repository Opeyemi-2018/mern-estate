import express from "express";
import {
  signUp,
  signIn,
  google,
  signOut,
} from "../controllers/authController.js";

let router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/google", google);
router.get("/signout", signOut);

export default router;

// Router: This creates a new router object using express.Router().
// The router is used to define route handlers for different HTTP methods and paths.
// It allows you to modularize your routing logic, keeping it organized and maintainable
