import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  addDepartment,
  deleteDepartment,
  editDepartment,
  getDepartmentById,
  listDepartments,
} from "../controllers/departmentController.js";
const router = express.Router();
router.get("/", authMiddleware, listDepartments);
router.post("/add", authMiddleware, addDepartment);
router.get("/:id", authMiddleware, getDepartmentById);
router.put("/:id", authMiddleware, editDepartment);
router.delete("/:id", authMiddleware, deleteDepartment);
export default router;
