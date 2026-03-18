import { useState } from 'react'
import { links } from './data/links'
import modelUpdates from '../public/model_updates.json'
import { AIIcon } from './components/AIIcon'
import { MultiSearchUI } from './components/MultiSearchUI'
import { Footer } from './components/Footer'

const isNew = (date?: string | null) =>
    !!date && Date.now() - new Date(date).getTime() < 5 * 24 * 60 * 60 * 1000

const rawItems = links.map((link) => ({
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
    const [isMultiMode, setIsMultiMode] = useState(false)
    const [prompt, setPrompt] = useState('')
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        )
    }

    const handleSend = async () => {
        if (!prompt || selectedIds.length === 0) return

        try {
            await navigator.clipboard.writeText(prompt)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }

        selectedIds.forEach((id) => {
            const item = rawItems.find((i) => i.id === id)
            if (item) {
                const url = item.searchUrl
                    ? `${item.searchUrl}${encodeURIComponent(prompt)}`
                    : item.url
                openUrl(url)
            }
        })
    }

    const toggleMode = () => {
        setIsMultiMode(!isMultiMode)
        if (!isMultiMode) { // Entering MULTI mode, no reset needed? 
            // The existing code resets when EXITING MULTI mode
        } else {
            setSelectedIds([])
            setPrompt('')
        }
    }

    return (
        <main className="flex flex-col items-center justify-center p-3 bg-[#0a0f1e] rounded-2xl m-1 border border-white/10 min-w-[260px] relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,#3b82f6,transparent_70%)]" />

            {/* Grid */}
            <div className="grid grid-cols-5 gap-x-1.5 gap-y-2 w-max p-0.5 relative z-10">
                {rawItems.map((link) => (
                    <AIIcon
                        key={link.id}
                        link={link}
                        isSelected={selectedIds.includes(link.id)}
                        isMultiMode={isMultiMode}
                        onToggle={toggleSelection}
                        onOpen={openUrl}
                    />
                ))}
            </div>

            {/* Multi-Search UI */}
            {isMultiMode && (
                <MultiSearchUI
                    prompt={prompt}
                    setPrompt={setPrompt}
                    selectedCount={selectedIds.length}
                    onSend={handleSend}
                />
            )}

            {/* Footer / Mode Toggle */}
            <Footer isMultiMode={isMultiMode} onToggleMode={toggleMode} />
            
            <style>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </main>
    )
}

export default App
