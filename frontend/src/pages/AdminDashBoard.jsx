import { AuthContext } from "../context/AuthContext";
import AdminSidebar from "../components/dashboard/AdminSidebar";
import TopBar from "../components/dashboard/AppBar";
import AdminSummary from "../components/dashboard/AdminSummary";
import { Outlet } from "react-router-dom";

const AdminDashBoard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 relative">
      {/* Sidebar */}
      <AdminSidebar />

      {/* TopBar */}
      <TopBar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-20 pb-20 md:pb-6 px-4 md:px-6 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashBoard;
