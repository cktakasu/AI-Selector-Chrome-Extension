import { LinkGrid } from './components/LinkGrid'
import { LinkCard } from './components/LinkCard'
import { links } from './data/links'

function App() {
    return (
        <main className="w-fit min-w-max p-3 min-h-0 rounded-2xl m-0 flex flex-col items-center bg-slate-900/90 backdrop-blur-md text-white border border-slate-700/50 shadow-2xl ring-1 ring-white/10">
            <LinkGrid>
                {links.map((link, index) => (
                    <LinkCard key={link.id} link={link} index={index} />
                ))}
            </LinkGrid>
        </main>
    )
}

export default App
