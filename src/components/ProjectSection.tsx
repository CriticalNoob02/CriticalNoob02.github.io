import { ArrowUpRight } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Project, Shot } from "../content/types";
import { useStore, useT } from "../store";
import { ForjaTheming } from "./extras/ForjaTheming";
import { MesaD20 } from "./extras/MesaD20";
import { RadarBody } from "./extras/RadarBody";

/** Live pieces that show what a project does, rendered under its section. */
const EXTRAS: Partial<Record<Project["id"], () => React.JSX.Element>> = {
  radar: RadarBody,
  forja: ForjaTheming,
  mesa: MesaD20,
};

/** The project's own mark, set in the project's own type. */
function Brand({ p }: { p: Project }) {
  const { logo } = p;
  return (
    <div className="brand">
      {p.id === "forja" && (
        <span className="brand-forja-mark" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
      )}
      {logo.src && (
        <img
          className={logo.full ? "brand-logo brand-logo-full" : "brand-logo"}
          src={logo.src}
          alt={logo.full ? p.name : ""}
          data-pixel={logo.pixel ? "" : undefined}
        />
      )}
      {!logo.full && (
        <span className="brand-name">
          {p.name}
          {logo.sub && <small>{logo.sub}</small>}
        </span>
      )}
    </div>
  );
}

/** One main shot; the others overlap it, and clicking any brings it to the front. */
function Shots({ p }: { p: Project }) {
  const t = useT();
  const reduce = useReducedMotion();
  const [order, setOrder] = useState(() => p.shots.map((_, i) => i));
  if (p.shots.length === 0) return null;
  const shots: Shot[] = order.map((i) => p.shots[i]);
  const front = (pos: number) => setOrder((o) => [o[pos], ...o.filter((_, i) => i !== pos)]);
  return (
    <motion.div
      className={`shots shots-${p.layout} shots-n${shots.length}${p.phone ? " has-phone" : ""}`}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {p.phone && (
        <figure className="shot shot-phone">
          <img src={p.phone.src} alt={t(p.phone.alt)} loading="lazy" />
        </figure>
      )}
      {shots.map((s, i) =>
        i === 0 ? (
          <figure key={s.src} className="shot shot-main">
            <img src={s.src} alt={t(s.alt)} loading="lazy" data-pixel={s.pixel ? "" : undefined} />
          </figure>
        ) : (
          <button
            key={s.src}
            type="button"
            className={`shot shot-side shot-side-${i}`}
            onClick={() => front(i)}
            aria-label={t(s.alt)}
          >
            <img src={s.src} alt="" loading="lazy" data-pixel={s.pixel ? "" : undefined} />
          </button>
        ),
      )}
    </motion.div>
  );
}

export function ProjectSection({ p }: { p: Project }) {
  const t = useT();
  const see = useStore((s) => s.see);
  const ref = useRef<HTMLElement>(null);
  const Extra = EXTRAS[p.id];

  // A section counts as seen once a good part of it has been on screen: that is the XP.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          see(p.id);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [p.id, see]);

  return (
    <section
      ref={ref}
      className={`project project-${p.layout}`}
      data-theme={p.id}
      id={p.id}
      aria-labelledby={`${p.id}-title`}
    >
      <div className="project-inner">
        <div className="project-text">
          <Brand p={p} />
          <p className="project-role">{t(p.role)}</p>
          <h3 className="project-headline" id={`${p.id}-title`}>
            {t(p.headline)}
          </h3>
          <p className="project-summary">{t(p.summary)}</p>
          {p.stats.length > 0 && (
            <dl className="project-stats">
              {p.stats.map((s) => (
                <div key={s.label.en}>
                  <dd>{s.value}</dd>
                  <dt>{t(s.label)}</dt>
                </div>
              ))}
            </dl>
          )}
        </div>
        <Shots p={p} />
        <div className="project-detail">
          <ul className="feats">
            {p.feats.map((f) => (
              <li key={f.en}>{t(f)}</li>
            ))}
          </ul>
          <ul className="chips" aria-label="Stack">
            {p.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          {p.links.map((l) => (
            <a key={l.href} className="project-link" href={l.href} target="_blank" rel="noreferrer">
              {t(l.label)}
              <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
            </a>
          ))}
        </div>
        {Extra && <Extra />}
      </div>
    </section>
  );
}
