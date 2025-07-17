import axios from "axios";

const API_URL = "http://localhost:3000/api/salary";
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getEmpSalary = async (empId) => {
  return axios.get(`${API_URL}/${empId}`, getAuthHeaders());
};
