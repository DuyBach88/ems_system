import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js"; // import custom upload
import {
  addEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
  fetchEmployeesByDepId,
  getNextEmployeeId,
} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/", authMiddleware, getEmployees);
router.get("/:id", authMiddleware, getEmployee);

router.post(
  "/add-employee",
  authMiddleware,
  upload.single("photo"), // key: photo
  addEmployee
);

router.put(
  "/:id",
  authMiddleware,
  upload.single("photo"), // key: photo
  updateEmployee
);

router.get("/department/:id", authMiddleware, fetchEmployeesByDepId);
router.get("/next-id", authMiddleware, getNextEmployeeId);
export default router;
