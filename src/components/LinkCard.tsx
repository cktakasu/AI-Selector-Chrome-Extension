import { useState, useEffect } from 'react'
import type { Link } from '../data/links'

export function LinkCard({ link, index }: { link: Link; index: number }) {
    const [imgError, setImgError] = useState(false);
    const [remoteUpdatedAt, setRemoteUpdatedAt] = useState<string | null>(null);

    useEffect(() => {
        // GitHub Pagesなどでホストされる予定のJSONをフェッチ
        // 開発環境でも public/model_updates.json が参照される
        fetch('/model_updates.json')
            .then(res => res.json())
            .then(data => {
                if (data[link.id]) {
                    setRemoteUpdatedAt(data[link.id]);
                }
            })
            .catch(() => {
                // 通信エラー時は静かにフォールバック（既存の動作を継続）
                console.log('Using local or no update info for', link.id);
            });
    }, [link.id]);

    const handleClick = () => {
        if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
            chrome.tabs.create({ url: link.url });
        } else {
            window.open(link.url, '_blank');
        }
    };

    // リモートデータを優先し、なければローカルの日付を使用
    const effectiveDate = remoteUpdatedAt || link.updatedAt;
    const isNew = effectiveDate ? (Date.now() - new Date(effectiveDate).getTime()) < 10 * 24 * 60 * 60 * 1000 : false;

    return (
        <button
            onClick={handleClick}
            className="relative flex items-center justify-center p-0 bg-transparent border-none shadow-none outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-full hover:scale-110 hover:brightness-110 active:scale-95 transition-all duration-300 ease-out group w-[32px] h-[32px] cursor-pointer animate-slide-in opacity-0 fill-mode-forwards"
            style={{ animationDelay: `${index * 30}ms` }}
            title={link.name}
            aria-label={`Open ${link.name}`}
        >
            {isNew && (
                <span className="absolute -top-2 -right-0.5 flex h-auto w-auto z-10 pointer-events-none">
                    <span className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-40"></span>
                        <span className="relative inline-flex rounded-full px-1.5 py-0.5 bg-sky-500 text-[10px] font-black text-white items-center justify-center uppercase tracking-tighter leading-none shadow-[0_2px_12px_rgba(14,165,233,0.7)] border-[1px] border-white/40">
                            New
                        </span>
                    </span>
                </span>
            )}
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
