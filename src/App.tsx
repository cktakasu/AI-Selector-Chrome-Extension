import { Link, links } from './data/links';

export default function App() {
    return (
        <div className="min-h-screen bg-white">
            <div className="p-4 grid grid-cols-4 gap-4">
                {links.map((link) => (
                    <IconLink key={link.id} link={link} />
                ))}
            </div>
        </div>
    );
}

function IconLink({ link }: { link: Link }) {
    return (
        <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 hover:bg-gray-50 hover:shadow-sm hover:-translate-y-1 group"
            title={link.name}
        >
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-2xl mb-2 group-hover:bg-white group-hover:shadow-md transition-all p-2">
                {link.icon ? (
                    <img src={link.icon} alt={link.name} className="w-full h-full object-contain" />
                ) : (
                    <span className="text-2xl">🔗</span>
                )}
            </div>
            <span className="text-xs text-gray-600 font-medium text-center truncate w-full group-hover:text-gray-900">
                {link.name}
            </span>
        </a>
    );
}
