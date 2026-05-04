import Link from "next/link";
import LoginForm from "./LoginForm";
import RegisterPreview from "./RegisterPreview";

export default function AuthFormPanel() {
  return (
    <div className="flex items-center justify-center p-6 sm:p-10 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="flex bg-slate-200 rounded-xl p-1 mb-8">
          <Link
            href="/login"
            className="flex-1 py-3 rounded-lg bg-white shadow-sm text-slate-900 font-semibold text-center transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="flex-1 py-3 rounded-lg text-slate-600 hover:text-slate-900 text-center transition"
          >
            Register
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-200">
          <LoginForm />
        </div>

        <RegisterPreview />
      </div>
    </div>
  );
}
