import { CaretDown, TreeStructure } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Architecture, ArchNode } from "../content/types";
import { ui } from "../i18n/strings";
import { useT } from "../store";

type Edge = { from: string; to: string };
type Path = { key: string; d: string; out: boolean };

/** Every edge of the map, from the `to` lists. */
function edgesOf(arch: Architecture): Edge[] {
  return arch.layers.flatMap((l) =>
    l.nodes.flatMap((n) => (n.to ?? []).map((to) => ({ from: n.id, to }))),
  );
}

/** Curve between two boxes: vertical between layers, a low arc inside one layer. */
function curve(a: DOMRect, b: DOMRect, box: DOMRect): string {
  const ax = a.left + a.width / 2 - box.left;
  const bx = b.left + b.width / 2 - box.left;
  if (Math.abs(a.top - b.top) < 4) {
    const y = a.bottom - box.top;
    const dip = y + 26;
    return `M ${ax} ${y} C ${ax} ${dip}, ${bx} ${dip}, ${bx} ${y}`;
  }
  const down = b.top > a.top;
  const ay = (down ? a.bottom : a.top) - box.top;
  const by = (down ? b.top : b.bottom) - box.top;
  const mid = (ay + by) / 2;
  return `M ${ax} ${ay} C ${ax} ${mid}, ${bx} ${mid}, ${bx} ${by}`;
}

/**
 * The project's architecture as layers of boxes. One box is active at a time
 * and only its connections are drawn, so a big map never turns into a tangle.
 */
export function ArchMap({ arch, projectId }: { arch: Architecture; projectId: string }) {
  const t = useT();
  const reduce = useReducedMotion();
  const panelId = useId();
  const markerId = `arch-arrow-${projectId}`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(arch.start);
  const [paths, setPaths] = useState<Path[]>([]);
  const board = useRef<HTMLDivElement>(null);
  const boxes = useRef(new Map<string, HTMLButtonElement>());

  const edges = useMemo(() => edgesOf(arch), [arch]);
  const nodes = useMemo(
    () => new Map(arch.layers.flatMap((l) => l.nodes).map((n) => [n.id, n])),
    [arch],
  );
  const linked = useMemo(() => {
    const set = new Set<string>([active]);
    for (const e of edges) {
      if (e.from === active) set.add(e.to);
      if (e.to === active) set.add(e.from);
    }
    return set;
  }, [active, edges]);

  const draw = useCallback(() => {
    const el = board.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const next: Path[] = [];
    for (const e of edges) {
      if (e.from !== active && e.to !== active) continue;
      const a = boxes.current.get(e.from)?.getBoundingClientRect();
      const b = boxes.current.get(e.to)?.getBoundingClientRect();
      if (!a || !b) continue;
      next.push({ key: `${e.from}>${e.to}`, d: curve(a, b, box), out: e.from === active });
    }
    setPaths(next);
  }, [active, edges]);

  useLayoutEffect(() => {
    if (!open) return;
    draw();
    const el = board.current;
    if (!el) return;
    const observer = new ResizeObserver(draw);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open, draw]);

  const current = nodes.get(active) as ArchNode;
  const talks = [...linked].filter((id) => id !== active).map((id) => nodes.get(id)?.name);

  return (
    <div className="arch">
      <button
        type="button"
        className="arch-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <TreeStructure size={20} weight="bold" aria-hidden="true" />
        {t(open ? ui.archClose : ui.archOpen)}
        <CaretDown size={16} weight="bold" aria-hidden="true" className="arch-caret" />
      </button>

      {open && (
        <motion.div
          id={panelId}
          className="arch-panel"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="arch-summary">{t(arch.summary)}</p>
          <p className="arch-hint">{t(ui.archHint)}</p>

          <div className="arch-board" ref={board}>
            <svg className="arch-lines" aria-hidden="true">
              <defs>
                <marker
                  id={markerId}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M0 0 L10 5 L0 10 z" />
                </marker>
              </defs>
              {paths.map((p) => (
                <motion.path
                  key={`${active}:${p.key}`}
                  d={p.d}
                  className={p.out ? "arch-line" : "arch-line arch-line-in"}
                  markerEnd={`url(#${markerId})`}
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
            </svg>

            {arch.layers.map((layer) => (
              <div className="arch-layer" key={layer.label.en}>
                <p className="arch-layer-label">{t(layer.label)}</p>
                <ul className="arch-nodes">
                  {layer.nodes.map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        ref={(el) => {
                          if (el) boxes.current.set(n.id, el);
                          else boxes.current.delete(n.id);
                        }}
                        className="arch-node"
                        data-state={
                          n.id === active ? "active" : linked.has(n.id) ? "linked" : "idle"
                        }
                        aria-pressed={n.id === active}
                        onMouseEnter={() => setActive(n.id)}
                        onFocus={() => setActive(n.id)}
                        onClick={() => setActive(n.id)}
                      >
                        <span className="arch-node-name">{n.name}</span>
                        <span className="arch-node-tech">{n.tech}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="arch-detail" aria-live="polite">
            <p className="arch-detail-name">
              {current.name} <span>{current.tech}</span>
            </p>
            <p>{t(current.note)}</p>
            {talks.length > 0 && (
              <p className="arch-detail-talks">
                {t(ui.archTalks)}: {talks.join(", ")}
              </p>
            )}
          </div>

          {arch.facts.length > 0 && (
            <dl className="project-stats arch-facts">
              {arch.facts.map((f) => (
                <div key={f.label.en}>
                  <dd>{f.value}</dd>
                  <dt>{t(f.label)}</dt>
                </div>
              ))}
            </dl>
          )}
        </motion.div>
      )}
    </div>
  );
}
