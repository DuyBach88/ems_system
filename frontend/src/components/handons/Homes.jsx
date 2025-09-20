import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Homes = () => {
  const [users, setUsers] = useState([]);

  // Fetch danh sách ảnh từ BE
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/handon/files");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Delete user theo id
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/handon/files/${id}`);
      setUsers(users.filter((u) => u._id !== id)); // cập nhật lại state
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full bg-gray-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          <div className="flex space-x-6 font-medium">
            <a href="#" className="hover:text-blue-400">
              Navbar
            </a>
            <a href="#" className="hover:text-blue-400">
              Register
            </a>
          </div>

          <Link
            to="/upload-forms"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow text-white"
          >
            Add User
          </Link>
        </div>
      </header>

      {/* Title */}
      <h1 className="text-3xl font-bold text-center mt-10 mb-8">
        MERN Image Upload Projects
      </h1>

      {/* User Cards */}
      <main className="max-w-7xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition"
            >
              <img
                src={user.image_url}
                alt={user.title}
                className="w-24 h-24 rounded-full border-4 border-blue-100 mb-4 object-cover"
              />
              <h2 className="text-lg font-semibold">UserName: {user.title}</h2>
              <p className="text-gray-500 text-sm mb-4">
                Date Added: {new Date(user.date).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleDelete(user._id)}
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Homes;
