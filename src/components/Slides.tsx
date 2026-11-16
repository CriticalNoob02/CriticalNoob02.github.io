import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Shot } from "../content/types";
import { ui } from "../i18n/strings";
import { useT } from "../store";

/**
 * A social-media carousel: the slides sit side by side and are swiped,
 * scrolled or stepped with the arrows, the way they would be in the feed.
 */
export function Slides({ slides, label }: { slides: Shot[]; label: string }) {
  const t = useT();
  const reduce = useReducedMotion();
  const track = useRef<HTMLOListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () =>
      setEdge({
        start: el.scrollLeft <= 4,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  /** Moves one slide (plus the gap) to either side. */
  const step = (dir: 1 | -1) => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (first.offsetWidth + gap), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <motion.div
      className="slides"
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be reachable by keyboard */}
      <ol className="slides-track" ref={track} tabIndex={0} aria-label={label}>
        {slides.map((s) => (
          <li key={s.src} className="slide">
            <img src={s.src} alt={t(s.alt)} loading="lazy" width={720} height={900} />
          </li>
        ))}
      </ol>
      <div className="slides-controls">
        <button
          type="button"
          className="slides-arrow"
          onClick={() => step(-1)}
          disabled={edge.start}
          aria-label={t(ui.slidePrev)}
          title={t(ui.slidePrev)}
        >
          <CaretLeft size={18} weight="bold" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="slides-arrow"
          onClick={() => step(1)}
          disabled={edge.end}
          aria-label={t(ui.slideNext)}
          title={t(ui.slideNext)}
        >
          <CaretRight size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
}
