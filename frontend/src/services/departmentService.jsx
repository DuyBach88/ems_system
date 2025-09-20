import axios from "axios";

const API_URL = "http://localhost:3000/api/department";

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// Lấy danh sách departments
export const getAllDepartments = async ({ page = 1, limit = 10, search = "" }) => {
  return axios.get(API_URL, {
    params: { page, limit, search },
    ...getAuthHeaders(),
  });
};

// Lấy chi tiết department
export const getDepartmentById = async (id) => {
  return axios.get(`${API_URL}/${id}`, getAuthHeaders());
};

//  Tạo mới department
export const createDepartment = async (departmentData) => {
  return axios.post(`${API_URL}/add`, departmentData, getAuthHeaders());
};

//  Cập nhật department
export const updateDepartment = async (id, departmentData) => {
  return axios.put(`${API_URL}/${id}`, departmentData, getAuthHeaders());
};

//  Xóa department
export const deleteDepartment = async (id) => {
  return axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};
