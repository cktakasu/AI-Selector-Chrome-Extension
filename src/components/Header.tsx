export function Header() {
    return (
        <header className="mb-6 text-center">
            <div className="inline-flex items-center px-2 py-0.5 mb-3 text-[10px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full select-none">
                ✨ Curated AI Directory
            </div>
            <h1 className="mb-2 text-[29px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 filter drop-shadow-sm">
                AI Links
            </h1>
            <p className="text-[11px] font-medium text-slate-500 max-w-[220px] mx-auto leading-relaxed">
                Discover the best AI tools and resources to supercharge your workflow.
            </p>
        </header>
    )
}
