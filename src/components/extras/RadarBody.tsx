import { useRef, useState } from "react";
import type { T } from "../../content/types";
import { useT } from "../../store";
import type { BodyScene, RegionKey } from "../../three/body-scene";
import { Stage } from "../../three/stage";

const REGIONS: { key: RegionKey; color: string; name: T; note: T }[] = [
  {
    key: "heart",
    color: "#f2711c",
    name: { pt: "Coração e vasos", en: "Heart and vessels" },
    note: {
      pt: "Pressão 146/91, risco cardiovascular alto",
      en: "BP 146/91, high cardiovascular risk",
    },
  },
  {
    key: "lungs",
    color: "#0aa5b8",
    name: { pt: "Pulmões", en: "Lungs" },
    note: { pt: "Asma", en: "Asthma" },
  },
  {
    key: "pancreas",
    color: "#f5a524",
    name: { pt: "Pâncreas", en: "Pancreas" },
    note: { pt: "Risco de diabetes moderado", en: "Moderate diabetes risk" },
  },
  {
    key: "kidneys",
    color: "#2f6fe4",
    name: { pt: "Rins", en: "Kidneys" },
    note: { pt: "Doença renal", en: "Kidney disease" },
  },
  {
    key: "joints",
    color: "#b4561b",
    name: { pt: "Articulações", en: "Joints" },
    note: { pt: "Artrose", en: "Osteoarthritis" },
  },
];

const ui = {
  title: { pt: "Mapa do corpo, ao vivo", en: "Body map, live" },
  hint: {
    pt: "Arraste para girar. Passe o mouse num ponto ou na lista. O IMC alarga o tronco como no produto.",
    en: "Drag to turn. Hover a point or the list. BMI widens the torso like in the product.",
  },
  bmi: { pt: "IMC", en: "BMI" },
  label: {
    pt: "Corpo humano 3D translúcido com pontos coloridos nas regiões com condição de saúde",
    en: "Translucent 3D human body with coloured points on the regions with a health condition",
  },
  fallback: {
    pt: "Este navegador não mostra WebGL; o print da ficha acima mostra a mesma peça.",
    en: "This browser cannot show WebGL; the record screenshot above shows the same piece.",
  },
} satisfies Record<string, T>;

/** BMI to torso width, the same rule as the Radar Hospital: 2% per BMI point around 25, 0.9 to 1.35. */
const torsoScaleFor = (bmi: number) => Math.min(1.35, Math.max(0.9, 1 + (bmi - 25) * 0.02));

export function RadarBody() {
  const t = useT();
  const scene = useRef<BodyScene | null>(null);
  const [active, setActive] = useState<RegionKey | null>(null);
  const [bmi, setBmi] = useState(31);
  const [failed, setFailed] = useState(false);

  const highlight = (key: RegionKey | null) => {
    setActive(key);
    scene.current?.setHighlight(key);
  };

  return (
    <div className="extra radar-body">
      <div className="radar-body-stage">
        {failed ? (
          <p className="extra-fallback">{t(ui.fallback)}</p>
        ) : (
          <Stage<BodyScene>
            className="stage-canvas"
            label={t(ui.label)}
            load={async () => {
              const [{ createBodyScene }, { parseBodyModel, BODY_MODEL_URL }] = await Promise.all([
                import("../../three/body-scene"),
                import("../../three/body-mesh"),
              ]);
              const buffer = await fetch(BODY_MODEL_URL).then((r) => r.arrayBuffer());
              const mesh = parseBodyModel(buffer);
              return (canvas) => createBodyScene(canvas, mesh, "#3d7bff");
            }}
            onReady={(s) => {
              scene.current = s;
              s.setRegions(REGIONS.map(({ key, color }) => ({ key, color })));
              s.setTorsoScale(torsoScaleFor(bmi));
              s.onHover((key) => setActive(key));
            }}
            onUnavailable={() => setFailed(true)}
          />
        )}
      </div>
      <div className="radar-body-side">
        <h4 className="extra-title">{t(ui.title)}</h4>
        <p className="extra-hint">{t(ui.hint)}</p>
        <ul className="radar-regions">
          {REGIONS.map((r) => (
            <li key={r.key}>
              <button
                type="button"
                aria-pressed={active === r.key}
                onMouseEnter={() => highlight(r.key)}
                onMouseLeave={() => highlight(null)}
                onFocus={() => highlight(r.key)}
                onBlur={() => highlight(null)}
              >
                <span className="dot" style={{ background: r.color }} aria-hidden="true" />
                <span>
                  <b>{t(r.name)}</b>
                  <small>{t(r.note)}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <label className="radar-bmi">
          <span>
            {t(ui.bmi)} <b>{bmi.toFixed(1).replace(".", ",")}</b>
          </span>
          <input
            type="range"
            min={18}
            max={42}
            step={0.5}
            value={bmi}
            onChange={(e) => {
              const value = Number(e.target.value);
              setBmi(value);
              scene.current?.setTorsoScale(torsoScaleFor(value));
            }}
          />
        </label>
      </div>
    </div>
  );
}
