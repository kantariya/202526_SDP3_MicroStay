import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hotel, Mail, Lock, ArrowLeft, Loader2, CheckCircle, Key } from 'lucide-react';
import api from "../../utils/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // STEPS: 1 = Email Entry, 2 = OTP Verification, 3 = New Password
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form Data
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');

  // UI State
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpWait, setOtpWait] = useState(0);

  // OTP resend countdown
  useEffect(() => {
    if (otpWait <= 0) return;
    const timer = setTimeout(() => setOtpWait(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpWait]);

  // ========== STEP 1: REQUEST OTP ==========
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/forgot-password/request-otp', {
        email: email.trim().toLowerCase()
      });

      if (response.data.status === 'SENT') {
        setSuccess('OTP has been sent to your email!');
        setStep(2);
        setOtpWait(60);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check your email.');
    } finally {
      setIsLoading(false);
    }
  };

  // ========== STEP 2: VERIFY OTP ==========
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/forgot-password/verify-otp', {
        email: email.trim().toLowerCase(),
        otp: otp.trim()
      });

      if (response.data.status === 'OTP_VERIFIED') {
        setResetToken(response.data.resetToken);
        setSuccess('OTP verified! Now set your new password.');
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ========== RESEND OTP ==========
  const handleResendOTP = async () => {
    if (otpWait > 0) return;

    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/auth/forgot-password/request-otp', {
        email: email.trim().toLowerCase()
      });

      if (response.data.status === 'SENT') {
        setSuccess('New OTP has been sent!');
        setOtpWait(60);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // ========== STEP 3: RESET PASSWORD ==========
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/forgot-password/reset', {
        resetToken,
        newPassword
      });

      if (response.data.status === 'PASSWORD_RESET') {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // ========== RENDER UI ==========

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 text-slate-900">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
            <Hotel className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-extrabold text-slate-900">
            {step === 1 && 'Forgot Password?'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'Set New Password'}
          </h1>
          <p className="text-slate-700">
            {step === 1 && "Enter your email to receive a reset code"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Create a new secure password"}
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">

          {/* Step Indicator */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className={`h-2 w-12 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-12 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-12 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          </div>

          {/* STEP 1: Email Input */}
          {step === 1 && (
            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-bold text-white hover:from-blue-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send OTP'}
              </button>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Enter OTP
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-center text-lg tracking-widest focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    placeholder="------"
                    maxLength={6}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  OTP sent to: <span className="font-semibold">{email}</span>
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-bold text-white hover:from-blue-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={otpWait > 0 || isLoading}
                className="w-full text-sm font-semibold text-blue-600 hover:underline disabled:opacity-50 disabled:no-underline"
              >
                {otpWait > 0 ? `Resend OTP in ${otpWait}s` : 'Resend OTP'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm font-semibold text-slate-600 hover:underline"
              >
                Change Email
              </button>
            </form>
          )}

          {/* STEP 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle size={18} />
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-bold text-white hover:from-blue-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Reset Password'}
              </button>

              {/* Password Requirements */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-xs font-bold text-blue-900 mb-2">Password Requirements:</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• At least 6 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Includes numbers or special characters</li>
                </ul>
              </div>
            </form>
          )}

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
