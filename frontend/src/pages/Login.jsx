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
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password }
      );
      const token = response.data.token;
      const userData = response.data.user;

      login(userData, token);

      toast.success("Login successful ", { autoClose: 1500 });

      setTimeout(() => {
        if (userData.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }, 2000);
    } catch (error) {
      console.error("Login error:", error.response?.data);
      setError(error.response?.data?.message || "Login failed");
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
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

          {/* ✅ Nút login với spinner */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition 
              ${loading ? "bg-gray-400 cursor-not-allowed text-white" : "bg-green-500 text-white hover:bg-green-600"}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 
                    5.373 0 12h4zm2 5.291A7.962 7.962 
                    0 014 12H0c0 3.042 1.135 5.824 
                    3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
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
    </div>
  );
};

export default Login;
