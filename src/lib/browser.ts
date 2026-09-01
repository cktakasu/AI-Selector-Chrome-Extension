/**
 * ブラウザ間のAPI差異を吸収するためのユーティリティ
 */

const isChrome = typeof chrome !== 'undefined' && !!chrome.storage;

export const browser = {
    storage: {
        local: {
            get: async <T extends Record<string, unknown> = Record<string, unknown>>(
                keys: string | string[] | Record<string, unknown> | null
            ): Promise<T> => {
                if (isChrome && chrome.storage?.local) {
                    return (await chrome.storage.local.get(keys)) as T;
                }
                
                const result: Record<string, unknown> = {};
                const keysToFetch = keys === null
                    ? Object.keys(localStorage)
                    : Array.isArray(keys)
                        ? keys
                        : typeof keys === 'string'
                            ? [keys]
                            : Object.keys(keys || {});
                
                for (const key of keysToFetch) {
                    const val = localStorage.getItem(key);
                    if (val !== null) {
                        try {
                            result[key] = JSON.parse(val);
                        } catch {
                            result[key] = val;
                        }
                    }
                }
                return result as T;
            },
            set: async (items: Record<string, unknown>): Promise<void> => {
                if (isChrome && chrome.storage?.local) {
                    return await chrome.storage.local.set(items);
                }
                
                for (const [key, value] of Object.entries(items)) {
                    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                }
            },
            remove: async (keys: string | string[]): Promise<void> => {
                if (isChrome && chrome.storage?.local) {
                    return await chrome.storage.local.remove(keys);
                }

                const keysToRemove = Array.isArray(keys) ? keys : [keys];
                for (const key of keysToRemove) {
                    localStorage.removeItem(key);
                }
            }
        }
    },
    tabs: {
        create: async (properties: { url: string }): Promise<void> => {
            if (isChrome && chrome.tabs) {
                chrome.tabs.create(properties);
            } else {
                window.open(properties.url, '_blank');
            }
        }
    },
    runtime: {
        lastError: isChrome ? chrome.runtime?.lastError : null
    }
};
