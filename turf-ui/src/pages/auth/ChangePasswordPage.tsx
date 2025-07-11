import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { ProgressBar } from "primereact/progressbar";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";

interface PasswordRequirement {
  id: string;
  label: string;
  validator: (password: string) => boolean;
  met: boolean;
}

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Password requirements checklist
  const [requirements, setRequirements] = useState<PasswordRequirement[]>([
    {
      id: "length",
      label: "At least 8 characters",
      validator: (password) => password.length >= 8,
      met: false,
    },
    {
      id: "lowercase",
      label: "One lowercase letter",
      validator: (password) => /[a-z]/.test(password),
      met: false,
    },
    {
      id: "uppercase",
      label: "One uppercase letter",
      validator: (password) => /[A-Z]/.test(password),
      met: false,
    },
    {
      id: "number",
      label: "One number",
      validator: (password) => /\d/.test(password),
      met: false,
    },
    {
      id: "special",
      label: "One special character",
      validator: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
      met: false,
    },
  ]);

  // Calculate password strength
  const calculatePasswordStrength = (
    password: string
  ): { score: number; label: string; color: string } => {
    const metRequirements = requirements.filter((req) =>
      req.validator(password)
    ).length;
    const score = (metRequirements / requirements.length) * 100;

    if (score === 0) return { score: 0, label: "", color: "var(--gray-300)" };
    if (score <= 40) return { score, label: "Weak", color: "var(--red-500)" };
    if (score <= 60)
      return { score, label: "Fair", color: "var(--orange-500)" };
    if (score <= 80) return { score, label: "Good", color: "var(--blue-500)" };
    return { score, label: "Strong", color: "var(--green-500)" };
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Update password requirements if it's the new password field
    if (field === "newPassword") {
      setRequirements((prev) =>
        prev.map((req) => ({
          ...req,
          met: req.validator(value),
        }))
      );
    }
  };

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!formData.currentPassword.trim()) {
      errors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword.trim()) {
      errors.newPassword = "New password is required";
    } else {
      const unmetRequirements = requirements.filter((req) => !req.met);
      if (unmetRequirements.length > 0) {
        errors.newPassword = "Password does not meet all requirements";
      }
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Password changed successfully!",
        life: 3000,
      });

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setRequirements((prev) => prev.map((req) => ({ ...req, met: false })));

      // Navigate back after a delay
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to change password. Please try again.",
        life: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = calculatePasswordStrength(formData.newPassword);
  const passwordsMatch =
    formData.newPassword &&
    formData.confirmPassword &&
    formData.newPassword === formData.confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Toast ref={toast} />

      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <i className="pi pi-shield text-3xl text-blue-600"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Change Password
            </h1>
            <p className="text-gray-600">
              Create a new secure password for your account
            </p>
          </div>

          {/* Back Navigation */}
          <div className="mb-6">
            <Button
              label="Back"
              icon="pi pi-arrow-left"
              className="p-button-text p-button-sm"
              onClick={() => navigate(-1)}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="relative">
                <i className="pi pi-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <Password
                  value={formData.currentPassword}
                  onChange={(e) =>
                    handleInputChange("currentPassword", e.target.value)
                  }
                  placeholder="Enter current password"
                  className="w-full"
                  inputClassName="pl-10 w-full pr-12"
                  inputStyle={{ width: "100%" }}
                  style={{ width: "100%" }}
                  toggleMask
                  feedback={false}
                />
              </div>
              {validationErrors.currentPassword && (
                <small className="text-red-500">
                  {validationErrors.currentPassword}
                </small>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <i className="pi pi-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <Password
                  value={formData.newPassword}
                  onChange={(e) =>
                    handleInputChange("newPassword", e.target.value)
                  }
                  placeholder="Enter new password"
                  className="w-full"
                  inputClassName="pl-10 w-full pr-12"
                  inputStyle={{ width: "100%" }}
                  style={{ width: "100%" }}
                  toggleMask
                  feedback={false}
                />
              </div>
              {validationErrors.newPassword && (
                <small className="text-red-500">
                  {validationErrors.newPassword}
                </small>
              )}

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      Password Strength
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <ProgressBar
                    value={passwordStrength.score}
                    className="h-2"
                    style={{ backgroundColor: "var(--gray-200)" }}
                    color={passwordStrength.color}
                  />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <i className="pi pi-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <Password
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm new password"
                  className="w-full"
                  inputClassName="pl-10 w-full pr-12"
                  inputStyle={{ width: "100%" }}
                  style={{ width: "100%" }}
                  toggleMask
                  feedback={false}
                />
              </div>
              {validationErrors.confirmPassword && (
                <small className="text-red-500">
                  {validationErrors.confirmPassword}
                </small>
              )}

              {/* Password Match Indicator */}
              {passwordsMatch && (
                <div className="flex items-center text-green-600 text-sm">
                  <i className="pi pi-check mr-2"></i>
                  Passwords match
                </div>
              )}
            </div>

            {/* Password Requirements Checklist */}
            {formData.newPassword && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Password Requirements:
                </h4>
                <div className="space-y-2">
                  {requirements.map((requirement) => (
                    <div
                      key={requirement.id}
                      className="flex items-center text-sm"
                    >
                      <i
                        className={`${
                          requirement.met
                            ? "pi pi-check text-green-500"
                            : "pi pi-circle text-gray-400"
                        } mr-2`}
                      ></i>
                      <span
                        className={
                          requirement.met ? "text-green-700" : "text-gray-600"
                        }
                      >
                        {requirement.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tips */}
            <Message
              severity="info"
              text="Use a unique password that you don't use anywhere else. Consider using a password manager to generate and store strong passwords."
              className="w-full"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              label={isLoading ? "Changing Password..." : "Change Password"}
              icon={isLoading ? "pi pi-spin pi-spinner" : "pi pi-check"}
              className="!w-full !bg-blue-600 !border-blue-600 !text-white hover:!bg-blue-700 hover:!border-blue-700"
              loading={isLoading}
              disabled={isLoading}
            />
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
