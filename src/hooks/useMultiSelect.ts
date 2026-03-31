import { useState, useCallback } from 'react';

export const useMultiSelect = () => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const toggleSelect = useCallback((id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    const isMultiSelectMode = selectedIds.size > 0;

    return { selectedIds, toggleSelect, clearSelection, isMultiSelectMode };
};
