import type { T } from "../content/types";

/** Interface copy. Content copy lives in src/content. */
export const ui = {
  navWork: { pt: "Projetos", en: "Work" },
  navGames: { pt: "Jogos", en: "Games" },
  navAbout: { pt: "Sobre", en: "About" },
  langToggle: { pt: "EN", en: "PT" },
  langToggleLabel: { pt: "Ver em inglês", en: "Ver em português" },
  seeWork: { pt: "Ver projetos", en: "See the work" },
  contact: { pt: "Falar comigo", en: "Get in touch" },
  sheetClass: { pt: "Classe", en: "Class" },
  sheetLevel: { pt: "Nível", en: "Level" },
  navLevel: { pt: "Nv", en: "Lv" },
  sheetGuild: { pt: "Guilda atual", en: "Current guild" },
  workTitle: { pt: "Campanhas principais", en: "Main campaigns" },
  gamesTitle: { pt: "Jogos que fiz", en: "Games I made" },
  gamesIntro: {
    pt: "Onde testo rede, simulação e anti-trapaça sem pedir licença a ninguém.",
    en: "Where I try networking, simulation and anti-cheat without asking anyone.",
  },
  questsTitle: { pt: "Ferramentas pequenas", en: "Small tools" },
  privateRepo: { pt: "Código privado", en: "Private code" },
  aboutTitle: { pt: "Ficha do personagem", en: "Character sheet" },
  sampleData: {
    pt: "Imagens com dados de exemplo. Nenhum dado real de cliente aparece aqui.",
    en: "Images use sample data. No real customer data appears here.",
  },
  pageTitle: {
    pt: "Adriel Rodrigues, desenvolvedor fullstack",
    en: "Adriel Rodrigues, fullstack developer",
  },
} satisfies Record<string, T>;
