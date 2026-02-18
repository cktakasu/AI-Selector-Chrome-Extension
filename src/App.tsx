import { LinkGrid } from './components/LinkGrid'
import { LinkCard } from './components/LinkCard'
import { links } from './data/links'

function App() {
    return (
        <main className="w-fit p-0.5 min-h-0 m-1 mt-1 flex flex-col items-center bg-white/50 backdrop-blur-md rounded-lg border border-white/40 shadow-xl">
            <LinkGrid>
                {links.map((link, index) => (
                    <LinkCard key={link.id} link={link} index={index} />
                ))}
            </LinkGrid>
        </main>
    )
}

export default App
