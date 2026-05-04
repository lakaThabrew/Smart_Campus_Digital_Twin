export default function AuthInfoPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-center bg-linear-to-br from-cyan-500 to-blue-700 text-white p-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 border border-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 border border-white rounded-full"></div>
      </div>

      <div className="relative z-10 space-y-6">
        <h1 className="text-5xl font-bold leading-tight">
          Smart Campus
          <br />
          Digital Twin
        </h1>

        <p className="text-lg text-slate-100 leading-relaxed max-w-md">
          Securely access your personalized campus experience with real-time
          navigation, scheduling, and smart university services.
        </p>

        <div className="grid grid-cols-2 gap-4 pt-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <h3 className="font-semibold text-lg">3D Navigation</h3>
            <p className="text-sm text-slate-100 mt-1">
              Explore campus buildings interactively.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <h3 className="font-semibold text-lg">Secure Access</h3>
            <p className="text-sm text-slate-100 mt-1">
              Protected authentication and sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
