import { useState } from "react";
import type { T } from "../../content/types";
import { useT } from "../../store";

/**
 * A live mini version of what the Forja Hub builder does at runtime: one platform, repainted
 * with another client's name, colour, font and vocabulary. Clients and numbers are fictional.
 */
type Brand = {
  id: string;
  name: string;
  color: string;
  font: string;
  people: T;
  catalog: T;
  modules: T[];
  kpi: { value: string; label: T };
};

const BRANDS: Brand[] = [
  {
    id: "lumi",
    name: "Studio Lumi",
    color: "#c2417a",
    font: "'Playfair Display', serif",
    people: { pt: "Clientes", en: "Clients" },
    catalog: { pt: "Procedimentos", en: "Treatments" },
    modules: [
      { pt: "Agenda", en: "Calendar" },
      { pt: "Fidelidade", en: "Loyalty" },
      { pt: "Financeiro", en: "Finance" },
    ],
    kpi: { value: "37", label: { pt: "atendimentos na semana", en: "appointments this week" } },
  },
  {
    id: "ritmo",
    name: "Academia Ritmo",
    color: "#16a34a",
    font: "'Space Grotesk', sans-serif",
    people: { pt: "Alunos", en: "Members" },
    catalog: { pt: "Planos", en: "Plans" },
    modules: [
      { pt: "Metas", en: "Goals" },
      { pt: "Vendas", en: "Sales" },
      { pt: "Notificações", en: "Notifications" },
    ],
    kpi: { value: "212", label: { pt: "alunos ativos", en: "active members" } },
  },
  {
    id: "prado",
    name: "Oficina Prado",
    color: "#2563eb",
    font: "'IBM Plex Sans', sans-serif",
    people: { pt: "Veículos", en: "Vehicles" },
    catalog: { pt: "Serviços", en: "Services" },
    modules: [
      { pt: "Estoque", en: "Stock" },
      { pt: "Compras", en: "Purchases" },
      { pt: "Integrações", en: "Integrations" },
    ],
    kpi: { value: "18", label: { pt: "ordens abertas", en: "open work orders" } },
  },
  {
    id: "serra",
    name: "Clínica Serra Azul",
    color: "#0e7490",
    font: "'Nunito', sans-serif",
    people: { pt: "Pacientes", en: "Patients" },
    catalog: { pt: "Consultas", en: "Visits" },
    modules: [
      { pt: "Agenda", en: "Calendar" },
      { pt: "Registros", en: "Records" },
      { pt: "Assistente de IA", en: "AI assistant" },
    ],
    kpi: { value: "64", label: { pt: "consultas no mês", en: "visits this month" } },
  },
];

const ui = {
  title: { pt: "Uma plataforma, quatro clientes", en: "One platform, four clients" },
  hint: {
    pt: "Troque o cliente: nome, cor, fonte e até o nome das entidades mudam na hora, como no construtor.",
    en: "Switch the client: name, colour, font and even entity names change at once, as in the builder.",
  },
  legend: { pt: "Cliente da agência", en: "Agency client" },
  sample: { pt: "Exemplo com dados fictícios.", en: "Example with fictional data." },
  newItem: { pt: "Novo", en: "New" },
} satisfies Record<string, T>;

export function ForjaTheming() {
  const t = useT();
  const [id, setId] = useState(BRANDS[0].id);
  const b = BRANDS.find((x) => x.id === id) ?? BRANDS[0];
  return (
    <div className="extra forja-theming">
      <div className="forja-controls">
        <h4 className="extra-title">{t(ui.title)}</h4>
        <p className="extra-hint">{t(ui.hint)}</p>
        <fieldset className="forja-brands">
          <legend className="sr-only">{t(ui.legend)}</legend>
          {BRANDS.map((x) => (
            <label key={x.id} className="forja-brand">
              <input
                type="radio"
                name="forja-brand"
                value={x.id}
                checked={x.id === id}
                onChange={() => setId(x.id)}
              />
              <span className="swatch" style={{ background: x.color }} aria-hidden="true" />
              <span style={{ fontFamily: x.font }}>{x.name}</span>
            </label>
          ))}
        </fieldset>
        <p className="extra-note">{t(ui.sample)}</p>
      </div>
      <div
        className="forja-preview"
        style={{ "--brand": b.color, "--brand-font": b.font } as React.CSSProperties}
        aria-live="polite"
      >
        <aside className="fp-side">
          <p className="fp-logo">
            <span aria-hidden="true">{b.name.charAt(0)}</span>
            {b.name}
          </p>
          <ul>
            <li className="is-active">{t(b.people)}</li>
            <li>{t(b.catalog)}</li>
            {b.modules.map((m) => (
              <li key={m.en}>{t(m)}</li>
            ))}
          </ul>
        </aside>
        <div className="fp-main">
          <div className="fp-head">
            <p className="fp-title">{t(b.people)}</p>
            <span className="fp-button">+ {t(ui.newItem)}</span>
          </div>
          <div className="fp-kpi">
            <b>{b.kpi.value}</b>
            <span>{t(b.kpi.label)}</span>
          </div>
          <div className="fp-rows" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}
