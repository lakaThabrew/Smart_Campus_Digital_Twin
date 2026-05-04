import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-slate-950/80 border border-slate-800 rounded-3xl shadow-2xl p-10 text-white">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-5xl font-bold">Campus Digital Twin</h1>
          <p className="mt-4 text-slate-300 leading-relaxed">
            Welcome back! Choose to sign in or create a new account to continue with the smart campus dashboard.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
            <Link
              href="/login"
              className="rounded-2xl bg-cyan-500 px-6 py-4 text-lg font-semibold text-slate-950 hover:bg-cyan-400 transition text-center"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-2xl bg-slate-800 px-6 py-4 text-lg font-semibold text-white hover:bg-slate-700 transition text-center"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
