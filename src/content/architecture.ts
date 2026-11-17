import type { Architecture, ArchNode, T } from "./types";

/** Short builder for a box: id, name, tech, note in both languages, and what it calls. */
const n = (
  id: string,
  name: string,
  tech: string,
  pt: string,
  en: string,
  to?: string[],
): ArchNode => ({
  id,
  name,
  tech,
  note: { pt, en },
  to,
});

const label = (pt: string, en: string): T => ({ pt, en });

/* --------------------------------------------------------------------
   WORK
-------------------------------------------------------------------- */

const radar: Architecture = {
  summary: {
    pt: "Três produtos sobre a mesma base: login único, tempo real em Go, biblioteca de UI e uma esteira que recebe dados dos hospitais por fila. Cada serviço expõe métricas, e um release só termina depois do smoke test nos front-ends.",
    en: "Three products on one base: single sign-on, realtime in Go, a UI library and a pipeline that takes hospital data through a queue. Every service exposes metrics, and a release only ends after smoke tests on the front ends.",
  },
  start: "receiver",
  layers: [
    {
      label: label("Clientes", "Clients"),
      nodes: [
        n(
          "hospitalfe",
          "Radar Hospital",
          "Next.js 15",
          "Carro-chefe: pacientes, risco, custos, hiperutilizadores e chatbot.",
          "The flagship: patients, risk, costs, high utilisers and chatbot.",
          ["proxy"],
        ),
        n(
          "privadofe",
          "Radar Privado",
          "Next.js 15",
          "Versão para operadoras, com camadas de mapa.",
          "The health-plan edition, with map layers.",
          ["proxy"],
        ),
        n(
          "queryfe",
          "Radar Query",
          "Next.js 15",
          "Consultas salvas, fluxos entre bancos e relatórios.",
          "Saved queries, cross-database flows and reports.",
          ["proxy"],
        ),
        n(
          "ui",
          "radar-ui",
          "React, Storybook",
          "Biblioteca de componentes publicada como código-fonte, usada pelos três front-ends.",
          "Component library shipped as source, used by all three front ends.",
          ["hospitalfe", "privadofe", "queryfe"],
        ),
      ],
    },
    {
      label: label("Borda e tempo real", "Edge and realtime"),
      nodes: [
        n(
          "proxy",
          "Proxy por produto",
          "nginx",
          "Uma origem só: front, API, login e socket por caminho.",
          "A single origin: front, API, sign-in and socket by path.",
          ["hospitalbe", "privadobe", "querybe", "auth", "ws"],
        ),
        n(
          "auth",
          "radar-auth-ms",
          "Express 5, JWT",
          "SSO de todos os produtos; grava permissões no Redis e publica notificações.",
          "SSO for every product; writes permissions to Redis and publishes notifications.",
          ["redis", "pg"],
        ),
        n(
          "ws",
          "radar-ws",
          "Go, Socket.IO",
          "Leva o pub/sub do Redis até as salas de cada pessoa e unidade; porte de Node para Go com suíte de compatibilidade.",
          "Carries Redis pub/sub to each person's and unit's rooms; ported from Node to Go with a compatibility suite.",
          ["redis", "hospitalfe", "privadofe", "queryfe"],
        ),
      ],
    },
    {
      label: label("Serviços", "Services"),
      nodes: [
        n(
          "hospitalbe",
          "Hospital API",
          "Express 5, Prisma",
          "Indicadores, custos e risco sobre o data warehouse; assistente de IA.",
          "Indicators, costs and risk over the data warehouse; AI assistant.",
          ["pg", "redis"],
        ),
        n(
          "privadobe",
          "Privado API",
          "Express 5, Prisma",
          "A mesma base para operadoras, com cobertura mínima de 90%.",
          "The same base for health plans, with a 90% coverage floor.",
          ["pg", "redis"],
        ),
        n(
          "querybe",
          "Query API",
          "Express",
          "Consultas multi-banco, PDF com Chromium e lote de exportação do e-SUS.",
          "Multi-database queries, Chromium PDFs and an e-SUS export batch.",
          ["pg"],
        ),
        n(
          "chatbot",
          "radar-chatbot-ms",
          "Go, pgx",
          "Motor de fluxos de WhatsApp com retomada; porte de Node para Go validado por contrato.",
          "WhatsApp flow engine with resume; ported from Node to Go and checked by contract.",
          ["pg", "redis"],
        ),
      ],
    },
    {
      label: label("Entrada de dados", "Data intake"),
      nodes: [
        n(
          "client",
          "Coletor no hospital",
          "Python",
          "Lê as views do prontuário, faz login e envia lotes.",
          "Reads the medical-record views, signs in and sends batches.",
          ["receiver"],
        ),
        n(
          "receiver",
          "radar-receiver-ms",
          "Fastify 5",
          "Valida o lote pelo contrato compartilhado, grava a chegada e responde 202.",
          "Validates the batch against the shared contract, stores the landing row and answers 202.",
          ["pg", "queue"],
        ),
        n(
          "queue",
          "Fila",
          "BullMQ",
          "Separa receber de processar; tem fila de mortos e replay.",
          "Splits receiving from processing; has a dead letter and replay.",
          ["worker"],
        ),
        n(
          "worker",
          "radar-receiver-worker",
          "Node",
          "Faz upsert nas tabelas recebidas com auditoria, varredura e retenção; cerca de 48 mil itens por segundo.",
          "Upserts into the received tables with audit, sweep and retention; about 48k items per second.",
          ["pg"],
        ),
        n(
          "airflow",
          "Airflow",
          "136 DAGs",
          "Transforma o recebido no data warehouse que as APIs leem.",
          "Turns what was received into the warehouse the APIs read.",
          ["pg"],
        ),
      ],
    },
    {
      label: label("Dados", "Data"),
      nodes: [
        n(
          "pg",
          "PostgreSQL 17",
          "5 schemas",
          "Login, data warehouse, consultas, recebimento com partição mensal e chatbot.",
          "Sign-in, data warehouse, queries, monthly-partitioned intake and chatbot.",
        ),
        n(
          "redis",
          "Redis 7",
          "cache, pub/sub, filas",
          "Permissões, ponte do tempo real e as filas do recebimento.",
          "Permissions, the realtime bridge and the intake queues.",
        ),
        n(
          "atlas",
          "Atlas",
          "migrações",
          "Schema versionado: o PR mostra o plano, o merge aplica em dev e a tag em produção.",
          "Versioned schema: the PR shows the plan, merge applies to dev and a tag to production.",
          ["pg"],
        ),
      ],
    },
    {
      label: label("Operação", "Operations"),
      nodes: [
        n(
          "prom",
          "Prometheus",
          "OpenTelemetry",
          "Coleta a cada 10 s de front-ends, login, socket, recebimento, worker, chatbot e Redis.",
          "Scrapes front ends, sign-in, socket, intake, worker, chatbot and Redis every 10 s.",
          ["hospitalfe", "auth", "ws", "receiver", "worker", "chatbot", "grafana"],
        ),
        n(
          "grafana",
          "Grafana",
          "4 painéis",
          "Login, clientes, Redis e recebimento: fila, mortos, p50/p95/p99 e idade do dado.",
          "Sign-in, clients, Redis and intake: queue, dead letters, p50/p95/p99 and data age.",
        ),
        n(
          "ci",
          "GitHub Actions",
          "CI/CD",
          "Biome, tipos, testes com cobertura e build a cada PR; imagem e release na tag.",
          "Biome, types, tests with coverage and build on every PR; image and release on a tag.",
          ["ops", "atlas"],
        ),
        n(
          "ops",
          "radar-ops",
          "NestJS, React",
          "Painel próprio que conduz o release: tag, CD, redeploy no Portainer, health e smoke.",
          "An in-house console that drives the release: tag, CD, Portainer redeploy, health and smoke.",
          ["smoke"],
        ),
        n(
          "smoke",
          "Smoke test",
          "Playwright",
          "Roda nos três front-ends depois do deploy; quebrou, o release para.",
          "Runs on all three front ends after deploy; if it breaks, the release stops.",
          ["hospitalfe", "privadofe", "queryfe"],
        ),
      ],
    },
  ],
  facts: [
    { value: "514", label: label("arquivos de teste", "test files") },
    { value: "2", label: label("serviços portados para Go", "services ported to Go") },
    { value: "4", label: label("painéis no Grafana", "Grafana dashboards") },
    { value: "7", label: label("etapas no release", "release steps") },
  ],
};

