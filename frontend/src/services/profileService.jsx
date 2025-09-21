import axios from "axios";
// Base URL for profile-related API endpoints
const API_URL = "http://localhost:3000/api/setting";
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});
// Change password
export const changePassword = (oldPassword, newPassword) =>
  axios.put(
    `${API_URL}/change-password`,
    { oldPassword, newPassword },
    getAuthHeaders()
  );

// Reset password
export const resetPassword = (token, newPassword) =>
  axios.post(`${API_URL}/reset-password`, { token, password: newPassword });
// Forgot password
export const forgotPassword = (email) => {
  return axios.post(`${API_URL}/forgot-password`, { email });
};

// Update employee details (Admin, HR, ReportingManager only)
export const updateEmployee = async (id, employeeData) => {
  return axios.put(`${API_URL}/${id}`, employeeData, getAuthHeaders());
};

// Get employees by department ID
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
// Get current user profile
export const getProfile = () => axios.get(`${API_URL}/me`, getAuthHeaders());
// Update current user profile
export const updateProfile = (formData) =>
  axios.put(`${API_URL}/update-profile`, formData, getAuthHeaders());
