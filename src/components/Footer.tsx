import React from 'react';

interface FooterProps {
    isMultiMode: boolean;
    onToggleMode: () => void;
}

export const Footer: React.FC<FooterProps> = ({ isMultiMode, onToggleMode }) => {
    return (
        <div className="flex items-center justify-between w-full mt-2 pt-2 px-1 relative z-10 border-t border-white/5">
            <div className="flex flex-col opacity-50 text-white hover:opacity-100">
                <h1 className="text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1">
                    AI Selector
                </h1>
                <div className="h-0.5 w-4 bg-sky-500/50 rounded-full" />
            </div>
            
            <button
                onClick={onToggleMode}
                className={`text-[9px] font-bold px-2 py-1 rounded-md border flex items-center gap-2 group ${
                    isMultiMode 
                    ? 'bg-sky-500/10 border-sky-500/50 text-sky-400' 
                    : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10 hover:text-white/50'
                }`}
            >
                <div className={`w-1 h-1 rounded-full ${isMultiMode ? 'bg-sky-400' : 'bg-white/20'}`} />
                {isMultiMode ? 'MULTI' : 'SINGLE'}
            </button>
        </div>
    );
};
