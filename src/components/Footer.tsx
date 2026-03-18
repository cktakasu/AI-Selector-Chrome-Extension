import React from 'react';

export const Footer: React.FC = () => {
    return (
        <div className="flex items-center justify-center w-full mt-2 pt-2 px-1 relative z-10 border-t border-white/5">
            <div className="flex flex-col items-center opacity-50 text-white hover:opacity-100">
                <h1 className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1">
                    AI Selector
                </h1>
                <div className="h-0.5 w-4 bg-sky-500/50 rounded-full" />
            </div>
        </div>
    );
};
