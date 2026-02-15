import type { ReactNode } from 'react'

interface LinkGridProps {
    children: ReactNode
}

export function LinkGrid({ children }: LinkGridProps) {
    return (
        <div className="flex flex-row gap-2 justify-center items-center w-full px-2">
            {children}
        </div>
    )
}
