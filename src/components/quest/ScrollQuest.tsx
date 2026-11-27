import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { projects } from "../../content/projects";
import type { T } from "../../content/types";
import { useStore, useT } from "../../store";
import { DIRS, type Dir, facing, laneFor, laneX, reached, trailX, type Waypoint } from "./path";
import { CELL, CHEST, IDLE, JUMP, WALK } from "./sprites";
import "./quest.css";

const ui = {
  chests: { pt: "Baús", en: "Chests" },
  allChests: { pt: "Todos os baús abertos!", en: "Every chest opened!" },
  hide: { pt: "Esconder o soldadinho", en: "Hide the soldier" },
  show: { pt: "Mostrar o soldadinho", en: "Show the soldier" },
  soldier: {
    pt: "Soldadinho: desce com a página e abre um baú em cada projeto. Clique para ele pular.",
    en: "Little soldier: walks down with the page and opens a chest at each project. Click to make him jump.",
  },
} satisfies Record<string, T>;

/** Where his feet sit on screen while the page scrolls (fraction of the viewport height). */
const FEET_AT = 0.62;
/** Chest sits this far below the top of its project section. */
const CHEST_OFFSET = 150;
/** Screen pixels walked per walk frame, so his steps match the scroll. */
const PX_PER_STEP = 14;
const WRAP = 1240;

const scaleFor = (width: number) => (width >= 1400 ? 2 : 1);

function layout(): Waypoint[] {
  const width = window.innerWidth;
  const s = CELL * scaleFor(width);
  return projects.flatMap((p, i) => {
    const el = document.getElementById(p.id);
    if (!el) return [];
    const top = el.getBoundingClientRect().top + window.scrollY;
    return [{ id: p.id, x: laneX(laneFor(i, width), width, WRAP, s), y: top + CHEST_OFFSET }];
  });
}

function Chest({ w, open, scale }: { w: Waypoint; open: boolean; scale: number }) {
  const size = CELL * scale;
  return (
    <div
      className={open ? "quest-chest is-open" : "quest-chest"}
      style={
        {
          left: w.x - size / 2,
          top: w.y - size * 0.8,
          width: size,
          height: size,
          "--frames": CHEST.frames,
          "--sheet": `url(${CHEST.src})`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      {open && <span className="quest-chest-plus">+1</span>}
    </div>
  );
}

/**
 * The scroll minigame: a PixelLab soldier walks down the page with the scroll,
 * zig-zagging between the side gutters, and opens a chest at every project.
 */
export function ScrollQuest() {
  const t = useT();
  const reduce = useReducedMotion();
  const loot = useStore((s) => s.loot);
  const collect = useStore((s) => s.collect);
  const off = useStore((s) => s.questOff);
  const toggle = useStore((s) => s.toggleQuest);
  const [points, setPoints] = useState<Waypoint[]>([]);
  const [scale, setScale] = useState(1);
  const soldier = useRef<HTMLButtonElement>(null);
  const pointsRef = useRef<Waypoint[]>([]);
  const jumpUntil = useRef(0);
  const total = projects.length;
  const done = loot.length >= total;

  // Chest positions follow the real layout: images load late and change section heights.
  useLayoutEffect(() => {
    if (off) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = layout();
        pointsRef.current = next;
        setPoints(next);
        setScale(scaleFor(window.innerWidth));
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [off]);

  // The walk loop: position from the scroll, frames from the distance walked.
  useEffect(() => {
    if (off) return;
    const el = soldier.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    let pos: { x: number; y: number } | null = null;
    let dir: Dir = "south";
    let walked = 0;
    let still = 0;
    let idleClock = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const pts = pointsRef.current;
      const sc = scaleFor(window.innerWidth);
      const size = CELL * sc;
      const feetY = window.scrollY + window.innerHeight * FEET_AT;
      const target = { x: trailX(pts, feetY), y: feetY };
      if (!pos) pos = { ...target };
      const k = reduce ? 1 : Math.min(1, dt * 9);
      const dx = (target.x - pos.x) * k;
      const dy = (target.y - pos.y) * k;
      pos.x += dx;
      pos.y += dy;
      // Never let him fall off the screen on a long fling.
      const minY = window.scrollY + window.innerHeight * 0.3;
      const maxY = window.scrollY + window.innerHeight * 0.92;
      pos.y = Math.min(maxY, Math.max(minY, pos.y));

      const step = Math.hypot(dx, dy);
      let sheet = IDLE;
      let frame = 0;
      if (now < jumpUntil.current) {
        sheet = JUMP;
        frame = Math.floor((1 - (jumpUntil.current - now) / JUMP.ms) * JUMP.frames);
        dir = "south";
      } else if (step > 0.4) {
        still = 0;
        dir = facing(dx, dy);
        walked += step;
        sheet = WALK;
        frame = Math.floor(walked / PX_PER_STEP) % WALK.frames;
      } else {
        still += dt;
        idleClock += dt;
        if (still < 0.12) {
          sheet = WALK;
          frame = Math.floor(walked / PX_PER_STEP) % WALK.frames;
        } else {
          frame = Math.floor(idleClock * IDLE.fps) % IDLE.frames;
        }
      }
      if (reduce) frame = 0;
      const row = sheet === JUMP ? 0 : DIRS.indexOf(dir);

      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.transform = `translate3d(${pos.x - size / 2}px, ${pos.y - window.scrollY - size * 0.9}px, 0)`;
      el.style.backgroundImage = `url(${sheet.src})`;
      el.style.backgroundSize = `${sheet.frames * size}px ${sheet.rows * size}px`;
      el.style.backgroundPosition = `${-frame * size}px ${-row * size}px`;

      const got = reached(pts, pos.y);
      if (got.length > useStore.getState().loot.length) collect(got);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [off, reduce, collect]);

  // A happy jump when the last chest opens.
  useEffect(() => {
    if (done && !reduce) jumpUntil.current = performance.now() + JUMP.ms;
  }, [done, reduce]);

  const jump = useCallback(() => {
    if (!reduce) jumpUntil.current = performance.now() + JUMP.ms;
  }, [reduce]);

  return (
    <>
      {!off && (
        <>
          <div className="quest-chests">
            {points.map((w) => (
              <Chest key={w.id} w={w} open={loot.includes(w.id)} scale={scale} />
            ))}
          </div>
          <button
            ref={soldier}
            type="button"
            className="quest-soldier"
            onClick={jump}
            aria-label={t(ui.soldier)}
            title={t(ui.soldier)}
          />
        </>
      )}
      <div className={done ? "quest-hud is-done" : "quest-hud"}>
        {!off && (
          <p className="quest-count" aria-live="polite">
            <span
              className="quest-hud-chest"
              style={{ backgroundImage: `url(${CHEST.src})` }}
              aria-hidden="true"
            />
            {done ? t(ui.allChests) : `${t(ui.chests)} ${loot.length}/${total}`}
          </p>
        )}
        <button
          type="button"
          className="quest-toggle"
          onClick={toggle}
          aria-label={off ? t(ui.show) : t(ui.hide)}
          title={off ? t(ui.show) : t(ui.hide)}
        >
          {off ? <Eye size={18} weight="bold" /> : <EyeSlash size={18} weight="bold" />}
        </button>
      </div>
    </>
  );
}
