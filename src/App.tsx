import { useCallback, useRef } from 'react'
import { links, Link } from './data/links'
import { AIIcon } from './components/AIIcon'
import { PromptInput } from './components/PromptInput'
import { usePrompt } from './hooks/usePrompt'
import pkg from '../package.json'

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
        <main className="flex flex-col items-center justify-center p-2 bg-[var(--bg-card)] rounded-2xl m-1 border border-[var(--border-subtle)] min-w-[240px] relative overflow-hidden gap-2">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary),transparent_70%)]" />

            <div className="grid grid-cols-5 gap-x-0.5 gap-y-0.5 w-max relative z-10">
                {links.map((link) => (
                    <AIIcon
                        key={link.id}
                        link={link}
                        onOpen={handleIconClick}
                    />
                ))}
            </div>

            <PromptInput prompt={prompt} setPrompt={setPrompt} />
            <span className="text-[9px] text-white/20 tracking-widest font-mono -mt-2 mb-0.5 select-none">v{pkg.version}</span>
        </main>
    )
}

export default App
