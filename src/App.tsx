import { LinkGrid } from './components/LinkGrid'
import { LinkCard } from './components/LinkCard'
import { links } from './data/links'
import { useModelUpdates } from './hooks/useModelUpdates'

function App() {
    // 1回のリクエストで共有データ（model_updates.json）を一括取得
    const { data: modelUpdates, isLoading } = useModelUpdates();

    return (
        <main className="flex items-center justify-center p-2 bg-transparent m-0">
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
