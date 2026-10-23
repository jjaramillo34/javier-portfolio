"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Scroll progress for a vertical timeline: a rail from the first marker to the last, the part
 * of it filled so far, and how many markers the fill has reached. A marker is reached when its
 * centre passes `anchor` (a fraction of the viewport height).
 *
 * Attach `listRef` to the positioned container and `markerRef(index)` to each marker, in order.
 * Pass `layoutKey` whenever the set of markers changes (e.g. a filter) to re-measure.
 */
export function useTimelineProgress(layoutKey: unknown = null, anchor = 0.6) {
  const listRef = useRef<HTMLDivElement>(null);
  const markers = useRef<(HTMLElement | null)[]>([]);
  const [rail, setRail] = useState({ top: 0, height: 0, fill: 0 });
  const [reached, setReached] = useState(0);

  const markerRef = useCallback(
    (index: number) => (node: HTMLElement | null) => {
      markers.current[index] = node;
    },
    [],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: layoutKey only triggers a re-measure.
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const list = listRef.current;
      const nodes = markers.current.filter((node): node is HTMLElement => node !== null);
      if (!list || nodes.length === 0) return;

      const listTop = list.getBoundingClientRect().top;
      const centers = nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });
      const first = centers[0];
      const last = centers[centers.length - 1];
      const line = window.innerHeight * anchor;

      setRail({
        top: first - listTop,
        height: last - first,
        fill: Math.min(Math.max(line - first, 0), last - first),
      });
      setReached(centers.filter((center) => center <= line).length);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Content above or inside the list can change height (images, filters, expanding text).
    const observer = new ResizeObserver(schedule);
    if (listRef.current) observer.observe(listRef.current);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [layoutKey, anchor]);

  return { listRef, markerRef, rail, reached };
}
