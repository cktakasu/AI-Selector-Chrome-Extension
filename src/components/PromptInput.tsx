import React from 'react';

interface PromptInputProps {
    prompt: string;
    setPrompt: (value: string) => void;
    onSubmit?: () => void;
    isMultiSelectMode?: boolean;
    selectedCount?: number;
}

export const PromptInput: React.FC<PromptInputProps> = React.memo(({ prompt, setPrompt, onSubmit, isMultiSelectMode, selectedCount = 0 }) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
    }, [setPrompt]);

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            if (isMultiSelectMode && onSubmit) {
                e.preventDefault();
                onSubmit();
            }
        }
    }, [isMultiSelectMode, onSubmit]);

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
                onKeyDown={handleKeyDown}
                placeholder={isMultiSelectMode ? `Type instruction for ${selectedCount} services...` : "Type your instruction..."}
                rows={3}
                className={`w-full min-h-14 max-h-48 overflow-y-auto rounded-[18px] border px-[14px] py-3 text-[11px] text-white/[0.92] placeholder:text-white/[0.34] focus:outline-none resize-none leading-relaxed transition-colors duration-200 ${
                    isMultiSelectMode ? 'bg-[#3b475c] border-blue-400/30 focus:border-blue-400/60' : 'bg-[#47494f] border-white/[0.10] focus:border-white/[0.14]'
                }`}
            />
            <div className="absolute bottom-1.5 right-2 flex gap-1 pointer-events-none items-center">
                {isMultiSelectMode && (
                    <span className="text-[9px] font-medium text-blue-300/80 tracking-wide mr-2 flex items-center gap-1 animate-pulse-subtle">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2z"/></svg>
                        Enter to Send
                    </span>
                )}
                {prompt.length > 0 && (
                    <span className="text-[8px] font-semibold text-white/[0.24] uppercase tracking-[0.12em]">
                        {prompt.length} chars
                    </span>
                )}
            </div>
        </div>
    );
});
