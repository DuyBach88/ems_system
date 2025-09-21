import axios from "axios";

// Initialize axios instance for Attendance API with token
const token = localStorage.getItem("token");
const api = axios.create({
  baseURL: "http://localhost:3000/api/attendance",
  headers: { Authorization: `Bearer ${token}` },
});

// Employee APIs
/** Record Check-In */
export const checkIn = () => api.post("/checkin");

/** Record Check-Out */
export const checkOut = () => api.post("/checkout");

/** Get attendance history of current user */
export const getMyAttendance = (page = 1, limit = 10) =>
  api.get("/me", { params: { page, limit } });

// Admin APIs
/** Get all attendance records */
export const getAllAttendance = (page = 1, limit = 10) =>
  api.get("/", { params: { page, limit } });

/** Approve an attendance record */
export const approveAttendance = (id, status) =>
  api.patch(`/${id}/approve`, { status });

/** Approve multiple attendance records at once */
export const approveMultiple = (ids, status) =>
  api.patch("/approve", { ids, status });
export const manualCheckout = (id) => api.patch(`/${id}/manual-checkout`);
/** Delete an attendance record */
export const deleteAttendance = (id) => api.delete(`/${id}`);
export const getDailyReport = (date, page = 1, limit = 10) =>
  api.get("/report/daily", { params: { date, page, limit } });
