import { useState } from 'react';
import { signup } from '../../services/authService.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignupForm({ switchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (apiError) {
      setApiError(null);
    }

    if (name === 'password') {
      validatePasswordRequirements(value);
    }
  };

  const validatePasswordRequirements = (password) => {
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const { length, uppercase, lowercase, number, special } = passwordRequirements;
      if (!length || !uppercase || !lowercase || !number || !special) {
        newErrors.password = 'Password does not meet all requirements';
      }
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { confirmPassword, ...userData } = formData;
      
      const signupResponse = await signup(userData);
      console.log('Signup successful:', signupResponse);

      toast.success('Account created successfully! Please log in.', {
        position: "top-right",
        autoClose: 3000,
        className: 'success-toast'
      });

      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      setTimeout(() => {
        switchToLogin();
      }, 2000);
        
    } catch (error) {
      console.error('Signup error:', error);

      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        className: 'error-toast'
      });
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setApiError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getRequirementColor = (met) => met ? 'text-green-500' : 'text-red-500';
  const getRequirementIcon = (met) => met ? '✓' : '✗';

  return (
    <div className="w-full max-w-md bg-white p-10 rounded-2xl border border-[#FFDAC1] shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#FD79A8] bg-clip-text text-transparent">
          Create Account
        </h2>
        <p className="text-gray-600 mt-1">Join us today</p>
      </div>

      {/* API Error Message */}
      {apiError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {apiError}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm text-gray-600">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={`w-full px-4 py-3 bg-gray-50 border ${errors.name ? 'border-red-400' : 'border-gray-300'} rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent transition-all`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="mr-1">⚠</span> {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={`w-full px-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-400' : 'border-gray-300'} rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent transition-all`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="mr-1">⚠</span> {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            className={`w-full px-4 py-3 bg-gray-50 border ${errors.password ? 'border-red-400' : 'border-gray-300'} rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent transition-all`}
          />
          
          {/* Password Requirements */}
          {formData.password && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Password Requirements:</p>
              <div className="space-y-1 text-xs">
                <div className={`flex items-center ${getRequirementColor(passwordRequirements.length)}`}>
                  <span className="mr-2">{getRequirementIcon(passwordRequirements.length)}</span>
                  At least 8 characters long
                </div>
                <div className={`flex items-center ${getRequirementColor(passwordRequirements.uppercase)}`}>
                  <span className="mr-2">{getRequirementIcon(passwordRequirements.uppercase)}</span>
                  Contains uppercase letter (A-Z)
                </div>
                <div className={`flex items-center ${getRequirementColor(passwordRequirements.lowercase)}`}>
                  <span className="mr-2">{getRequirementIcon(passwordRequirements.lowercase)}</span>
                  Contains lowercase letter (a-z)
                </div>
                <div className={`flex items-center ${getRequirementColor(passwordRequirements.number)}`}>
                  <span className="mr-2">{getRequirementIcon(passwordRequirements.number)}</span>
                  Contains number (0-9)
                </div>
                <div className={`flex items-center ${getRequirementColor(passwordRequirements.special)}`}>
                  <span className="mr-2">{getRequirementIcon(passwordRequirements.special)}</span>
                  Contains special character (!@#$%^&*)
                </div>
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="mr-1">⚠</span> {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-sm text-gray-600">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className={`w-full px-4 py-3 bg-gray-50 border ${errors.confirmPassword ? 'border-red-400' : 'border-gray-300'} rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent transition-all`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <span className="mr-1">⚠</span> {errors.confirmPassword}
            </p>
          )}
          {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
            <p className="text-green-500 text-xs mt-1 flex items-center">
              <span className="mr-1">✓</span> Passwords match
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-6 py-3.5 bg-gradient-to-r from-[#FF6B6B] to-[#FD79A8] text-white font-semibold rounded-lg hover:from-[#FF8E53] hover:to-[#FF9AA2] transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-[#FF6B6B]/20 mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500 text-sm">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={switchToLogin}
            className="text-[#FF6B6B] hover:text-[#FF8E53] font-medium hover:underline focus:outline-none"
          >
            Log in
          </button>
        </p>
      </div>
  
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="custom-toast-container"
      />
    </div>
  );
}