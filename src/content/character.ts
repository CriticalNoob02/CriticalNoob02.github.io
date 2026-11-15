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
  /** Character-sheet attributes: one line each, the number is a self-rating out of 20. */
  attributes: [
    { name: { pt: "Front-end", en: "Front end" }, value: 17, note: "React, Next.js, React Native" },
    { name: { pt: "Back-end", en: "Back end" }, value: 17, note: "Node, Express, Prisma, Go" },
    { name: { pt: "Dados", en: "Data" }, value: 14, note: "PostgreSQL, Redis, Airflow" },
    { name: { pt: "Infra", en: "Infra" }, value: 14, note: "Docker, CI/CD, Grafana" },
  ],
};
