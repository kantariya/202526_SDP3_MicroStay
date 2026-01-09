import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";
import { Hotel, Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Globe, ArrowRight, Loader2 } from "lucide-react";
import api from "../utils/api";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [isFetchingCountries, setIsFetchingCountries] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    terms: false,
  });


  // Fetch countries from external API
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data
          .map((c) => ({
            value: c.name.common,
            label: c.name.common,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setCountries(formatted);
        setIsFetchingCountries(false);
      })
      .catch(() => setIsFetchingCountries(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCountryChange = (selectedOption) => {
    setFormData((prev) => ({ ...prev, country: selectedOption ? selectedOption.value : "" }));
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 1) {
      newErrors.firstName = "First name must be at least 1 character";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.firstName)) {
      newErrors.firstName = "First name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 1) {
      newErrors.lastName = "Last name must be at least 1 character";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.lastName)) {
      newErrors.lastName = "Last name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Phone validation (optional but validate format if provided)
    if (formData.phone && !/^[+]?[(]?[0-9]{1,4}[)]?[-\\s.]?[(]?[0-9]{1,4}[)]?[-\\s.]?[0-9]{1,9}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Terms validation
    if (!formData.terms) {
      newErrors.terms = "You must accept the Terms & Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Destructure confirmPassword and terms out, keep the rest in 'registerData'
      const { confirmPassword, terms, ...registerData } = formData;

      // Trim string fields
      Object.keys(registerData).forEach(key => {
        if (typeof registerData[key] === 'string') {
          registerData[key] = registerData[key].trim();
        }
      });

      // Send ONLY the fields the backend expects
      const response = await api.post("/register/auth", registerData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        if (response.data.role) {
          localStorage.setItem("role", response.data.role);
        }
        navigate("/");
      }
    } catch (err) {
      console.error("Registration error:", err);

      // Handle validation errors from backend
      if (err.errors) {
        setErrors(err.errors);
      } else {
        // Show error message
        const errorMessage = err.message || "Registration failed. Please try again.";
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Modern React-Select Styling
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#f8fafc", // slate-50
      borderRadius: "1rem",
      padding: "3px 8px 3px 40px",
      border: "none",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(79, 70, 229, 0.2)" : "none",
      cursor: "pointer",
    }),
    valueContainer: (base) => ({ ...base, paddingLeft: "0" }),
    // This fixes the color of the text AFTER you select an option
    singleValue: (base) => ({
      ...base,
      color: "#0f172a", // slate-900 (Dark text)
    }),
    // This fixes the placeholder text color
    placeholder: (base) => ({
      ...base,
      color: "#94a3b8", // slate-400
      fontSize: "0.875rem",
    }),
    // This fixes the dropdown menu container
    menu: (base) => ({
      ...base,
      backgroundColor: "white",
      borderRadius: "1rem",
      overflow: "hidden",
      border: "1px solid #f1f5f9",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      zIndex: 50, // Ensures it stays above other elements
    }),
    // This fixes the individual items inside the list
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#4f46e5" // Indigo-600 when selected
        : state.isFocused
          ? "#f1f5f9" // Slate-100 on hover
          : "white",
      color: state.isSelected ? "white" : "#334155", // slate-700
      cursor: "pointer",
      padding: "10px 15px",
      fontSize: "0.875rem",
      "&:active": {
        backgroundColor: "#e2e8f0",
      },
    }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans relative overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-[2.5rem] p-8 md:p-12 border border-white relative z-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4 shadow-lg shadow-indigo-200">
            <Hotel className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create an account</h1>
          <p className="text-slate-500 mt-2">Start your journey with us today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">First Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="John"
                  className={`w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all ${errors.firstName ? 'ring-2 ring-red-500' : ''}`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName}</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Last Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                  className={`w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all ${errors.lastName ? 'ring-2 ring-red-500' : ''}`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className={`w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 0000000000"
                  className={`w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all ${errors.phone ? 'ring-2 ring-red-500' : ''}`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Street Address</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Modern St, Apt 4B"
                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all"
              />
            </div>
          </div>

          {/* City & Country Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Country</label>
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10 group-focus-within:text-indigo-600" />
                <Select
                  options={countries}
                  isLoading={isFetchingCountries}
                  onChange={handleCountryChange}
                  placeholder="Search country..."
                  styles={selectStyles}
                />
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border-none rounded-2xl pl-12 pr-12 py-3.5 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 transition-all ${errors.password ? 'ring-2 ring-red-500' : ''}`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-indigo-600/20 outline-none text-slate-900 transition-all ${errors.confirmPassword ? 'ring-2 ring-red-500' : ''}`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Terms */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer py-2">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className={`w-5 h-5 rounded-md border-slate-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer ${errors.terms ? 'ring-2 ring-red-500' : ''}`}
              />
              <span className="text-sm text-slate-600">
                I accept the <span className="text-indigo-600 font-semibold hover:underline">Terms</span> and <span className="text-indigo-600 font-semibold hover:underline">Privacy Policy</span>
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-500 text-xs mt-1 ml-8">{errors.terms}</p>
            )}
          </div>

          {/* General error message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <>
                Create Account
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="my-6 flex items-center before:flex-1 before:border-t before:border-slate-100 after:flex-1 after:border-t after:border-slate-100">
          <span className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
        </div>

        <button
          onClick={() => window.location.href = "http://localhost:8081/oauth2/authorization/google"}
          className="w-full flex items-center justify-center gap-3 py-3.5 border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-colors mb-6"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
          Continue with Google
        </button>

        <p className="text-center text-slate-500 font-medium">
          Already a member?
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 ml-1.5 font-bold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}