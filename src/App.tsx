import { useState } from 'react'
import { links } from './data/links'
import modelUpdates from '../public/model_updates.json'

const isNew = (date?: string | null) =>
    !!date && Date.now() - new Date(date).getTime() < 5 * 24 * 60 * 60 * 1000

const rawItems = links.map((link) => ({
    ...link,
    updatedAt: (modelUpdates as Record<string, string>)[link.id] || link.updatedAt,
    isNew: isNew((modelUpdates as Record<string, string>)[link.id] || link.updatedAt),
}))

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

        // Copy to clipboard fallback
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
                window.open(url, '_blank')
            }
        })
    }

    return (
        <main className="flex flex-col items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl m-2 border border-white/20 min-w-[240px]">
            {/* Header / Mode Toggle */}
            <div className="flex items-center justify-between w-full mb-3 px-1">
                <h1 className="text-xs font-black text-white/50 uppercase tracking-widest">AI Selector</h1>
                <button
                    onClick={() => {
                        setIsMultiMode(!isMultiMode)
                        if (isMultiMode) {
                            setSelectedIds([])
                            setPrompt('')
                        }
                    }}
                    className={`text-[10px] font-bold px-2 py-1 rounded-full transition-all duration-200 ${
                        isMultiMode 
                        ? 'bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.5)]' 
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                >
                    {isMultiMode ? 'Multi-Search: ON' : 'Multi-Search: OFF'}
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 gap-2 w-max p-0 m-0">
                {rawItems.map((link) => {
                    const isSelected = selectedIds.includes(link.id)
                    return (
                        <div key={link.id} className="relative group">
                            <button
                                onClick={() => isMultiMode ? toggleSelection(link.id) : window.open(link.url, '_blank')}
                                className={`relative flex items-center justify-center bg-white/5 shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl hover:scale-105 active:scale-95 transition-all duration-200 w-[42px] h-[42px] overflow-visible border ${
                                    isSelected 
                                    ? 'border-sky-400 bg-sky-400/20 shadow-[0_0_15px_rgba(56,189,248,0.3)]' 
                                    : 'border-white/10 hover:border-white/30'
                                }`}
                                title={link.name}
                            >
                                {link.isNew && !isSelected && (
                                    <span className="absolute -top-1.5 -right-1.5 z-10 pointer-events-none rounded-full px-1.5 py-0.5 bg-sky-500 text-[8px] font-black text-white uppercase tracking-tighter leading-none shadow-lg border border-white/20">
                                        New
                                    </span>
                                )}
                                {isSelected && (
                                    <span className="absolute -top-1.5 -right-1.5 z-10 pointer-events-none bg-sky-400 rounded-full w-4 h-4 flex items-center justify-center shadow-lg border border-white/40">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                )}
                                <img
                                    src={`/icons/${link.icon}`}
                                    alt={link.name}
                                    className={`w-[26px] h-[26px] object-contain transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}
                                    onError={(event) => {
                                        event.currentTarget.hidden = true
                                        event.currentTarget.nextElementSibling?.removeAttribute('hidden')
                                    }}
                                />
                                <span hidden className="text-[10px] font-bold text-white/40 uppercase">
                                    {link.name.slice(0, 2)}
                                </span>
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* Multi-Search UI */}
            <div className={`w-full transition-all duration-300 overflow-hidden ${isMultiMode ? 'max-h-64 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col gap-2 p-1">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="What's your prompt?"
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 resize-none h-20 shadow-inner"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!prompt || selectedIds.length === 0}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                            prompt && selectedIds.length > 0
                            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg hover:from-sky-400 hover:to-blue-500 active:scale-[0.98]'
                            : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                    >
                        Send to {selectedIds.length} Tool{selectedIds.length > 1 ? 's' : ''}
                    </button>
                </div>
            </div>
        </main>
    )
}

export default App
