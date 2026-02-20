import { useState } from 'react';
import type { Link } from '../types';
import { isRecentlyUpdated } from '../utils/date';
import { NewBadge } from './NewBadge';

interface LinkCardProps {
    link: Link;
    index: number;
    remoteUpdatedAt: string | null;
    isLoading: boolean;
}

export function LinkCard({ link, index, remoteUpdatedAt, isLoading }: LinkCardProps) {
    const [imgError, setImgError] = useState(false);

    const handleClick = () => {
        if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
            chrome.tabs.create({ url: link.url });
        } else {
            window.open(link.url, '_blank');
        }
    };

    // リモートデータを優先し、なければローカルの日付を使用
    const effectiveDate = remoteUpdatedAt || link.updatedAt;

    // ロード中はバッジ判定を保留し、ロード完了後に isRecentlyUpdated で判定
    const isNew = !isLoading && isRecentlyUpdated(effectiveDate, 5);

    return (
        <button
            onClick={handleClick}
            className="relative flex items-center justify-center p-0 bg-transparent border-none shadow-none outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-full hover:scale-110 hover:brightness-110 active:scale-95 transition-all duration-300 ease-out group w-[28px] h-[28px] cursor-pointer animate-pop-in opacity-0 fill-mode-forwards"
            style={{ animationDelay: `${index * 15}ms` }}
            title={link.name}
            aria-label={`Open ${link.name}`}
        >
            <NewBadge isVisible={isNew} />
            <div className="w-full h-full flex items-center justify-center">
                {!imgError ? (
                    <img
                        src={`/icons/${link.icon}`}
                        alt={link.name}
                        loading="lazy"
                        className="w-[24px] h-[24px] object-contain"
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
