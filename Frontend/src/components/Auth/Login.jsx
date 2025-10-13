import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { login, getCurrentUser } from "../../app/Slices/authSlice.js";
import { Logo } from "../index.js";
import { Link, useNavigate } from "react-router-dom";
import toast from "../../utils/toast";
import LoadingSpinner from "../Loading/LoadingSpinner";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const authLoading = useSelector((state) => state.auth?.loading);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      await dispatch(login(data)).unwrap();
      await dispatch(getCurrentUser()).unwrap();
      toast.success("Welcome back! 🎉");
      navigate("/");
    } catch (error) {
      toast.error(error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full bg-[#121212] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <Logo />
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-gray-400">Sign in to your PlayTube account</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800">
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ae7aff] focus:border-transparent transition-colors ${
                  errors.username ? 'border-red-500' : 'border-gray-700'
                }`}
                {...register("username", { 
                  required: "Username is required",
                  minLength: { value: 3, message: "Username must be at least 3 characters" }
                })}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ae7aff] focus:border-transparent transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-700'
                }`}
                {...register("password", { 
                  required: "Password is required",
                  // minLength: { value: 6, message: "Password must be at least 6 characters" }
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || authLoading}
              className="w-full bg-gradient-to-r from-[#ae7aff] to-purple-500 text-black font-semibold py-3 px-4 rounded-lg hover:from-[#9c6ae6] hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-[#ae7aff] focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading || authLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-[#ae7aff] hover:text-[#9c6ae6] font-medium transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
