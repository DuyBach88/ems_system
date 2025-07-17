import React, { useState, useContext } from "react";
import {
  LockClosedIcon,
  EnvelopeIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { ems } from "../assets";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password }
      );
      const token = response.data.token;
      const userData = response.data.user;

      login(userData, token);
      setOpenDialog(true);

      setTimeout(() => {
        setOpenDialog(false);
        if (userData.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }, 2000);
    } catch (error) {
      console.error("Login error:", error.response?.data);
      setError(error.response?.data?.message || "Login failed");
    }
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-100 to-green-50 flex items-center justify-center p-4">
      {/* Logo */}
      <div className="absolute top-6 left-6 z-20">
        <img
          src={ems}
          alt="Logo"
          className="w-48 h-auto transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Form */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-green-500 p-3 rounded-full shadow-md">
            <LockClosedIcon className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome to EMS Login
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Please login to continue
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
              </span>
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <KeyIcon className="w-5 h-5 text-gray-400" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-green-600 hover:underline font-medium"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <span className="text-gray-500 text-sm">Don't have an account? </span>
          <button
            type="button"
            className="text-green-600 hover:underline font-medium text-sm"
            onClick={handleGoToRegister}
          >
            Register
          </button>
        </div>
      </div>

      {/* Loading Modal */}
      {openDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-10 shadow-2xl max-w-sm w-full mx-4 text-center">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-green-200 rounded-lg animate-spin-slow"></div>
              <div className="absolute inset-1 border-4 border-green-300 rounded-lg animate-spin"></div>
              <div className="absolute inset-2 border-4 border-green-400 rounded-lg animate-spin-fast"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-500 animate-bounce"
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
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Signing in...
            </h3>
            <p className="text-gray-500 text-sm mb-4">Please wait a moment</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full animate-pulse"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
