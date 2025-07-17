import axios from "axios";

const API_URL = "http://localhost:3000/api/employee";
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getAllEmployees = async () => {
  return axios.get(API_URL, getAuthHeaders());
};

// Get employee by userId
export const getEmployeeByUserId = async (empId) => {
  return axios.get(`${API_URL}/${empId}`, getAuthHeaders());
};

// Update employee details (Admin, HR, ReportingManager only)
export const updateEmployee = async (id, employeeData) => {
  return axios.put(`${API_URL}/${id}`, employeeData, getAuthHeaders());
};

// Delete an employee (Only Admin)
export const getEmployees = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/department/${id}`,
      getAuthHeaders()
    );

    if (response.data.success) {
      return response.data.employees;
    } else {
      console.error("Failed to fetch employees:", response.data.message);
      return [];
    }
  } catch (err) {
    console.error("Error fetching employees:", err);
    return [];
  }
};
