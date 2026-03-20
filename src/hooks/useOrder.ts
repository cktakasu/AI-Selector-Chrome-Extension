import { useState, useEffect } from 'react';
import { links } from '../data/links';

const STORAGE_KEY = 'aiSelectorOrder';

const chromeStorage = typeof chrome !== 'undefined' && chrome.storage ? chrome.storage : null;

async function loadOrder(): Promise<string[]> {
    const defaultOrder = links.map(l => l.id);
    if (chromeStorage) {
        const result = await chromeStorage.local.get(STORAGE_KEY);
        return result[STORAGE_KEY] ?? defaultOrder;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultOrder;
    try {
        return JSON.parse(saved);
    } catch {
        return defaultOrder;
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
    const [order, setOrder] = useState<string[]>(() => links.map(l => l.id));

    useEffect(() => {
        loadOrder().then(setOrder);
    }, []);

    const updateOrder = (newOrder: string[]) => {
        setOrder(newOrder);
        saveOrder(newOrder);
    };

    return { order, updateOrder };
};
