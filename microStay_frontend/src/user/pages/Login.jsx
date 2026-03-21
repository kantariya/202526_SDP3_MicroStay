import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hotel, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import api from "../../utils/api";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ OTP FLOW STATE
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpUserId, setOtpUserId] = useState(null);
  const [otpWait, setOtpWait] = useState(0);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [errors, setErrors] = useState({});

  // OTP resend countdown
  useEffect(() => {
    if (otpWait <= 0) return;
    const t = setTimeout(() => setOtpWait(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [otpWait]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.email.trim()) e.email = "Email required";
    if (!formData.password) e.password = "Password required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ---------------- LOGIN SUBMIT ----------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      const data = res.data;

      if (data.status === "VERIFY_REQUIRED") {
        setErrors({ general: "Please verify your email first." });
        return;
      }

      if (data.status === "OTP_REQUIRED") {
        setOtpMode(true);
        setOtpUserId(data.userId);
        setOtpWait(60);
        return;
      }

      if (data.status === "SUCCESS") {
        localStorage.setItem('token', data.token);
        if (data.role) localStorage.setItem('role', data.role);

        if (data.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (data.role === 'HOTEL_MANAGER') {
          navigate('/manager/dashboard');
        } else {
          navigate('/');
        }
      }

    } catch (err) {
      setErrors({ general: err?.response?.data?.message || "Login failed" });
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- VERIFY OTP ----------------

  const submitOtp = async () => {
    if (!otp) return;

    setIsLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', null, {
        params: { userId: otpUserId, otp }
      });

      const data = res.data;

      if (data.status === "SUCCESS") {
        localStorage.setItem('token', data.token);
        if (data.role) localStorage.setItem('role', data.role);

        if (data.role === 'ADMIN' || data.role === 'HOTEL_MANAGER') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }

    } catch {
      setErrors({ general: "Invalid OTP" });
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- RESEND OTP ----------------

  const resendOtp = async () => {
    if (!otpUserId) return;
    await api.post('/auth/resend-otp', null, {
      params: { userId: otpUserId }
    });
    setOtpWait(60);
  };

  // ================= OTP SCREEN (UI SAME STYLE) =================

  if (otpMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 text-slate-900">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl text-center">

          <h2 className="text-2xl font-bold mb-2">Enter OTP</h2>
          <p className="text-slate-600 mb-6">Check your email for the OTP</p>

          <input
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="w-full rounded-lg border py-3 px-4 text-center text-lg tracking-widest"
            placeholder="------"
          />

          {errors.general && (
            <div className="mt-3 text-red-600 text-sm">{errors.general}</div>
          )}

          <button
            onClick={submitOtp}
            disabled={isLoading}
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-bold text-white rounded-lg"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Verify OTP"}
          </button>

          <button
            onClick={resendOtp}
            disabled={otpWait > 0}
            className="mt-4 text-blue-600 font-semibold disabled:opacity-50"
          >
            {otpWait > 0 ? `Resend in ${otpWait}s` : "Resend OTP"}
          </button>
        </div>
      </div>
    );
  }

  // ================= ORIGINAL LOGIN UI (UNCHANGED) =================

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 text-slate-900">
      <div className="w-full max-w-md">

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

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">

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
                  className="w-full rounded-lg border py-3 pl-10 pr-3"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-800">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border py-3 pl-10 pr-12"
                />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {errors.general && (
              <div className="text-red-600 text-sm">{errors.general}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-bold text-white"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="my-6 text-center text-sm text-slate-600">OR</div>

          <button
            onClick={() => window.location.href = "http://localhost:8081/oauth2/authorization/google"}
            className="flex w-full items-center justify-center rounded-lg border py-3"
          >
            Continue with Google
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-700">
          Don’t have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
