import express from "express";
import {
  getAllContacts,
  getMessageByUserId,
  sendMessage,
  getChatPartner,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {arcjetProtection} from "../middlewares/arcjet.middleware.js"

const router = express.Router();
router.use(arcjetProtection,protectRoute);
router.get("/contacts", getAllContacts);
router.get("/chats",getChatPartner);
router.get("/:id",getMessageByUserId);
router.post("/send/:id",sendMessage);


export default router;
