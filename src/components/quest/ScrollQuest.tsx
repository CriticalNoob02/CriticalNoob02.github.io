import { Eye, EyeSlash, Sword } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import type { T } from "../../content/types";
import { useStore, useT } from "../../store";
import { type Body, jump, makeWorld, newBody, type Platform, step } from "./engine";
import { ATTACK, CELL, FEET, IDLE, JUMP, type Sheet, WALK } from "./sprites";
import "./quest.css";

const ui = {
  beaten: { pt: "Tags derrotadas", en: "Tags beaten" },
  allBeaten: { pt: "Todas as tags derrotadas!", en: "Every tag beaten!" },
  hide: { pt: "Esconder o soldadinho", en: "Hide the soldier" },
  show: { pt: "Mostrar o soldadinho", en: "Show the soldier" },
  soldier: {
    pt: "Soldadinho: desce com a página pulando nos cards e derrota as tags. Clique para ele pular.",
    en: "Little soldier: rides the page down jumping on the cards and beats the tags. Click to make him jump.",
  },
} satisfies Record<string, T>;

/** Blocks whose whole top edge is a ledge. */
const BLOCKS = [
  ".sheet",
  ".shot",
  ".slides",
  ".project-stats > div",
  ".project-link",
  ".quest",
  ".btn",
];
/** Text whose first line is a ledge, as wide as the words. */
const LINES = [
  ".hero-title",
  ".hero-intro",
  ".section-title",
  ".section-intro",
  ".brand",
  ".project-role",
  ".project-headline",
  ".project-summary",
  ".feats li",
  ".quest-name",
  ".about-bio",
];
const ENEMIES = ".chips li";

const scaleFor = (width: number) => (width >= 1700 ? 2 : 1);

/** Stable ids for elements, so a ledge keeps its key when the layout is measured again. */
const ids = new WeakMap<Element, string>();
let nextId = 0;
function idOf(el: Element): string {
  let id = ids.get(el);
  if (!id) {
    id = `e${nextId++}`;
    ids.set(el, id);
  }
  return id;
}

function visible(r: DOMRect) {
  return r.width >= 20 && r.height > 0;
}

/** Reads every ledge and enemy from the page, in document pixels. */
function measure(enemyEls: Map<string, HTMLElement>, platformEls: Map<string, HTMLElement>) {
  const sx = window.scrollX;
  const sy = window.scrollY;
  const out: Platform[] = [];
  enemyEls.clear();
  platformEls.clear();
  const add = (el: HTMLElement, key: string, r: DOMRect, enemy?: string) => {
    out.push({ key, l: r.left + sx, r: r.right + sx, y: r.top + sy, b: r.bottom + sy, enemy });
    platformEls.set(key, el);
  };
  for (const el of document.querySelectorAll<HTMLElement>(BLOCKS.join(","))) {
    const r = el.getBoundingClientRect();
    if (visible(r)) add(el, idOf(el), r);
  }
  const range = document.createRange();
  for (const el of document.querySelectorAll<HTMLElement>(LINES.join(","))) {
    range.selectNodeContents(el);
    const first = [...range.getClientRects()].filter(visible);
    if (first.length === 0) continue;
    // The words of the first line: every rect that shares the top of the first one.
    const t = first[0].top;
    const line = first.filter((r) => Math.abs(r.top - t) < 4);
    const l = Math.min(...line.map((r) => r.left));
    const rr = Math.max(...line.map((r) => r.right));
    const b = Math.max(...line.map((r) => r.bottom));
    add(el, idOf(el), new DOMRect(l, t, rr - l, b - t));
  }
  for (const el of document.querySelectorAll<HTMLElement>(ENEMIES)) {
    const r = el.getBoundingClientRect();
    if (!visible(r)) continue;
    const key = idOf(el);
    add(el, key, r, key);
    enemyEls.set(key, el);
  }
  return out;
}

/** Restart a one-shot CSS reaction on a page element. */
function react(el: HTMLElement | undefined, kind: "bump" | "hit") {
  if (!el) return;
  el.dataset.soldier = "";
  void el.offsetWidth;
  el.dataset.soldier = kind;
}

/** A floating word over the page ("POW!"), in document pixels. */
function pop(layer: HTMLElement | null, x: number, y: number, text: string) {
  if (!layer) return;
  const span = document.createElement("span");
  span.className = "soldier-pop";
  span.textContent = text;
  span.style.left = `${x}px`;
  span.style.top = `${y}px`;
  layer.appendChild(span);
  setTimeout(() => span.remove(), 900);
}

function frameOf(sheet: Sheet, t: number) {
  return Math.floor(t * sheet.fps) % sheet.frames;
}

/**
 * The page platformer: a PixelLab soldier, seen from the side, follows the scroll by
 * walking on the cards and text, dropping and jumping between them, and beats the
 * stack chips (stomp or sword) that he meets on screen.
 */
