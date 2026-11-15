import { EnvelopeSimple, GithubLogo, LinkedinLogo } from "@phosphor-icons/react";
import { character } from "../content/character";
import { ui } from "../i18n/strings";
import { useT } from "../store";
import { contactHref } from "./contact";

export function About() {
  const t = useT();
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <h2 className="section-title" id="about-title">
        {t(ui.aboutTitle)}
      </h2>
      <p className="about-bio">{t(character.bio)}</p>
      <div className="about-contact">
        <a className="btn btn-primary" href={contactHref()} target="_blank" rel="noreferrer">
          {t(ui.contact)}
        </a>
        <ul className="about-links">
          <li>
            <a href={character.github} target="_blank" rel="noreferrer">
              <GithubLogo size={20} aria-hidden="true" /> GitHub
            </a>
          </li>
          {character.linkedin && (
            <li>
              <a href={character.linkedin} target="_blank" rel="noreferrer">
                <LinkedinLogo size={20} aria-hidden="true" /> LinkedIn
              </a>
            </li>
          )}
          {character.email && (
            <li>
              <a href={`mailto:${character.email}`}>
                <EnvelopeSimple size={20} aria-hidden="true" /> {character.email}
              </a>
            </li>
          )}
        </ul>
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
