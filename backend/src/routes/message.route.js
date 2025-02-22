import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessages,
} from "../controllers/message.controller.js";
const router = express.Router();

//message routes
router.get("/users", protectRoute, getUsersForSidebar);
router.get("/users/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessages);

export default router;
