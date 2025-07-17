// src/routes/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, token } = useContext(AuthContext);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    const redirectMap = {
      admin: "/admin-dashboard",
      employee: "/employee-dashboard",
    };
    const to = redirectMap[user.role] || "/login";
    return <Navigate to={to} replace />;
  }

  return children;
}
