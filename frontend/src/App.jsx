import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthContext } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import AdminDashBoard from "./pages/AdminDashBoard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import Register from "./pages/Register.jsx";
import AdminSummary from "./components/dashboard/AdminSummary.jsx";
import DepartmentList from "./components/department/DepartmentList.jsx";
import AddDepartment from "./components/department/AddDepartment.jsx";
import EditDepartment from "./components/department/EditDepartment.jsx";
import NotFound from "./pages/NotFound.jsx";
import List from "./components/employee/List.jsx";
import AddEmployee from "./components/employee/Add.jsx";
import ViewDetail from "./components/employee/ViewDetail.jsx";
import Edit from "./components/employee/Edit.jsx";
import AddSalary from "./components/salary/AddSalary.jsx";
import ViewSalary from "./components/salary/ViewSalary.jsx";
import EmpSummaryCard from "./components/dashboard/EmpSummaryCard.jsx";
import EmployeeProfile from "./components/employee/EmployeeProfile.jsx";
import MySalary from "./components/employee/MySalary.jsx";
import AddLeave from "./components/leave/AddLeave.jsx";
import LeaveList from "./components/leave/MyLeave.jsx";
import EmployeeLeaveHistory from "./components/leave/HistoryLeave.jsx";
import EmployeeAttendance from "./components/dashboard/EmployeeAttendance.jsx";
import AdminAttendance from "./components/attendance/AdminAttendance.jsx";
import AttendanceReport from "./components/attendance/AttendanceReport.jsx";
import Setting from "./components/employee/Setting.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Homes from "./components/handons/Homes.jsx";
import UploadForm from "./components/handons/UploadForm.jsx";
import Profile from "./components/employee/EditProfile.jsx";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user, token } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" />;

  if (!allowedRoles.includes(user?.role)) {
    // Redirect theo role
    switch (user?.role) {
      case "admin":
        return <Navigate to="/admin-dashboard" />;
      case "employee":
        return <Navigate to="/employee-dashboard" />;
      default:
        return <Navigate to="/login" />;
    }
  }

  return element;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Homes />} />
        <Route path="/upload-forms" element={<UploadForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Admin route */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute
              element={<AdminDashBoard />}
              allowedRoles={["admin"]}
            />
          }
        >
          <Route index element={<AdminSummary />} />
          <Route
            path="/admin-dashboard/attendance"
            element={<AdminAttendance />}
          />
          <Route
            path="/admin-dashboard/departments"
            element={<DepartmentList />}
          />
          <Route
            path="/admin-dashboard/add-department"
            element={<AddDepartment />}
          />
          <Route
            path="/admin-dashboard/departments/:id"
            element={<EditDepartment />}
          />
          <Route path="/admin-dashboard/employees" element={<List />} />
          <Route
            path="/admin-dashboard/add-employee"
            element={<AddEmployee />}
          />
          <Route
            path="/admin-dashboard/employees/:id"
            element={<ViewDetail />}
          />
          <Route
            path="/admin-dashboard/employees/:id/edit"
            element={<Edit />}
          />
          <Route
            path="/admin-dashboard/employees/salary/:id"
            element={<ViewSalary />}
          />
          <Route path="/admin-dashboard/salary/add" element={<AddSalary />} />
          <Route
            path="/admin-dashboard/employees/leaves"
            element={<LeaveList />}
          />
          <Route
            path="/admin-dashboard/employees/:empId/leaves"
            element={<EmployeeLeaveHistory />}
          />
          <Route
            path="/admin-dashboard/attendance-report"
            element={<AttendanceReport />}
          />
        </Route>

        {/* Employee route */}
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute
              element={<EmployeeDashboard />}
              allowedRoles={["admin", "employee"]}
            />
          }
        >
          <Route index element={<EmpSummaryCard />} />
          <Route
            path="/employee-dashboard/profile"
            element={<Profile />}
          />

          <Route
            path="/employee-dashboard/profile/:id"
            element={<EmployeeProfile />}
          />
          <Route path="/employee-dashboard/salary/:id" element={<MySalary />} />
          <Route path="/employee-dashboard/leaves" element={<LeaveList />} />
          <Route path="/employee-dashboard/add-leave" element={<AddLeave />} />
          <Route
            path="/employee-dashboard/attendance"
            element={<EmployeeAttendance />}
          />
          <Route
            path="/employee-dashboard/change-password"
            element={<Setting />}
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}

export default App;
