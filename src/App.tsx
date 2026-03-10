import { links } from './data/links'
import modelUpdates from '../public/model_updates.json'

const isNew = (date?: string | null) =>
    !!date && Date.now() - new Date(date).getTime() < 5 * 24 * 60 * 60 * 1000

const items = links.map((link) => ({
    ...link,
    updatedAt: modelUpdates[link.id] || link.updatedAt,
    isNew: isNew(modelUpdates[link.id] || link.updatedAt),
}))

function App() {
    return (
        <main className="flex items-center justify-center p-2 bg-transparent m-0">
            <div className="grid grid-cols-5 gap-1 justify-end place-items-center w-max p-0 m-0">
                {items.map((link) => (
                    <div key={link.id} className="relative hover:z-10">
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="relative flex items-center justify-center bg-transparent shadow-none outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-full hover:scale-110 active:scale-95 transition-transform duration-150 w-[34px] h-[34px] overflow-visible"
                            title={link.name}
                            aria-label={`Open ${link.name}`}
                        >
                            {link.isNew && (
                                <span className="absolute -top-1 -right-1 z-10 pointer-events-none rounded-full px-1 py-0 bg-sky-500/40 backdrop-blur-sm text-[9px] font-black text-white/90 uppercase tracking-tighter leading-none shadow-[0_2px_4px_rgba(0,0,0,0.2)] border border-white/30 scale-90 origin-top-right">
                                    New
                                </span>
                            )}
                            <img
                                src={`/icons/${link.icon}`}
                                alt={link.name}
                                loading="lazy"
                                className="w-[28px] h-[28px] object-contain"
                                onError={(event) => {
                                    event.currentTarget.hidden = true
                                    event.currentTarget.nextElementSibling?.removeAttribute('hidden')
                                }}
                            />
                            <span hidden className="text-[10px] font-bold text-slate-400">
                                {link.name.slice(0, 2)}
                            </span>
                        </a>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default App
