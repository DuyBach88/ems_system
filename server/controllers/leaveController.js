import Employee from "../models/Employee.js";
import LeaveRequest from "../models/Leave.js";
import transporter from "../config/email.js";

/* ------------------------------
   API: Nhân viên xin nghỉ phép
------------------------------- */
const addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;
    if (!userId || !leaveType || !startDate || !endDate || !reason) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    if (isNaN(sDate) || isNaN(eDate))
      return res
        .status(400)
        .json({ success: false, message: "Invalid date format." });

    if (sDate > eDate)
      return res
        .status(400)
        .json({
          success: false,
          message: "Start date cannot be after end date.",
        });

    const employee = await Employee.findOne({ userId });
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    // Kiểm tra trùng lịch nghỉ (pending hoặc approved)
    const overlap = await LeaveRequest.findOne({
      employeeId: employee._id,
      status: { $in: ["pending", "approved"] },
      $or: [{ startDate: { $lte: eDate }, endDate: { $gte: sDate } }],
    });
    if (overlap)
      return res.status(409).json({
        success: false,
        message: "Requested dates overlap with an existing leave.",
      });

    const leave = await LeaveRequest.create({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    return res.status(200).json({ success: true, leave });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
/* ------------------------------
   API: Xem đơn nghỉ của chính mình
------------------------------- */
const getMyLeaves = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    const query = { employeeId: employee._id };
    if (search) query.reason = { $regex: search, $options: "i" };

    const skip = (page - 1) * limit;
    const [docs, totalDocs] = await Promise.all([
      LeaveRequest.find(query)
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit)),
      LeaveRequest.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        docs,
        totalDocs,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalDocs / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ------------------------------
   API: Admin xem tất cả đơn nghỉ
------------------------------- */
const getAllLeaves = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search = "" } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) query.reason = { $regex: search, $options: "i" };

    const skip = (page - 1) * limit;
    const [docs, totalDocs] = await Promise.all([
      LeaveRequest.find(query)
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit))
        .populate({
          path: "employeeId",
          populate: { path: "userId", select: "name email" },
        }),
      LeaveRequest.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        docs,
        totalDocs,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalDocs / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ------------------------------
   API: Admin xem đơn nghỉ của 1 nhân viên
------------------------------- */
const getLeavesByEmployee = async (req, res) => {
  try {
    const { empId } = req.params;
    const { page = 1, limit = 10, status, search = "" } = req.query;

    const employee = await Employee.findById(empId).populate(
      "userId",
      "name email profileImage"
    );
    if (!employee)
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });

    const query = { employeeId: empId };
    if (status) query.status = status;
    if (search) query.reason = { $regex: search, $options: "i" };

    const skip = (page - 1) * limit;
    const [docs, totalDocs] = await Promise.all([
      LeaveRequest.find(query)
        .sort("-createdAt")
        .skip(skip)
        .limit(Number(limit)),
      LeaveRequest.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        employee,
        leaves: {
          docs,
          totalDocs,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(totalDocs / limit),
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const changeLeaveStatus = (newStatus) => async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id).populate({
      path: "employeeId",
      populate: {
        path: "userId",
        select: "email name",
      },
    });

    if (!leave)
      return res.status(404).json({ success: false, message: "Not found" });

    if (leave.status !== "pending")
      return res.status(400).json({
        success: false,
        message: "Already processed",
      });

    leave.status = newStatus;
    await leave.save();

    const to = leave.employeeId.userId.email;
    const isApproved = newStatus === "approved";
    const subject = isApproved
      ? "✅ Your leave request has been APPROVED"
      : "❌ Your leave request has been REJECTED";

    // Beautiful HTML email template
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Leave Request ${newStatus.toUpperCase()}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, ${
              isApproved ? "#4CAF50, #45a049" : "#f44336, #d32f2f"
            });
            color: white;
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
          }
          .status-badge {
            display: inline-block;
            padding: 8px 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 20px;
          }
          .leave-details {
            background: #f8f9fa;
            border-left: 4px solid ${isApproved ? "#4CAF50" : "#f44336"};
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .leave-details h3 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 16px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: 600;
            color: #6c757d;
          }
          .detail-value {
            color: #2c3e50;
            font-weight: 500;
          }
          .status-message {
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            text-align: center;
            font-size: 16px;
            font-weight: 500;
          }
          .approved {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          }
          .rejected {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
          }
          .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
          .footer p {
            margin-bottom: 10px;
            color: #6c757d;
          }
          .company-name {
            font-weight: bold;
            color: #2c3e50;
          }
          .divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, #ddd, transparent);
            margin: 20px 0;
          }
          @media (max-width: 600px) {
            .container {
              margin: 10px;
              border-radius: 8px;
            }
            .content {
              padding: 20px;
            }
            .header {
              padding: 20px;
            }
            .header h1 {
              font-size: 24px;
            }
            .detail-row {
              flex-direction: column;
              gap: 5px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${isApproved ? "✅" : "❌"} Leave Request Update</h1>
            <div class="status-badge">${newStatus.toUpperCase()}</div>
          </div>
          
          <div class="content">
            <div class="greeting">
              Hi ${leave.employeeId.userId.name},
            </div>
            
            <p>We hope this message finds you well. We're writing to inform you about the status of your recent leave request.</p>
            
            <div class="leave-details">
              <h3>📋 Leave Request Details</h3>
              <div class="detail-row">
                <span class="detail-label">Start Date:</span>
                <span class="detail-value">${new Date(
                  leave.startDate
                ).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">End Date:</span>
                <span class="detail-value">${new Date(
                  leave.endDate
                ).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${
                  Math.ceil(
                    (new Date(leave.endDate) - new Date(leave.startDate)) /
                      (1000 * 60 * 60 * 24)
                  ) + 1
                } days</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value">${newStatus.toUpperCase()}</span>
              </div>
            </div>
            
            <div class="status-message ${isApproved ? "approved" : "rejected"}">
              ${
                isApproved
                  ? "🎉 Great news! Your leave request has been approved. Enjoy your time off!"
                  : "😔 Unfortunately, your leave request has been rejected. Please contact HR for more details."
              }
            </div>
            
            <div class="divider"></div>
            
            <p>If you have any questions or concerns about this decision, please don't hesitate to contact the HR department.</p>
            
            ${
              isApproved
                ? "<p><strong>Please note:</strong> Make sure to complete any pending work and coordinate with your team before your leave begins.</p>"
                : "<p><strong>Alternative:</strong> You may submit a new leave request for different dates or contact HR to discuss alternative arrangements.</p>"
            }
          </div>
          
          <div class="footer">
            <p>Best regards,</p>
            <p class="company-name">Admin Department</p>
            <p style="font-size: 12px; color: #8c8c8c; margin-top: 15px;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      to,
      from: process.env.MAIL_USER,
      subject,
      html,
    });

    res.json({ success: true, data: leave });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export {
  addLeave,
  getMyLeaves,
  getAllLeaves,
  changeLeaveStatus,
  getLeavesByEmployee,
};
