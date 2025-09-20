import axios from "axios";
import { useNavigate } from "react-router-dom";

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
