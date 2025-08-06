import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
// authService import removed - no longer used for sendOtp
import { registerUser } from "../../store/slices/authSlice";
import type { RootState } from "../../types";
import type { AppDispatch } from "../../store";
import CustomInput from "../../components/common/CustomInput";
import CustomEmailInput from "../../components/common/CustomEmailInput";
import CustomDropdown from "../../components/common/CustomDropdown";

// OTP input removed - no longer needed

const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
  });

  const [validationErrors, setValidationErrors] = useState<{
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
  }>({});

  // OTP-related state variables removed - no longer needed



  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const errors: typeof validationErrors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }



    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 digits";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // OTP validation removed

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormComplete = () => {
    return (
      formData.fullName.trim() &&
      formData.email.trim() &&
      formData.phoneNumber.trim() &&
      formData.password.trim() &&
      formData.confirmPassword.trim()
    );
  };

  // OTP-related functions removed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Direct user registration without OTP verification
      const registerData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        passwordHash: formData.password,
        role: formData.role,
      };

      await dispatch(registerUser(registerData)).unwrap();

      // Redirect to login page after successful registration
      navigate("/auth/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <i className="pi pi-user-plus text-3xl text-blue-600"></i>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/80">Join Turf Booking today</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <CustomInput
              id="fullName"
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              icon={<i className="pi pi-user" />}
              error={validationErrors.fullName}
              placeholder="Enter your full name"
            />
            {/* Role Field */}
            <CustomDropdown
              id="role"
              label="Role"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.value)}
              options={[
                { label: "Customer", value: "CUSTOMER" },
                { label: "Admin", value: "ADMIN" },
              ]}
              placeholder="Select your role"
              error={validationErrors.role}
            />

            {/* Email Field */}
            <CustomEmailInput
              id="email"
              label="Email Address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={validationErrors.email}
              placeholder="Enter your email"
            />
            {/* Phone Number Field */}
            <CustomInput
              id="phoneNumber"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              icon={<i className="pi pi-phone" />}
              error={validationErrors.phoneNumber}
              placeholder="Enter 10-digit phone number"
              maxLength={10}
              inputMode="numeric"
            />
            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <i className="pi pi-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
              {validationErrors.password && (
                <small className="text-red-500 block mt-1">
                  {validationErrors.password}
                </small>
              )}
            </div>
            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <i className="pi pi-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
              {validationErrors.confirmPassword && (
                <small className="text-red-500 block mt-1">
                  {validationErrors.confirmPassword}
                </small>
              )}
            </div>
           
            {/* Register Button */}
            <Button
              type="submit"
              label={isLoading ? "Creating Account..." : "Create Account"}
              icon={isLoading ? "pi pi-spinner pi-spin" : "pi pi-user-plus"}
              className="!w-full !bg-blue-600"
              loading={isLoading}
              disabled={isLoading || !isFormComplete()}
              style={{ color: "white", fontWeight: "bold" }}
            />
            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Sign in
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

export default RegisterPage;
