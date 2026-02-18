import { LinkGrid } from './components/LinkGrid'
import { LinkCard } from './components/LinkCard'
import { links } from './data/links'

function App() {
    return (
        <main className="w-fit p-1.5 min-h-0 m-1 mt-4 flex flex-col items-center bg-white/20 backdrop-blur-2xl saturate-150 rounded-full border border-white/20 ring-1 ring-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
            <LinkGrid>
                {links.map((link, index) => (
                    <LinkCard key={link.id} link={link} index={index} />
                ))}
            </LinkGrid>
        </main>
    )
}

export default App
