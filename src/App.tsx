import { useCallback, useMemo, useRef } from 'react'
import { links, Link } from './data/links'
import { AIIcon } from './components/AIIcon'
import { PromptInput } from './components/PromptInput'
import { usePrompt } from './hooks/usePrompt'
import { useOrder } from './hooks/useOrder'
import { useDragReorder } from './hooks/useDragReorder'
import pkg from '../package.json'

const chromeStorage = typeof chrome !== 'undefined' && chrome.storage ? chrome.storage : null
const chromeTabs = typeof chrome !== 'undefined' && chrome.tabs ? chrome.tabs : null
const ZERO_OFFSET = { x: 0, y: 0 }

const openUrl = (url: string) => {
    if (chromeTabs) {
        chromeTabs.create({ url });
    } else {
        window.open(url, '_blank');
    }
}

function App() {
    const { prompt, setPrompt, copyToClipboard } = usePrompt();
    const { order, updateOrder } = useOrder();
    const promptRef = useRef(prompt);
    promptRef.current = prompt;

    const allLinks = useMemo(() => {
        const knownIds = new Set(order);
        const orderedLinks = order
            .map(id => links.find(l => l.id === id))
            .filter((l): l is Link => l !== undefined);
        const newLinks = links.filter(l => !knownIds.has(l.id));
        return [...orderedLinks, ...newLinks];
    }, [order]);

    const { dragIndex, dragOffset, isDropping, shiftOffsets, checkWasDragged, handlePointerDown, containerRef } = useDragReorder(allLinks, updateOrder);

    const handleIconClick = useCallback(async (link: Link) => {
        if (checkWasDragged()) return;
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
    }, [copyToClipboard, checkWasDragged])

    return (
        <main className="flex flex-col items-center justify-center p-2 bg-[var(--bg-card)] rounded-2xl m-1 border border-[var(--border-subtle)] min-w-[240px] relative gap-2">
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary),transparent_70%)] rounded-2xl overflow-hidden" />

            <div ref={containerRef} className="grid grid-cols-5 gap-x-0.5 gap-y-0.5 w-max relative z-10">
                {allLinks.map((link, i) => (
                    <AIIcon
                        key={link.id}
                        link={link}
                        index={i}
                        isDragging={dragIndex === i}
                        isDropping={isDropping && dragIndex === i}
                        dragOffset={dragIndex === i ? dragOffset : ZERO_OFFSET}
                        shiftOffset={shiftOffsets[i]}
                        onOpen={handleIconClick}
                        onDragStart={handlePointerDown}
                    />
                ))}
            </div>

            <PromptInput prompt={prompt} setPrompt={setPrompt} />
            <span className="text-[9px] text-white/20 tracking-widest font-mono -mt-2 mb-0.5 select-none">v{pkg.version}</span>
        </main>
    )
}

export default App
