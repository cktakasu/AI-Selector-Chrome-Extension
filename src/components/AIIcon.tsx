import React from 'react';

interface AIIconProps {
    link: {
        id: string;
        name: string;
        icon?: string;
        url: string;
        isNew: boolean;
    };
    isSelected: boolean;
    isMultiMode: boolean;
    onToggle: (id: string) => void;
    onOpen: (url: string) => void;
}

export const AIIcon: React.FC<AIIconProps> = ({
    link,
    isSelected,
    isMultiMode,
    onToggle,
    onOpen,
}) => {
    return (
        <div className="relative group flex flex-col items-center">
            <button
                onClick={() => isMultiMode ? onToggle(link.id) : onOpen(link.url)}
                className={`relative flex flex-col items-center justify-center rounded-[10px] w-[42px] h-[42px] overflow-visible border ${
                    isSelected 
                    ? 'bg-sky-500/20 border-sky-400/50 scale-105' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 active:scale-95'
                }`}
                title={link.name}
            >
                {/* Badge - Updated design */}
                {link.isNew && !isSelected && (
                    <span className="absolute -top-1 -right-1 z-10 rounded-md px-1 py-0.5 bg-gradient-to-r from-sky-500 to-blue-600 text-[8px] scale-[0.75] font-black text-white uppercase tracking-wider shadow-lg border border-white/20 origin-top-right">
                        NEW
                    </span>
                )}

                {/* Checkmark for selection */}
                {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 z-10 bg-sky-400 rounded-full w-4 h-4 flex items-center justify-center shadow-lg border border-[#0a0f1e]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 text-[#0a0f1e]">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
                
                <div className="w-[34px] h-[34px] bg-slate-100 rounded-[6px] p-[2px] shadow-inner flex items-center justify-center">
                    <img
                        src={`/icons/${link.icon}`}
                        alt={link.name}
                        className={`w-full h-full object-contain ${isSelected ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'}`}
                        onError={(event) => {
                            event.currentTarget.parentElement!.hidden = true
                            event.currentTarget.parentElement!.nextElementSibling?.removeAttribute('hidden')
                        }}
                    />
                </div>
                <span hidden className="text-[11px] font-black text-white/40 uppercase tracking-tighter absolute">
                    {link.name.slice(0, 2)}
                </span>
            </button>
            <span className="mt-0.5 text-[8.5px] font-semibold text-white/30 tracking-tight text-center w-[44px] truncate px-0.5 leading-none">
                {link.name}
            </span>
        </div>
    );
};
