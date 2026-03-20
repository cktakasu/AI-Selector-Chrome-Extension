import { useCallback, useRef } from 'react'
import { links, Link } from './data/links'
import { AIIcon } from './components/AIIcon'
import { PromptInput } from './components/PromptInput'
import { usePrompt } from './hooks/usePrompt'
import { useOrder } from './hooks/useOrder'
import pkg from '../package.json'
import {
    DndContext,
    closestCenter,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    rectSwappingStrategy,
} from '@dnd-kit/sortable'

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
    const { order, updateOrder } = useOrder();
    const promptRef = useRef(prompt);
    promptRef.current = prompt;
    const isDraggingRef = useRef(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    );

    const orderedLinks = order
        .map(id => links.find(l => l.id === id))
        .filter((l): l is Link => l !== undefined);
    const knownIds = new Set(order);
    const newLinks = links.filter(l => !knownIds.has(l.id));
    const allLinks = [...orderedLinks, ...newLinks];

    const handleDragStart = (_event: DragStartEvent) => {
        isDraggingRef.current = true;
    };

    const handleDragEnd = (event: DragEndEvent) => {
        isDraggingRef.current = false;
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = allLinks.findIndex(l => l.id === active.id);
            const newIndex = allLinks.findIndex(l => l.id === over.id);
            const swapped = [...allLinks];
            [swapped[oldIndex], swapped[newIndex]] = [swapped[newIndex], swapped[oldIndex]];
            updateOrder(swapped.map(l => l.id));
        }
    };

    const handleIconClick = useCallback(async (link: Link) => {
        if (isDraggingRef.current) return;
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
        <main className="flex flex-col items-center justify-center p-2 bg-[var(--bg-card)] rounded-2xl m-1 border border-[var(--border-subtle)] min-w-[240px] relative gap-2">
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary),transparent_70%)] rounded-2xl overflow-hidden" />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={() => { isDraggingRef.current = false; }}
            >
                <SortableContext items={allLinks.map(l => l.id)} strategy={rectSwappingStrategy}>
                    <div className="grid grid-cols-5 gap-x-0.5 gap-y-0.5 w-max relative z-10">
                        {allLinks.map((link) => (
                            <AIIcon
                                key={link.id}
                                link={link}
                                onOpen={handleIconClick}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <PromptInput prompt={prompt} setPrompt={setPrompt} />
            <span className="text-[9px] text-white/20 tracking-widest font-mono -mt-2 mb-0.5 select-none">v{pkg.version}</span>
        </main>
    )
}

export default App
