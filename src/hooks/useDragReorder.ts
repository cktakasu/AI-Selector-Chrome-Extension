import { useState, useRef, useCallback, useEffect, RefObject } from 'react';

interface Offset { x: number; y: number }

interface UseDragReorderReturn {
    dragIndex: number | null;
    dragOffset: Offset;
    isDropping: boolean;
    shiftOffsets: Record<number, Offset>;
    checkWasDragged: () => boolean;
    handlePointerDown: (index: number, e: React.PointerEvent) => void;
    containerRef: RefObject<HTMLDivElement | null>;
}

const ACTIVATION_DISTANCE_SQ = 25; // 5px
const ANIMATION_DURATION = 200;

export function useDragReorder(
    items: { id: string }[],
    onReorder: (newOrder: string[]) => void,
): UseDragReorderReturn {
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dragOffset, setDragOffset] = useState<Offset>({ x: 0, y: 0 });
    const [isDropping, setIsDropping] = useState(false);
    const [shiftOffsets, setShiftOffsets] = useState<Record<number, Offset>>({});
    const wasDraggedRef = useRef(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const startPos = useRef({ x: 0, y: 0 });
    const activated = useRef(false);
    const dragIndexRef = useRef<number | null>(null);
    const dragOriginalIndexRef = useRef<number | null>(null);
    const itemsRef = useRef(items);
    const onReorderRef = useRef(onReorder);
    const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dragFlagTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rectsRef = useRef<DOMRect[]>([]);
    // liveOrder[position] = originalIndex — ドラッグ中の並び順を追跡
    const liveOrderRef = useRef<number[]>([]);

    itemsRef.current = items;
    onReorderRef.current = onReorder;

    // liveOrder から各アイテムのビジュアルオフセットを計算
    const computeOffsets = (order: number[], dragOrigIdx: number): Record<number, Offset> => {
        const rects = rectsRef.current;
        const offsets: Record<number, Offset> = {};
        for (let pos = 0; pos < order.length; pos++) {
            const origIdx = order[pos];
            if (origIdx !== dragOrigIdx && pos !== origIdx) {
                offsets[origIdx] = {
                    x: rects[pos].left - rects[origIdx].left,
                    y: rects[pos].top - rects[origIdx].top,
                };
            }
        }
        return offsets;
    };

    useEffect(() => {
        const captureRects = () => {
            const container = containerRef.current;
            if (!container) return;
            rectsRef.current = Array.from(container.children).map(
                child => child.getBoundingClientRect()
            );
        };

        // 元の位置rect でポインタがどの枠にいるか判定
        const findPosition = (clientX: number, clientY: number): number | null => {
            const rects = rectsRef.current;
            for (let i = 0; i < rects.length; i++) {
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
                    liveOrderRef.current = itemsRef.current.map((_, i) => i);
                    dragOriginalIndexRef.current = dragIndexRef.current;
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

            // ポインタが入った枠のアイテムと、ドラッグアイテムを入れ替え
            const pos = findPosition(e.clientX, e.clientY);
            if (pos !== null) {
                const dragOrigIdx = dragOriginalIndexRef.current!;
                const order = liveOrderRef.current;
                if (order[pos] !== dragOrigIdx) {
                    const dragPos = order.indexOf(dragOrigIdx);
                    const newOrder = [...order];
                    [newOrder[dragPos], newOrder[pos]] = [newOrder[pos], newOrder[dragPos]];
                    liveOrderRef.current = newOrder;
                    setShiftOffsets(computeOffsets(newOrder, dragOrigIdx));
                }
            }
        };

        const onUp = () => {
            const dragOrigIdx = dragOriginalIndexRef.current;
            const wasActivated = activated.current;

            document.body.style.cursor = '';
            document.body.style.userSelect = '';

            if (wasActivated && dragOrigIdx !== null) {
                const order = liveOrderRef.current;
                const dragPos = order.indexOf(dragOrigIdx);

                if (dragPos !== dragOrigIdx) {
                    // ドロップアニメーション: ドラッグアイテムを最終位置へ滑らせる
                    const targetOffset: Offset = {
                        x: rectsRef.current[dragPos].left - rectsRef.current[dragOrigIdx].left,
                        y: rectsRef.current[dragPos].top - rectsRef.current[dragOrigIdx].top,
                    };
                    setIsDropping(true);
                    setDragOffset(targetOffset);

                    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
                    animTimeoutRef.current = setTimeout(() => {
                        // liveOrder を元に新しい並び順をコミット
                        const newItems = order.map(origIdx => itemsRef.current[origIdx]);
                        onReorderRef.current(newItems.map(item => item.id));

                        setIsDropping(false);
                        setDragIndex(null);
                        setDragOffset({ x: 0, y: 0 });
                        setShiftOffsets({});
                        animTimeoutRef.current = null;
                    }, ANIMATION_DURATION);
                } else {
                    // 位置変更なし
                    setDragIndex(null);
                    setDragOffset({ x: 0, y: 0 });
                    setShiftOffsets({});
                }
            } else {
                setDragIndex(null);
                setDragOffset({ x: 0, y: 0 });
                setShiftOffsets({});
            }

            activated.current = false;
            dragIndexRef.current = null;
            dragOriginalIndexRef.current = null;

            if (dragFlagTimeoutRef.current) clearTimeout(dragFlagTimeoutRef.current);
            dragFlagTimeoutRef.current = setTimeout(() => {
                wasDraggedRef.current = false;
                dragFlagTimeoutRef.current = null;
            }, ANIMATION_DURATION + 50);
        };

        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
        return () => {
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
            if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
            if (dragFlagTimeoutRef.current) clearTimeout(dragFlagTimeoutRef.current);
        };
    }, []);

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
        isDropping,
        shiftOffsets,
        checkWasDragged,
        handlePointerDown,
        containerRef,
    };
}
