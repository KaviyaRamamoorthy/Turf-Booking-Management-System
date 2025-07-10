import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Message } from 'primereact/message';
import { loginUser } from '../../store/slices/authSlice';
import type { RootState } from '../../types';
import type { AppDispatch } from '../../store';

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
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
      // For development: any email/password combination works
      // Set role as admin by default
      const loginCredentials = {
        email: formData.email,
        password: formData.password,
        role: 'admin' as const
      };

      await dispatch(loginUser(loginCredentials)).unwrap();

      // Redirect to admin dashboard on successful login
      navigate('/dashboard/admin');
    } catch (error) {
      // Error handling is done by Redux
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <i className="pi pi-leaf text-3xl text-green-600"></i>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Turf Booking</h1>
          <p className="text-white/80">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <span className="p-input-icon-right w-full">
                  <InputText
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full ${validationErrors.email ? 'p-invalid' : ''}`}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                  <i className="pi pi-envelope" />
                </span>
                {validationErrors.email && (
                  <small className="p-error block mt-1">{validationErrors.email}</small>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative w-full">
                <Password
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full ${validationErrors.password ? 'p-invalid' : ''}`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  toggleMask
                  feedback={false}
                  style={{ width: '100%' }}
                />
                {validationErrors.password && (
                  <small className="p-error block mt-1">{validationErrors.password}</small>
                )}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  inputId="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.checked)}
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <Message
                severity="error"
                text={error}
                className="w-full"
              />
            )}

            {/* Login Button */}
            <Button
              type="submit"
              label={isLoading ? 'Signing in...' : 'Sign In'}
              icon={isLoading ? 'pi pi-spinner pi-spin' : 'pi pi-sign-in'}
              className="!w-full !bg-green-500 "
              loading={isLoading}
              disabled={isLoading}
              style={{ color: 'white', fontWeight: 'bold' }}
            />

            {/* Demo Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <i className="pi pi-info-circle text-blue-600 mt-0.5 mr-2"></i>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Demo Mode</p>
                  <p>Any email and password combination will work. You'll be logged in as an admin.</p>
                </div>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
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