import React from 'react';
import { Link } from '../data/links';

interface AIIconProps {
    link: Link;
    onOpen: (link: Link) => void;
}

export const AIIcon: React.FC<AIIconProps> = React.memo(({ link, onOpen }) => {
    const [iconError, setIconError] = React.useState(false);

    return (
        <div className="relative group flex flex-col items-center">
            <button
                onClick={() => onOpen(link)}
                className="relative flex flex-col items-center justify-center rounded-[10px] w-[42px] h-[42px] border bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 active:scale-95"
                title={link.id.toUpperCase()}
            >
                <div className="w-[34px] h-[34px] bg-white rounded-[6px] p-[2px] shadow-inner flex items-center justify-center overflow-hidden">
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
            <span className="mt-0.5 text-[8px] font-semibold text-white/90 tracking-tight text-center w-[58px] leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                {link.name}
            </span>
        </div>
    );
});
