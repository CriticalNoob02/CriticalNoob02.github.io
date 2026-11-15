import { useEffect, useRef, useState } from "react";

/** What a three.js scene exposes to run on the stage. */
export type StageScene = {
  /** Draws one frame; `time` in seconds. */
  render: (time: number) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
  /** Pointer relative to the canvas, -1..1 on each axis (y down). */
  pointerMove?: (x: number, y: number) => void;
  pointerLeave?: () => void;
  pointerDown?: (x: number, y: number) => void;
  pointerUp?: (x: number, y: number) => void;
};

export type StageFactory<T extends StageScene> = (canvas: HTMLCanvasElement, still: boolean) => T;

// With reduced motion the scene clock stays at this instant (seconds).
const STILL_TIME = 2.6;

/**
 * Canvas for a three.js scene, adapted from the Radar Hospital stage: it sizes the scene,
 * forwards the pointer, and stops drawing when the canvas is off screen or the tab is hidden.
 * The scene arrives through `load` (dynamic import), so three.js is only downloaded when a
 * stage mounts. Without WebGL it calls `onUnavailable`.
 */
export function Stage<T extends StageScene>({
  load,
  onReady,
  onUnavailable,
  className,
  label,
}: {
  load: () => Promise<StageFactory<T>>;
  onReady?: (scene: T) => void;
  onUnavailable?: () => void;
  className?: string;
  label: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const props = useRef({ load, onReady, onUnavailable });
  props.current = { load, onReady, onUnavailable };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    let scene: T | null = null;
    let frame = 0;
    let cancelled = false;
    let visible = false;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    const loop = (ms: number) => {
      scene?.render(still ? STILL_TIME : ms / 1000);
      frame = requestAnimationFrame(loop);
    };
    const stop = () => cancelAnimationFrame(frame);
    const start = () => {
      stop();
      if (visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    props.current
      .load()
      .then((create) => {
        if (cancelled) return;
        const created = create(canvas, still);
        scene = created;

        const resize = () => created.resize(container.clientWidth, container.clientHeight);
        resize();
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);
        cleanups.push(() => resizeObserver.disconnect());

        const viewObserver = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          start();
        });
        viewObserver.observe(container);
        cleanups.push(() => viewObserver.disconnect());
        const onVisibility = () => start();
        document.addEventListener("visibilitychange", onVisibility);
        cleanups.push(() => document.removeEventListener("visibilitychange", onVisibility));

        const at = (event: PointerEvent): [number, number] => {
          const rect = canvas.getBoundingClientRect();
          return [
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            ((event.clientY - rect.top) / rect.height) * 2 - 1,
          ];
        };
        const listeners: [string, (event: PointerEvent) => void][] = [
          ["pointermove", (e) => created.pointerMove?.(...at(e))],
          ["pointerleave", () => created.pointerLeave?.()],
          ["pointerdown", (e) => created.pointerDown?.(...at(e))],
          ["pointerup", (e) => created.pointerUp?.(...at(e))],
        ];
        for (const [type, listener] of listeners) {
          canvas.addEventListener(type, listener as EventListener);
        }
        cleanups.push(() => {
          for (const [type, listener] of listeners) {
            canvas.removeEventListener(type, listener as EventListener);
          }
        });

        setReady(true);
        props.current.onReady?.(created);
        start();
      })
      .catch(() => {
        if (!cancelled) props.current.onUnavailable?.();
      });

    return () => {
      cancelled = true;
      stop();
      for (const cleanup of cleanups) cleanup();
      scene?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      data-ready={ready ? "" : undefined}
      role="img"
      aria-label={label}
    />
  );
}
