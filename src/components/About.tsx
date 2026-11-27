import { EnvelopeSimple, GithubLogo, LinkedinLogo, MapPin } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { character } from "../content/character";
import { projects } from "../content/projects";
import type { T } from "../content/types";
import { ui } from "../i18n/strings";
import { useStore, useT } from "../store";
import { contactHref } from "./contact";
import { useVisits } from "./visits";
import { level } from "./xp";

const copy = {
  origin: { pt: "Origem", en: "Origin" },
  journey: { pt: "Jornada", en: "Journey" },
  gear: { pt: "Equipamento", en: "Gear" },
  deeds: { pt: "Feitos", en: "Deeds" },
  recruit: { pt: "Recrutar", en: "Recruit" },
  recruitNote: {
    pt: "Aberto a conversas sobre vagas e projetos.",
    en: "Open to talk about roles and projects.",
  },
  products: { pt: "produtos e plataformas", en: "products and platforms" },
  games: { pt: "jogos publicados", en: "games released" },
  tags: { pt: "tags derrotadas pelo soldadinho", en: "tags the soldier beat" },
  visits: { pt: "visitas nesta página", en: "visits to this page" },
} satisfies Record<string, T>;

const ease = [0.16, 1, 0.3, 1] as const;

/** The character sheet: who, where from, the career as a quest log, the gear and the deeds. */
export function About() {
  const t = useT();
  const reduce = useReducedMotion();
  const seen = useStore((s) => s.seen.length);
  const beaten = useStore((s) => s.defeated.length);
  const visits = useVisits();
  const built = projects.filter((p) => p.group === "work").length;
  const games = projects.filter((p) => p.group === "games").length;
  const reveal = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.7, ease },
      };

  const deeds = [
    { value: String(built), label: copy.products },
    { value: String(games), label: copy.games },
    { value: String(beaten), label: copy.tags },
    ...(visits === null
      ? []
      : [{ value: visits === undefined ? "…" : visits.toLocaleString(), label: copy.visits }]),
  ];

  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <h2 className="section-title" id="about-title">
        {t(ui.aboutTitle)}
      </h2>

      <div className="ficha">
        <motion.aside className="ficha-id" {...reveal}>
          <div className="ficha-portrait">
            <img src={character.portrait} alt="" width={256} height={256} />
          </div>
          <div className="ficha-id-body">
            <p className="ficha-name">{character.name}</p>
            <p className="ficha-class">
              {t(character.title)} · {t(ui.sheetLevel)} <b>{level(seen)}</b>
            </p>
            <p className="ficha-home">
              <MapPin size={16} weight="fill" aria-hidden="true" />
              {character.home}
            </p>
            <div className="ficha-recruit">
              <p className="ficha-label">{t(copy.recruit)}</p>
              <p className="ficha-recruit-note">{t(copy.recruitNote)}</p>
              <a className="btn btn-primary" href={contactHref()} target="_blank" rel="noreferrer">
                {t(ui.contact)}
              </a>
              <ul className="ficha-links">
                <li>
                  <a href={character.github} target="_blank" rel="noreferrer">
                    <GithubLogo size={18} aria-hidden="true" /> GitHub
                  </a>
                </li>
                {character.linkedin && (
                  <li>
                    <a href={character.linkedin} target="_blank" rel="noreferrer">
                      <LinkedinLogo size={18} aria-hidden="true" /> LinkedIn
                    </a>
                  </li>
                )}
                {character.email && (
                  <li>
                    <a href={`mailto:${character.email}`}>
                      <EnvelopeSimple size={18} aria-hidden="true" /> E-mail
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </motion.aside>

        <div className="ficha-main">
          <motion.div className="ficha-panel ficha-origin" {...reveal}>
            <p className="ficha-label">{t(copy.origin)}</p>
            <p className="ficha-bio">{t(character.bio)}</p>
          </motion.div>

          <motion.div className="ficha-panel ficha-journey" {...reveal}>
            <p className="ficha-label">{t(copy.journey)}</p>
            <ol className="journey">
              {character.journey.map((j) => (
                <li key={j.when.en}>
                  <span className="journey-when">{t(j.when)}</span>
                  <span className="journey-role">
                    {t(j.role)} <span className="journey-where">· {j.where}</span>
                  </span>
                  <span className="journey-note">{t(j.note)}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div className="ficha-panel ficha-gear" {...reveal}>
            <p className="ficha-label">{t(copy.gear)}</p>
            <dl className="gear">
              {character.gear.map((g) => (
                <div key={g.slot.en} className="gear-slot">
                  <dt>{t(g.slot)}</dt>
                  <dd>
                    {g.items.map((i) => (
                      <span key={i} className="gear-item">
                        {i}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div className="ficha-panel ficha-deeds" {...reveal}>
            <p className="ficha-label">{t(copy.deeds)}</p>
            <dl className="deeds">
              {deeds.map((d) => (
                <div key={d.label.en}>
                  <dd>{d.value}</dd>
                  <dt>{t(d.label)}</dt>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>

      <footer className="footer">
        <p>{t(ui.sampleData)}</p>
        <p>
          {character.name}, {new Date().getFullYear()}
        </p>
      </footer>
    </section>
  );
}
