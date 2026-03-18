import { useState, useCallback } from 'react';

export const usePrompt = () => {
    const [prompt, setPrompt] = useState('');

    const copyToClipboard = useCallback(async (text: string) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }, []);

    return {
        prompt,
        setPrompt,
        copyToClipboard,
    };
};
