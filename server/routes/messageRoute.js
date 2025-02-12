import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  sendMessage,
  getMessage,
  getUser,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/send-message/:id", verifyToken, sendMessage);
router.get("/get-message/:myId/:id", verifyToken, getMessage);
router.get("/users", verifyToken, getUser);

export default router;
