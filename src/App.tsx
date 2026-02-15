import { LinkGrid } from './components/LinkGrid'
import { LinkCard } from './components/LinkCard'
import { links } from './data/links'

function App() {
    return (
        <main className="w-fit p-2 bg-white min-h-0 rounded-xl m-0 border border-slate-200 shadow-xl flex flex-col items-center">
            <LinkGrid>
                {links.map((link, index) => (
                    <LinkCard key={link.id} link={link} index={index} />
                ))}
            </LinkGrid>
        </main>
    )
}

export default App
