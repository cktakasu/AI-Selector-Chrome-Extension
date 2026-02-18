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
            className="relative flex items-center justify-center p-0 bg-transparent border-none shadow-none outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-full hover:scale-110 hover:brightness-110 active:scale-95 transition-all duration-300 ease-out group w-[32px] h-[32px] cursor-pointer animate-slide-in opacity-0 fill-mode-forwards"
            style={{ animationDelay: `${index * 50}ms` }}
            title={link.name}
            aria-label={`Open ${link.name}`}
        >
            <div className="w-full h-full flex items-center justify-center">
                {!imgError ? (
                    <img
                        src={`/icons/${link.icon}`}
                        alt={link.name}
                        loading="lazy"
                        className="w-[28px] h-[28px] object-contain"
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
