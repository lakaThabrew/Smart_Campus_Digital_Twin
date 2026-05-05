"use client";

import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }
    

    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else {
      // Check for uppercase letter
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one uppercase letter.";
        isValid = false;
      }
      // Check for lowercase letter
      else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one lowercase letter.";
        isValid = false;
      }
      // Check for digit
      else if (!/\d/.test(formData.password)) {
        newErrors.password = "Password must contain at least one digit.";
        isValid = false;
      }
      // Check for symbol (special character)
      else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one special character.";
        isValid = false;
      }
      // Check minimum length
      else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long.";
        isValid = false;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    if (success) {
      router.push("/dashboard");
    } else {
      setErrors(prev => ({ ...prev, email: "Registration failed. Please try again." }));
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100">Create Account</h2>
        <p className="text-slate-300 mt-2">Register to access your campus digital twin experience.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
          />
          <p className="text-red-500 text-sm mt-2">{errors.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">University Email</label>
          <input
            type="email"
            placeholder="student@university.edu"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
          />
          <p className="text-red-500 text-sm mt-2">{errors.email}</p>
        </div>


        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
          <p className="text-red-500 text-sm mt-2">{errors.password}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showConfirmPassword ? "🙈" : "👁"}
            </button>
          </div>
          <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-linear-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.01] active:scale-[0.99] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Account..." : "Register"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-8">
        Already have an account?
        <Link href="/login" className="text-cyan-300 hover:text-cyan-100 font-medium ml-1">
          Sign In
        </Link>
      </p>
    </>
  );
}