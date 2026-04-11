import { useRef, useCallback, useEffect, RefObject } from 'react';

interface Offset { x: number; y: number }

export interface UseDragReorderReturn {
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
    const moveFrameRef = useRef<number | null>(null);
    const latestPointerRef = useRef<Offset>({ x: 0, y: 0 });
    const rectsRef = useRef<DOMRect[]>([]);
    // liveOrder[position] = originalIndex
    const liveOrderRef = useRef<number[]>([]);

    itemsRef.current = items;
    onReorderRef.current = onReorder;

    useEffect(() => {
        const captureRects = () => {
            const container = containerRef.current;
            if (!container) return;
            rectsRef.current = Array.from(container.children).map(
                child => child.getBoundingClientRect()
            );
        };

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

        const resetStyles = () => {
            const container = containerRef.current;
            if (!container) return;
            const children = container.children as HTMLCollectionOf<HTMLElement>;
            for (let i = 0; i < children.length; i++) {
                const el = children[i];
                el.style.transform = '';
                el.style.transition = '';
                el.style.zIndex = '';
                el.style.position = '';
                el.style.filter = '';
            }
        };

        const applyStyles = (dragOffset: Offset, shiftOffsets: Record<number, Offset>, isDropping: boolean) => {
            const container = containerRef.current;
            if (!container) return;
            const children = container.children as HTMLCollectionOf<HTMLElement>;
            const dragOrigIdx = dragOriginalIndexRef.current;

            for (let i = 0; i < children.length; i++) {
                const el = children[i];
                if (i === dragOrigIdx) {
                    if (!isDropping) {
                        el.style.transform = `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(1.08)`;
                        el.style.transition = 'none';
                        el.style.zIndex = '50';
                        el.style.position = 'relative';
                        el.style.filter = 'drop-shadow(0 4px 10px rgba(0,0,0,0.20))';
                    } else {
                        el.style.transform = `translate(${dragOffset.x}px, ${dragOffset.y}px)`;
                        el.style.transition = `transform ${ANIMATION_DURATION}ms ease-out`;
                        el.style.zIndex = '50';
                        el.style.position = 'relative';
                        el.style.filter = '';
                    }
                } else {
                    const shift = shiftOffsets[i];
                    if (shift) {
                        el.style.transform = `translate(${shift.x}px, ${shift.y}px)`;
                        el.style.transition = 'transform 150ms ease-out';
                        el.style.zIndex = '';
                        el.style.position = '';
                        el.style.filter = '';
                    } else {
                        el.style.transform = '';
                        el.style.transition = 'transform 150ms ease-out';
                        el.style.zIndex = '';
                        el.style.position = '';
                        el.style.filter = '';
                    }
                }
            }
        };

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

        const applyPointerMove = () => {
            moveFrameRef.current = null;
            const dragIndex = dragIndexRef.current;
            if (dragIndex === null) return;

            const { x: clientX, y: clientY } = latestPointerRef.current;

            if (!activated.current) {
                const dx = clientX - startPos.current.x;
                const dy = clientY - startPos.current.y;
                if (dx * dx + dy * dy >= ACTIVATION_DISTANCE_SQ) {
                    activated.current = true;
                    wasDraggedRef.current = true;
                    captureRects();
                    liveOrderRef.current = itemsRef.current.map((_, i) => i);
                    dragOriginalIndexRef.current = dragIndex;
                    document.body.style.cursor = 'grabbing';
                    document.body.style.userSelect = 'none';
                }
                return;
            }

            const dragOffset = {
                x: clientX - startPos.current.x,
                y: clientY - startPos.current.y,
            };

            const pos = findPosition(clientX, clientY);
            let shiftOffsets: Record<number, Offset> = {};
            const dragOrigIdx = dragOriginalIndexRef.current!;

            if (pos !== null) {
                const order = liveOrderRef.current;
                if (order[pos] !== dragOrigIdx) {
                    const dragPos = order.indexOf(dragOrigIdx);
                    const newOrder = [...order];
                    [newOrder[dragPos], newOrder[pos]] = [newOrder[pos], newOrder[dragPos]];
                    liveOrderRef.current = newOrder;
                }
            }
            shiftOffsets = computeOffsets(liveOrderRef.current, dragOrigIdx);

            applyStyles(dragOffset, shiftOffsets, false);
        };

        const onMove = (e: PointerEvent) => {
            if (dragIndexRef.current === null) return;

            latestPointerRef.current = { x: e.clientX, y: e.clientY };
            if (moveFrameRef.current === null) {
                moveFrameRef.current = requestAnimationFrame(applyPointerMove);
            }
        };

        const onUp = (e: PointerEvent) => {
            if (dragIndexRef.current === null) return;
            
            // Pointer Captureを解除
            try {
                (e.target as HTMLElement)?.releasePointerCapture(e.pointerId);
            } catch (err) {
                // ignore
            }

            const dragOrigIdx = dragOriginalIndexRef.current;
            const wasActivated = activated.current;

            if (moveFrameRef.current !== null) {
                cancelAnimationFrame(moveFrameRef.current);
                moveFrameRef.current = null;
            }

            document.body.style.cursor = '';
            document.body.style.userSelect = '';

            if (wasActivated && dragOrigIdx !== null) {
                const order = liveOrderRef.current;
                const dragPos = order.indexOf(dragOrigIdx);

                if (dragPos !== dragOrigIdx) {
                    const targetOffset: Offset = {
                        x: rectsRef.current[dragPos].left - rectsRef.current[dragOrigIdx].left,
                        y: rectsRef.current[dragPos].top - rectsRef.current[dragOrigIdx].top,
                    };

                    applyStyles(targetOffset, computeOffsets(order, dragOrigIdx), true);

                    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
                    animTimeoutRef.current = setTimeout(() => {
                        const newItems = order.map(origIdx => itemsRef.current[origIdx]);
                        onReorderRef.current(newItems.map(item => item.id));

                        resetStyles();
                        animTimeoutRef.current = null;
                    }, ANIMATION_DURATION);
                } else {
                    resetStyles();
                }
            } else {
                resetStyles();
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
        document.addEventListener('pointercancel', onUp); // キャンセル時も同様に処理
        return () => {
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
            document.removeEventListener('pointercancel', onUp);
            if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
            if (dragFlagTimeoutRef.current) clearTimeout(dragFlagTimeoutRef.current);
            if (moveFrameRef.current !== null) cancelAnimationFrame(moveFrameRef.current);
            resetStyles();
        };
    }, []);

    const handlePointerDown = useCallback((index: number, e: React.PointerEvent) => {
        // Pointer Captureを開始して、ウィンドウ外でもイベントを拾えるようにする
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        
        startPos.current = { x: e.clientX, y: e.clientY };
        dragIndexRef.current = index;
        activated.current = false;
        wasDraggedRef.current = false;
    }, []);

    const checkWasDragged = useCallback(() => wasDraggedRef.current, []);

    return {
        checkWasDragged,
        handlePointerDown,
        containerRef,
    };
}
