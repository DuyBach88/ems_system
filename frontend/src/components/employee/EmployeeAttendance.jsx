import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  checkIn,
  checkOut,
  getMyAttendance,
} from "../../services/attendanceService";

export default function EmployeeAttendance() {
  const { user } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [todayRecord, setTodayRecord] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getMyAttendance(page, limit);
      if (res.data.success) {
        setRecords(res.data.records);
        setTotalPages(res.data.totalPages);

        // Xác định today's record (tính trên records trả về)
        const today = new Date().toDateString();
        const todayRec = res.data.records.find(
          (rec) => new Date(rec.date).toDateString() === today
        );
        setTodayRecord(todayRec || null);
      }
    } catch (err) {
      console.error(err);
      alert("Không tải được dữ liệu chấm công.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]); // ⚡ reload khi đổi trang

  const handleCheckIn = async () => {
    try {
      const res = await checkIn();
      if (res.data.success) loadData();
      else alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Check-in thất bại");
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await checkOut();
      if (res.data.success) loadData();
      else alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Check-out thất bại");
    }
  };

  // ✅ Tính tiến độ làm việc hôm nay
  const getTodayProgress = () => {
    if (!todayRecord) return { hours: 0, percentage: 0 };
    const targetHours = 8;
    const currentHours = todayRecord.totalHours;
    const percentage = Math.min((currentHours / targetHours) * 100, 100);
    return { hours: currentHours, percentage };
  };

  const { hours: todayHours, percentage: todayPercentage } = getTodayProgress();

  // ✅ Kiểm tra nếu hôm nay đã check-in nhưng chưa check-out
  const canCheckOut =
    todayRecord && todayRecord.times.some((t) => t.in && !t.out);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Attendance Tracker
          </h1>

          {/* Check Out Button */}
          <button
            onClick={handleCheckOut}
            disabled={!canCheckOut}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
              canCheckOut
                ? "bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            CHECK OUT
          </button>
        </div>

        {/* Today's Work Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Today's Work Progress
            </h2>
            <button
              onClick={handleCheckIn}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Check In
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{todayHours.toFixed(1)} / 8 hours</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${todayPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Attendance History
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Chưa có dữ liệu chấm công</p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((rec, index) => (
                <div
                  key={rec._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {(page - 1) * limit + index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Date: {new Date(rec.date).toLocaleDateString("vi-VN")}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total Hours: {rec.totalHours.toFixed(2)} hrs
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="mb-2">
                      {rec.times.map((t, i) => (
                        <div key={i} className="text-sm">
                          {t.in && (
                            <span className="text-green-600">
                              In: {new Date(t.in).toLocaleTimeString("vi-VN")}
                            </span>
                          )}
                          {t.out && (
                            <span className="text-red-600 ml-2">
                              Out: {new Date(t.out).toLocaleTimeString("vi-VN")}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        rec.approvalStatus === "Approved"
                          ? "bg-green-100 text-green-800"
                          : rec.approvalStatus === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {rec.approvalStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center items-center space-x-2 mt-6">
            {/* Prev */}
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className={`px-3 py-1 rounded-lg border ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100 text-gray-700"
              }`}
            >
              Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`px-3 py-1 rounded-lg border ${
                  page === num
                    ? "bg-blue-500 text-white font-semibold"
                    : "bg-white hover:bg-gray-100 text-gray-700"
                }`}
              >
                {num}
              </button>
            ))}

            {/* Next */}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={`px-3 py-1 rounded-lg border ${
                page === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100 text-gray-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
