import React from 'react';

interface PromptInputProps {
    prompt: string;
    setPrompt: (value: string) => void;
    onSubmit?: () => void;
    isMultiSelectMode?: boolean;
    selectedCount?: number;
    enterNewline?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = React.memo(({ prompt, setPrompt, onSubmit, isMultiSelectMode, selectedCount = 0, enterNewline = false }) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
    }, [setPrompt]);

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Enterキーのみ（Shiftなし）かつ改行モードが無効な場合に送信
        if (e.key === 'Enter' && !e.shiftKey && !enterNewline) {
            if (onSubmit) {
                e.preventDefault();
                onSubmit();
            }
        }
    }, [onSubmit, enterNewline]);

    React.useLayoutEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        
        // 高さを一度リセットしてから再計算することで、文字削除時の縮小を可能にする
        textarea.style.height = 'auto';
        if (prompt) {
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
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
                className={`w-full min-h-14 max-h-48 overflow-y-auto rounded-[18px] border px-[14px] py-3 text-[11px] text-slate-800 dark:text-white/[0.92] placeholder:text-slate-400 dark:placeholder:text-white/[0.34] focus:outline-none resize-none leading-relaxed transition-colors duration-200 ${
                    isMultiSelectMode ? 'bg-blue-50/50 dark:bg-[#3b475c] border-blue-400/40 dark:border-blue-400/30 focus:border-blue-500/60 dark:focus:border-blue-400/60' : 'bg-slate-50 dark:bg-[#47494f] border-slate-200 dark:border-white/[0.10] focus:border-slate-300 dark:focus:border-white/[0.14]'
                }`}
            />
            <div className="absolute bottom-1.5 right-2 flex gap-1 pointer-events-none items-center">
                {isMultiSelectMode && (
                    <span className="text-[9px] font-medium text-blue-500 dark:text-blue-300/80 tracking-wide mr-2 flex items-center gap-1 animate-pulse-subtle">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2z"/></svg>
                        Enter to Send
                    </span>
                )}
                {prompt.length > 0 && (
                    <span className="text-[8px] font-semibold text-slate-400 dark:text-white/[0.24] uppercase tracking-[0.12em]">
                        {prompt.length} chars
                    </span>
                )}
            </div>
        </div>
    );
});
