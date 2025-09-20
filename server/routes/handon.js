import express from "express";
import { deleteFile, getFiles, uploadFile } from "../controllers/handons.js";
import upload from "../middlewares/upload.js";
const router = express.Router();

router.post("/upload", upload.single("image"), uploadFile);
router.get("/files", getFiles);
router.delete("/files/:id", deleteFile);
export default router;
