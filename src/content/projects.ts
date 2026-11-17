import { architectures } from "./architecture";
import type { Project, Quest, Shot } from "./types";

const shot = (src: string, pt: string, en: string, pixel = false): Shot => ({
  src: `/media/${src}`,
  alt: { pt, en },
  pixel,
});

export const projects: Project[] = [
  {
    id: "radar",
    arch: architectures.radar,
    name: "Radar Saúde",
    group: "work",
    logo: { src: "/media/logos/radar.svg", full: true },
    layout: "wide",
    role: { pt: "Desenvolvedor fullstack, CLT", en: "Fullstack developer, full time" },
    headline: {
      pt: "Saúde populacional para hospitais e operadoras",
      en: "Population health for hospitals and health plans",
    },
    summary: {
      pt: "Família de produtos de analytics em saúde com login, websocket, biblioteca de UI e pipeline de dados em comum. O Radar Hospital é o carro-chefe.",
      en: "A family of health analytics products sharing sign-in, websocket, a UI library and a data pipeline. Radar Hospital is the flagship.",
    },
    feats: [
      {
        pt: "Reescrevi a biblioteca de UI compartilhada e migrei os 3 front-ends; só o Hospital perdeu 7 mil linhas.",
        en: "Rewrote the shared UI library and moved all 3 front ends onto it; Hospital alone lost 7,000 lines.",
      },
      {
        pt: "Portei websocket e chatbot de Node para Go, validados por uma suíte de contrato que roda contra as duas versões.",
        en: "Ported the websocket and chatbot from Node to Go, checked by a contract suite run against both versions.",
      },
      {
        pt: "Recebimento de dados com fila, partições mensais e replay; o worker processa cerca de 48 mil itens por segundo.",
        en: "Queue-based data intake with monthly partitions and replay; the worker handles about 48k items per second.",
      },
      {
        pt: "Release ponta a ponta: tag, deploy, health check e smoke test com Playwright nos front-ends.",
        en: "End-to-end release: tag, deploy, health check and Playwright smoke tests on the front ends.",
      },
    ],
    stack: [
      "Next.js",
      "React",
      "Express",
      "Prisma",
      "Go",
      "BullMQ",
      "PostgreSQL",
      "Airflow",
      "Atlas",
      "Docker",
    ],
    stats: [
      { value: "25", label: { pt: "repositórios", en: "repositories" } },
      { value: "12", label: { pt: "serviços no ar", en: "live services" } },
      { value: "136", label: { pt: "DAGs no Airflow", en: "Airflow DAGs" } },
    ],
    shots: [
      shot(
        "radar/hiperutilizadores.webp",
        "Painel de hiperutilizadores: parcela dos pacientes contra parcela do faturamento, perfil médio, pirâmide etária e comorbidades. Dados fictícios.",
        "High-utiliser dashboard: share of patients vs share of billing, average profile, age pyramid and comorbidities. Fictional data.",
      ),
      shot(
        "radar/paciente.webp",
        "Ficha do paciente com mapa do corpo 3D: condições e riscos por região do corpo. Paciente fictícia.",
        "Patient record with a 3D body map: conditions and risks by body region. Fictional patient.",
      ),
      shot(
        "radar/fluxo-chatbot.webp",
        "Editor visual de fluxos do chatbot: lembrete de consulta com desvios para confirmar, cancelar ou remarcar.",
        "Visual chatbot flow editor: an appointment reminder with branches to confirm, cancel or reschedule.",
      ),
    ],
    links: [],
  },
  {
    id: "brio",
    arch: architectures.brio,
    name: "Brio",
    group: "work",
    logo: { src: "/media/logos/brio.svg", sub: "GESTÃO E SAÚDE" },
    layout: "split",
    role: { pt: "Arquitetura e desenvolvimento", en: "Architecture and development" },
    headline: {
      pt: "Um ERP de clínica e um app para a paciente",
      en: "A clinic ERP and an app for the patient",
    },
    summary: {
      pt: "Agenda, prontuário, vendas, estoque, financeiro e notas fiscais para clínicas de estética e saúde, mais um app com metas diárias e um companheiro 3D para usar entre as sessões.",
      en: "Calendar, records, sales, stock, finance and invoices for aesthetics and health clinics, plus an app with daily goals and a 3D companion for between sessions.",
    },
    feats: [
      {
        pt: "SSO multi-clínica: os serviços checam permissão num cache Redis, sem chamar o login por HTTP.",
        en: "Multi-clinic SSO: services check permissions in a Redis cache instead of calling sign-in over HTTP.",
      },
      {
        pt: "Agendador próprio com FOR UPDATE SKIP LOCKED, retry com backoff e jobs registrados pelos serviços.",
        en: "In-house scheduler with FOR UPDATE SKIP LOCKED, retries with backoff and jobs registered by services.",
      },
      {
        pt: "Regra de produto travada por teste: nada no app da paciente piora com o tempo.",
        en: "A product rule locked by a test: nothing in the patient app gets worse over time.",
      },
    ],
    stack: [
      "Next.js",
      "Expo",
      "React Native",
      "Express",
      "Prisma",
      "Redis",
      "WhatsApp",
      "PIX",
      "NFS-e",
    ],
    stats: [
      { value: "33", label: { pt: "módulos no back-end", en: "back-end modules" } },
      { value: "115", label: { pt: "tabelas versionadas", en: "versioned tables" } },
    ],
    shots: [
      shot(
        "brio/agenda.webp",
        "Agenda semanal de uma clínica fictícia com atendimentos de estética de três profissionais.",
        "Weekly calendar of a fictional clinic with aesthetics appointments from three professionals.",
      ),
      shot(
        "brio/financeiro.webp",
        "Visão geral financeira: entradas, saídas e saldo de seis meses e o caixa do mês. Dados fictícios.",
        "Financial overview: six months of income, expenses and balance and the month's cash. Fictional data.",
      ),
      shot(
        "brio/app-paciente.webp",
        "Painel do app da paciente: uso do app, distribuição por selo de engajamento, moedas e cupons.",
        "Patient app dashboard: app usage, engagement badge distribution, coins and coupons.",
      ),
    ],
    links: [],
  },
  {
    id: "forja",
    arch: architectures.forja,
    name: "Forja Hub",
    group: "work",
    logo: {},
    layout: "split-reverse",
    role: { pt: "Produto próprio", en: "My own product" },
    headline: {
      pt: "Uma plataforma que monta plataformas",
      en: "A platform that builds platforms",
    },
    summary: {
      pt: "Agências escolhem módulos, aplicam a própria marca e entregam ao cliente um sistema de gestão white label. São 20 módulos, de agenda e financeiro a MQTT e assistente de IA.",
      en: "Agencies pick modules, apply their own brand and hand their client a white-label management system. There are 20 modules, from calendar and finance to MQTT and an AI assistant.",
    },
    feats: [
      {
        pt: "Monólito modular: cada módulo é um manifesto e nenhum importa outro; um lint de arquitetura no CI garante.",
        en: "Modular monolith: each module is a manifest and none imports another; a CI architecture lint enforces it.",
      },
      {
        pt: "Módulos conversam por outbox de eventos gravado na mesma transação.",
        en: "Modules talk through an event outbox written in the same transaction.",
      },
      {
        pt: "Marca, cor e fonte de cada plataforma aplicadas em tempo de execução.",
        en: "Each platform's brand, colour and font applied at runtime.",
      },
    ],
    stack: ["Next.js 16", "React 19", "shadcn/ui", "Express 5", "Prisma 7", "PostgreSQL", "Stripe"],
    stats: [
      { value: "20", label: { pt: "módulos", en: "modules" } },
      { value: "8", label: { pt: "repositórios", en: "repositories" } },
    ],
    shots: [
      shot(
        "forja/construtor-modulos.webp",
        "Construtor do Forja Hub escolhendo módulos de uma plataforma, com dados de exemplo.",
        "Forja Hub builder choosing a platform's modules, with sample data.",
      ),
      shot(
        "forja/plataforma-agenda.webp",
        "Plataforma gerada: agenda semanal de uma clínica fictícia.",
        "Generated platform: weekly calendar of a fictional clinic.",
      ),
      shot(
        "forja/construtor-aparencia.webp",
        "Construtor: marca, cor e fonte da plataforma.",
        "Builder: the platform's brand, colour and font.",
      ),
    ],
    links: [
      { label: { pt: "forjahub.online", en: "forjahub.online" }, href: "https://forjahub.online" },
    ],
  },
  {
    id: "prosaude",
    arch: architectures.prosaude,
    group: "work",
    name: "Pró-Saúde Inspeções",
    logo: { src: "/media/logos/prosaude.svg", full: true },
    layout: "wide",
    role: { pt: "Reescrita e evolução, para a Blabsia", en: "Rewrite and evolution, for Blabsia" },
    headline: {
      pt: "Inspeção de segurança do agendamento ao relatório assinado",
      en: "Safety inspections from scheduling to the signed report",
    },
    summary: {
      pt: "Agenda da equipe, checklist por norma em campo, fotos com GPS, relatório em PDF assinado e plano de ação até a correção. Funciona sem internet no celular e se adapta a qualquer tipo de local e norma.",
      en: "Team calendar, norm-based checklists in the field, GPS-stamped photos, a signed PDF report and an action plan through to the fix. Works offline on the phone and adapts to any kind of site and standard.",
    },
    feats: [
      {
        pt: "PWA de campo offline-first: respostas, fotos e assinatura ficam no IndexedDB e sobem por um /sync idempotente quando a rede volta; service worker escrito à mão.",
        en: "Offline-first field PWA: answers, photos and signature stay in IndexedDB and go up through an idempotent /sync when the network returns; hand-written service worker.",
      },
      {
        pt: "Maquete 3D do local em three.js com as áreas coloridas pelo último resultado; no login, uma varredura acende os pinos por severidade.",
        en: "A three.js 3D model of the site with areas coloured by the latest result; on login, a scan lights the pins by severity.",
      },
      {
        pt: "Prova de presença por GPS no início e em cada foto, e assinatura desenhada com verificação pública do PDF por SHA-256.",
        en: "Proof of presence by GPS at start and on every photo, and a drawn signature with public PDF verification by SHA-256.",
      },
      {
        pt: "White label por cliente: vocabulário próprio, cor derivada em oklab, textos de relatório com marcadores e biblioteca de normas que avisa quando uma NR muda.",
        en: "White label per client: own vocabulary, colour derived in oklab, report texts with placeholders and a norm library that warns when a standard changes.",
      },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "Tailwind 4",
      "TanStack Query",
      "three.js",
      "d3",
      "IndexedDB",
      "Express",
      "Prisma 7",
      "PostgreSQL",
      "S3",
      "Grafana",
    ],
    stats: [
      { value: "10", label: { pt: "repositórios", en: "repositories" } },
      { value: "4", label: { pt: "serviços de plataforma", en: "platform services" } },
      { value: "0.13", label: { pt: "versão desta seção", en: "version shown here" } },
    ],
    shots: [
      shot(
        "prosaude/maquete.webp",
        "Ficha de um condomínio com a maquete 3D, áreas marcadas pela cor do pior resultado e os itens não conformes da cobertura. Dados de demonstração.",
        "Condominium page with its 3D model, areas marked by their worst result and the roof's non-compliant items. Demo data.",
      ),
      shot(
        "prosaude/visao-geral.webp",
        "Visão geral com indicadores do mês, inspeções por mês e próximas visitas da equipe.",
        "Overview with monthly KPIs, inspections per month and the team's upcoming visits.",
      ),
      shot(
        "prosaude/plano-kanban.webp",
        "Relatório de uma inspeção entregue com o plano de ação em quadro Kanban.",
        "A delivered inspection report with its action plan as a Kanban board.",
      ),
    ],
    phone: shot(
      "prosaude/campo-celular.webp",
      "App de campo no celular: inspeção em andamento com progresso, áreas e itens do checklist com norma e resposta.",
      "Field app on the phone: inspection in progress with progress, areas and checklist items with norm and answer.",
    ),
    links: [],
  },
  {
    id: "carrossel",
    name: "Forja Hub",
    group: "marketing",
    logo: { sub: "INSTAGRAM" },
    layout: "wide",
    role: {
      pt: "Divulgação feita com Claude Code",
      en: "Social content made with Claude Code",
    },
    headline: {
      pt: "Um carrossel por módulo, escrito a partir do código",
      en: "One carousel per module, written from the code",
    },
    summary: {
      pt: "Série de Instagram para agências que montam sistema para pequenos negócios. Recursos, ajustes e perguntas do assistente saem dos manifestos do back-end, então nenhum slide promete o que o produto não faz.",
      en: "An Instagram series for agencies that build systems for small businesses. Features, settings and assistant questions come from the back-end manifests, so no slide promises what the product does not do.",
    },
    feats: [
      {
        pt: "Gerador em Node: cada slide é HTML, o Playwright fotografa em 1080×1350 e o título que estoura a largura encolhe sozinho.",
        en: "Node generator: each slide is HTML, Playwright shoots it at 1080×1350 and a headline that overflows shrinks itself.",
      },
      {
        pt: "Estrutura fixa: gancho, a tela, o que faz, o que o construtor ajusta, perguntas do assistente, integrações e chamada final.",
        en: "Fixed structure: hook, the screen, what it does, what the builder sets, assistant questions, integrations and a closing call.",
      },
      {
        pt: "Regras de texto escritas junto com o gerador: fala com quem constrói, sem travessão, sem slogan pronto, e cada carrossel sai com legenda e hashtags.",
        en: "Copy rules written next to the generator: it speaks to the builder, no em dashes, no stock slogans, and every carousel ships with a caption and hashtags.",
      },
      {
        pt: "Reels em 1080×1920 num motor próprio em Three.js: cada reel é um roteiro de poucas linhas e os módulos viram a marca no fim.",
        en: "Reels at 1080×1920 on a small Three.js engine: each reel is a short script and the modules turn into the logo at the end.",
      },
    ],
    stack: ["Claude Code", "Node", "Playwright", "HTML/CSS", "Three.js"],
    stats: [
      { value: "18", label: { pt: "carrosséis", en: "carousels" } },
      { value: "7", label: { pt: "slides cada", en: "slides each" } },
    ],
    shots: [],
    slides: [
      shot(
        "marketing/carrossel/01.webp",
        "Capa do carrossel do módulo Fidelidade: o cliente do seu cliente compra e volta para gastar o crédito.",
        "Cover of the Loyalty module carousel: your client's customer buys and comes back to spend the credit.",
      ),
      shot(
        "marketing/carrossel/02.webp",
        "Slide 2: parte da compra volta como crédito, com a tela de configuração do cashback.",
        "Slide 2: part of the purchase comes back as credit, with the cashback settings screen.",
      ),
      shot(
        "marketing/carrossel/03.webp",
        "Slide 3: o que o módulo faz, em quatro cartões: cashback, cupons, página de adesão, pontos e selos.",
        "Slide 3: what the module does, in four cards: cashback, coupons, sign-up page, points and stamps.",
      ),
      shot(
        "marketing/carrossel/04.webp",
        "Slide 4: o saldo aparece na ficha da cliente antes de fechar a venda. Dados fictícios.",
        "Slide 4: the balance shows on the customer's record before the sale closes. Fictional data.",
      ),
      shot(
        "marketing/carrossel/05.webp",
        "Slide 5: o assistente de IA responde como está a fidelidade do mês. Dados fictícios.",
        "Slide 5: the AI assistant answers how loyalty is doing this month. Fictional data.",
      ),
      shot(
        "marketing/carrossel/06.webp",
        "Slide 6: como a Fidelidade conversa com Pessoas, Vendas e Chatbot.",
        "Slide 6: how Loyalty works with People, Sales and Chatbot.",
      ),
      shot(
        "marketing/carrossel/07.webp",
        "Slide 7, chamada final em fundo escuro: ligue a Fidelidade, com o perfil do Instagram e os módulos do hub.",
        "Slide 7, closing call on a dark background: turn on Loyalty, with the Instagram handle and the hub's modules.",
      ),
    ],
    links: [],
  },
  {
    id: "tutoriais",
    name: "Tutoriais em vídeo",
    group: "marketing",
    logo: {},
    layout: "split",
    role: {
      pt: "Vídeos feitos com Claude Code",
      en: "Videos made with Claude Code",
    },
    headline: {
      pt: "Tutoriais gravados, narrados e editados por script",
      en: "Tutorials recorded, narrated and edited by script",
    },
    summary: {
      pt: "Um vídeo por módulo do Forja Hub, numa marca fictícia (Studio Lumi) para servir a qualquer cliente. O roteiro é código: muda a fala, roda de novo e sai o vídeo novo.",
      en: "One video per Forja Hub module, under a fictional brand (Studio Lumi) so it fits any client. The script is code: change a line, run it again and a new video comes out.",
    },
    feats: [
      {
        pt: "Playwright usa o app de verdade seguindo o roteiro, com cursor desenhado, relógio congelado e dados novos semeados a cada rodada.",
        en: "Playwright drives the real app from the script, with a drawn cursor, a frozen clock and fresh seed data on every run.",
      },
      {
        pt: "Narração em português com edge-tts, em cache pela fala; a legenda é o próprio roteiro.",
        en: "Portuguese narration with edge-tts, cached per line; the subtitles are the script itself.",
      },
      {
        pt: "Remotion monta zoom, destaque e legenda, e acelera a ação que dura mais que a fala.",
        en: "Remotion adds zoom, highlights and subtitles, and speeds up any action that runs longer than its line.",
      },
      {
        pt: "Capítulos e descrição do YouTube saem do mesmo roteiro. O mesmo pipeline gravou 7 tutoriais do Radar Hospital com os dados mascarados.",
        en: "YouTube chapters and descriptions come from the same script. The same pipeline recorded 7 Radar Hospital tutorials with masked data.",
      },
    ],
    stack: ["Claude Code", "Playwright", "Remotion", "edge-tts", "React", "YouTube"],
    stats: [
      { value: "23", label: { pt: "vídeos do Forja Hub", en: "Forja Hub videos" } },
      { value: "~2 min", label: { pt: "cada", en: "each" } },
    ],
    shots: [
      shot(
        "marketing/tutoriais/assistente.webp",
        "Quadro do tutorial do assistente: a câmera aproxima o menu de perguntas e a legenda narra o passo. Studio Lumi é fictício.",
        "Frame from the assistant tutorial: the camera zooms on the question menu and the subtitle narrates the step. Studio Lumi is fictional.",
      ),
      shot(
        "marketing/tutoriais/relatorios.webp",
        "Quadro do tutorial de relatórios: um destaque azul marca o bloco que acabou de subir no modelo.",
        "Frame from the reports tutorial: a blue highlight marks the block that just moved up in the template.",
      ),
      shot(
        "marketing/tutoriais/paineis.webp",
        "Quadro do tutorial de painéis: atendimentos por profissional, com a legenda da narração.",
        "Frame from the dashboards tutorial: appointments by professional, with the narration subtitle.",
      ),
    ],
    links: [],
  },
  {
    id: "idle",
    arch: architectures.idle,
    group: "games",
    name: "Idle Legends",
    logo: { src: "/media/logos/idle.png" },
    layout: "wide",
    role: { pt: "Jogo próprio, no ar", en: "My own game, live" },
    headline: {
      pt: "Um RPG idle onde morrer é para sempre",
      en: "An idle RPG where death is permanent",
    },
    summary: {
      pt: "RPG de fantasia sombria no navegador: escolha a classe, entre numa área, lute em combate automático e decida a cada vitória se continua ou volta à vila. Ferreiro, encantador, mercado entre jogadores, arena por temporada, eventos e salas para jogar com os amigos.",
      en: "A dark-fantasy RPG in the browser: pick a class, enter an area, fight in auto combat and decide after every win whether to push on or return to the village. Blacksmith, enchanter, player market, seasonal arena, events and rooms to play with friends.",
    },
    feats: [
      {
        pt: "Economia autoritativa no servidor: revisão de save, travas de mercado, catálogo de itens no servidor e morte permanente.",
        en: "Server-authoritative economy: save revisions, market locks, a server-side item catalogue and permadeath.",
      },
      {
        pt: "Validador de save que recusa progresso impossível por teto de ganho por área e ritmo de abates da conta.",
        en: "A save validator that refuses impossible progress through gain caps per area and the account's kill pace.",
      },
      {
        pt: "Requisições cifradas e assinadas com HMAC, nonce e relógio; rotas isca banem quem tenta forjar.",
        en: "Encrypted, HMAC-signed requests with a nonce and clock check; honeypot routes ban whoever tries to forge them.",
      },
      {
        pt: "Duelos simulados no servidor com pontuação Elo, temporadas com hall da fama e eventos com ranking por sala.",
        en: "Server-simulated duels with Elo points, seasons with a hall of fame and events ranked per room.",
      },
    ],
    stack: [
      "React 19",
      "Vite",
      "Zustand",
      "Express 5",
      "Prisma",
      "PostgreSQL",
      "Docker",
      "GitHub Actions",
    ],
    stats: [
      { value: "1.45", label: { pt: "versão no ar", en: "live version" } },
      { value: "3", label: { pt: "classes jogáveis", en: "playable classes" } },
      { value: "33", label: { pt: "inimigos ilustrados", en: "illustrated enemies" } },
    ],
    shots: [
      shot(
        "idle/vila.webp",
        "Vila do herói: retrato, atributos e o mapa de aventura com evento aberto e áreas.",
        "The hero's village: portrait, attributes and the adventure map with an open event and areas.",
      ),
      shot(
        "idle/combate.webp",
        "Combate automático na Floresta Sombria contra um lobo raro, com diário de combate.",
        "Auto combat in the Dark Forest against a rare wolf, with the combat log.",
      ),
      shot(
        "idle/ferreiro.webp",
        "Ferreiro: receitas de forja com materiais, custo em ouro e conjuntos.",
        "Blacksmith: forging recipes with materials, gold cost and gear sets.",
      ),
    ],
    links: [
      { label: { pt: "Jogar agora", en: "Play now" }, href: "https://arena.forjahub.online" },
    ],
  },
  {
    id: "arena",
    arch: architectures.arena,
    group: "games",
    name: "Arena 4v4",
    logo: { src: "/media/logos/arena.png", pixel: true },
    layout: "split",
    role: { pt: "Protótipo próprio", en: "My own prototype" },
    headline: {
      pt: "Quatro contra quatro, e quem fica na frente apanha",
      en: "Four against four, and the front row takes the hits",
    },
    summary: {
      pt: "Escolha 4 de 5 lutadores, posicione em linha de frente e de trás; alcance e provocação decidem quem pode ser alvo. O mesmo núcleo roda por turnos ou semiautomático, numa escada de 5 encontros.",
      en: "Pick 4 of 5 fighters and place them in front and back rows; reach and taunt decide who can be targeted. The same core runs turn-based or semi-auto, across a ladder of 5 encounters.",
    },
    feats: [
      {
        pt: "Simulação de combate pura e determinística, fora do Phaser, que roda no Node.",
        en: "Pure, deterministic combat simulation outside Phaser, running in Node.",
      },
      {
        pt: "Harness IA contra IA que mede a taxa de vitória de cada composição de time.",
        en: "An AI-vs-AI harness that measures the win rate of every team composition.",
      },
      {
        pt: "Render nativo em 480×270 com escala inteira e fontes bitmap sem suavização.",
        en: "Native 480×270 rendering with integer scaling and unsmoothed bitmap fonts.",
      },
    ],
    stack: ["Phaser 3", "TypeScript", "Vite", "Vitest", "PixelLab"],
    stats: [
      { value: "9", label: { pt: "lutadores", en: "fighters" } },
      { value: "20", label: { pt: "efeitos animados", en: "animated effects" } },
    ],
    shots: [
      shot(
        "arena/batalha.webp",
        "Batalha 4 contra 4 no coliseu, com efeito de corte, barras de vida e fila de turnos.",
        "A 4v4 battle in the colosseum, with a slash effect, health bars and turn order.",
        true,
      ),
      shot(
        "arena/selecao.webp",
        "Montagem do time: cartas de lutadores com atributos, em fileira da frente e de trás.",
        "Team building: fighter cards with stats, placed in front and back rows.",
        true,
      ),
    ],
    links: [],
  },
  {
    id: "mesa",
    group: "games",
    name: "Mesa RPG",
    logo: { sub: "D&D 3.5" },
    layout: "split-reverse",
    role: { pt: "Projeto pessoal, código aberto", en: "Personal project, open source" },
    headline: {
      pt: "Mesa virtual de D&D 3.5 para jogar com os amigos",
      en: "A D&D 3.5 virtual tabletop to play with friends",
    },
    summary: {
      pt: "Fichas validadas por um motor de regras, mapa tático com névoa de guerra, iniciativa e combate, narração, áudio e handouts, tudo em português.",
      en: "Character sheets validated by a rules engine, a tactical map with fog of war, initiative and combat, narration, audio and handouts, all in Portuguese.",
    },
    feats: [
      {
        pt: "Motor de regras 3.5 em TypeScript puro: empilhamento de bônus e validação de ficha.",
        en: "A pure TypeScript 3.5 rules engine: bonus stacking and character validation.",
      },
      {
        pt: "Servidor autoritativo: cada jogador recebe só o que já revelou do mapa.",
        en: "Authoritative server: each player only receives the part of the map they revealed.",
      },
      {
        pt: "Dados rolados no servidor com crypto.randomInt; SRD traduzido para o português.",
        en: "Dice rolled on the server with crypto.randomInt; SRD translated into Portuguese.",
      },
    ],
    stack: ["Next.js 16", "Tailwind 4", "Express", "Socket.IO", "Prisma 7", "PostgreSQL"],
    stats: [{ value: "0.2", label: { pt: "versão publicada", en: "released version" } }],
    shots: [
      shot(
        "mesa/mapa.webp",
        "Mapa tático na visão do mestre: masmorra com névoa, tokens, chefe oculto e iniciativa.",
        "Tactical map from the GM's view: dungeon with fog, tokens, a hidden boss and initiative.",
      ),
      shot(
        "mesa/mapa-jogador.webp",
        "A mesma cena na visão da jogadora: só as áreas reveladas, sem o chefe oculto.",
        "The same scene from the player's view: only revealed areas, no hidden boss.",
      ),
      shot(
        "mesa/ficha.webp",
        "Ficha de personagem D&D 3.5 com atributos, ataques e perícias calculados.",
        "D&D 3.5 character sheet with computed abilities, attacks and skills.",
      ),
    ],
    links: [
      {
        label: { pt: "Código no GitHub", en: "Code on GitHub" },
        href: "https://github.com/CriticalNoob02/mesa-rpg",
      },
    ],
  },
  {
    id: "royale",
    group: "games",
    name: "Battle royale de captura",
    logo: { src: "/media/logos/royale.png", pixel: true },
    layout: "wide",
    role: { pt: "Projeto pessoal, código privado", en: "Personal project, private code" },
    headline: {
      pt: "Quatro treinadores, uma ilha e um relógio",
      en: "Four trainers, one island and a clock",
    },
    summary: {
      pt: "Battle royale para até 4 jogadores ou bots num mapa de 160×160 tiles com 7 zonas temáticas. Capture criaturas, desafie rivais e dispute raides com HP compartilhado; vence quem montar o melhor time até o fim.",
      en: "A battle royale for up to 4 players or bots on a 160×160-tile map with 7 themed zones. Catch creatures, challenge rivals and fight raids with a shared HP pool; whoever builds the best team by the end wins.",
    },
    feats: [
      {
        pt: "Uma única função step(state, inputs) a 20 ticks por segundo roda no navegador e no servidor.",
        en: "A single step(state, inputs) at 20 ticks per second runs in the browser and on the server.",
      },
      {
        pt: "Salas com código de 4 letras, snapshot a cada 2 ticks e bot que assume quem cai até voltar.",
        en: "Rooms with 4-letter codes, a snapshot every 2 ticks and a bot that covers dropped players until they return.",
      },
      {
        pt: "Fuzz que checa invariantes a cada tick; mapa montado por autotile com conjuntos Wang feitos no PixelLab.",
        en: "A fuzz harness checking invariants every tick; the map is autotiled from Wang sets made in PixelLab.",
      },
    ],
    stack: ["TypeScript", "WebSocket", "Phaser 3", "Vitest", "Docker"],
    stats: [
      { value: "20", label: { pt: "ticks por segundo", en: "ticks per second" } },
      { value: "4", label: { pt: "jogadores por sala", en: "players per room" } },
      { value: "7", label: { pt: "zonas no mapa", en: "map zones" } },
    ],
    shots: [
      shot(
        "royale/partida.webp",
        "Partida em andamento: a treinadora caminha pela arena com sua criatura, criaturas selvagens por perto e o HUD com equipe, ranking, minimapa, cronômetro e missões.",
        "Match in progress: the trainer walks the arena with her creature, wild creatures nearby, and the HUD with team, ranking, minimap, timer and missions.",
        true,
      ),
      shot(
        "royale/duelo.webp",
        "Duelo de ginásio entre dois treinadores: batalha automática com barras de HP, golpe em animação e aviso de super efetivo.",
        "Gym duel between two trainers: automatic battle with HP bars, a move animation and a super-effective callout.",
        true,
      ),
      shot(
        "royale/raide.webp",
        "Raide lendária na fase de captura, com a recompensa por dano no topo.",
        "Legendary raid in its capture phase, with the damage reward at the top.",
        true,
      ),
    ],
    links: [],
  },
];

