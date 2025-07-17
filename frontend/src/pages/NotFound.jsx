// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Oops! Page not found.</p>
      <Link
        to="/login"
        className="text-white bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
