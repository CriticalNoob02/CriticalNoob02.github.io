import { ArrowDown } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { character } from "../content/character";
import { ui } from "../i18n/strings";
import { useStore, useT } from "../store";
import { contactHref } from "./contact";
import { level, xpFill } from "./xp";

const ease = [0.16, 1, 0.3, 1] as const;

/** The RPG nod: a character sheet beside the headline. */
function Sheet() {
  const t = useT();
  const reduce = useReducedMotion();
  const seen = useStore((s) => s.seen.length);
  return (
    <motion.aside
      className="sheet"
      aria-label={t(ui.aboutTitle)}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.25, ease }}
    >
      <div className="sheet-portrait">
        <img src={character.portrait} alt="" width={256} height={256} />
      </div>
      <div className="sheet-body">
        <p className="sheet-name">{character.name}</p>
        <dl className="sheet-meta">
          <div>
            <dt>{t(ui.sheetClass)}</dt>
            <dd>{t(character.title)}</dd>
          </div>
          <div>
            <dt>{t(ui.sheetGuild)}</dt>
            <dd>Radar Saúde</dd>
          </div>
        </dl>
        <div className="sheet-xp">
          <span className="sheet-level">
            {t(ui.sheetLevel)} <b>{level(seen)}</b>
          </span>
          <span className="sheet-xp-bar" aria-hidden="true">
            <motion.span
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: xpFill(seen) }}
              transition={{ duration: 0.9, ease }}
            />
          </span>
        </div>
        <ul className="sheet-attrs">
          {character.attributes.map((a) => (
            <li key={a.name.en}>
              <span className="attr-value">{a.value}</span>
              <span className="attr-name">{t(a.name)}</span>
              <span className="attr-note">{a.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.aside>
  );
}

export function Hero() {
  const t = useT();
  const reduce = useReducedMotion();
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease },
        };
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <motion.h1 className="hero-title" {...enter(0)}>
          {t(character.headline)}
        </motion.h1>
        <motion.p className="hero-intro" {...enter(0.1)}>
          {t(character.intro)}
        </motion.p>
        <motion.div className="hero-ctas" {...enter(0.18)}>
          <a className="btn btn-primary" href="#work">
            {t(ui.seeWork)}
            <ArrowDown size={18} weight="bold" aria-hidden="true" />
          </a>
          <a className="btn btn-ghost" href={contactHref()} target="_blank" rel="noreferrer">
            {t(ui.contact)}
          </a>
        </motion.div>
      </div>
      <Sheet />
    </section>
  );
}
