import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Message } from "primereact/message";
import { loginUser } from "../../store/slices/authSlice";
import type { RootState } from "../../types";
import type { AppDispatch } from "../../store";

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const loginCredentials = {
        email: formData.email,
        password: formData.password,
      };

      await dispatch(loginUser(loginCredentials)).unwrap();

      // Redirect to Home page on successful login
      navigate("/home");
    } catch (error) {
      // Error handling is done by Redux
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <i className="pi pi-sign-in text-3xl text-blue-600"></i>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/80">Join Turf Booking today</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <InputText
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full ${validationErrors.email ? "p-invalid" : ""
                    }`}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
                <i className="absolute right-2 top-1/2 -translate-y-1/2  pi pi-envelope" />
                {validationErrors.email && (
                  <small className="p-error block mt-1">
                    {validationErrors.email}
                  </small>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative w-full">
                <div className="w-full" style={{ width: '100%' }}>
                  <Password
                    id="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`!w-full full-width-password ${validationErrors.password ? "p-invalid" : ""
                      }`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    toggleMask
                    appendTo="self"

                  />
                </div>
                {validationErrors.password && (
                  <small className="p-error block mt-1">
                    {validationErrors.password}
                  </small>
                )}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  inputId="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange("rememberMe", e.checked)}
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <a href="#"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <Message severity="error" text={error} className="w-full" />
            )}

            {/* Login Button */}
            <Button
              type="submit"
              label={isLoading ? "Signing in..." : "Sign In"}
              icon={isLoading ? "pi pi-spinner pi-spin" : "pi pi-sign-in"}
              className="!w-full submit-button font-bold"
              loading={isLoading}
              disabled={isLoading}
            />

            {/* Sign Up Link */}
            <div className="text-center pt-3">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/auth/register"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            © 2024 Turf Booking Management. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
