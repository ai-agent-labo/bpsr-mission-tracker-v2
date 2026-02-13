import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';
import type { SubItem } from '../types';

interface CheckListCardProps {
    name: string;
    subItems: SubItem[];
    parentId: string;
    completed: Record<string, string | null>;
    onToggle: (id: string) => void;
}

export const CheckListCard: React.FC<CheckListCardProps> = ({
    name,
    subItems,
    parentId,
    completed,
    onToggle
}) => {
    const childIds = subItems.map((sub) => `${parentId}:${sub.id}`);
    const completedCount = childIds.filter((id) => !!completed[id]).length;
    const isAllDone = completedCount === subItems.length && subItems.length > 0;

    return (
        <>
            <div className="flex items-start justify-between">
                <h3 className={cn(
                    "text-lg font-black transition-all font-premium leading-tight",
                    isAllDone ? "text-cyan-400" : "text-white"
                )}>
                    {name}
                </h3>
                <span className="text-[10px] font-black tabular-nums text-slate-500 bg-slate-800/40 px-2 py-0.5 rounded">
                    {completedCount} / {subItems.length}
                </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {subItems.map((sub) => {
                    const id = `${parentId}:${sub.id}`;
                    const isDone = !!completed[id];
                    return (
                        <button
                            key={sub.id}
                            onClick={() => onToggle(id)}
                            className={cn(
                                "group flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 active:scale-95",
                                isDone
                                    ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                                    : "border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700"
                            )}
                        >
                            <span className="text-[11px] font-bold tracking-tight">{sub.name}</span>
                            <div className={cn(
                                "h-5 w-5 rounded flex items-center justify-center transition-all border",
                                isDone
                                    ? "bg-cyan-500 border-cyan-400 text-slate-900 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                                    : "bg-slate-700/50 border-slate-600/50 text-transparent"
                            )}>
                                {isDone && <Check size={14} strokeWidth={4} />}
                            </div>
                        </button>
                    );
                })}
            </div>
        </>
    );
};
