import { useNavigate } from "react-router-dom";

export const DepartmentButton = ({ DepId, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div>
      <button
        className="text-blue-600 hover:underline mr-4"
        onClick={() => navigate(`/admin-dashboard/departments/${DepId}`)}
      >
        Edit
      </button>
      <button
        className="text-red-600 hover:underline"
        onClick={() => onDelete(DepId)}
      >
        Delete
      </button>
    </div>
  );
};


