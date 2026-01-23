import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hotel, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '../utils/api';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      const { token, role } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        if (role) localStorage.setItem('role', role);
        navigate('/');
      }
    } catch (error) {
      setErrors({ general: error.message || "Invalid email or password" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 text-slate-900">
      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
            <Hotel className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-extrabold text-slate-900">
            Welcome Back
          </h1>
          <p className="text-slate-700">
            Sign in to your account to continue
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-lg border py-3 pl-10 pr-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full rounded-lg border py-3 pl-10 pr-12 text-slate-900 placeholder:text-slate-400 focus:ring-2 ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* REMEMBER */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                Remember me
              </label>
              <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>

            {/* ERROR */}
            {errors.general && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errors.general}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-bold text-white shadow-lg hover:scale-[1.02] transition disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="my-6 text-center text-sm font-medium text-slate-600">
            OR
          </div>

          {/* GOOGLE LOGIN */}
          <button
            onClick={() => window.location.href = "http://localhost:8081/oauth2/authorization/google"}
            className="flex w-full items-center justify-center rounded-lg border border-gray-300 py-3 hover:bg-gray-50"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="mr-2 h-5 w-5"
            />
            <span className="text-sm font-semibold text-slate-800">
              Continue with Google
            </span>
          </button>
        </div>

        {/* FOOTER */}
        <p className="mt-6 text-center text-sm font-medium text-slate-700">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
