import { architectures } from "./architecture";
import type { Project, Shot } from "./types";

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
    id: "basal",
    group: "work",
    name: "Basal",
    logo: { src: "/media/logos/basal.svg" },
    layout: "split",
    role: { pt: "Produto próprio, no ar", en: "My own product, live" },
    headline: {
      pt: "Um app de saúde e o painel de quem acompanha",
      en: "A health app and the panel of who follows it",
    },
    summary: {
      pt: "O cliente usa o app de graça: peso, medidas, água, passos, sono e o cardápio do dia, com um corpo 3D que muda junto com as medidas. Nutricionistas e personal trainers usam um painel web para montar cardápio e treino, avaliar e acompanhar a adesão, e são encontrados no app por um radar de profissionais próximos.",
      en: "Clients use the app for free: weight, measurements, water, steps, sleep and the day's meal plan, with a 3D body that changes along with the measurements. Nutritionists and personal trainers use a web panel to build meal plans and workouts, run assessments and follow adherence, and clients find them in the app through a radar of nearby professionals.",
    },
    feats: [
      {
        pt: "Corpo 3D a partir de uma malha de licença aberta, com gordura e músculo pintados por região e estimativa de gordura pelas medidas.",
        en: "A 3D body built from an openly licensed mesh, with fat and muscle painted by region and a body-fat estimate from the measurements.",
      },
      {
        pt: "Cardápio com a tabela TACO: macros na hora, troca por alimento equivalente, ajuste de porções para uma meta de calorias, modelos e lista de compras.",
        en: "Meal plans on the TACO food table: macros on the fly, swaps for equivalent foods, portions scaled to a calorie target, templates and a shopping list.",
      },
      {
        pt: "Refeição confirmada com foto do prato, conferida pela nutricionista, e treino registrado série a série com progressão de carga.",
        en: "Meals confirmed with a photo of the plate, reviewed by the nutritionist, and workouts logged set by set with load progression.",
      },
      {
        pt: "Avaliação física por protocolo de dobras, passos e sono pelo Health Connect, e cada cliente decide o que cada profissional pode ver.",
        en: "Skinfold-protocol assessments, steps and sleep from Health Connect, and each client decides what each professional can see.",
      },
    ],
    stack: [
      "Expo",
      "React Native",
      "three.js",
      "React 19",
      "Vite",
      "Tailwind 4",
      "Express 5",
      "Prisma",
      "PostgreSQL",
    ],
    stats: [
      { value: "2", label: { pt: "profissões no painel", en: "professions in the panel" } },
      { value: "597", label: { pt: "alimentos da TACO", en: "TACO foods" } },
      { value: "160", label: { pt: "exercícios na biblioteca", en: "exercises in the library" } },
    ],
    shots: [
      shot(
        "basal/painel-inicio.webp",
        "Início do painel da nutricionista: adesão da semana, check-ins por dia, clientes ativos e tempo poupado. Dados fictícios.",
        "The nutritionist's panel home: weekly adherence, check-ins per day, active clients and time saved. Fictional data.",
      ),
      shot(
        "basal/ficha-cliente.webp",
        "Ficha da cliente com o corpo 3D e a gordura em amarelo, peso no tempo, passos, sono e água. Cliente fictícia.",
        "Client record with the 3D body and fat in yellow, weight over time, steps, sleep and water. Fictional client.",
      ),
      shot(
        "basal/cardapio.webp",
        "Editor de cardápio com alimentos da TACO, porções, troca equivalente e o total de macros do dia.",
        "Meal plan editor with TACO foods, portions, equivalent swaps and the day's macro totals.",
      ),
    ],
    phone: shot(
      "basal/app-hoje.webp",
      "App do cliente, tela Hoje: progresso do dia, corpo 3D, passos, sono, água, refeições e o próximo item do cardápio.",
      "Client app, Today screen: the day's progress, 3D body, steps, sleep, water, meals and the next item on the meal plan.",
    ),
    links: [
      {
        label: { pt: "basal.forjahub.online", en: "basal.forjahub.online" },
        href: "https://basal.forjahub.online",
      },
    ],
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
      { value: "1.54", label: { pt: "versão no ar", en: "live version" } },
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
      {
        label: { pt: "Jogar pelo GG77 Launcher", en: "Play through the GG77 Launcher" },
        href: "https://arena.forjahub.online",
      },
    ],
  },
  {
    id: "gg77",
    group: "games",
    name: "GG77 Launcher",
    logo: { src: "/media/logos/gg77.png" },
    layout: "split",
    role: { pt: "Produto próprio, no ar", en: "My own product, live" },
    headline: {
      pt: "Uma Steam pequena para os jogos da turma",
      en: "A small Steam for the group's games",
    },
    summary: {
      pt: "Aplicativo de desktop que instala, atualiza e abre os meus jogos fora do navegador. Cada jogador tem biblioteca, tempo de jogo, conquistas de todos os jogos num lugar só, perfil com moldura, banner e título, e uma conta GG77 para ver os amigos.",
      en: "A desktop app that installs, updates and opens my games outside the browser. Every player gets a library, play time, achievements from every game in one place, a profile with frame, banner and title, and a GG77 account to see their friends.",
    },
    feats: [
      {
        pt: "Atualização que baixa só os arquivos que mudaram, retoma download interrompido e confere cada arquivo pelo manifesto assinado.",
        en: "Updates download only the files that changed, resume interrupted downloads and check every file against a signed manifest.",
      },
      {
        pt: "Os jogos liberam conquistas e pegam a sessão da conta por um SDK injetado na janela do jogo, com permissão só para isso.",
        en: "Games unlock achievements and get the account session through an SDK injected into the game window, allowed to do nothing else.",
      },
      {
        pt: "Catálogo remoto e instaladores para Windows e Linux publicados pelo GitHub Actions a cada tag.",
        en: "Remote catalogue, plus Windows and Linux installers published by GitHub Actions on every tag.",
      },
      {
        pt: "Conta GG77 própria, com amigos, presença e login único nos jogos.",
        en: "Its own GG77 account, with friends, presence and single sign-on into the games.",
      },
    ],
    stack: [
      "Tauri 2",
      "Rust",
      "React 19",
      "TypeScript",
      "Vite",
      "Express 5",
      "Prisma",
      "GitHub Actions",
    ],
    stats: [
      { value: "2", label: { pt: "jogos no catálogo", en: "games in the catalogue" } },
      { value: "40", label: { pt: "conquistas", en: "achievements" } },
      { value: "0.5", label: { pt: "versão no ar", en: "live version" } },
    ],
    shots: [
      shot(
        "gg77/biblioteca.webp",
        "Biblioteca do launcher com o Tribos em destaque: tempo de jogo, sessões, conquistas e os jogos instalados. Perfil fictício.",
        "The launcher library with Tribos featured: play time, sessions, achievements and the installed games. Fictional profile.",
      ),
      shot(
        "gg77/conquistas.webp",
        "Conquistas do launcher, do Idle Legends e do Tribos numa lista só, com raridade e data.",
        "Achievements from the launcher, Idle Legends and Tribos in one list, with rarity and date.",
      ),
      shot(
        "gg77/perfil.webp",
        "Perfil do jogador com título, nível, vitrine de conquistas e banner liberado em jogo.",
        "Player profile with title, level, an achievement showcase and a banner unlocked in game.",
      ),
    ],
    links: [
      {
        label: { pt: "Baixar o launcher", en: "Download the launcher" },
        href: "https://arena.forjahub.online",
      },
    ],
  },
  {
    id: "tribos",
    group: "games",
    name: "Clanfall",
    logo: { src: "/media/logos/tribos.png" },
    layout: "wide",
    role: { pt: "Jogo próprio, no launcher", en: "My own game, in the launcher" },
    headline: {
      pt: "Cinco clãs, um vale e nenhum turno",
      en: "Five clans, one valley and no turns",
    },
    summary: {
      pt: "Estratégia em tempo real num mapa hexagonal para até 5 clãs, entre amigos e bots. Comida, madeira e pedra pagam tropas, muralhas e torres, e vence o último clã de pé. Névoa de guerra, ruínas, acampamentos de saqueadores e tréguas entre clãs.",
      en: "Real-time strategy on a hex map for up to 5 clans, friends and bots. Food, wood and stone pay for troops, walls and towers, and the last clan standing wins. Fog of war, ruins, raider camps and truces between clans.",
    },
    feats: [
      {
        pt: "Ponto a ponto: a partida roda no navegador de quem cria a sala e os outros se ligam direto por WebRTC. O servidor só entrega o código da sala, repassa mensagens quando a ligação direta falha e guarda o placar.",
        en: "Peer to peer: the match runs in the host's browser and the others connect directly over WebRTC. The server only hands out the room code, relays messages when a direct link fails and keeps the leaderboard.",
      },
      {
        pt: "Muralha, portão, torre, armadilha e ponte construídas nos hexágonos, com modo de construção que marca onde cabe, fila de treino por cidade e 9 saberes para pesquisar.",
        en: "Walls, gates, towers, traps and bridges built on the hexes, with a build mode that marks where they fit, a training queue per city and 9 techs to research.",
      },
      {
        pt: "Bots em três dificuldades, que também jogam sob a névoa, e um simulador que joga partidas só de bots para medir equilíbrio. 128 testes nas regras.",
        en: "Bots at three difficulty levels, which also play under the fog, and a simulator that plays bot-only matches to measure balance. 128 tests on the rules.",
      },
      {
        pt: "Música, ambiente e efeitos sintetizados no próprio jogo, sem arquivo de áudio, e 16 conquistas que chegam ao launcher.",
        en: "Music, ambience and sound effects synthesised in the game itself, with no audio files, and 16 achievements sent to the launcher.",
      },
    ],
    stack: ["TypeScript", "React", "Phaser 3", "Vite", "Express", "WebSocket", "WebRTC", "Vitest"],
    stats: [
      { value: "5", label: { pt: "clãs por partida", en: "clans per match" } },
      { value: "12", label: { pt: "tipos de tropa", en: "troop types" } },
      { value: "128", label: { pt: "testes nas regras", en: "tests on the rules" } },
    ],
    shots: [
      shot(
        "tribos/partida-rts.webp",
        "Partida aos 15 minutos com cinco clãs, cidades, fazendas, torres e tropas no mapa de hexágonos, barra de comida, madeira e pedra, registro de eventos e minimapa. Jogadores e bots fictícios.",
        "A match at minute 15 with five clans, cities, farms, towers and troops on the hex map, the food, wood and stone bar, the event log and the minimap. Fictional players and bots.",
      ),
      shot(
        "tribos/construcao.webp",
        "Modo de construção de uma torre, com os hexágonos válidos marcados e o painel da obra.",
        "Build mode for a tower, with the valid hexes marked and the construction panel.",
      ),
      shot(
        "tribos/sala-p2p.webp",
        "Sala antes da partida: código da sala, cinco estandartes entre anfitrião, convidado e bots, escolha do clã e ritmo.",
        "The room before the match: room code, five banners for the host, a guest and bots, clan choice and pace.",
      ),
    ],
    links: [
      {
        label: { pt: "Jogar pelo GG77 Launcher", en: "Play through the GG77 Launcher" },
        href: "https://arena.forjahub.online",
      },
    ],
  },
  {
    id: "dawnkeep",
    group: "games",
    name: "Dawnkeep",
    logo: { src: "/media/logos/dawnkeep.png", pixel: true },
    layout: "split",
    role: { pt: "Jogo próprio, no launcher", en: "My own game, in the launcher" },
    headline: {
      pt: "Segure a noite. Reconstrua de dia.",
      en: "Hold the night. Rebuild by day.",
    },
    summary: {
      pt: "Defesa de torres cooperativa num mundo de zumbis, para 1 a 4 jogadores. À noite a horda cerca o refúgio e os heróis atiram junto com as torres. De dia a sucata vira barricada, torre, morteiro e prédio da vila.",
      en: "Co-op tower defence in a zombie world for 1 to 4 players. At night the horde surrounds the refuge and the heroes shoot alongside the towers. By day the scrap turns into barricades, towers, mortars and village buildings.",
    },
    feats: [
      {
        pt: "A partida roda no navegador de quem cria a sala e os outros se ligam direto por WebRTC. O anfitrião manda 20 atualizações por segundo só com o que mudou, e cada jogador vê o próprio movimento e tiro na hora, corrigido quando a atualização chega.",
        en: "The match runs in the host's browser and the others connect directly over WebRTC. The host sends 20 updates a second with only what changed, and each player sees their own movement and shots at once, corrected when the update arrives.",
      },
      {
        pt: "Zumbis andam por campos de fluxo calculados a partir do núcleo. Construções são passáveis com custo, então caminho fechado vira barricada derrubada; rastejadores têm campo próprio e passam por baixo.",
        en: "Zombies follow flow fields computed outward from the core. Buildings can be crossed at a cost, so a closed path means a broken barricade; crawlers have their own field and slip underneath.",
      },
      {
        pt: "Arte toda feita no PixelLab, com árvores e mato animados quadro a quadro ao vento, luz e sombra que seguem a hora do dia e um ajuste de efeitos que cai para o modo leve sozinho quando o quadro passa de 24 ms.",
        en: "All art made in PixelLab, with trees and grass animated frame by frame in the wind, light and shadows that follow the time of day, and an effects setting that drops to lite mode on its own when frames go over 24 ms.",
      },
      {
        pt: "Som sintetizado no jogo, sem arquivo de áudio, e bots que jogam partidas inteiras sem tela para acertar os números do equilíbrio.",
        en: "Sound synthesised in the game, with no audio files, and bots that play whole matches with no screen to tune the balance numbers.",
      },
    ],
    stack: ["TypeScript", "Canvas 2D", "Vite", "Node", "WebSocket", "WebRTC", "Vitest", "PixelLab"],
    stats: [
      { value: "4", label: { pt: "jogadores por sala", en: "players per room" } },
      { value: "7", label: { pt: "tipos de zumbi", en: "zombie types" } },
      { value: "12", label: { pt: "defesas e prédios", en: "defences and buildings" } },
    ],
    shots: [
      shot(
        "dawnkeep/noite.webp",
        "Noite 10: a horda chega por três lados, quatro heróis atiram em volta do refúgio iluminado por tochas e as torres seguram as bordas. Jogadores fictícios.",
        "Night 10: the horde comes from three sides, four heroes shoot around the torch-lit refuge and the towers hold the edges. Fictional players.",
        true,
      ),
      shot(
        "dawnkeep/dia.webp",
        "Dia 6 na floresta: a base de dia com torres, morteiros, barricadas, poços de lama e a vila, entre árvores e mato animados.",
        "Day 6 in the forest: the base by day with towers, mortars, barricades, mud pits and the village, among animated trees and grass.",
        true,
      ),
      shot(
        "dawnkeep/anoitecer.webp",
        "Anoitecer: o aviso de que a horda está vindo sobre o refúgio aceso.",
        "Nightfall: the warning that the horde is coming, over the lit refuge.",
        true,
      ),
    ],
    links: [
      {
        label: { pt: "Jogar pelo GG77 Launcher", en: "Play through the GG77 Launcher" },
        href: "https://arena.forjahub.online",
      },
    ],
  },
  {
    id: "corre",
    group: "games",
    name: "No Corre",
    logo: { src: "/media/logos/corre.png", pixel: true },
    layout: "split-reverse",
    role: { pt: "Jogo próprio, no launcher", en: "My own game, in the launcher" },
    headline: {
      pt: "Da garagem à franquia, um lanche de cada vez",
      en: "From the garage to a franchise, one snack at a time",
    },
    summary: {
      pt: "Lanchonete em pixel art. De dia você atende a fila, de noite cuida do caixa, do estoque e da equipe. Começa numa garagem e, se as contas fecharem no verde, chega a uma franquia na avenida.",
      en: "A pixel-art snack bar. By day you serve the queue, by night you look after the cash, the stock and the staff. It starts in a garage and, if the books close in the black, ends with a franchise on the avenue.",
    },
    feats: [
      {
        pt: "Regras num pacote puro: fila, bancadas, equipe que decide sozinha, imposto de MEI ou ME, empréstimo, contas do mês e falência depois de 3 meses no vermelho. 40 testes.",
        en: "Rules in a pure package: queue, stations, staff that decides on its own, small-business taxes, loans, month-end bills and bankruptcy after 3 months in the red. 40 tests.",
      },
      {
        pt: "8 eventos sorteados por dia, fregueses com pressa, que dão gorjeta ou pedem fiado, e clientes fixos que voltam pelo nome pedindo o de sempre.",
        en: "8 daily random events, customers in a hurry, tippers and ones who buy on credit, and regulars who come back by name for their usual.",
      },
      {
        pt: "Três dificuldades, um dia de treino guiado e um final na franquia que segue como modo sem fim.",
        en: "Three difficulty levels, a guided training day and an ending at the franchise that carries on as an endless mode.",
      },
      {
        pt: "Som e música sintetizados no jogo, save local com cópia na nuvem pela conta GG77 e conquistas no launcher.",
        en: "Sound and music synthesised in the game, a local save with a cloud copy through the GG77 account, and achievements in the launcher.",
      },
    ],
    stack: ["TypeScript", "React", "Canvas 2D", "Vite", "WebAudio", "Vitest"],
    stats: [
      { value: "9", label: { pt: "itens no cardápio", en: "menu items" } },
      { value: "4", label: { pt: "pontos, da garagem à avenida", en: "venues, garage to avenue" } },
      { value: "21", label: { pt: "conquistas", en: "achievements" } },
    ],
    shots: [
      shot(
        "corre/loja-movimento.webp",
        "Lanchonete no centro ao meio-dia de um feriado: seis funcionários nas bancadas, fila até a porta, fregueses marcados com pressa e fiado e um pedido do aplicativo de entrega. Loja e pessoas fictícias.",
        "The downtown shop at noon on a holiday: six staff at the stations, a queue out the door, customers tagged as in a hurry or on credit, and a delivery-app order. Fictional shop and people.",
        true,
      ),
      shot(
        "corre/mercado.webp",
        "Aba Mercado: gosto do bairro, tabela da concorrência com a fatia de cada um e o jornal do bairro.",
        "The Market tab: what the neighbourhood likes, the competitor table with each share, and the local paper.",
        true,
      ),
      shot(
        "corre/titulo.webp",
        "Tela de título com o logo NO CORRE.",
        "Title screen with the NO CORRE logo.",
        true,
      ),
    ],
    links: [
      {
        label: { pt: "Jogar pelo GG77 Launcher", en: "Play through the GG77 Launcher" },
        href: "https://arena.forjahub.online",
      },
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
