interface NewBadgeProps {
    isVisible: boolean;
}

export function NewBadge({ isVisible }: NewBadgeProps) {
    if (!isVisible) return null;

    return (
        <span className="absolute -top-1 -right-1 flex h-auto w-auto z-10 pointer-events-none">
            <span className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-20"></span>
                <span className="relative inline-flex rounded-full px-1 py-0 bg-sky-500/40 backdrop-blur-sm text-[9px] font-black text-white/90 items-center justify-center uppercase tracking-tighter leading-none shadow-[0_2px_4px_rgba(0,0,0,0.2)] border-[1px] border-white/30 transform scale-90 origin-top-right">
                    New
                </span>
            </span>
        </span>
    );
}
