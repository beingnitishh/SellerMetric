import { BarChart3 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-mesh">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center animate-pulse shadow-xl shadow-primary-200">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
        <div className="absolute -inset-4 rounded-3xl border-2 border-primary-200 animate-ping opacity-20" />
      </div>
      <div className="mt-8 text-center">
        <h3 className="text-xl font-semibold text-slate-800">Processing your data</h3>
        <p className="text-slate-500 mt-2 text-sm">Running strictly exact calculations...</p>
      </div>
      <div className="mt-6 flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
