import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface RuinsSelectorProps {
    floor: number;
    onChange: (floor: number) => void;
}

export const RuinsSelector: React.FC<RuinsSelectorProps> = ({ floor, onChange }) => {
    return (
        <div className="flex items-center justify-between gap-6 px-2">
            <div className="flex flex-col items-center gap-1.5">
                <button
                    onClick={() => onChange(floor + 5)}
                    className="flex h-9 w-12 flex-col items-center justify-center rounded-lg bg-slate-800 text-cyan-400 transition-all hover:bg-slate-700 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-90"
                >
                    <ChevronUp size={16} />
                    <span className="text-[8px] font-black">+5</span>
                </button>
                <button
                    onClick={() => onChange(floor + 1)}
                    className="flex h-8 w-12 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-all hover:bg-slate-700 active:scale-90"
                >
                    <ChevronUp size={14} />
                </button>
            </div>

            <div className="relative flex flex-col items-center">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-[-4px]">Elevtn</span>
                <span className="text-4xl font-black text-white tabular-nums drop-shadow-[0_0_12px_rgba(255,255,255,0.15)] font-premium">
                    {String(floor).padStart(2, '0')}
                </span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
                <button
                    onClick={() => onChange(floor - 1)}
                    className="flex h-8 w-12 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-all hover:bg-slate-700 active:scale-90"
                >
                    <ChevronDown size={14} />
                </button>
                <button
                    onClick={() => onChange(floor - 5)}
                    className="flex h-9 w-12 flex-col items-center justify-center rounded-lg bg-slate-800 text-cyan-600 transition-all hover:bg-slate-700 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] active:scale-90"
                >
                    <span className="text-[8px] font-black">-5</span>
                    <ChevronDown size={16} />
                </button>
            </div>
        </div>
    );
};
