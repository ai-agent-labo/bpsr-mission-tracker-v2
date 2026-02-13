import React from 'react';
import { cn } from '../lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
    bgImage?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick, hover = true, bgImage }) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-xl transition-all duration-500",
                hover && "hover:border-cyan-500/50 hover:bg-slate-900/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]",
                onClick && "cursor-pointer active:scale-95",
                className
            )}
        >
            {/* Background Image with Hover Zoom */}
            {bgImage && (
                <div
                    className="absolute inset-0 z-0 opacity-20 transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
            )}

            {/* Glass Shimmer Overlay */}
            <div className="glass-shimmer absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 h-full flex flex-col">{children}</div>

            {/* Cyan Gradient Glows */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/5 blur-[60px]" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-500/5 blur-[60px]" />
        </div>
    );
};
