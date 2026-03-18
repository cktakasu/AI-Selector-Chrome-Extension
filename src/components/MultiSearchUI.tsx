import React from 'react';

interface MultiSearchUIProps {
    prompt: string;
    setPrompt: (value: string) => void;
    selectedCount: number;
    onSend: () => void;
}

export const MultiSearchUI: React.FC<MultiSearchUIProps> = ({
    prompt,
    setPrompt,
    selectedCount,
    onSend,
}) => {
    const isDisabled = !prompt || selectedCount === 0;

    return (
        <div className="w-full relative z-10 mt-3 mb-4">
            <div className="flex flex-col gap-3 p-1">
                <div className="relative group">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Type your instruction..."
                        className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[11px] text-white placeholder-white/20 focus:outline-none focus:border-sky-500/30 resize-none h-24 shadow-inner leading-relaxed"
                    />
                    <div className="absolute bottom-2 right-2 flex gap-1 pointer-events-none">
                        <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest">
                            {prompt.length} chars
                        </span>
                    </div>
                </div>

                <button
                    onClick={onSend}
                    disabled={isDisabled}
                    className={`w-full py-3 rounded-xl text-[11px] font-black tracking-[0.1em] overflow-hidden relative group/btn ${
                        !isDisabled
                        ? 'text-white cursor-pointer active:scale-95'
                        : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'
                    }`}
                >
                    {!isDisabled && (
                        <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-blue-600 to-sky-500 opacity-100 group-hover/btn:opacity-90" />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        ACTIVATE {selectedCount} AGENT{selectedCount > 1 ? 'S' : ''}
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M10.21 14.77a.75.75 0 01.02-1.06L14.168 10 10.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                    </span>
                </button>
                {!isDisabled && (
                    <p className="text-[9px] text-center text-white/30 font-medium tracking-tight h-3">
                        Prompt will be copied and opened in {selectedCount} tabs
                    </p>
                )}
            </div>
        </div>
    );
};
