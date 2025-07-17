import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import {
  columns as baseColumns,
  customTableStyles,
  DepartmentButton,
} from "../../utils/DepartmentHelper";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDepartments = async () => {
    try {
      setDepLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:3000/api/department", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        const data = response.data.departments.map((dep, index) => ({
          _id: dep._id,
          sno: index + 1,
          dep_name: dep.dep_name,
          description: dep.description,
        }));
        setDepartments(data);
      } else {
        setError("Failed to fetch departments");
      }
    } catch (error) {
      setError("Error fetching departments: " + error.message);
    } finally {
      setDepLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3000/api/department/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchDepartments(); // refresh
    } catch (err) {
      alert("Failed to delete department.");
    }
  };

  const columns = [
    ...baseColumns.slice(0, 2), // S No, Department Name
    {
      name: "Action",
      cell: (row) => (
        <DepartmentButton DepId={row._id} onDelete={handleDelete} />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const filteredDepartments = departments.filter((dep) =>
    dep.dep_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Manage Departments
        </h1>

        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by department name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Link
            to="/admin-dashboard/add-department"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            + Add Department
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={filteredDepartments}
          progressPending={depLoading}
          pagination
          highlightOnHover
          customStyles={customTableStyles}
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

export default DepartmentList;