const brio: Architecture = {
  summary: {
    pt: "Uma origem só para o ERP e o app, quatro serviços atrás dela e um agendador que dispara as rotinas de todos. Permissão é lida do Redis, nunca pedida ao login por HTTP.",
    en: "A single origin for the ERP and the app, four services behind it and a scheduler that fires everyone's routines. Permissions are read from Redis, never asked of sign-in over HTTP.",
  },
  start: "be",
  layers: [
    {
      label: label("Clientes", "Clients"),
      nodes: [
        n(
          "erp",
          "ERP da clínica",
          "Next.js 15",
          "Agenda, prontuário, vendas, estoque, financeiro e notas.",
          "Calendar, records, sales, stock, finance and invoices.",
          ["edge"],
        ),
        n(
          "app",
          "App da paciente",
          "Expo, three.js",
          "Metas diárias, companheiro 3D, fila offline e atualização ao vivo.",
          "Daily goals, a 3D companion, an offline queue and live updates.",
          ["edge"],
        ),
      ],
    },
    {
      label: label("Borda", "Edge"),
      nodes: [
        n(
          "edge",
          "Traefik + CrowdSec",
          "TLS",
          "Única entrada pública, com TLS 1.2 no mínimo e bloqueio de IP abusivo.",
          "The only public entry, TLS 1.2 minimum and abusive-IP blocking.",
          ["proxy"],
        ),
        n(
          "proxy",
          "Proxy",
          "nginx",
          "Origem única: front, API, WebSocket, login e chatbot por caminho.",
          "A single origin: front, API, WebSocket, sign-in and chatbot by path.",
          ["be", "auth", "chatbot"],
        ),
      ],
    },
    {
      label: label("Serviços", "Services"),
      nodes: [
        n(
          "auth",
          "Auth",
          "Express 5",
          "SSO multi-clínica; no login grava as permissões no Redis.",
          "Multi-clinic SSO; writes permissions to Redis at sign-in.",
          ["redis", "pg"],
        ),
        n(
          "be",
          "API da clínica",
          "Express 5, 33 módulos",
          "O domínio do ERP e do app; tempo real por WebSocket espalhado entre instâncias pelo Redis.",
          "The ERP and app domain; realtime over WebSocket fanned out across instances through Redis.",
          ["redis", "pg", "groq", "nfse", "push"],
        ),
        n(
          "chatbot",
          "Chatbot",
          "Express",
          "Fluxos e campanhas de WhatsApp; usa a API da clínica como usuário de serviço.",
          "WhatsApp flows and campaigns; uses the clinic API as a service user.",
          ["evolution", "be", "pg"],
        ),
        n(
          "schedule",
          "Agendador",
          "SKIP LOCKED",
          "Tick de 10 s com retry e backoff; dispara 11 rotinas do sistema, de recorrência financeira a lembrete do app.",
          "10 s tick with retries and backoff; fires 11 system routines, from financial recurrences to app reminders.",
          ["be", "chatbot"],
        ),
      ],
    },
    {
      label: label("Externos", "External"),
      nodes: [
        n(
          "evolution",
          "Evolution API",
          "WhatsApp",
          "Envia as mensagens e devolve as respostas por webhook.",
          "Sends messages and returns replies by webhook.",
          ["chatbot"],
        ),
        n(
          "groq",
          "Groq",
          "LLM",
          "Assistente com limite de taxa e cota semanal de tokens.",
          "Assistant with rate limits and a weekly token quota.",
        ),
        n(
          "nfse",
          "NFS-e",
          "Focus NFe",
          "Emissão de nota com webhook e varredura de pendentes.",
          "Invoice issuing with a webhook and a sweep of pending ones.",
          ["be"],
        ),
        n(
          "push",
          "Expo Push",
          "EAS",
          "Lembretes no celular da paciente.",
          "Reminders on the patient's phone.",
          ["app"],
        ),
      ],
    },
    {
      label: label("Dados", "Data"),
      nodes: [
        n(
          "pg",
          "PostgreSQL 17",
          "5 bancos",
          "Um banco por serviço, mais o do gateway de WhatsApp.",
          "One database per service, plus the WhatsApp gateway's.",
        ),
        n(
          "redis",
          "Redis",
          "permissões, pub/sub",
          "Cache de permissão lido por todos e barramento do tempo real.",
          "Permission cache read by everyone and the realtime bus.",
        ),
        n(
          "atlas",
          "Atlas",
          "um repo por banco",
          "Migrações versionadas; o Prisma só gera o cliente.",
          "Versioned migrations; Prisma only generates the client.",
          ["pg"],
        ),
        n(
          "backup",
          "Backup",
          "dump + restic",
          "Dump diário com retenção de 7 dias, 4 semanas e 6 meses.",
          "Daily dump kept for 7 days, 4 weeks and 6 months.",
          ["pg"],
        ),
      ],
    },
    {
      label: label("Operação", "Operations"),
      nodes: [
        n(
          "prom",
          "Prometheus",
          "OpenTelemetry",
          "Métricas dos quatro serviços, Traefik, host, contêineres, Postgres e Redis.",
          "Metrics from the four services, Traefik, host, containers, Postgres and Redis.",
          ["be", "auth", "chatbot", "schedule", "edge", "grafana"],
        ),
        n(
          "grafana",
          "Grafana",
          "5 alertas",
          "Alerta por e-mail: serviço fora, disco, memória, contêiner reiniciando e backup atrasado.",
          "Email alerts: service down, disk, memory, restart loop and a late backup.",
          ["backup"],
        ),
        n(
          "ci",
          "GitHub Actions",
          "CI/CD + EAS",
          "Biome, tipos, Jest com cobertura e build a cada PR; imagem e release na tag; APK e OTA do app.",
          "Biome, types, Jest with coverage and build on every PR; image and release on a tag; APK and OTA for the app.",
          ["app", "atlas"],
        ),
      ],
    },
  ],
  facts: [
    { value: "399", label: label("arquivos de teste", "test files") },
    { value: "33", label: label("módulos no back-end", "back-end modules") },
    { value: "11", label: label("rotinas agendadas", "scheduled routines") },
    { value: "5", label: label("bancos", "databases") },
  ],
};

