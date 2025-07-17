import { Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import EmployeeSidebar from "../components/dashboard/EmployeerSidebar";
import EmployeeNavbar from "../components/dashboard/AppBarEmployee";
import { useContext } from "react";

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Main Content Area */}
      <div className="md:ml-64 min-h-screen">
        {/* Top Navigation */}
        <EmployeeNavbar />

        {/* Main Content */}
        <main className="pt-16 md:pt-20 pb-16 md:pb-8 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Content Container */}
            <main>
              <Outlet />
            </main>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
