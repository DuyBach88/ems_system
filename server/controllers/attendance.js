// src/controllers/attendance.js
import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

// ================= Employee controllers =================

/** POST /api/attendance/checkin */
const checkIn = async (req, res) => {
  try {
    // Tìm nhân viên dựa trên userId từ token
    const emp = await Employee.findOne({ userId: req.user.id });
    if (!emp) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    const employeeId = emp._id;
    const todayKey = new Date().toISOString().split("T")[0];

    // Tìm hoặc tạo mới bản ghi cho ngày hôm nay
    let attendance = await Attendance.findOne({ employeeId, date: todayKey });
    if (!attendance) {
      attendance = new Attendance({ employeeId, date: todayKey });
    }

    attendance.times.push({ in: new Date(), out: null });
    attendance.inOutStatus = "in";
    attendance.checkInCount += 1;
    attendance.status = "present";

    await attendance.save();
    return res.json({ success: true, attendance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** POST /api/attendance/checkout */
const checkOut = async (req, res) => {
  try {
    const emp = await Employee.findOne({ userId: req.user.id });
    if (!emp) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    const employeeId = emp._id;
    const todayKey = new Date().toISOString().split("T")[0];

    const attendance = await Attendance.findOne({ employeeId, date: todayKey });
    if (!attendance || attendance.times.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No check-in found" });
    }

    const lastSession = attendance.times[attendance.times.length - 1];
    lastSession.out = new Date();
    attendance.inOutStatus = "out";
    attendance.checkOutCount += 1;

    const diffMs = lastSession.out - lastSession.in;
    attendance.totalHours += diffMs / (1000 * 60 * 60);

    await attendance.save();
    return res.json({ success: true, attendance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** GET /api/attendance/me */
const getMyAttendance = async (req, res) => {
  try {
    const emp = await Employee.findOne({ userId: req.user.id });
    if (!emp) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }
    const employeeId = emp._id;

    const records = await Attendance.find({ employeeId }).sort({ date: -1 });
    return res.json({ success: true, records });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ================= Admin controllers =================

/** PATCH /api/attendance/:id/approve */
const approveAttendance = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const attendance = await Attendance.findById(id);
  if (!attendance)
    return res.status(404).json({ success: false, message: "Not found" });

  attendance.approvalStatus = status;
  attendance.approveBy = req.user.id;
  await attendance.save();

  res.json({ success: true, attendance });
};

/** PATCH /api/attendance/approve */
const approveMultiple = async (req, res) => {
  try {
    const { ids, status } = req.body;
    const result = await Attendance.updateMany(
      { _id: { $in: ids } },
      { approvalStatus: status, approveBy: req.user.id }
    );
    return res.json({ success: true, modifiedCount: result.nModified });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** GET /api/attendance */

const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "emp",
        },
      },
      { $unwind: { path: "$emp", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "users",
          localField: "emp.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "departments",
          localField: "emp.department",
          foreignField: "_id",
          as: "dept",
        },
      },
      { $unwind: { path: "$dept", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 1,
          empCode: "$emp.employeeId",
          empName: "$user.name",
          deptName: "$dept.name",
          date: 1,
          times: 1,
          approvalStatus: 1,
        },
      },
      { $sort: { date: -1 } },
    ]);

    res.json({ success: true, records });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/** DELETE /api/attendance/:id */
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findByIdAndDelete(id);
    if (!attendance) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
const manualCheckOut = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    // Lấy phiên cuối cùng
    const session = attendance.times[attendance.times.length - 1];
    if (!session || session.out) {
      return res
        .status(400)
        .json({ success: false, message: "No open session to check out" });
    }

    // Ghi lại giờ out – dùng giờ hiện tại
    session.out = new Date();
    attendance.inOutStatus = "out";
    attendance.checkOutCount += 1;

    // Cộng giờ làm
    const diffMs = session.out - session.in;
    attendance.totalHours += diffMs / (1000 * 60 * 60);

    await attendance.save();
    return res.json({ success: true, attendance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const dailyAttendanceReport = async (req, res) => {
  try {
    const { date, page = 1, limit = 10 } = req.query;
    if (!date)
      return res.status(400).json({ success: false, message: "Missing date" });

    // Build day range
    const d = new Date(date);
    const start = new Date(d.setHours(0, 0, 0, 0));
    const end = new Date(d.setHours(23, 59, 59, 999));

    // 1) Total count for paging
    const total = await Attendance.countDocuments({
      date: { $gte: start, $lte: end },
    });
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // 2) Attendance‐status counts (e.g. present/absent/…)
    const statusCounts = await Attendance.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // 3) Approval‐status counts (Approved/Pending/Rejected)
    const approvalCounts = await Attendance.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      { $group: { _id: "$approvalStatus", count: { $sum: 1 } } },
    ]);

    // 4) Paged records with lookups
    const records = await Attendance.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },

      // join Employee → emp
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "emp",
        },
      },
      { $unwind: "$emp" },

      // join User → user
      {
        $lookup: {
          from: "users",
          localField: "emp.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      // join Department → dept
      {
        $lookup: {
          from: "departments",
          localField: "emp.department",
          foreignField: "_id",
          as: "dept",
        },
      },
      { $unwind: "$dept" },

      // only needed fields
      {
        $project: {
          empCode: "$emp.employeeId",
          empName: "$user.name",
          deptName: "$dept.dep_name",
          status: "$status", // attendance status
          approvalStatus: "$approvalStatus", // <-- new
        },
      },
      { $sort: { empCode: 1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    return res.json({
      success: true,
      date: start.toISOString().split("T")[0],
      page: parseInt(page),
      totalPages,
      statusCounts, // [ { _id:"present", count:10 }, … ]
      approvalCounts, // [ { _id:"Approved", count:8 }, … ]
      records,
    });
  } catch (err) {
    console.error("dailyAttendanceReport:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export default {
  checkIn,
  checkOut,
  getMyAttendance,
  approveAttendance,
  approveMultiple,
  getAllAttendance,
  manualCheckOut,
  deleteAttendance,
  dailyAttendanceReport,
};