const forja: Architecture = {
  summary: {
    pt: "Um monólito modular no centro, cercado de serviços pequenos. Cada módulo é um manifesto, nenhum importa outro, e eles conversam por eventos gravados na mesma transação e entregues por um worker.",
    en: "A modular monolith at the centre, ringed by small services. Each module is a manifest, none imports another, and they talk through events written in the same transaction and delivered by a worker.",
  },
  start: "api",
  layers: [
    {
      label: label("Borda", "Edge"),
      nodes: [
        n(
          "landing",
          "Landing",
          "Next.js estático",
          "Site de venda; o formulário cai numa rota pública com limite de taxa.",
          "Sales site; its form posts to a public, rate-limited route.",
          ["api"],
        ),
        n(
          "edge",
          "Proxy de borda",
          "NPM + CrowdSec",
          "Único com porta pública: TLS e bloqueio de IP abusivo.",
          "The only public port: TLS and abusive-IP blocking.",
          ["proxy"],
        ),
        n(
          "proxy",
          "Proxy do produto",
          "nginx",
          "Roteia por caminho, põe cabeçalhos de segurança e limita login e senha.",
          "Routes by path, adds security headers and rate-limits login and password.",
          ["builder", "runtime", "api", "auth", "chatbot"],
        ),
      ],
    },
    {
      label: label("Telas", "Screens"),
      nodes: [
        n(
          "builder",
          "Construtor",
          "Next.js 16",
          "Onde a agência escolhe módulos, marca, rótulos, painéis e cobra o cliente.",
          "Where the agency picks modules, brand, labels, dashboards and bills its client.",
          ["api"],
        ),
        n(
          "runtime",
          "Plataformas geradas",
          "Next.js 16",
          "A mesma base vira o sistema do cliente, com a marca dele aplicada em tempo de execução.",
          "The same code becomes the client's system, with their brand applied at runtime.",
          ["api"],
        ),
        n(
          "assistant",
          "Assistente de IA",
          "Groq",
          "Só chama ferramentas dos módulos ligados e que a pessoa pode usar; plataforma e unidade vêm da sessão, nunca do modelo.",
          "Only calls tools of active modules the person may use; platform and unit come from the session, never the model.",
          ["api"],
        ),
      ],
    },
    {
      label: label("Núcleo", "Core"),
      nodes: [
        n(
          "api",
          "Hub API",
          "Express 5, 20 módulos",
          "Valida os manifestos no boot; módulo só fala com módulo por evento ou referência.",
          "Validates manifests at boot; modules only talk through events or references.",
          ["outbox", "auth", "billing", "pg", "redis"],
        ),
        n(
          "outbox",
          "Outbox de eventos",
          "mesma transação",
          "O evento é gravado junto com a escrita de negócio, então nunca se perde.",
          "The event is written with the business write, so it is never lost.",
          ["worker"],
        ),
        n(
          "worker",
          "Worker",
          "mesma imagem",
          "Entrega eventos em lotes com SKIP LOCKED, retry com backoff e fila de mortos; roda MQTT, cobrança e PDFs.",
          "Delivers events in batches with SKIP LOCKED, backoff retries and a dead letter; runs MQTT, billing and PDFs.",
          ["pg"],
        ),
        n(
          "billing",
          "Cobrança",
          "Stripe Connect",
          "Fatura da agência e repasse para ela, com webhooks deduplicados.",
          "Bills the agency and pays it out, with deduplicated webhooks.",
          ["pg"],
        ),
      ],
    },
    {
      label: label("Serviços", "Services"),
      nodes: [
        n(
          "auth",
          "Auth",
          "Express, JWT",
          "SSO onde cada plataforma criada é uma feature; permissões em cache no Redis.",
          "SSO where each created platform is a feature; permissions cached in Redis.",
          ["redis", "pg"],
        ),
        n(
          "chatbot",
          "Chatbot",
          "Express, MCP",
          "Fluxos de WhatsApp; entra na API como usuário de serviço da plataforma.",
          "WhatsApp flows; signs in to the API as the platform's service user.",
          ["evolution", "api"],
        ),
        n(
          "schedule",
          "Agendador",
          "cron em HTTP",
          "Tick de 10 s com SKIP LOCKED e lista de destinos permitidos contra SSRF.",
          "10 s tick with SKIP LOCKED and an allowlist of targets against SSRF.",
          ["chatbot"],
        ),
        n(
          "evolution",
          "Evolution API",
          "gateway WhatsApp",
          "Envia e recebe as mensagens; avisa o chatbot por webhook interno.",
          "Sends and receives messages; notifies the chatbot through an internal webhook.",
          ["chatbot"],
        ),
      ],
    },
    {
      label: label("Dados", "Data"),
      nodes: [
        n(
          "pg",
          "PostgreSQL 17",
          "4 schemas + arquivo",
          "Um banco, um schema por serviço e um schema de arquivo para registros com mais de 3 anos.",
          "One database, a schema per service and an archive schema for records older than 3 years.",
        ),
        n(
          "redis",
          "Redis",
          "cache",
          "Permissões compartilhadas entre auth e API, e cache do assistente.",
          "Permissions shared by auth and the API, and the assistant's cache.",
        ),
        n(
          "atlas",
          "Atlas",
          "45 migrações",
          "Schema versionado; o CI aplica em dev no merge e em produção na tag.",
          "Versioned schema; CI applies to dev on merge and to production on a tag.",
          ["pg"],
        ),
      ],
    },
    {
      label: label("Operação", "Operations"),
      nodes: [
        n(
          "prom",
          "Prometheus",
          "métricas",
          "Coleta latência, fila do outbox e entregas mortas de cada serviço, mais host, contêineres, Postgres e Redis.",
          "Scrapes latency, outbox backlog and dead deliveries from every service, plus host, containers, Postgres and Redis.",
          ["api", "worker", "auth", "chatbot", "schedule", "grafana"],
        ),
        n(
          "loki",
          "Loki + Alloy",
          "logs",
          "Logs de todos os contêineres, com o nível como rótulo.",
          "Logs from every container, with the level as a label.",
          ["grafana"],
        ),
        n(
          "grafana",
          "Grafana",
          "6 painéis, 10 alertas",
          "Alerta por e-mail: serviço fora, 5xx, p95, fila do outbox, entrega morta, backup faltando.",
          "Email alerts: service down, 5xx, p95, outbox backlog, dead delivery, missing backup.",
        ),
        n(
          "ci",
          "GitHub Actions",
          "CI/CD",
          "A cada PR: audit, Biome, lint de arquitetura, tipos, Jest com cobertura e build; na tag, imagem com Trivy.",
          "On every PR: audit, Biome, architecture lint, types, Jest with coverage and build; on a tag, an image scanned by Trivy.",
          ["deploy", "atlas"],
        ),
        n(
          "deploy",
          "GHCR + Portainer",
          "deploy",
          "Stacks com tag fixa; nada é compilado em produção.",
          "Stacks pinned to a tag; nothing is built in production.",
          ["proxy"],
        ),
      ],
    },
  ],
  facts: [
    { value: "20", label: label("módulos", "modules") },
    { value: "80+", label: label("tabelas", "tables") },
    { value: "87%", label: label("cobertura do back-end", "back-end coverage") },
    { value: "10", label: label("alertas", "alerts") },
  ],
};

