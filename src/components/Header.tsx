export function Header() {
    return (
        <header className="mb-8 text-center">
            <div className="inline-flex items-center px-3 py-1 mb-4 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full select-none">
                ✨ Curated AI Directory
            </div>
            <h1 className="mb-3 text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 filter drop-shadow-sm">
                AI Links
            </h1>
            <p className="text-sm font-medium text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                Discover the best AI tools and resources to supercharge your workflow.
            </p>
        </header>
    )
}
