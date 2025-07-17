import express from "express";
import { login, register } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { verify } from "../controllers/authController.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/verify", authMiddleware, verify);
export default router;