const prosaude: Architecture = {
  summary: {
    pt: "Um produto em cima de uma plataforma de serviços compartilhados: login, arquivos, e-mail e agendador servem qualquer produto da empresa. Cada serviço tem o próprio schema e só conversa pela rede interna.",
    en: "One product on top of a platform of shared services: sign-in, files, email and scheduler serve any of the company's products. Each service owns its schema and only talks over the internal network.",
  },
  start: "be",
  layers: [
    {
      label: label("Clientes", "Clients"),
      nodes: [
        n(
          "web",
          "Painel web",
          "Next.js 16",
          "Agenda, cadastros, inspeções, relatórios e plano de ação.",
          "Calendar, records, inspections, reports and action plans.",
          ["proxy"],
        ),
        n(
          "field",
          "App de campo",
          "PWA, hoje Expo",
          "Começou como PWA offline com service worker; hoje é app Expo com fila offline, GPS e assinatura.",
          "Started as an offline PWA with a service worker; now an Expo app with an offline queue, GPS and signature.",
          ["proxy", "files"],
        ),
      ],
    },
    {
      label: label("Borda", "Edge"),
      nodes: [
        n(
          "traefik",
          "Cloudflare + Traefik",
          "TLS",
          "Único contêiner nas portas 80 e 443.",
          "The only container on ports 80 and 443.",
          ["proxy"],
        ),
        n(
          "proxy",
          "Proxy do produto",
          "nginx",
          "Roteia web, API, login e arquivos; rotas internas respondem 404 de fora.",
          "Routes web, API, sign-in and files; internal routes return 404 from outside.",
          ["be", "auth", "files"],
        ),
      ],
    },
    {
      label: label("Produto", "Product"),
      nodes: [
        n(
          "be",
          "API de inspeções",
          "Express 5, Prisma 7",
          "Ciclo da inspeção até a confirmação irreversível com snapshot SHA-256, matriz de risco 5×5, PDF e /sync idempotente.",
          "Inspection lifecycle up to an irreversible confirmation with a SHA-256 snapshot, a 5×5 risk matrix, PDFs and an idempotent /sync.",
          ["files", "mail", "schedule", "pg", "redis"],
        ),
      ],
    },
    {
      label: label("Plataforma", "Platform"),
      nodes: [
        n(
          "auth",
          "Auth",
          "JWT, Redis",
          "SSO de todos os produtos; grava a sessão no Redis e cada back-end a lê sozinho.",
          "SSO for every product; writes the session to Redis and each back end reads it on its own.",
          ["redis", "mail", "pg"],
        ),
        n(
          "files",
          "Arquivos",
          "sharp, S3",
          "Upload com ticket de uso único, checagem de tipo pelo conteúdo, HEIC para JPEG, miniatura e URL assinada que expira.",
          "Upload with a one-time ticket, file type checked by content, HEIC to JPEG, thumbnails and expiring signed URLs.",
          ["s3", "pg"],
        ),
        n(
          "mail",
          "E-mail",
          "fila no Postgres",
          "Fila com SKIP LOCKED, 6 tentativas com backoff e remetente por cliente.",
          "A queue with SKIP LOCKED, 6 attempts with backoff and a sender per client.",
          ["files", "pg"],
        ),
        n(
          "schedule",
          "Agendador",
          "cron em HTTP",
          "Chama de volta a API como usuário de serviço, só para destinos permitidos.",
          "Calls the API back as a service user, only to allowed targets.",
          ["be"],
        ),
      ],
    },
    {
      label: label("Dados", "Data"),
      nodes: [
        n(
          "pg",
          "PostgreSQL 17",
          "schema por serviço",
          "Nenhum serviço lê o schema do outro; dump diário.",
          "No service reads another's schema; daily dump.",
        ),
        n(
          "redis",
          "Redis 7",
          "sessões",
          "Sessão gravada pelo auth e lida por todos os back-ends.",
          "Sessions written by auth and read by every back end.",
        ),
        n(
          "s3",
          "S3",
          "SeaweedFS",
          "Só o serviço de arquivos encosta nos bytes.",
          "Only the files service touches the bytes.",
        ),
        n(
          "atlas",
          "Atlas",
          "2 repositórios",
          "Schemas da plataforma e do produto versionados à parte; o back-end nunca roda DDL.",
          "Platform and product schemas versioned apart; the back ends never run DDL.",
          ["pg"],
        ),
      ],
    },
    {
      label: label("Operação", "Operations"),
      nodes: [
        n(
          "prom",
          "Prometheus",
          "métricas",
          "Latência por rota de todo serviço, logins, uploads, entregas de e-mail, disparos do agendador e tempo de PDF.",
          "Per-route latency for every service, sign-ins, uploads, email deliveries, scheduler runs and PDF render time.",
          ["be", "auth", "files", "mail", "schedule", "grafana"],
        ),
        n(
          "loki",
          "Loki + Alloy",
          "logs",
          "Logs de todos os contêineres; os alertas de backup leem daqui.",
          "Logs from every container; the backup alerts read from here.",
          ["grafana"],
        ),
        n(
          "grafana",
          "Grafana 12",
          "16 alertas",
          "Painel de serviços e de logs; alerta de 5xx, p95, força bruta no login, fila de e-mail parada, TLS e backup.",
          "Services and logs dashboards; alerts on 5xx, p95, login brute force, a stuck mail queue, TLS and backups.",
        ),
        n(
          "ci",
          "GitHub Actions",
          "CI/CD",
          "Audit, Biome, tipos, Jest com cobertura e build a cada PR; imagem e release na tag; APK e OTA do app.",
          "Audit, Biome, types, Jest with coverage and build on every PR; image and release on a tag; APK and OTA for the app.",
          ["deploy", "atlas"],
        ),
        n(
          "deploy",
          "Compose por stack",
          "GHCR",
          "Versões fixas sobem em ordem: borda, bancos, infra, ambiente, produto.",
          "Pinned versions go up in order: edge, databases, infra, environment, product.",
          ["traefik"],
        ),
      ],
    },
  ],
  facts: [
    { value: "5", label: label("serviços de back-end", "back-end services") },
    { value: "16", label: label("alertas", "alerts") },
    { value: "80%+", label: label("cobertura em todo serviço", "coverage in every service") },
  ],
};

