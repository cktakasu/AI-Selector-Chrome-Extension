import type { ReactNode } from 'react'

interface LinkGridProps {
    children: ReactNode
}

export function LinkGrid({ children }: LinkGridProps) {
    return (
        // 要素を5列のグリッドで配置し、マウス移動距離を短縮するコンパクトなブロック状にする
        <div className="grid grid-cols-5 gap-x-1 gap-y-1.5 justify-end place-items-center w-full pl-2 pr-1 py-1">
            {children}
        </div>
    )
}
