export default function RegisterPreview() {
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Registration Form Fields</h2>
        <p className="text-slate-500 mt-2 text-sm">
          Use these fields when implementing the registration page.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400"
        />

        <input
          type="email"
          placeholder="University Email"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400"
        />

        <input
          type="text"
          placeholder="Student ID"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400"
        />

        <div>
          <input
            type="password"
            placeholder="Create Password"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400"
          />

          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-green-600">
              <span>✔</span>
              <span>Minimum 8 characters</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <span>•</span>
              <span>Contains uppercase letter</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <span>•</span>
              <span>Contains number and special character</span>
            </div>
          </div>
        </div>

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400"
        />

        <button className="w-full bg-linear-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:scale-[1.01] active:scale-[0.99] transition shadow-lg">
          Create Account
        </button>
      </div>
    </div>
  );
}
