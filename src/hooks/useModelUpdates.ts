import { useState, useEffect } from 'react';
import type { ModelUpdates, FetchState } from '../types';

/**
 * model_updates.json をフェッチし、アプリケーション全体で共有する状態を提供します
 * （N+1レンダリング・リクエスト問題の解消）
 */
export function useModelUpdates() {
    const [state, setState] = useState<FetchState<ModelUpdates>>({
        data: null,
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                // 開発環境でもビルド後でもルートからの public 参照で動作する
                const res = await fetch('/model_updates.json');
                if (!res.ok) {
                    throw new Error(`Failed to fetch model updates: ${res.status}`);
                }
                const data: ModelUpdates = await res.json();

                if (isMounted) {
                    setState({ data, isLoading: false, error: null });
                }
            } catch (error) {
                console.info('Using local or no update info (fetch failed or skipped).', error);
                if (isMounted) {
                    setState({ data: null, isLoading: false, error: error as Error });
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    return state;
}
