import React from 'react';
import { Link } from '../data/links';

interface Offset { x: number; y: number }

interface AIIconProps {
    link: Link;
    index: number;
    isDragging: boolean;
    isDropping: boolean;
    dragOffset: Offset;
    shiftOffset?: Offset;
    onOpen: (link: Link) => void;
    onDragStart: (index: number, e: React.PointerEvent) => void;
}

const TRANSITION_SHIFT = 'transform 150ms ease-out';
const TRANSITION_DROP = 'transform 200ms ease-out';

function computeStyle(
    isDragging: boolean,
    isDropping: boolean,
    dragOffset: Offset,
    shiftOffset?: Offset,
): React.CSSProperties | undefined {
    if (isDragging && !isDropping) {
        return {
            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(1.08)`,
            zIndex: 50,
            position: 'relative',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
        };
    }
    if (isDragging && isDropping) {
        return {
            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
            transition: TRANSITION_DROP,
            zIndex: 50,
            position: 'relative',
        };
    }
    if (shiftOffset) {
        return {
            transform: `translate(${shiftOffset.x}px, ${shiftOffset.y}px)`,
            transition: TRANSITION_SHIFT,
        };
    }
    return undefined;
}

export const AIIcon: React.FC<AIIconProps> = React.memo(({
    link, index, isDragging, isDropping, dragOffset, shiftOffset,
    onOpen, onDragStart,
}) => {
    const [iconError, setIconError] = React.useState(false);
    const style = computeStyle(isDragging, isDropping, dragOffset, shiftOffset);

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
