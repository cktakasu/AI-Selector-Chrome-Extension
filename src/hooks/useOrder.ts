import { useState, useEffect, useCallback } from 'react';
import { links } from '../data/links';

const STORAGE_KEY = 'aiSelectorOrder';
const DEFAULT_ORDER = links.map((link) => link.id);
const VALID_IDS = new Set(DEFAULT_ORDER);

const chromeStorage = typeof chrome !== 'undefined' && chrome.storage ? chrome.storage : null;

function normalizeOrder(order: string[]): string[] {
    const seen = new Set<string>();
    const normalized: string[] = [];

    for (const id of order) {
        if (!VALID_IDS.has(id) || seen.has(id)) continue;
        seen.add(id);
        normalized.push(id);
    }

    for (const id of DEFAULT_ORDER) {
        if (!seen.has(id)) {
            normalized.push(id);
        }
    }

    return normalized;
}

async function loadOrder(): Promise<string[]> {
    if (chromeStorage) {
        const result = await chromeStorage.local.get(STORAGE_KEY);
        const storedOrder = result[STORAGE_KEY];
        return Array.isArray(storedOrder) ? normalizeOrder(storedOrder) : DEFAULT_ORDER;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_ORDER;
    try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? normalizeOrder(parsed) : DEFAULT_ORDER;
    } catch {
        return DEFAULT_ORDER;
    }
}

async function saveOrder(order: string[]): Promise<void> {
    if (chromeStorage) {
        await chromeStorage.local.set({ [STORAGE_KEY]: order });
    } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    }
}

export const useOrder = () => {
    const [order, setOrder] = useState<string[]>(DEFAULT_ORDER);

    useEffect(() => {
        let isMounted = true;

        loadOrder().then((loadedOrder) => {
            if (isMounted) {
                setOrder(loadedOrder);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    const updateOrder = useCallback((newOrder: string[]) => {
        const normalizedOrder = normalizeOrder(newOrder);
        setOrder(normalizedOrder);
        void saveOrder(normalizedOrder);
    }, []);

    return { order, updateOrder };
};
