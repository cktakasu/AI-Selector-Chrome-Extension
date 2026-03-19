import React from 'react';

interface PromptInputProps {
    prompt: string;
    setPrompt: (value: string) => void;
}

export const PromptInput: React.FC<PromptInputProps> = React.memo(({ prompt, setPrompt }) => {
    return (
        <div className="w-full relative z-10 mb-2">
            <textarea
                autoFocus
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your instruction..."
                className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[11px] text-white placeholder-white/20 focus:outline-none focus:border-sky-500/30 resize-none h-16 shadow-inner leading-relaxed"
            />
            {prompt.length > 0 && (
                <div className="absolute bottom-1.5 right-2 flex gap-1 pointer-events-none">
                    <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest">
                        {prompt.length} chars
                    </span>
                </div>
            )}
        </div>
    );
});
