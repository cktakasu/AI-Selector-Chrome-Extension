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
            className="relative flex items-center justify-center p-0 bg-transparent border-none shadow-none outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg hover:scale-[1.025] hover:-translate-y-0.5 transition-all duration-200 group w-[32px] h-[32px] cursor-pointer animate-slide-in opacity-0 fill-mode-forwards"
            style={{ animationDelay: `${index * 50}ms` }}
            title={link.name}
            aria-label={`Open ${link.name}`}
        >
            {link.isNew && (
                <span className="absolute -top-2 -right-2 flex h-[19px] w-auto px-0.5 z-10">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-[19px] w-auto px-2 bg-sky-500 text-[11px] font-bold text-white items-center justify-center uppercase tracking-tighter">
                        New
                    </span>
                </span>
            )}
            <div className="w-full h-full flex items-center justify-center">
                {!imgError ? (
                    <img
                        src={`/icons/${link.icon}`}
                        alt={link.name}
                        loading="lazy"
                        className="w-[20px] h-[20px] object-contain"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <span className="text-[10px] font-bold text-slate-400">
                        {link.name.substring(0, 2)}
                    </span>
                )}
            </div>
        </button>
    )
}
