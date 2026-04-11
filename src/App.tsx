import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { links, Link } from './data/links'
import { AIIcon } from './components/AIIcon'
import { PromptInput } from './components/PromptInput'
import { ThemeToggle } from './components/ThemeToggle'
import { usePrompt } from './hooks/usePrompt'
import { useOrder } from './hooks/useOrder'
import { useDragReorder } from './hooks/useDragReorder'
import { useMultiSelect } from './hooks/useMultiSelect'
import { browser } from './lib/browser'

const LINK_BY_ID = new Map(links.map((link) => [link.id, link] as const))

const openUrl = (url: string) => {
    browser.tabs.create({ url });
}

const dispatchPrompt = async (link: Link, prompt: string) => {
    if (prompt && link.searchUrl) {
        openUrl(`${link.searchUrl}${encodeURIComponent(prompt)}`);
        return;
    }
    if (prompt) {
        await browser.storage.local.set({
            pendingPrompt: prompt,
            timestamp: Date.now()
        });
    }
    openUrl(link.url);
};

function App() {
    const { prompt, setPrompt, copyToClipboard } = usePrompt();
    const { order, updateOrder } = useOrder();
    const { selectedIds, toggleSelect, clearSelection, isMultiSelectMode } = useMultiSelect();
    const promptRef = useRef(prompt);

    const [enterNewline, setEnterNewline] = useState(false);
    useEffect(() => {
        browser.storage.local.get(['aiSelectorEnterNewline']).then((data) => {
            if (data?.aiSelectorEnterNewline) setEnterNewline(true);
        });
    }, []);
    const toggleEnterNewline = useCallback(() => {
        setEnterNewline(prev => {
            const next = !prev;
            browser.storage.local.set({ aiSelectorEnterNewline: next });
            return next;
        });
    }, []);
    promptRef.current = prompt;

    const allLinks = useMemo(() => {
        const knownIds = new Set(order);
        const orderedLinks = order
            .map(id => LINK_BY_ID.get(id))
            .filter((l): l is Link => l !== undefined);
        const newLinks = links.filter(l => !knownIds.has(l.id));
        return [...orderedLinks, ...newLinks];
    }, [order]);

    const { checkWasDragged, handlePointerDown, containerRef } = useDragReorder(allLinks, updateOrder);

    const handleGeneralSubmit = useCallback(async () => {
        const p = promptRef.current;
        if (!p) return;

        await copyToClipboard(p);

        if (isMultiSelectMode) {
            const selectedLinks = allLinks.filter(l => selectedIds.has(l.id));
            for (const link of selectedLinks) {
                await dispatchPrompt(link, p);
            }
            clearSelection();
        } else {
            // 単一選択（通常モード）でEnterキーが押された場合：
            // もしくは、デフォルトの動作としてリストの最初のリンクに送信、
            // または「最後に使用したAI」に送信するなどの拡張が考えられます。
            // ここでは一貫性のために、もし何も選択されていなければ
            // リストの先頭のアイテムに送信するシンプルな挙動にします。
            if (allLinks.length > 0) {
                await dispatchPrompt(allLinks[0], p);
            }
        }
        setPrompt('');
    }, [isMultiSelectMode, selectedIds, allLinks, copyToClipboard, clearSelection, setPrompt]);

    const handleIconClick = useCallback(async (link: Link) => {
        if (checkWasDragged()) return;
        const p = promptRef.current;
        await copyToClipboard(p);
        await dispatchPrompt(link, p);
    }, [copyToClipboard, checkWasDragged])

    return (
        <main className="app-shell flex flex-col items-center justify-center min-w-[284px] relative gap-2">
            <ThemeToggle />
            <button
                onClick={toggleEnterNewline}
                title={enterNewline ? 'Enter = 改行モード ON（クリックでOFF）' : 'Enter = 改行モード OFF（クリックでON）'}
                className={`absolute top-2.5 left-2.5 p-1.5 rounded-full transition-colors z-20 outline-none ${
                    enterNewline
                        ? 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-400/10'
                        : 'text-slate-400 dark:text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-white/[0.08]'
                }`}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 10 4 15 9 20"/>
                    <path d="M20 4v7a4 4 0 0 1-4 4H4"/>
                </svg>
            </button>
            <div ref={containerRef} className="grid grid-cols-5 gap-x-1 gap-y-2 w-max relative z-10 pt-2">
                {allLinks.map((link, i) => (
                    <AIIcon
                        key={link.id}
                        link={link}
                        index={i}
                        isSelected={selectedIds.has(link.id)}
                        onOpen={handleIconClick}
                        onSelect={toggleSelect}
                        onDragStart={handlePointerDown}
                    />
                ))}
            </div>

            <PromptInput 
                prompt={prompt} 
                setPrompt={setPrompt} 
                onSubmit={handleGeneralSubmit}
                isMultiSelectMode={isMultiSelectMode}
                selectedCount={selectedIds.size}
                enterNewline={enterNewline}
            />
        </main>
    )
}

export default App
