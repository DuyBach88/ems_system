import { useNavigate } from "react-router-dom";

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
  },
  {
    name: "Department Name",
    selector: (row) => row.dep_name,
  },
  {
    name: "Action",
    selector: (row) => row.action,
  },
];

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

export const customTableStyles = {
  rows: {
    style: {
      minHeight: "56px",
      borderBottom: "1px solid #e5e7eb", // Tailwind gray-200
    },
  },
  headCells: {
    style: {
      backgroundColor: "#f3f4f6", // Tailwind gray-100
      fontWeight: "bold",
      fontSize: "14px",
      color: "#374151", // Tailwind gray-700
    },
  },
  cells: {
    style: {
      fontSize: "14px",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  pagination: {
    style: {
      borderTop: "1px solid #e5e7eb",
      padding: "10px 16px",
    },
  },
};
