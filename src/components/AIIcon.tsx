import React from 'react';
import { Link } from '../data/links';

interface Offset { x: number; y: number }

interface AIIconProps {
    link: Link;
    index: number;
    isSelected?: boolean;
    isDragging: boolean;
    isDropping: boolean;
    dragOffset: Offset;
    shiftOffset?: Offset;
    onOpen: (link: Link) => void;
    onSelect?: (link: Link) => void;
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
    link, index, isSelected, isDragging, isDropping, dragOffset, shiftOffset,
    onOpen, onSelect, onDragStart,
}) => {
    const [iconError, setIconError] = React.useState(false);
    const style = computeStyle(isDragging, isDropping, dragOffset, shiftOffset);
    const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
        onDragStart(index, e);
    }, [index, onDragStart]);
    const handleClick = React.useCallback((e: React.MouseEvent) => {
        if ((e.ctrlKey || e.metaKey) && onSelect) {
            onSelect(link);
            return;
        }
        onOpen(link);
    }, [link, onOpen, onSelect]);
    const handleIconError = React.useCallback(() => {
        setIconError(true);
    }, []);

    return (
        <div className="relative group flex flex-col items-center" style={style}>
            <button
                onPointerDown={handlePointerDown}
                onClick={handleClick}
                className={`relative flex flex-col items-center justify-center rounded-[13px] w-[48px] h-[48px] border bg-white/[0.04] hover:bg-white/[0.07] active:scale-95 cursor-grab active:cursor-grabbing transition-all duration-150 ${
                    isSelected ? 'border-blue-400/60 bg-blue-500/10 scale-[1.02] shadow-[0_0_12px_rgba(59,130,246,0.3)]' : 'border-white/[0.08]'
                }`}
                title={link.name}
            >
                {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md z-20 border border-white/20">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.33333 2.5L3.75 7.08333L1.66667 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                )}
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
