import React from 'react';
import { Key } from 'lucide-react';
import { cn } from '../lib/utils';

interface StockGaugeProps {
  value: number;
  max?: number;
  onChange: (value: number) => void;
  label: string;
}

export const StockGauge: React.FC<StockGaugeProps> = ({
  value,
  max = 6,
  onChange,
  label
}) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-black text-slate-300 transition-all font-premium leading-tight">
          {label}
        </h3>
        <span className="text-xl font-black text-cyan-400 font-mono tracking-tighter">
          {value} <span className="text-[10px] font-bold text-slate-500 uppercase">/ {max}</span>
        </span>
      </div>
      <div className="flex items-center gap-1.5 justify-start">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange(0);
          }}
          className={cn(
            'h-10 px-2 rounded-xl border transition-all flex flex-col items-center justify-center shrink-0',
            value === 0
              ? 'border-cyan-500/50 bg-cyan-500/20 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
              : 'border-slate-800 bg-slate-800/40 text-slate-500 hover:border-slate-700'
          )}
        >
          <span className="text-[9px] font-black uppercase tracking-tighter">CLR</span>
        </button>
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(num);
              }}
              className={cn(
                'h-10 w-10 min-w-10 rounded-xl border transition-all flex items-center justify-center',
                value >= num
                  ? 'border-cyan-500/50 bg-cyan-500/20 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'border-slate-800 bg-slate-800/40 text-slate-500 hover:border-slate-700'
              )}
            >
              <Key size={16} className={cn(value >= num ? "animate-pulse" : "opacity-20")} />
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
