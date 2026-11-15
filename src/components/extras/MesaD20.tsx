import { useRef, useState } from "react";
import type { T } from "../../content/types";
import { useT } from "../../store";
import type { D20Scene } from "../../three/d20-scene";
import { Stage } from "../../three/stage";

const ui = {
  title: { pt: "Role um d20", en: "Roll a d20" },
  hint: {
    pt: "Sorteado com crypto, como o servidor da mesa faz; o dado só mostra o resultado.",
    en: "Drawn with crypto, like the table's server does; the die only shows the result.",
  },
  roll: { pt: "Rolar d20", en: "Roll d20" },
  rolling: { pt: "Rolando...", en: "Rolling..." },
  crit: { pt: "20 natural, acerto crítico!", en: "Natural 20, critical hit!" },
  fumble: { pt: "1 natural, falha crítica.", en: "Natural 1, critical miss." },
  last: { pt: "Últimas rolagens", en: "Last rolls" },
  label: { pt: "Dado de vinte faces em 3D", en: "3D twenty-sided die" },
  fallback: {
    pt: "Este navegador não mostra WebGL, mas o sorteio funciona igual.",
    en: "This browser cannot show WebGL, but the roll works all the same.",
  },
} satisfies Record<string, T>;

/** Uniform 1..20 without modulo bias, as crypto.randomInt does on the server. */
function d20(): number {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / 20) * 20;
  do crypto.getRandomValues(buf);
  while (buf[0] >= limit);
  return (buf[0] % 20) + 1;
}

export function MesaD20() {
  const t = useT();
  const scene = useRef<D20Scene | null>(null);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [failed, setFailed] = useState(false);

  const roll = () => {
    if (rolling) return;
    const value = d20();
    setRolling(true);
    setResult(null);
    const land = () => {
      setRolling(false);
      setResult(value);
      setHistory((h) => [value, ...h].slice(0, 6));
    };
    if (scene.current) scene.current.roll(value, land);
    else land();
  };

  return (
    <div className="extra mesa-d20">
      <div className="d20-stage">
        {failed ? (
          <p className="extra-fallback">{t(ui.fallback)}</p>
        ) : (
          <Stage<D20Scene>
            className="stage-canvas"
            label={t(ui.label)}
            load={async () => {
              const { createD20Scene } = await import("../../three/d20-scene");
              await document.fonts.load('600 60px "Fraunces Variable"').catch(() => {});
              return createD20Scene;
            }}
            onReady={(s) => {
              scene.current = s;
            }}
            onUnavailable={() => setFailed(true)}
          />
        )}
      </div>
      <div className="d20-side">
        <h4 className="extra-title">{t(ui.title)}</h4>
        <p className="extra-hint">{t(ui.hint)}</p>
        <button type="button" className="project-link d20-button" onClick={roll} disabled={rolling}>
          {rolling ? t(ui.rolling) : t(ui.roll)}
        </button>
        <p className="d20-result" aria-live="polite">
          {result !== null && (
            <>
              <b data-kind={result === 20 ? "crit" : result === 1 ? "fumble" : undefined}>
                {result}
              </b>
              {result === 20 && <span>{t(ui.crit)}</span>}
              {result === 1 && <span>{t(ui.fumble)}</span>}
            </>
          )}
        </p>
        {history.length > 0 && (
          <p className="d20-history">
            {t(ui.last)}: {history.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
