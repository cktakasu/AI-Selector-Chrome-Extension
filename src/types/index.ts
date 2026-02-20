export interface Link {
    id: string;
    name: string;
    description: string;
    url: string;
    category: 'LLM' | 'Image' | 'Audio' | 'Video' | 'Productivity' | 'Dev';
    icon?: string;
    updatedAt?: string; // ISO 8601 date string (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ)
}

// ネットワークフェッチ時のレスポンス型
export type ModelUpdates = Record<string, string>;

// キャッシュ状態の型定義
export interface FetchState<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
}
