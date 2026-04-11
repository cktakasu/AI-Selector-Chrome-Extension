/**
 * ブラウザ間のAPI差異を吸収するためのユーティリティ
 */

const isChrome = typeof chrome !== 'undefined' && !!chrome.storage;

export const browser = {
    storage: {
        local: {
            get: async (keys: string | string[] | Record<string, any> | null): Promise<Record<string, any>> => {
                if (isChrome && chrome.storage?.local) {
                    return await chrome.storage.local.get(keys);
                }
                
                const result: Record<string, any> = {};
                const keysToFetch = Array.isArray(keys) ? keys : typeof keys === 'string' ? [keys] : Object.keys(keys || {});
                
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
                return result;
            },
            set: async (items: Record<string, any>): Promise<void> => {
                if (isChrome && chrome.storage?.local) {
                    return await chrome.storage.local.set(items);
                }
                
                for (const [key, value] of Object.entries(items)) {
                    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
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
