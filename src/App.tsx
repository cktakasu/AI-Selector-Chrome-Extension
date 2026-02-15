import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { LinkGrid } from './components/LinkGrid'
import { LinkCard } from './components/LinkCard'
import { links } from './data/links'

function App() {
    return (
        <main className="w-[450px] p-6 bg-white min-h-0 rounded-2xl m-0 border border-slate-200 shadow-2xl flex flex-col items-center">
            <Header />
            <LinkGrid>
                {links.map((link, index) => (
                    <LinkCard key={link.id} link={link} index={index} />
                ))}
            </LinkGrid>
            <Footer />
        </main>
    )
}

export default App
