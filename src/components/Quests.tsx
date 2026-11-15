import { ArrowUpRight } from "@phosphor-icons/react";
import { quests } from "../content/projects";
import { ui } from "../i18n/strings";
import { useT } from "../store";

export function Quests() {
  const t = useT();
  return (
    <section className="quests" aria-labelledby="quests-title">
      <h2 className="section-title section-title-sm" id="quests-title">
        {t(ui.questsTitle)}
      </h2>
      <ul className="quest-list">
        {quests.map((q) => (
          <li key={q.id} className="quest">
            {q.shot && (
              <figure className="quest-shot">
                <img src={q.shot.src} alt={t(q.shot.alt)} loading="lazy" />
              </figure>
            )}
            <h3 className="quest-name">
              {q.href ? (
                <a href={q.href} target="_blank" rel="noreferrer">
                  {q.name}
                  <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                </a>
              ) : (
                q.name
              )}
            </h3>
            <p>{t(q.summary)}</p>
            <p className="quest-stack">
              {q.stack.join(", ")}
              {!q.href && <span>{t(ui.privateRepo)}</span>}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
