import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  addLeave,
  changeLeaveStatus,
  getAllLeaves,
  getLeavesByEmployee,
  getMyLeaves,
} from "../controllers/leaveController.js";
import authRole from "../middlewares/authRole.js";

const router = express.Router();
router.get("/my", authMiddleware, getMyLeaves);
router.post("/add", authMiddleware, addLeave);
router.get("/all", authMiddleware, authRole("admin"), getAllLeaves);
// routes/leave.routes.js  (thêm)
router.patch(
  "/:id/approved",
  authMiddleware,
  authRole("admin"),
  changeLeaveStatus("approved")
);
router.patch(
  "/:id/rejected",
  authMiddleware,
  authRole("admin"),
  changeLeaveStatus("rejected")
);
// routes/leave.routes.js  (thêm cuối)
router.get(
  "/employee/:empId",
  authMiddleware,
  authRole("admin"),
  getLeavesByEmployee
);

export default router;
