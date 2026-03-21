import React from 'react';
import { Link } from '../data/links';
import type { SwapAnimation } from '../hooks/useDragReorder';

interface AIIconProps {
    link: Link;
    index: number;
    isDragging: boolean;
    dragOffset: { x: number; y: number };
    liveOverIndex: number | null;
    liveOverOffset: { x: number; y: number };
    swapAnimation: SwapAnimation | null;
    onOpen: (link: Link) => void;
    onDragStart: (index: number, e: React.PointerEvent) => void;
}

const TRANSITION_FAST = 'transform 150ms ease-out';
const TRANSITION_SWAP = 'transform 200ms ease-out';

function computeStyle(
    index: number,
    isDragging: boolean,
    dragOffset: { x: number; y: number },
    liveOverIndex: number | null,
    liveOverOffset: { x: number; y: number },
    swapAnimation: SwapAnimation | null,
): React.CSSProperties | undefined {
    if (isDragging) {
        return {
            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(1.08)`,
            zIndex: 50,
            position: 'relative',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
        };
    }
    if (swapAnimation) {
        const isFrom = index === swapAnimation.fromIndex;
        const isTo = index === swapAnimation.toIndex;
        if (isFrom || isTo) {
            const offset = isFrom ? swapAnimation.fromOffset : swapAnimation.toOffset;
            return {
                transform: `translate(${offset.x}px, ${offset.y}px)`,
                transition: TRANSITION_SWAP,
                zIndex: 40,
                position: 'relative',
            };
        }
    }
    if (index === liveOverIndex) {
        return {
            transform: `translate(${liveOverOffset.x}px, ${liveOverOffset.y}px)`,
            transition: TRANSITION_FAST,
            zIndex: 30,
            position: 'relative',
        };
    }
    if (liveOverIndex !== null) {
        return { transform: 'translate(0, 0)', transition: TRANSITION_FAST };
    }
    return undefined;
}

export const AIIcon: React.FC<AIIconProps> = React.memo(({
    link, index, isDragging, dragOffset,
    liveOverIndex, liveOverOffset, swapAnimation,
    onOpen, onDragStart,
}) => {
    const [iconError, setIconError] = React.useState(false);
    const style = computeStyle(index, isDragging, dragOffset, liveOverIndex, liveOverOffset, swapAnimation);

    return (
        <div className="relative group flex flex-col items-center" style={style}>
            <button
                onPointerDown={(e) => onDragStart(index, e)}
                onClick={() => onOpen(link)}
                className="relative flex flex-col items-center justify-center rounded-[8px] w-[38px] h-[38px] border bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 active:scale-95 cursor-grab active:cursor-grabbing"
                title={link.name}
            >
                <div className="w-[30px] h-[30px] bg-white rounded-[5px] p-[2px] shadow-inner flex items-center justify-center overflow-hidden">
                    {!iconError ? (
                        <img
                            src={`/icons/${link.icon}`}
                            alt={link.name}
                            draggable={false}
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
            <span className="mt-0.5 text-[9px] font-bold text-white/90 tracking-tight text-center w-[42px] leading-tight line-clamp-2">
                {link.name}
            </span>
        </div>
    );
});
