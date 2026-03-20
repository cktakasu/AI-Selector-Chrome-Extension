import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from '../data/links';

interface AIIconProps {
    link: Link;
    onOpen: (link: Link) => void;
}

export const AIIcon: React.FC<AIIconProps> = React.memo(({ link, onOpen }) => {
    const [iconError, setIconError] = React.useState(false);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 10 : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} className="relative group flex flex-col items-center">
            <button
                {...listeners}
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
