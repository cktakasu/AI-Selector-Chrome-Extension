import React from 'react';

interface PromptInputProps {
    prompt: string;
    setPrompt: (value: string) => void;
}

export const PromptInput: React.FC<PromptInputProps> = React.memo(({ prompt, setPrompt }) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
    }, [setPrompt]);

    React.useLayoutEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        if (!prompt) {
            textarea.style.height = '';
            return;
        }

        textarea.style.height = '0px';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, [prompt]);

    return (
        <div className="w-full relative z-10">
            <textarea
                ref={textareaRef}
                value={prompt}
                onChange={handleChange}
                placeholder="Type your instruction..."
                rows={3}
                className="w-full min-h-14 max-h-48 overflow-y-auto rounded-[18px] border border-white/[0.10] bg-[#47494f] px-[14px] py-3 text-[11px] text-white/[0.92] placeholder:text-white/[0.34] focus:outline-none focus:border-white/[0.14] resize-none leading-relaxed"
            />
            {prompt.length > 0 && (
                <div className="absolute bottom-1.5 right-2 flex gap-1 pointer-events-none">
                    <span className="text-[8px] font-semibold text-white/[0.24] uppercase tracking-[0.12em]">
                        {prompt.length} chars
                    </span>
                </div>
            )}
        </div>
    );
});
