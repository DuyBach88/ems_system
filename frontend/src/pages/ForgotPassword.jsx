import React, { useState } from "react";
import { forgotPassword } from "../services/profileService";
import { useNavigate } from "react-router-dom";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setMsg(res.data.message);
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-green-200 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-105 duration-300">
        {/* Decorative Element */}
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-300 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-green-400 rounded-full opacity-50 animate-pulse delay-150"></div>

        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-green-400 to-green-600 p-3 rounded-full shadow-lg">
            <EnvelopeIcon className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Forgot Your Password?
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter your email to receive a reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {msg && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm text-center border border-green-300">
              {msg}
            </div>
          )}
          {err && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center border border-red-300">
              {err}
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <EnvelopeIcon className="w-5 h-5 text-green-400" />
              </span>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-500 transition bg-green-50/50"
                placeholder="Enter your email"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Remembered?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-600 hover:underline cursor-pointer font-medium"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
