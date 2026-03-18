import { useMemo, useCallback } from 'react'
import { links } from './data/links'
import modelUpdates from '../public/model_updates.json'
import { AIIcon } from './components/AIIcon'
import { PromptInput } from './components/PromptInput'
import { usePrompt } from './hooks/usePrompt'

const isNew = (date?: string | null) =>
    !!date && Date.now() - new Date(date).getTime() < 5 * 24 * 60 * 60 * 1000

const getProcessedItems = () => links.map((link) => ({
    ...link,
    updatedAt: (modelUpdates as Record<string, string>)[link.id] || link.updatedAt,
    isNew: isNew((modelUpdates as Record<string, string>)[link.id] || link.updatedAt),
}))

const openUrl = (url: string) => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url });
    } else {
        window.open(url, '_blank');
    }
}

function App() {
    const { prompt, setPrompt, copyToClipboard } = usePrompt();
    const rawItems = useMemo(() => getProcessedItems(), [])

    const handleIconClick = useCallback(async (link: typeof rawItems[0]) => {
        await copyToClipboard(prompt);

        const url = prompt && link.searchUrl
            ? `${link.searchUrl}${encodeURIComponent(prompt)}`
            : link.url
        openUrl(url)
    }, [prompt, copyToClipboard])

    return (
        <main className="flex flex-col items-center justify-center p-3 bg-[var(--bg-card)] rounded-2xl m-1 border border-[var(--border-subtle)] min-w-[260px] relative overflow-hidden gap-3">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary),transparent_70%)]" />

            {/* Grid - Now at the top */}
            <div className="grid grid-cols-5 gap-x-1.5 gap-y-2 w-max p-0.5 relative z-10">
                {rawItems.map((link) => (
                    <AIIcon
                        key={link.id}
                        link={link}
                        onOpen={handleIconClick}
                    />
                ))}
            </div>

            {/* Prompt Input - Moved below icons */}
            <PromptInput prompt={prompt} setPrompt={setPrompt} />
        </main>
    )
}

export default App
