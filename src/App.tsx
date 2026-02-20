import { LinkGrid } from './components/LinkGrid'
import { LinkCard } from './components/LinkCard'
import { links } from './data/links'
import { useModelUpdates } from './hooks/useModelUpdates'

function App() {
    // 1回のリクエストで共有データ（model_updates.json）を一括取得
    const { data: modelUpdates, isLoading } = useModelUpdates();

    return (
        <main className="w-full min-h-screen p-2 flex flex-col items-center justify-center bg-white/20 backdrop-blur-2xl saturate-150">
            <LinkGrid>
                {links.map((link, index) => (
                    <LinkCard
                        key={link.id}
                        link={link}
                        index={index}
                        // 各カードに自身の更新日データを渡す
                        remoteUpdatedAt={modelUpdates?.[link.id] ?? null}
                        isLoading={isLoading}
                    />
                ))}
            </LinkGrid>
        </main>
    )
}

export default App
