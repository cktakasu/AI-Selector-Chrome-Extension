import { useState, useEffect, useCallback } from 'react';
import { links } from '../data/links';
import { browser } from '../lib/browser';

const STORAGE_KEY = 'aiSelectorOrder';
const DEFAULT_ORDER = links.map((link) => link.id);
const VALID_IDS = new Set(DEFAULT_ORDER);

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
    try {
        const result = await browser.storage.local.get(STORAGE_KEY);
        const storedOrder = result[STORAGE_KEY];
        return Array.isArray(storedOrder) ? normalizeOrder(storedOrder) : DEFAULT_ORDER;
    } catch {
        return DEFAULT_ORDER;
    }
}

async function saveOrder(order: string[]): Promise<void> {
    await browser.storage.local.set({ [STORAGE_KEY]: order });
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
