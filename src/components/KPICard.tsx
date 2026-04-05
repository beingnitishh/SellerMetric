import type { ReactNode } from 'react';

interface KPICardProps {
  label: string;
  value: string;
  icon: ReactNode;
  color: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
  delay?: number;
}

const colorMap = {
  indigo: {
    bg: 'bg-[#1C2537]',
    icon: 'bg-[#1E2D45] text-[#D4A847]',
    text: 'text-[#A07A28]',
    border: 'border-[#A07A28]/30',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'bg-emerald-100 text-emerald-600',
    text: 'text-emerald-700',
    border: 'border-emerald-100',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'bg-amber-100 text-amber-600',
    text: 'text-amber-700',
    border: 'border-amber-100',
  },
  rose: {
    bg: 'bg-rose-50',
    icon: 'bg-rose-100 text-rose-600',
    text: 'text-rose-700',
    border: 'border-rose-100',
  },
  slate: {
    bg: 'bg-[#111827]',
    icon: 'bg-[#1C2537] text-[#94A3B8]',
    text: 'text-[#F0EDE6]',
    border: 'border-[#1E2D45]',
  },
};

export function KPICard({ label, value, icon, color, delay = 0 }: KPICardProps) {
  const c = colorMap[color];
  return (
    <div
      className={`animate-fade-in-up rounded-2xl ${c.bg} border ${c.border} p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">{label}</span>
        <div className={`w-9 h-9 rounded-xl ${c.icon} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className={`text-2xl font-bold ${c.text} tracking-tight`}>{value}</div>
    </div>
  );
}