export function ScrollQuest() {
  const t = useT();
  const off = useStore((s) => s.questOff);
  const toggle = useStore((s) => s.toggleQuest);
  const count = useStore((s) => s.defeated.length);
  const defeat = useStore((s) => s.defeat);
  const [total, setTotal] = useState(0);
  const sprite = useRef<HTMLButtonElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const body = useRef<Body | null>(null);
  const done = total > 0 && count >= total;

  useEffect(() => {
    if (off) return;
    const el = sprite.current;
    if (!el) return;
    const enemyEls = new Map<string, HTMLElement>();
    const platformEls = new Map<string, HTMLElement>();
    const beaten = new Set(useStore.getState().defeated);
    let platforms: Platform[] = [];
    let measuredAt = -1e9;
    let raf = 0;
    let last = performance.now();
    let clock = 0;
    let walked = 0;
    let attackClock = 0;

    // Chips beaten earlier in this visit stay beaten if the soldier is shown again.
    const remeasure = () => {
      platforms = measure(enemyEls, platformEls);
      setTotal(enemyEls.size);
      for (const [id, chip] of enemyEls) if (beaten.has(id)) chip.dataset.soldier = "down";
    };

    const win = (id: string, x: number, y: number, word: string) => {
      if (beaten.has(id)) return;
      beaten.add(id);
      defeat(id);
      const chip = enemyEls.get(id);
      react(chip, "hit");
      setTimeout(() => {
        if (chip) chip.dataset.soldier = "down";
      }, 320);
      pop(layer.current, x, y, word);
    };

    const tick = (now: number) => {
      const dt = Math.min(1 / 30, (now - last) / 1000);
      last = now;
      clock += dt;
      if (now - measuredAt > 500) {
        remeasure();
        measuredAt = now;
      }
      const scale = scaleFor(window.innerWidth);
      const world = makeWorld(platforms, {
        defeated: beaten,
        scrollY: window.scrollY,
        vh: window.innerHeight,
        docW: document.documentElement.scrollWidth,
        scale,
      });
      if (!body.current) {
        body.current = newBody(window.innerWidth * 0.62 + window.scrollX, window.scrollY - 10);
      }
      const b = body.current;
      const wasAttacking = b.attackT > 0;
      const x0 = b.x;
      const ev = step(b, world, dt);
      walked += Math.abs(b.x - x0);

      if (ev.stomped) win(ev.stomped, b.x, b.y - 30 * scale, "POW!");
      if (ev.slashed) {
        const p = world.byKey.get(ev.slashed);
        win(ev.slashed, p ? (p.l + p.r) / 2 : b.x, p ? p.y - 8 : b.y - 30 * scale, "TCHAU!");
      }
      if (ev.landed && ev.landed.speed > 520) react(platformEls.get(ev.landed.key), "bump");
      if (ev.attacked && !wasAttacking) attackClock = 0;

      // Pick the frame.
      let sheet = IDLE;
      let frame = frameOf(IDLE, clock);
      if (b.attackT > 0) {
        attackClock += dt;
        sheet = ATTACK;
        frame = Math.min(
          ATTACK.frames - 1,
          Math.floor((attackClock / ATTACK.ms) * 1000 * ATTACK.frames),
        );
      } else if (!b.ground) {
        sheet = JUMP;
        // Rising: take-off frames; falling: tuck, then reach for the floor.
        frame = b.vy < -250 ? 3 : b.vy < 0 ? 4 : b.vy < 400 ? 5 : 7;
      } else if (Math.abs(b.vx) > 1) {
        sheet = WALK;
        frame = Math.floor(walked / (9 * scale)) % WALK.frames;
      }

      const size = CELL * scale;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.backgroundImage = `url(${sheet.src})`;
      el.style.backgroundSize = `${sheet.frames * size}px ${size}px`;
      el.style.backgroundPosition = `${-frame * size}px 0`;
      const left = b.x - window.scrollX - size / 2;
      const top = b.y - window.scrollY - FEET * scale;
      el.style.transform = `translate3d(${left}px, ${top}px, 0) scaleX(${b.facing})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      body.current = null;
      for (const chip of enemyEls.values()) delete chip.dataset.soldier;
    };
  }, [off, defeat]);

  const onClick = () => {
    if (body.current) jump(body.current);
  };

  return (
    <>
      {!off && (
        <>
          <div className="soldier-layer" ref={layer} aria-hidden="true" />
          <button
            ref={sprite}
            type="button"
            className="soldier"
            onClick={onClick}
            aria-label={t(ui.soldier)}
            title={t(ui.soldier)}
          />
        </>
      )}
      <div className={done ? "soldier-hud is-done" : "soldier-hud"}>
        {!off && total > 0 && (
          <p className="soldier-count" aria-live="polite">
            <Sword size={18} weight="fill" aria-hidden="true" />
            {done ? t(ui.allBeaten) : `${t(ui.beaten)} ${count}/${total}`}
          </p>
        )}
        <button
          type="button"
          className="soldier-toggle"
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
