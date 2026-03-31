import { useCallback, useMemo, useRef } from 'react'
import { links, Link } from './data/links'
import { AIIcon } from './components/AIIcon'
import { PromptInput } from './components/PromptInput'
import { usePrompt } from './hooks/usePrompt'
import { useOrder } from './hooks/useOrder'
import { useDragReorder } from './hooks/useDragReorder'
import { useMultiSelect } from './hooks/useMultiSelect'

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
    const { selectedIds, toggleSelect, clearSelection, isMultiSelectMode } = useMultiSelect();
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

    const handleMultiSubmit = useCallback(async () => {
        const p = promptRef.current;
        if (!p || !isMultiSelectMode) return;
        await copyToClipboard(p);

        const selectedLinks = allLinks.filter(l => selectedIds.has(l.id));
        for (const link of selectedLinks) {
            if (link.searchUrl) {
                openUrl(`${link.searchUrl}${encodeURIComponent(p)}`);
            } else {
                if (chromeStorage) {
                    await chromeStorage.local.set({
                        pendingPrompt: p,
                        timestamp: Date.now()
                    });
                }
                openUrl(link.url);
            }
        }
        clearSelection();
        setPrompt('');
    }, [isMultiSelectMode, selectedIds, allLinks, copyToClipboard, clearSelection, setPrompt]);

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
                        isSelected={selectedIds.has(link.id)}
                        isDragging={dragIndex === i}
                        isDropping={isDropping && dragIndex === i}
                        dragOffset={dragIndex === i ? dragOffset : ZERO_OFFSET}
                        shiftOffset={shiftOffsets[i]}
                        onOpen={handleIconClick}
                        onSelect={() => toggleSelect(link.id)}
                        onDragStart={handlePointerDown}
                    />
                ))}
            </div>

            <PromptInput 
                prompt={prompt} 
                setPrompt={setPrompt} 
                onSubmit={handleMultiSubmit}
                isMultiSelectMode={isMultiSelectMode}
                selectedCount={selectedIds.size}
            />
        </main>
    )
}

export default App
