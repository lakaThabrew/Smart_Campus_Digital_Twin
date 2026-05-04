import AuthFormPanel from "./AuthFormPanel";
import AuthInfoPanel from "./AuthInfoPanel";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <AuthInfoPanel />
        <AuthFormPanel />
      </div>
    </div>
  );
}
