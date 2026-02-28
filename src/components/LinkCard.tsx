import { useState, memo, useCallback } from 'react';
import type { Link } from '../types';
import { isRecentlyUpdated } from '../utils/date';
import { NewBadge } from './NewBadge';

interface LinkCardProps {
    link: Link;
    index: number;
    remoteUpdatedAt: string | null;
    isLoading: boolean;
}

export const LinkCard = memo(function LinkCard({ link, index, remoteUpdatedAt, isLoading }: LinkCardProps) {
    const [imgError, setImgError] = useState(false);

    const handleClick = useCallback(() => {
        if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
            chrome.tabs.create({ url: link.url });
        } else {
            window.open(link.url, '_blank');
        }
    }, [link.url]);

    // リモートデータを優先し、なければローカルの日付を使用
    const effectiveDate = remoteUpdatedAt || link.updatedAt;

    // ロード中はバッジ判定を保留し、ロード完了後に isRecentlyUpdated で判定
    const isNew = !isLoading && isRecentlyUpdated(effectiveDate, 5);

    return (
        <div
            className="animate-pop-in opacity-0 fill-mode-forwards relative hover:z-10"
            style={{ animationDelay: `${index * 15}ms` }}
        >
            <button
                onClick={handleClick}
                className="relative flex items-center justify-center p-0 bg-transparent border-none shadow-none outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-full hover:scale-125 hover:brightness-110 active:scale-95 transition-all duration-300 ease-out group w-[34px] h-[34px] cursor-pointer"
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
        </div>
    )
});
