import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginForm({ onClose, switchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Login successful!', {
        position: "top-left",
        autoClose: 3000,
        className: 'left-toast'
      });
      onClose?.();
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || 'Login failed';
        setApiError(errorMessage);
      } else if (error.request) {
        setApiError('Network error - please try again');
      } else {
        setApiError(error.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-10 rounded-2xl border border-[#FFDAC1] shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#FD79A8] bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-1">Log in to your account</p>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 transition-colors text-2xl transform hover:scale-110"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      {/* API Error Message */}
      {apiError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
          {apiError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm text-gray-600">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={`w-full px-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-400' : 'border-gray-300'} rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent transition-all`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm text-gray-600">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={handleChange}
            placeholder="Enter your password"
            className={`w-full px-4 py-3 bg-gray-50 border ${errors.password ? 'border-red-400' : 'border-gray-300'} rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent transition-all`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
              Logging in...
            </div>
          ) : (
            'Continue'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500 text-sm">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Switch to Signup */}
      <div className="text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button 
            onClick={switchToSignup}
            className="text-[#FF6B6B] hover:text-[#FF8E53] font-medium hover:underline focus:outline-none"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}