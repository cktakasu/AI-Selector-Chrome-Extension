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

const openUrl = (url: string) => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url })
    } else {
        window.open(url, '_blank')
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
                openUrl(url)
            }
        })
    }

    return (
        <main className="flex flex-col items-center justify-center p-4 bg-[#0a0f1e]/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] m-1 border border-white/10 min-w-[280px] relative overflow-hidden">
            {/* Background Mesh Gradient - Subtle accent */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,#3b82f6,transparent_70%)]" />

            {/* Header / Mode Toggle */}
            <div className="flex items-center justify-between w-full mb-4 px-1 relative z-10">
                <div className="flex flex-col">
                    <h1 className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] leading-none mb-1">
                        AI Selector
                    </h1>
                    <div className="h-0.5 w-6 bg-sky-500/50 rounded-full" />
                </div>
                
                <button
                    onClick={() => {
                        setIsMultiMode(!isMultiMode)
                        if (isMultiMode) {
                            setSelectedIds([])
                            setPrompt('')
                        }
                    }}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all duration-300 border flex items-center gap-2 group ${
                        isMultiMode 
                        ? 'bg-sky-500/10 border-sky-500/50 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.2)]' 
                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10 hover:text-white/60'
                    }`}
                >
                    <div className={`w-1.5 h-1.5 rounded-full ${isMultiMode ? 'bg-sky-400 animate-pulse' : 'bg-white/20'}`} />
                    {isMultiMode ? 'MULTI MODE' : 'SINGLE MODE'}
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 gap-x-3 gap-y-4 w-max p-2 relative z-10">
                {rawItems.map((link) => {
                    const isSelected = selectedIds.includes(link.id)
                    return (
                        <div key={link.id} className="relative group flex flex-col items-center">
                            <button
                                onClick={() => isMultiMode ? toggleSelection(link.id) : openUrl(link.url)}
                                className={`relative flex flex-col items-center justify-center rounded-[14px] transition-all duration-300 w-[50px] h-[50px] overflow-visible border ${
                                    isSelected 
                                    ? 'bg-sky-500/20 border-sky-400/50 shadow-[0_0_20px_rgba(56,189,248,0.2)] scale-105' 
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 active:scale-95'
                                }`}
                                title={link.name}
                            >
                                {/* Badge - Updated design */}
                                {link.isNew && !isSelected && (
                                    <span className="absolute -top-1.5 -right-1.5 z-10 rounded-md px-1 py-0.5 bg-gradient-to-r from-sky-500 to-blue-600 text-[9px] scale-[0.8] font-black text-white uppercase tracking-wider shadow-lg border border-white/20 origin-top-right">
                                        NEW
                                    </span>
                                )}

                                {/* Checkmark for selection */}
                                {isSelected && (
                                    <div className="absolute -top-1.5 -right-1.5 z-10 bg-sky-400 rounded-full w-4 h-4 flex items-center justify-center shadow-lg border border-[#0a0f1e]">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 text-[#0a0f1e]">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                                
                                <div className="w-[30px] h-[30px] bg-slate-100 rounded-[8px] p-[4px] shadow-inner flex items-center justify-center">
                                    <img
                                        src={`/icons/${link.icon}`}
                                        alt={link.name}
                                        className={`w-full h-full object-contain transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-90 group-hover:opacity-100 group-hover:scale-105'}`}
                                        onError={(event) => {
                                            event.currentTarget.parentElement!.hidden = true
                                            event.currentTarget.parentElement!.nextElementSibling?.removeAttribute('hidden')
                                        }}
                                    />
                                </div>
                                <span hidden className="text-[12px] font-black text-white/40 uppercase tracking-tighter absolute">
                                    {link.name.slice(0, 2)}
                                </span>
                            </button>
                            <span className="mt-1.5 text-[9px] font-semibold text-white/50 tracking-wider text-center w-[54px] truncate px-0.5">
                                {link.name}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* Multi-Search UI */}
            {isMultiMode && (
                <div className="w-full relative z-10 mt-4">
                    <div className="flex flex-col gap-3 p-1">
                    <div className="relative group">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Type your instruction..."
                            className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[11px] text-white placeholder-white/20 focus:outline-none focus:border-sky-500/30 transition-colors duration-200 resize-none h-24 shadow-inner leading-relaxed"
                        />
                        <div className="absolute bottom-2 right-2 flex gap-1 pointer-events-none">
                             <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest">
                                {prompt.length} chars
                             </span>
                        </div>
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!prompt || selectedIds.length === 0}
                        className={`w-full py-3 rounded-xl text-[11px] font-black tracking-[0.1em] transition-all duration-300 overflow-hidden relative group/btn ${
                            prompt && selectedIds.length > 0
                            ? 'text-white cursor-pointer active:scale-95'
                            : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'
                        }`}
                    >
                        {prompt && selectedIds.length > 0 && (
                            <div className="absolute inset-0 bg-gradient-to-r from-sky-500 via-blue-600 to-sky-500 bg-[length:200%_auto] animate-[gradient_3s_linear_infinite] opacity-100 group-hover/btn:opacity-90" />
                        )}
                        <span className="relative z-10 flex items-center justify-center gap-2">
                             ACTIVATE {selectedIds.length} AGENT{selectedIds.length > 1 ? 'S' : ''}
                             <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                <path fillRule="evenodd" d="M10.21 14.77a.75.75 0 01.02-1.06L14.168 10 10.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                             </svg>
                        </span>
                    </button>
                    {prompt && selectedIds.length > 0 && (
                        <p className="text-[9px] text-center text-white/30 font-medium tracking-tight h-3">
                            Prompt will be copied and opened in {selectedIds.length} tabs
                        </p>
                    )}
                </div>
            </div>
            )}
            
            <style>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-3px) scaleY(0.98); }
                    to { opacity: 1; transform: translateY(0) scaleY(1); }
                }
            `}</style>
        </main>
    )
}

export default App
