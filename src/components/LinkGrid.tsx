import type { ReactNode } from 'react'

interface LinkGridProps {
    children: ReactNode
}

export function LinkGrid({ children }: LinkGridProps) {
    return (
        // 要素を5列のグリッドで配置し、マウス移動距離を短縮するコンパクトなブロック状にする
        <div className="grid grid-cols-5 gap-1 justify-end place-items-center w-max p-0 m-0">
            {children}
        </div>
    )
}
