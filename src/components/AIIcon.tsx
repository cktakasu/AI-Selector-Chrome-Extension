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
const DRAG_STYLE: React.CSSProperties = {
    zIndex: 50,
    position: 'relative',
    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.20))',
};
const DROP_STYLE: React.CSSProperties = {
    transition: TRANSITION_DROP,
    zIndex: 50,
    position: 'relative',
};

function computeStyle(
    isDragging: boolean,
    isDropping: boolean,
    dragOffset: Offset,
    shiftOffset?: Offset,
): React.CSSProperties | undefined {
    if (isDragging && !isDropping) {
        return {
            ...DRAG_STYLE,
            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(1.08)`,
        };
    }
    if (isDragging && isDropping) {
        return {
            ...DROP_STYLE,
            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
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
    const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
        onDragStart(index, e);
    }, [index, onDragStart]);
    const handleClick = React.useCallback(() => {
        onOpen(link);
    }, [link, onOpen]);
    const handleIconError = React.useCallback(() => {
        setIconError(true);
    }, []);

    return (
        <div className="relative group flex flex-col items-center" style={style}>
            <button
                onPointerDown={handlePointerDown}
                onClick={handleClick}
                className="relative flex flex-col items-center justify-center rounded-[13px] w-[48px] h-[48px] border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] active:scale-95 cursor-grab active:cursor-grabbing transition-[background-color] duration-150"
                title={link.name}
            >
                <div className="w-[36px] h-[36px] rounded-[10px] bg-[#eef0f3] p-[3px] flex items-center justify-center overflow-hidden">
                    {!iconError ? (
                        <img
                            src={`/icons/${link.icon}`}
                            alt={link.name}
                            draggable={false}
                            loading="lazy"
                            className="w-full h-full object-contain opacity-100"
                            onError={handleIconError}
                        />
                    ) : (
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                            {link.name.slice(0, 2)}
                        </span>
                    )}
                </div>
            </button>
            <span className="mt-1 text-[9px] font-semibold text-white/[0.82] text-center w-[52px] leading-[1.05] line-clamp-2">
                {link.name}
            </span>
        </div>
    );
});
