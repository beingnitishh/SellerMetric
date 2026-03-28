import type { ReactNode } from 'react';

interface SectionHeaderProps {
  number?: string;
  title: string;
  icon?: ReactNode;
}

export function SectionHeader({ number, title, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {number && (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-700 text-sm font-bold shrink-0">
          {number}
        </span>
      )}
      {icon && !number && (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-700 shrink-0">
          {icon}
        </span>
      )}
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent ml-2" />
    </div>
  );
}
