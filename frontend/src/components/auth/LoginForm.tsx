import Link from "next/link";

export default function LoginForm() {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100">Welcome Back</h2>
        <p className="text-slate-300 mt-2">Sign in to continue to your campus dashboard.</p>
      </div>

      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            University Email
          </label>
          <input
            type="email"
            placeholder="student@university.edu"
            className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
          />
          <p className="text-red-500 text-sm mt-2 hidden">Please enter a valid email address.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>

          <div className="relative">
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition pr-12"
            />

            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              👁
            </button>
          </div>

          <div className="flex justify-between items-center mt-2">
            <p className="text-red-500 text-sm hidden">Password is required.</p>

            <button type="button" className="text-sm text-cyan-300 hover:text-cyan-100 ml-auto">
              Forgot Password?
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              className="rounded border-slate-600 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
            />
            Remember Me
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-linear-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.01] active:scale-[0.99] transition shadow-lg"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-8">
        Don’t have an account?
        <Link href="/register" className="text-cyan-300 hover:text-cyan-100 font-medium ml-1">
          Create Account
        </Link>
      </p>
    </>
  );
}
