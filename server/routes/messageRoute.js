import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  sendMessage,
  getMessage,
  getUsersWithMessage,
  GetUsersWithListings
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/send-message/:id", verifyToken, sendMessage);
router.get("/get-message/:id", verifyToken, getMessage);
router.get("/users-with-message", verifyToken, getUsersWithMessage);
router.get("/users-with-listings", verifyToken, GetUsersWithListings);


export default router;
