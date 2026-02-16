import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Mission, SubItem } from '../types';

const DIFFICULTIES = [
  { key: 'easy', label: 'Easy' },
  { key: 'hard', label: 'Hard' },
  { key: 'night', label: 'Nightmare' }
] as const;

interface RaidGridProps {
  mission: Mission;
  completed: Record<string, string | null>;
  onToggle: (id: string) => void;
}

export const RaidGrid: React.FC<RaidGridProps> = ({ mission, completed, onToggle }) => {
  const subItems = mission.subItems ?? [];
  const lockedItems = (mission.metadata?.lockedItems as string[]) ?? [];

  return (
    <div className="grid grid-cols-4 gap-x-3 gap-y-2">
      <div />
      {DIFFICULTIES.map((d) => (
        <div
          key={d.key}
          className="flex items-center justify-center text-[9px] font-black text-slate-500 uppercase tracking-widest"
        >
          {d.label}
        </div>
      ))}

      {subItems.map((sub: SubItem) => (
        <React.Fragment key={sub.id}>
          <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-tight">
            {sub.name}
          </div>
          {DIFFICULTIES.map((diff) => {
            const fullId = `${mission.id}:${sub.id}_${diff.key}`;
            const subIdWithDiff = `${sub.id}_${diff.key}`;
            const isLocked = mission.metadata?.isLocked === true || lockedItems.includes(subIdWithDiff);

            const isDone = !!completed[fullId];
            return (
              <button
                key={fullId}
                onClick={() => !isLocked && onToggle(fullId)}
                disabled={isLocked}
                className={cn(
                  'h-8 rounded flex items-center justify-center border transition-all duration-300 active:scale-95',
                  isLocked
                    ? 'border-slate-800 bg-slate-900/40 text-slate-700 cursor-not-allowed'
                    : isDone
                      ? 'border-cyan-400 bg-cyan-500 text-slate-900 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'border-slate-700/50 bg-slate-800/60 text-transparent hover:border-slate-600'
                )}
              >
                {isLocked ? '─' : isDone ? <Check size={14} strokeWidth={4} /> : ''}
              </button>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};
