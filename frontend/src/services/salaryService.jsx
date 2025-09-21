import axios from "axios";

const API_URL = "http://localhost:3000/api/salary";
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// Add page and limit parameters
export const getEmpSalary = async (empId, page = 1, limit = 10) => {
  return axios.get(
    `${API_URL}/${empId}?page=${page}&limit=${limit}`,
    getAuthHeaders()
  );
};
// Add new salary record
export const createSalary = async (salaryData) => {
  return axios.post(`${API_URL}/add`, salaryData, getAuthHeaders());
};
