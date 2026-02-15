import type { ReactNode } from 'react'

interface LinkGridProps {
    children: ReactNode
}

export function LinkGrid({ children }: LinkGridProps) {
    return (
        <div className="flex flex-row flex-nowrap gap-0.5 justify-center items-center w-full px-0">
            {children}
        </div>
    )
}
