import AuthInfoPanel from "./AuthInfoPanel";
import LoginForm from "./LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "radial-gradient(circle at center, #0B666A 0%, #071952 100%)" }}>
      <div className="w-full max-w-6xl bg-slate-900 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-slate-800">
        <AuthInfoPanel />

        <div className="flex items-center justify-center p-6 sm:p-10" style={{ background: "radial-gradient(circle at center, #0B666A 0%, #071952 100%)" }}>
          <div className="w-full max-w-md">
            <div className="flex bg-slate-800 rounded-xl p-1 mb-8">
              <Link
                href="/login"
                className="flex-1 py-3 rounded-lg bg-slate-950 text-white font-semibold text-center transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="flex-1 py-3 rounded-lg text-slate-400 hover:text-white text-center transition"
              >
                Register
              </Link>
            </div>

            <div className="bg-slate-950 rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-800">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
