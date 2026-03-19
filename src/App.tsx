import { useCallback, useRef } from 'react'
import { links, Link } from './data/links'
import { AIIcon } from './components/AIIcon'
import { PromptInput } from './components/PromptInput'
import { usePrompt } from './hooks/usePrompt'

const chromeStorage = typeof chrome !== 'undefined' && chrome.storage ? chrome.storage : null
const chromeTabs = typeof chrome !== 'undefined' && chrome.tabs ? chrome.tabs : null

const openUrl = (url: string) => {
    if (chromeTabs) {
        chromeTabs.create({ url });
    } else {
        window.open(url, '_blank');
    }
}

function App() {
    const { prompt, setPrompt, copyToClipboard } = usePrompt();
    const promptRef = useRef(prompt);
    promptRef.current = prompt;

    const handleIconClick = useCallback(async (link: Link) => {
        const p = promptRef.current;
        await copyToClipboard(p);

        if (p && link.searchUrl) {
            openUrl(`${link.searchUrl}${encodeURIComponent(p)}`);
            return;
        }
        if (p && chromeStorage) {
            await chromeStorage.local.set({
                pendingPrompt: p,
                timestamp: Date.now()
            });
        }
        openUrl(link.url);
    }, [copyToClipboard])

    return (
        <main className="flex flex-col items-center justify-center p-3 bg-[var(--bg-card)] rounded-2xl m-1 border border-[var(--border-subtle)] min-w-[260px] relative overflow-hidden gap-3">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary),transparent_70%)]" />

            <div className="grid grid-cols-5 gap-x-1.5 gap-y-2 w-max p-0.5 relative z-10">
                {links.map((link) => (
                    <AIIcon
                        key={link.id}
                        link={link}
                        onOpen={handleIconClick}
                    />
                ))}
            </div>

            <PromptInput prompt={prompt} setPrompt={setPrompt} />
        </main>
    )
}

export default App
