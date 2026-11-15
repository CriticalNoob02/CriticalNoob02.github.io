import { MotionConfig } from "motion/react";
import { useEffect } from "react";
import { About } from "./components/About";
import { Hero } from "./components/Hero";
import { Nav } from "./components/Nav";
import { ProjectSection } from "./components/ProjectSection";
import { Quests } from "./components/Quests";
import { XpToast } from "./components/XpToast";
import { projects } from "./content/projects";
import { ui } from "./i18n/strings";
import { useStore, useT } from "./store";

function Group({ id, title, intro }: { id: "work" | "games"; title: string; intro?: string }) {
  return (
    <>
      <header className="group-head" id={id}>
        <h2 className="section-title">{title}</h2>
        {intro && <p className="section-intro">{intro}</p>}
      </header>
      {projects
        .filter((p) => p.group === id)
        .map((p) => (
          <ProjectSection key={p.id} p={p} />
        ))}
    </>
  );
}

export function App() {
  const t = useT();
  const lang = useStore((s) => s.lang);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    document.title = ui.pageTitle[lang];
  }, [lang]);

  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main>
        <Hero />
        <Group id="work" title={t(ui.workTitle)} />
        <Group id="games" title={t(ui.gamesTitle)} intro={t(ui.gamesIntro)} />
        <Quests />
        <About />
      </main>
      <XpToast />
    </MotionConfig>
  );
}
