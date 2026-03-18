import React from 'react';

interface AIIconProps {
    link: {
        id: string;
        name: string;
        icon?: string;
        url: string;
        searchUrl?: string; // Added to match processed items
        isNew: boolean;
    };
    onOpen: (link: any) => void;
}

export const AIIcon: React.FC<AIIconProps> = React.memo(({ link, onOpen }) => {
    const [iconError, setIconError] = React.useState(false);

    return (
        <div className="relative group flex flex-col items-center">
            <button
                onClick={() => onOpen(link)}
                className="relative flex flex-col items-center justify-center rounded-[10px] w-[42px] h-[42px] overflow-visible border bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 active:scale-95"
                title={link.id.toUpperCase()}
            >
                {/* NEW badge */}
                {link.isNew && (
                    <span className="absolute -top-1 -right-1 z-10 rounded-md px-1 py-0.5 bg-gradient-to-r from-sky-500 to-blue-600 text-[8px] scale-[0.75] font-black text-white uppercase tracking-wider shadow-lg border border-white/20 origin-top-right">
                        NEW
                    </span>
                )}

                <div className="w-[34px] h-[34px] bg-slate-100 rounded-[6px] p-[2px] shadow-inner flex items-center justify-center overflow-hidden">
                    {!iconError ? (
                        <img
                            src={`/icons/${link.icon}`}
                            alt={link.name}
                            loading="lazy"
                            className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-200"
                            onError={() => setIconError(true)}
                        />
                    ) : (
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                            {link.name.slice(0, 2)}
                        </span>
                    )}
                </div>
            </button>
            <span className="mt-0.5 text-[8.5px] font-semibold text-white/30 tracking-tight text-center w-[44px] truncate px-0.5 leading-none">
                {link.name}
            </span>
        </div>
    );
});