/* --------------------------------------------------------------------
   GAMES
-------------------------------------------------------------------- */

const idle: Architecture = {
  summary: {
    pt: "Três contêineres e uma regra: o cliente só pede, o servidor decide. Luta, duelo, mercado e premium são resolvidos no back-end, atrás de uma rota única cifrada por sessão.",
    en: "Three containers and one rule: the client asks, the server decides. Fights, duels, the market and premium are resolved on the back end, behind a single route encrypted per session.",
  },
  start: "router",
  layers: [
    {
      label: label("Cliente", "Client"),
      nodes: [
        n(
          "spa",
          "Jogo no navegador",
          "React 19, Zustand",
          "SPA que desenha o jogo e consulta arena, amigos e missões em intervalos.",
          "SPA that draws the game and polls arena, friends and missions on timers.",
          ["nginx"],
        ),
      ],
    },
    {
      label: label("Borda", "Edge"),
      nodes: [
        n(
          "nginx",
          "Nginx",
          "estático + proxy",
          "Serve o build do cliente e repassa /api para o servidor.",
          "Serves the client build and proxies /api to the server.",
          ["router", "auth"],
        ),
      ],
    },
    {
      label: label("API", "API"),
      nodes: [
        n(
          "auth",
          "Login",
          "JWT, Google OAuth",
          "Conta com senha em bcrypt ou Google; devolve a sessão e a chave da sessão.",
          "Password (bcrypt) or Google sign-in; returns the session and its key.",
          ["db"],
        ),
        n(
          "router",
          "Roteador de ações",
          "Express 5",
          "Uma rota só recebe toda ação do jogo, cifrada por sessão, com nonce e checagem de relógio contra replay.",
          "One route takes every game action, encrypted per session, with a nonce and clock check against replay.",
          ["guard"],
        ),
        n(
          "guard",
          "Travas de confiança",
          "rate limit, validador",
          "Limite por ação e por IP, validador de save com teto de ganho e rotas isca que banem quem forja.",
          "Per-action and per-IP limits, a save validator with gain caps and honeypot routes that ban forgers.",
          ["combat", "arena", "rooms", "premium"],
        ),
      ],
    },
    {
      label: label("Regras do jogo", "Game rules"),
      nodes: [
        n(
          "combat",
          "Motor de combate",
          "servidor",
          "Resolve a luta inteira no servidor a partir da ficha do herói.",
          "Resolves the whole fight on the server from the hero sheet.",
          ["db"],
        ),
        n(
          "arena",
          "Arena",
          "Elo, temporadas",
          "Duelos assíncronos simulados no servidor, pontuação Elo e hall da fama.",
          "Asynchronous duels simulated on the server, Elo points and a hall of fame.",
          ["db"],
        ),
        n(
          "rooms",
          "Salas e mercado",
          "feed, ranking",
          "Sala global e salas de amigos com feed de eventos, ranking, mercado e cemitério.",
          "Global and friends' rooms with an event feed, ranking, market and graveyard.",
          ["db"],
        ),
        n(
          "premium",
          "Premium",
          "só no servidor",
          "Vale o que o servidor diz: a validade mora no banco, nunca no cliente.",
          "Whatever the server says: the expiry lives in the database, never in the client.",
          ["db"],
        ),
      ],
    },
    {
      label: label("Dados", "Data"),
      nodes: [
        n(
          "db",
          "PostgreSQL",
          "Prisma",
          "Contas, heróis, itens, mercado e temporadas; dados do jogo semeados de arquivos no boot.",
          "Accounts, heroes, items, market and seasons; game data seeded from files at boot.",
        ),
      ],
    },
    {
      label: label("Entrega", "Delivery"),
      nodes: [
        n(
          "ci",
          "GitHub Actions",
          "CI + CD por tag",
          "Lint e build a cada PR; tag em main gera as imagens do cliente e do servidor.",
          "Lint and build on every PR; a tag on main builds the client and server images.",
          ["ghcr"],
        ),
        n(
          "ghcr",
          "GHCR",
          "imagens",
          "Registro das imagens versionadas.",
          "Registry for the versioned images.",
          ["compose"],
        ),
        n(
          "compose",
          "Docker Compose",
          "VPS",
          "Sobe Nginx, servidor e Postgres na VPS.",
          "Runs Nginx, the server and Postgres on the VPS.",
          ["nginx", "db"],
        ),
      ],
    },
  ],
  facts: [
    { value: "3", label: label("contêineres", "containers") },
    { value: "27", label: label("arquivos de teste", "test files") },
    { value: "1", label: label("rota para toda ação", "route for every action") },
  ],
};

