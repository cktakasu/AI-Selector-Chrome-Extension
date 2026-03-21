import { useState, useRef, useCallback, useEffect, RefObject } from 'react';

export interface SwapAnimation {
    fromIndex: number;
    toIndex: number;
    fromOffset: { x: number; y: number };
    toOffset: { x: number; y: number };
}

interface UseDragReorderReturn {
    dragIndex: number | null;
    dragOffset: { x: number; y: number };
    liveOverIndex: number | null;
    liveOverOffset: { x: number; y: number };
    swapAnimation: SwapAnimation | null;
    checkWasDragged: () => boolean;
    handlePointerDown: (index: number, e: React.PointerEvent) => void;
    containerRef: RefObject<HTMLDivElement | null>;
}

const ACTIVATION_DISTANCE = 5;
const ACTIVATION_DISTANCE_SQ = ACTIVATION_DISTANCE * ACTIVATION_DISTANCE;
const SWAP_DURATION = 200;

// rect間のオフセット計算ヘルパー
const rectOffset = (from: DOMRect, to: DOMRect) => ({
    x: to.left - from.left,
    y: to.top - from.top,
});

export function useDragReorder(
    items: { id: string }[],
    onReorder: (newOrder: string[]) => void,
): UseDragReorderReturn {
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [liveOverIndex, setLiveOverIndex] = useState<number | null>(null);
    const [liveOverOffset, setLiveOverOffset] = useState({ x: 0, y: 0 });
    const [swapAnimation, setSwapAnimation] = useState<SwapAnimation | null>(null);
    const wasDraggedRef = useRef(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const startPos = useRef({ x: 0, y: 0 });
    const activated = useRef(false);
    const dragIndexRef = useRef<number | null>(null);
    const overIndexRef = useRef<number | null>(null);
    const itemsRef = useRef(items);
    const onReorderRef = useRef(onReorder);
    const swapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dragFlagTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rectsRef = useRef<DOMRect[]>([]);

    itemsRef.current = items;
    onReorderRef.current = onReorder;

    useEffect(() => {
        // useEffect内でのみ使用するため、ここで定義（外部公開不要）
        const captureRects = () => {
            const container = containerRef.current;
            if (!container) return;
            rectsRef.current = Array.from(container.children).map(
                child => child.getBoundingClientRect()
            );
        };

        const findOverIndex = (clientX: number, clientY: number): number | null => {
            const rects = rectsRef.current;
            for (let i = 0; i < rects.length; i++) {
                if (i === dragIndexRef.current) continue;
                const rect = rects[i];
                if (
                    clientX >= rect.left && clientX <= rect.right &&
                    clientY >= rect.top && clientY <= rect.bottom
                ) {
                    return i;
                }
            }
            return null;
        };

        const onMove = (e: PointerEvent) => {
            if (dragIndexRef.current === null) return;

            if (!activated.current) {
                const dx = e.clientX - startPos.current.x;
                const dy = e.clientY - startPos.current.y;
                if (dx * dx + dy * dy >= ACTIVATION_DISTANCE_SQ) {
                    activated.current = true;
                    wasDraggedRef.current = true;
                    captureRects();
                    setDragIndex(dragIndexRef.current);
                    document.body.style.cursor = 'grabbing';
                    document.body.style.userSelect = 'none';
                }
                return;
            }

            setDragOffset({
                x: e.clientX - startPos.current.x,
                y: e.clientY - startPos.current.y,
            });

            const over = findOverIndex(e.clientX, e.clientY);
            if (over !== overIndexRef.current) {
                overIndexRef.current = over;

                if (over !== null && dragIndexRef.current !== null) {
                    const dragRect = rectsRef.current[dragIndexRef.current];
                    const overRect = rectsRef.current[over];
                    if (dragRect && overRect) {
                        setLiveOverIndex(over);
                        setLiveOverOffset(rectOffset(overRect, dragRect));
                    }
                } else {
                    setLiveOverIndex(null);
                    setLiveOverOffset({ x: 0, y: 0 });
                }
            }
        };

        const onUp = () => {
            const di = dragIndexRef.current;
            const oi = overIndexRef.current;
            const wasActivated = activated.current;

            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            setLiveOverIndex(null);
            setLiveOverOffset({ x: 0, y: 0 });
            // dragIndex / dragOffset は常にリセット（スワップの有無に関わらず）
            setDragIndex(null);
            setDragOffset({ x: 0, y: 0 });

            if (wasActivated && di !== null && oi !== null && oi !== di) {
                const fromRect = rectsRef.current[di];
                const toRect = rectsRef.current[oi];
                setSwapAnimation({
                    fromIndex: di,
                    toIndex: oi,
                    fromOffset: rectOffset(fromRect, toRect),
                    toOffset: rectOffset(toRect, fromRect),
                });

                if (swapTimeoutRef.current) clearTimeout(swapTimeoutRef.current);
                swapTimeoutRef.current = setTimeout(() => {
                    const swapped = [...itemsRef.current];
                    [swapped[di], swapped[oi]] = [swapped[oi], swapped[di]];
                    onReorderRef.current(swapped.map(item => item.id));
                    setSwapAnimation(null);
                    swapTimeoutRef.current = null;
                }, SWAP_DURATION);
            }

            overIndexRef.current = null;
            activated.current = false;
            dragIndexRef.current = null;

            if (dragFlagTimeoutRef.current) clearTimeout(dragFlagTimeoutRef.current);
            dragFlagTimeoutRef.current = setTimeout(() => {
                wasDraggedRef.current = false;
                dragFlagTimeoutRef.current = null;
            }, SWAP_DURATION + 50);
        };

        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
        return () => {
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
            if (swapTimeoutRef.current) clearTimeout(swapTimeoutRef.current);
            if (dragFlagTimeoutRef.current) clearTimeout(dragFlagTimeoutRef.current);
        };
    }, []); // すべての参照は stable な ref のため deps 不要

    const handlePointerDown = useCallback((index: number, e: React.PointerEvent) => {
        e.preventDefault();
        startPos.current = { x: e.clientX, y: e.clientY };
        dragIndexRef.current = index;
        activated.current = false;
        wasDraggedRef.current = false;
    }, []);

    const checkWasDragged = useCallback(() => wasDraggedRef.current, []);

    return {
        dragIndex,
        dragOffset,
        liveOverIndex,
        liveOverOffset,
        swapAnimation,
        checkWasDragged,
        handlePointerDown,
        containerRef,
    };
}
