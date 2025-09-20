import axios from "axios";

const API_URL = "http://localhost:3000/api/employee";
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});
// Get all employees with pagination, search, and filters
export const getAllEmployees = async ({
  page = 1,
  limit = 10,
  search = "",
  department,
  gender,
  role,
}) => {
  return axios.get(API_URL, {
    params: { page, limit, search, department, gender, role },
    ...getAuthHeaders(),
  });
};

// Get employee by userId
export const getEmployeeByUserId = async (empId) => {
  return axios.get(`${API_URL}/${empId}`, getAuthHeaders());
};

// Update employee details (Admin, HR, ReportingManager only)
export const updateEmployee = async (id, employeeData) => {
  return axios.put(`${API_URL}/${id}`, employeeData, getAuthHeaders());
};

export const getEmployeesByDepartment = async (departmentId) => {
  try {
    const response = await axios.get(
      `${API_URL}/department/${departmentId}`,
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

export const getNextEmployeeId = async () => {
  return axios.get(`${API_URL}/next-id`, getAuthHeaders());
};

export const createEmployee = async (employeeData) => {
  return axios.post(`${API_URL}/add-employee`, employeeData, getAuthHeaders());
};
