import { LinkGrid } from './components/LinkGrid'
import { LinkCard } from './components/LinkCard'
import { links } from './data/links'

function App() {
    return (
        <main className="w-fit min-w-max p-3 min-h-0 rounded-2xl m-0 flex flex-col items-center bg-white/30 backdrop-blur-md border border-white/20 shadow-xl">
            <LinkGrid>
                {links.map((link, index) => (
                    <LinkCard key={link.id} link={link} index={index} />
                ))}
            </LinkGrid>
        </main>
    )
}

export default App
