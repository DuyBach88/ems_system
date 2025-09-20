import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEmployeeByUserId } from "../../services/employeeService";

const ViewDetail = () => {
  const { id } = useParams(); // Get the employee ID from the URL
  const [employee, setEmployee] = useState(null); // Default to null until data is fetched
  const [error, setError] = useState(""); // To hold any error messages

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await getEmployeeByUserId(id); // Fetch employee by ID
        if (response.data.success) {
          setEmployee(response.data.employee); // Store the employee data in state
        } else {
          setError("Employee not found.");
        }
      } catch (error) {
        setError(
          error.response
            ? error.response.data.message
            : "Error fetching employee details."
        );
      }
    };

    fetchEmployee();
  }, [id]); // Dependency on 'id' to re-fetch if the ID changes

  // Render the error message if there is one
  if (error) {
    return (
      <div className="max-w-lg mx-auto p-4 bg-red-100 text-red-600 rounded-lg shadow-lg">
        Error: {error}
      </div>
    );
  }

  // If employee data is still being fetched, show a loading message
  if (!employee) {
    return (
      <div className="text-center text-gray-500 text-lg p-6">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-800 text-center">
              Employee Details
            </h1>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-start gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-1">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={employee.userId && employee.userId.profileImage}
                    alt={employee.userId ? employee.userId.name : "Employee"}
                  />
                </div>
              </div>

              {/* Employee Information */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Name:
                    </span>
                    <span className="ml-2 text-lg font-semibold text-gray-800">
                      {employee.userId?.name || "N/A"}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Employee ID:
                    </span>
                    <span className="ml-2 text-lg font-semibold text-gray-800">
                      {employee.employeeId || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Email:
                    </span>
                    <span className="ml-2 text-lg font-semibold text-gray-800">
                      {employee.userId?.email || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Date of Birth:
                    </span>
                    <span className="ml-2 text-lg font-semibold text-gray-800">
                      {employee.dob
                        ? new Date(employee.dob).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Gender:
                    </span>
                    <span className="ml-2 text-lg font-semibold text-gray-800">
                      {employee.gender || "N/A"}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Department:
                    </span>
                    <span className="ml-2 text-lg font-semibold text-gray-800">
                      {employee.department
                        ? employee.department.dep_name
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetail;
