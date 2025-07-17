import React, { useState } from "react";
import { EnvelopeIcon, KeyIcon, UserIcon } from "@heroicons/react/24/outline";
import { logo } from "../assets";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("employee");
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        { email, password, name, role },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!response.data.success) {
        setOpenDialog(true);
        setError("");
      } else {
        setError(response.data.message);
        setTimeout(() => {
          setOpenDialog(false);
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200 relative overflow-hidden">
      <div className="absolute top-6 left-6 z-20">
        <img
          src={logo}
          alt="Logo"
          className="w-48 h-auto transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="relative z-10 w-full max-w-lg p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-green-300/50">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-full shadow-md transform transition-transform hover:rotate-12">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-center text-green-700 tracking-tight">
          Join Wruk!
        </h2>
        <p className="text-sm text-center text-gray-600 mt-2 mb-6 font-medium">
          Create your account with flair
        </p>

        {error && (
          <p className="text-red-500 mb-4 text-sm text-center font-medium bg-red-100/50 py-2 rounded-md">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-left text-green-700 font-semibold mb-2">
              Name
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                <UserIcon className="w-5 h-5 text-green-400 group-hover:text-green-600 transition-colors duration-300" />
              </span>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:shadow-lg group-hover:border-green-500"
                placeholder="Your name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
              />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-green-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          </div>

          <div>
            <label className="block text-left text-green-700 font-semibold mb-2">
              Email
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                <EnvelopeIcon className="w-5 h-5 text-green-400 group-hover:text-green-600 transition-colors duration-300" />
              </span>
              <input
                type="email"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:shadow-lg group-hover:border-green-500"
                placeholder="Your email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
              />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-green-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          </div>

          <div>
            <label className="block text-left text-green-700 font-semibold mb-2">
              Password
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                <KeyIcon className="w-5 h-5 text-green-400 group-hover:text-green-600 transition-colors duration-300" />
              </span>
              <input
                type="password"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:shadow-lg group-hover:border-green-500"
                placeholder="Your password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
              />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-green-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <button
            type="button"
            className="text-green-600 hover:text-green-800 font-semibold transition-colors duration-300"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>

      {openDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 text-center transform transition-all duration-500 scale-100 animate-pulse">
            <svg
              className="w-14 h-14 text-green-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h3 className="text-xl font-bold text-green-700 mb-3">
              Registration Successful!
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Redirecting to login...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full animate-[load_1s_ease-in-out]"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
