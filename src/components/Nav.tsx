import { GithubLogo } from "@phosphor-icons/react";
import { character } from "../content/character";
import { ui } from "../i18n/strings";
import { useStore, useT } from "../store";
import { level, xpFill } from "./xp";

export function Nav() {
  const t = useT();
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const seen = useStore((s) => s.seen.length);
  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="nav-name" href="#top">
          {character.name}
        </a>
        <nav aria-label={t(ui.navWork)}>
          <ul className="nav-links">
            <li>
              <a href="#work">{t(ui.navWork)}</a>
            </li>
            <li>
              <a href="#games">{t(ui.navGames)}</a>
            </li>
            <li>
              <a href="#about">{t(ui.navAbout)}</a>
            </li>
          </ul>
        </nav>
        <div className="nav-xp" title={`${t(ui.sheetLevel)} ${level(seen)}`}>
          <span>
            {t(ui.navLevel)} {level(seen)}
          </span>
          <span className="nav-xp-bar" aria-hidden="true">
            <span style={{ transform: `scaleX(${xpFill(seen)})` }} />
          </span>
        </div>
        <div className="nav-actions">
          <button
            type="button"
            className="nav-lang"
            lang={lang === "pt" ? "en" : "pt-BR"}
            aria-label={t(ui.langToggleLabel)}
            onClick={() => setLang(lang === "pt" ? "en" : "pt")}
          >
            {t(ui.langToggle)}
          </button>
          <a
            className="nav-icon"
            href={character.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <GithubLogo size={20} weight="regular" />
          </a>
        </div>
      </div>
    </header>
  );
}
