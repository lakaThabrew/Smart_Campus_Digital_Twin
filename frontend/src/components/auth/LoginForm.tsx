"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else {
      // Check for uppercase letter
      if (!/[A-Z]/.test(password)) {
        setPasswordError("Password must contain at least one uppercase letter.");
        isValid = false;
      }
      // Check for lowercase letter
      else if (!/[a-z]/.test(password)) {
        setPasswordError("Password must contain at least one lowercase letter.");
        isValid = false;
      }
      // Check for digit
      else if (!/\d/.test(password)) {
        setPasswordError("Password must contain at least one digit.");
        isValid = false;
      }
      // Check for symbol (special character)
      else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        setPasswordError("Password must contain at least one special character.");
        isValid = false;
      }
      // Check minimum length
      else if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters long.");
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const success = await login(email, password);
    if (success) {
      router.push("/dashboard");
    } else {
      setPasswordError("Invalid email or password.");
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100">Welcome Back</h2>
        <p className="text-slate-300 mt-2">Sign in to continue to your campus dashboard.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            University Email
          </label>
          <input
            type="email"
            placeholder="student@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
          />
          <p className="text-red-500 text-sm mt-2">{emailError}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div className="flex justify-between items-center mt-2">
            <p className="text-red-500 text-sm">{passwordError}</p>

            <Link href="/forgot-password" className="text-sm text-cyan-300 hover:text-cyan-100 ml-auto">
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-600 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
            />
            Remember Me
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-linear-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.01] active:scale-[0.99] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-8">
        Don't have an account?
        <Link href="/register" className="text-cyan-300 hover:text-cyan-100 font-medium ml-1">
          Create Account
        </Link>
      </p>
    </>
  );
}