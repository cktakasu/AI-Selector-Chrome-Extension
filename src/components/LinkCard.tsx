import { useState } from 'react'
import type { Link } from '../data/links'

export function LinkCard({ link, index }: { link: Link; index: number }) {
    const [imgError, setImgError] = useState(false);

    const handleClick = () => {
        if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
            chrome.tabs.create({ url: link.url });
        } else {
            window.open(link.url, '_blank');
        }
    };

    return (
        <button
            onClick={handleClick}
            className="relative flex items-center justify-center p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 hover:scale-110 hover:-translate-y-1 transition-all duration-200 border border-slate-200 group w-12 h-12 cursor-pointer shadow-sm animate-slide-in opacity-0 fill-mode-forwards will-change-transform"
            style={{ animationDelay: `${index * 50}ms` }}
            title={link.name}
            aria-label={`Open ${link.name}`}
        >
            {link.isNew && (
                <span className="absolute -top-1 -right-1 flex h-4 w-auto px-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-auto px-1 bg-sky-500 text-[8px] font-bold text-white items-center justify-center uppercase tracking-tighter">
                        New
                    </span>
                </span>
            )}
            <div className="w-8 h-8 rounded-md transition-colors flex items-center justify-center">
                {!imgError ? (
                    <img
                        src={`/icons/${link.icon}`}
                        alt={link.name}
                        loading="lazy"
                        className="w-full h-full object-contain drop-shadow-none"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <span className="text-xs font-bold text-slate-400">
                        {link.name.substring(0, 2)}
                    </span>
                )}
            </div>
        </button>
    )
}
