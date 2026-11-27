import type { T } from "./types";

/**
 * Personal block. Empty `linkedin` / `email` are not rendered, so the page
 * never shows a placeholder contact.
 */
export const character = {
  name: "Adriel Rodrigues",
  title: { pt: "Desenvolvedor fullstack", en: "Fullstack developer" } satisfies T,
  headline: {
    pt: "Construo produtos inteiros, do banco ao pixel",
    en: "I build whole products, from database to pixel",
  } satisfies T,
  intro: {
    pt: "Saúde digital no trabalho, plataformas próprias e jogos no resto do tempo.",
    en: "Digital health at work, my own platforms and games the rest of the time.",
  } satisfies T,
  bio: {
    pt: "Trabalho de ponta a ponta: schema, fila, API, tela, deploy e o alerta que toca de madrugada. Gosto de sistemas que se explicam sozinhos e de testes que travam regra de negócio. Python foi o primeiro amor; hoje o dia a dia é TypeScript e Go.",
    en: "I work end to end: schema, queue, API, screen, deploy and the alert that fires at 3 a.m. I like systems that explain themselves and tests that lock business rules. Python was my first love; these days it is mostly TypeScript and Go.",
  } satisfies T,
  github: "https://github.com/CriticalNoob02",
  linkedin: "https://www.linkedin.com/in/adrieldevelop",
  email: "",
  portrait: "/media/idle/guerreiro.png",
  home: "Palhoça, SC",
  /** Career as a quest log, newest first (same dates as LinkedIn). */
  journey: [
    {
      when: { pt: "fev 2026 · hoje", en: "Feb 2026 · now" },
      role: { pt: "Engenheiro de software", en: "Software engineer" },
      where: "Radar Saúde",
      note: {
        pt: "De volta à Radar, agora de ponta a ponta: biblioteca de UI, portes para Go, recebimento de dados e os produtos do hospital.",
        en: "Back at Radar, now end to end: the UI library, Go ports, data intake and the hospital products.",
      },
    },
    {
      when: { pt: "set 2024 · fev 2026", en: "Sep 2024 · Feb 2026" },
      role: { pt: "Engenheiro de software", en: "Software engineer" },
      where: "MaxPan Tech",
      note: { pt: "Remoto.", en: "Remote." },
    },
    {
      when: { pt: "jan 2024 · set 2024", en: "Jan 2024 · Sep 2024" },
      role: { pt: "Engenheiro de software", en: "Software engineer" },
      where: "Radar Saúde",
      note: {
        pt: "Java com Spring, React, Docker Swarm e Rundeck.",
        en: "Java with Spring, React, Docker Swarm and Rundeck.",
      },
    },
    {
      when: { pt: "out 2022 · jan 2024", en: "Oct 2022 · Jan 2024" },
      role: { pt: "QA", en: "QA" },
      where: "Radar Saúde",
      note: {
        pt: "Primeira missão: testes com Cypress e Storybook.",
        en: "First quest: tests with Cypress and Storybook.",
      },
    },
  ] satisfies { when: T; role: T; where: string; note: T }[],
  /** Stack as an inventory, one slot per group. */
  gear: [
    { slot: { pt: "Linguagens", en: "Languages" }, items: ["TypeScript", "Go", "Python", "Java"] },
    { slot: { pt: "Front-end", en: "Front end" }, items: ["React", "Next.js", "React Native"] },
    { slot: { pt: "Back-end", en: "Back end" }, items: ["Node", "Express", "Prisma", "Spring"] },
    { slot: { pt: "Dados", en: "Data" }, items: ["PostgreSQL", "Redis", "Airflow"] },
    { slot: { pt: "Infra", en: "Infra" }, items: ["Docker", "CI/CD", "Grafana"] },
  ] satisfies { slot: T; items: string[] }[],
  /** Character-sheet attributes: one line each, the number is a self-rating out of 20. */
  attributes: [
    { name: { pt: "Front-end", en: "Front end" }, value: 17, note: "React, Next.js, React Native" },
    { name: { pt: "Back-end", en: "Back end" }, value: 17, note: "Node, Express, Prisma, Go" },
    { name: { pt: "Dados", en: "Data" }, value: 14, note: "PostgreSQL, Redis, Airflow" },
    { name: { pt: "Infra", en: "Infra" }, value: 14, note: "Docker, CI/CD, Grafana" },
  ],
};
