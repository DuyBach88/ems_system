import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns = [
  {
    name: "S.No",
    selector: (row) => row.sno,
    sortable: true,
    width: "80px",
    className: "text-center font-bold",
  },
  {
    name: "Image",
    selector: (row) => row.profileImage,
    width: "88px",
    className: "text-center",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    className: "text-primary text-sm font-semibold",
  },
  {
    name: "DOB",
    selector: (row) => row.dob,
    sortable: true,
    className: "text-muted text-center",
  },
  {
    name: "Department",
    selector: (row) => row.department,
    sortable: true,
    className: "text-info font-semibold",
  },
  {
    name: "Actions",
    selector: (row) => row.action,
    className: "text-center text-danger",
  },
];

export const fetchDepartments = async () => {
  let departments;
  try {
    const response = await axios.get("http://localhost:3000/api/department", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.data.success) {
      departments = response.data.departments;
      return departments;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.message);
    }
  }
};
export const EmployeeButton = ({ EmpId }) => {
  const nav = useNavigate();
  return (
    <div className="flex space-x-2">
      <button
        className="text-blue-600 hover:underline"
        onClick={() => nav(`/admin-dashboard/employees/${EmpId}`)}
      >
        View
      </button>
      <button
        className="text-green-600 hover:underline"
        onClick={() => nav(`/admin-dashboard/employees/${EmpId}/edit`)}
      >
        Edit
      </button>
      <button
        className="text-yellow-600 hover:underline"
        onClick={() => nav(`/admin-dashboard/employees/salary/${EmpId}`)}
      >
        Salary
      </button>
      <button
        className="text-red-600 hover:underline"
        onClick={() => nav(`/admin-dashboard/employees/${EmpId}/leaves`)}
      >
        Leave
      </button>
    </div>
  );
};