const arena: Architecture = {
  summary: {
    pt: "Tudo no cliente, mas com a regra separada do desenho: o combate é uma simulação pura e determinística que roda no Node, e o Phaser só mostra o resultado.",
    en: "All in the client, with rules kept apart from drawing: combat is a pure, deterministic simulation that runs in Node, and Phaser only shows the result.",
  },
  start: "combat",
  layers: [
    {
      label: label("Arte", "Art"),
      nodes: [
        n(
          "pixellab",
          "Sprites e VFX",
          "PixelLab",
          "Lutadores e efeitos gerados e animados quadro a quadro.",
          "Fighters and effects generated and animated frame by frame.",
          ["tools"],
        ),
        n(
          "tools",
          "Pipeline de arte",
          "Python, Pillow",
          "Recorta e monta as folhas de sprite que o jogo carrega.",
          "Cuts and assembles the sprite sheets the game loads.",
          ["scenes"],
        ),
      ],
    },
    {
      label: label("Tela", "Screen"),
      nodes: [
        n(
          "scenes",
          "Cenas",
          "Phaser 3",
          "Escolha do time, batalha e recompensa, em 480×270 com escala inteira.",
          "Team select, battle and reward, at 480×270 with integer scaling.",
          ["modes"],
        ),
      ],
    },
    {
      label: label("Simulação", "Simulation"),
      nodes: [
        n(
          "modes",
          "Modos de ritmo",
          "turno, semiautomático",
          "O mesmo núcleo serve por turnos ou semiautomático.",
          "The same core runs turn-based or semi-auto.",
          ["combat"],
        ),
        n(
          "combat",
          "Resolvedor de combate",
          "TypeScript puro",
          "Alcance, provocação e habilidades decidem cada golpe, com RNG semeado.",
          "Range, taunt and abilities decide every hit, with a seeded RNG.",
          ["ai"],
        ),
        n(
          "ai",
          "IA dos lutadores",
          "TypeScript",
          "Escolhe alvo e habilidade dos dois lados.",
          "Picks target and ability for both sides.",
        ),
        n(
          "run",
          "Escada",
          "5 encontros",
          "A corrida de cinco encontros com recompensa entre eles.",
          "The five-encounter run with rewards in between.",
          ["combat"],
        ),
      ],
    },
    {
      label: label("Verificação", "Checks"),
      nodes: [
        n(
          "vitest",
          "Testes",
          "Vitest",
          "Travam as regras da simulação sem abrir o jogo.",
          "Lock the simulation rules without opening the game.",
          ["combat", "run"],
        ),
        n(
          "compare",
          "IA contra IA",
          "Node",
          "Roda milhares de lutas e mede a taxa de vitória de cada composição.",
          "Runs thousands of fights and measures each team's win rate.",
          ["combat"],
        ),
      ],
    },
  ],
  facts: [
    { value: "0", label: label("servidores", "servers") },
    { value: "6", label: label("arquivos de teste", "test files") },
  ],
};

export const architectures = { radar, brio, forja, prosaude, idle, arena };
