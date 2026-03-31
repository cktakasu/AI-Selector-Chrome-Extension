import { useCallback, useMemo, useRef } from 'react'
import { links, Link } from './data/links'
import { AIIcon } from './components/AIIcon'
import { PromptInput } from './components/PromptInput'
import { usePrompt } from './hooks/usePrompt'
import { useOrder } from './hooks/useOrder'
import { useDragReorder } from './hooks/useDragReorder'

const chromeStorage = typeof chrome !== 'undefined' && chrome.storage ? chrome.storage : null
const chromeTabs = typeof chrome !== 'undefined' && chrome.tabs ? chrome.tabs : null
const ZERO_OFFSET = { x: 0, y: 0 }
const LINK_BY_ID = new Map(links.map((link) => [link.id, link] as const))

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
            .map(id => LINK_BY_ID.get(id))
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
        <main className="app-shell flex flex-col items-center justify-center min-w-[284px] relative gap-2">
            <div ref={containerRef} className="grid grid-cols-5 gap-x-1 gap-y-2 w-max relative z-10">
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
            <span className="text-[9px] text-white/30 tracking-[0.12em] font-mono mt-0.5 select-none relative z-10">v{__APP_VERSION__}</span>
        </main>
    )
}

export default App
