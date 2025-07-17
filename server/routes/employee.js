import express from "express";
import multer from "multer";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  addEmployee,
  upload,
  handleMulterErrors,
  getEmployee,
  getEmployees,
  updateEmployee,
  fetchEmployeesByDepId,
} from "../controllers/employeeController.js";
import { getSalary } from "../controllers/salaryController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });
router.get("/", authMiddleware, getEmployees);
router.get("/:id", authMiddleware, getEmployee);
router.put("/:id", authMiddleware, uploads.none(), updateEmployee);
router.post(
  "/add-employee",
  authMiddleware,
  upload.single("photo"),
  handleMulterErrors,
  addEmployee
);

router.get("/department/:id", authMiddleware, fetchEmployeesByDepId);
export default router;
