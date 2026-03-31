import { useState, useCallback } from 'react';

async function fallbackCopyText(text: string): Promise<void> {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
    } finally {
        document.body.removeChild(textarea);
    }
}

export const usePrompt = () => {
    const [prompt, setPrompt] = useState('');

    const copyToClipboard = useCallback(async (text: string) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            await fallbackCopyText(text);
        }
    }, []);

    return {
        prompt,
        setPrompt,
        copyToClipboard,
    };
};