export const quests: Quest[] = [
  {
    id: "docker-manager",
    name: "docker-manager",
    summary: {
      pt: "Gerencia containers com logs ao vivo e edita compose como grafo.",
      en: "Manages containers with live logs and edits compose files as a graph.",
    },
    stack: ["Express", "Dockerode", "Socket.IO", "React Flow"],
    shot: shot(
      "docker-manager/compose.webp",
      "Grafo de um compose de demonstração: serviços web, api, cache e banco ligados por rede, com volumes.",
      "Graph of a demo compose stack: web, api, cache and database services linked by network, with volumes.",
    ),
    href: "https://github.com/CriticalNoob02/docker-manager-fe",
  },
  {
    id: "devtui",
    name: "devtui",
    summary: {
      pt: "Painel de terminal em Go que sobe repositórios, processos e serviços Docker.",
      en: "A Go terminal dashboard that runs repos, processes and Docker services.",
    },
    stack: ["Go", "Bubble Tea"],
  },
  {
    id: "sync-datasus",
    name: "sync-datasus",
    summary: {
      pt: "Copia dados públicos do DATASUS por FTP para o PostgreSQL com pool de workers.",
      en: "Copies public DATASUS data over FTP into PostgreSQL with a worker pool.",
    },
    stack: ["Go", "C", "PostgreSQL"],
    href: "https://github.com/CriticalNoob02/sync-datasus",
  },
  {
    id: "crawler-sisab",
    name: "crawler-sisab",
    summary: {
      pt: "Baixa relatórios públicos do SISAB, a base da atenção primária.",
      en: "Downloads public SISAB reports, Brazil's primary care database.",
    },
    stack: ["Python"],
    href: "https://github.com/WizardCodeForge/crawler-sisab",
  },
];
