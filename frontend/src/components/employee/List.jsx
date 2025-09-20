import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { getAllEmployees } from "../../services/employeeService";
import { columns, EmployeeButton } from "../../utils/EmployeeeHelper";
import { customTableStyles } from "../../utils/DepartmentHelper";
const List = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setEmpLoading(true);
        const response = await getAllEmployees();
        if (response.data.success) {
          let sno = 1;
          // Trong mapping data:
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            name: emp.userId.name,
            dob: emp.dob?.slice(0, 10),
            profileImage: emp.userId.profileImage ? (
              <img
                className=" with-40 rounded-full"
                src={emp.userId.profileImage}
                alt={emp.userId.name}
              />
            ) : (
              <img
                src="/default-avatar.png"
                alt="Default avatar"
                className=" with-40 rounded-full"
              />
            ),
            department: emp.department?.dep_name || "–",
            action: <EmployeeButton EmpId={emp._id} />,
          }));
          setEmployees(data);
        }
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setEmpLoading(false);
      }
    };

    fetchEmployees();
  }, []);
  const filterEmployees = employees.filter((emp) => {
    return (
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  if (error) return <div>Error loading employees.</div>;
  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Manage Employees
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by department name..."
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link
            to="/admin-dashboard/add-employee"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            + Add New Employee
          </Link>
        </div>
        <DataTable
          columns={columns}
          data={filterEmployees}
          customStyles={customTableStyles}
          progressPending={empLoading}
          pagination
          highlightOnHover
          noDataComponent={
            <div className="text-center py-4 text-gray-500">
              No departments found.
            </div>
          }
        />
      </div>
    </div>
  );
};

export default List;
