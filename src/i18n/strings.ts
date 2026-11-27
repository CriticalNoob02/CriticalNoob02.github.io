import type { T } from "../content/types";

/** Interface copy. Content copy lives in src/content. */
export const ui = {
  navWork: { pt: "Projetos", en: "Work" },
  navMarketing: { pt: "Marketing", en: "Marketing" },
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
  marketingTitle: { pt: "Marketing com IA", en: "Marketing with AI" },
  marketingIntro: {
    pt: "Com o Claude Code eu também faço a divulgação. As peças saem do mesmo código do produto, com regras de texto e dados fictícios.",
    en: "With Claude Code I also make the promotion. The pieces come from the product's own code, with copy rules and fictional data.",
  },
  archOpen: { pt: "Ver a arquitetura", en: "See the architecture" },
  archClose: { pt: "Fechar a arquitetura", en: "Close the architecture" },
  archHint: {
    pt: "Passe o mouse ou toque num bloco para ver com quem ele conversa.",
    en: "Hover or tap a box to see what it talks to.",
  },
  archTalks: { pt: "Conversa com", en: "Talks to" },
  slidePrev: { pt: "Slide anterior", en: "Previous slide" },
  slideNext: { pt: "Próximo slide", en: "Next slide" },
  gamesTitle: { pt: "Jogos que fiz", en: "Games I made" },
  gamesIntro: {
    pt: "Onde testo rede, simulação e anti-trapaça sem pedir licença a ninguém.",
    en: "Where I try networking, simulation and anti-cheat without asking anyone.",
  },
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
