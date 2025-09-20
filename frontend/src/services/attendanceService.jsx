import axios from "axios";

// Khởi tạo axios instance cho Attendance API với token
const token = localStorage.getItem("token");
const api = axios.create({
  baseURL: "http://localhost:3000/api/attendance",
  headers: { Authorization: `Bearer ${token}` },
});

// Employee APIs
/** Ghi nhận Check-In */
export const checkIn = () => api.post("/checkin");

/** Ghi nhận Check-Out */
export const checkOut = () => api.post("/checkout");

/** Lấy lịch sử chấm công của chính user  */
export const getMyAttendance = (page = 1, limit = 10) =>
  api.get("/me", { params: { page, limit } });


// Admin APIs
/** Lấy tất cả bản ghi chấm công */
export const getAllAttendance = (page = 1, limit = 10) =>
  api.get("/", { params: { page, limit } });

/** Duyệt một bản ghi chấm công */
export const approveAttendance = (id, status) =>
  api.patch(`/${id}/approve`, { status });

/** Duyệt nhiều bản ghi chấm công cùng lúc */
export const approveMultiple = (ids, status) =>
  api.patch("/approve", { ids, status });
export const manualCheckout = (id) => api.patch(`/${id}/manual-checkout`);
/** Xóa một bản ghi chấm công */
export const deleteAttendance = (id) => api.delete(`/${id}`);
export const getDailyReport = (date, page = 1, limit = 10) =>
  api.get("/report/daily", { params: { date, page, limit } });
