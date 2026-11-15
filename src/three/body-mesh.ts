// Malha do corpo (public/media/radar/body-model.bin, copiada do Radar Hospital; gerada a
// partir da malha base CC0 do MakeHuman) e a deformação do tronco pelo IMC. Sem three.js: fica
// à parte para o Jest testar sem carregar a lib.

export const BODY_MODEL_URL = "/media/radar/body-model.bin";

const MAGIC = "RBM1";
const HEADER_BYTES = 12;
// As coordenadas vêm em Int16, de -COORD_RANGE a +COORD_RANGE.
const COORD_RANGE = 2;

export type TBodyMesh = { positions: Float32Array; indices: Uint16Array };

/** Lê o binário da malha. Lança erro se o arquivo não for o esperado. */
export function parseBodyModel(buffer: ArrayBuffer): TBodyMesh {
  const view = new DataView(buffer);
  const magic =
    buffer.byteLength >= HEADER_BYTES
      ? String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3))
      : "";
  if (magic !== MAGIC) throw new Error("body-map: arquivo de malha inválido");
  const vertexCount = view.getUint32(4, true);
  const indexCount = view.getUint32(8, true);
  if (buffer.byteLength < HEADER_BYTES + vertexCount * 6 + indexCount * 2) {
    throw new Error("body-map: arquivo de malha truncado");
  }
  const positions = new Float32Array(vertexCount * 3);
  for (let i = 0; i < positions.length; i++) {
    positions[i] = (view.getInt16(HEADER_BYTES + i * 2, true) / 32767) * COORD_RANGE;
  }
  const indexOffset = HEADER_BYTES + vertexCount * 6;
  const indices = new Uint16Array(indexCount);
  for (let i = 0; i < indexCount; i++) indices[i] = view.getUint16(indexOffset + i * 2, true);
  return { positions, indices };
}

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/** Faixa de altura do tronco (0..1): cheia entre a pelve e o peito, sumindo em ombros e coxas. */
const torsoHeight = (y: number) => smoothstep(-0.05, 0.25, y) * (1 - smoothstep(0.75, 1.05, y));

/** Meia-largura a partir da qual o ponto já é braço (os braços descem rente ao tronco). */
const ARM_START = 0.36;
const ARM_FULL = 0.44;

/**
 * Quanto um ponto pertence ao tronco (0..1), nas coordenadas da malha (pés em -1,75, topo em
 * 1,75): cheio entre a pelve e o peito, sumindo em direção aos ombros e às coxas, e zero nos
 * braços.
 */
export function torsoWeight(x: number, y: number): number {
  return torsoHeight(y) * (1 - smoothstep(ARM_START, ARM_FULL, Math.abs(x)));
}

/**
 * Posição de um ponto com o tronco alargado por `scale` (1 = sem mudança). A barriga cresce mais
 * para a frente (z > 0) do que para os lados, e quase nada para trás. Os braços não engrossam:
 * são empurrados para fora o tanto que a lateral do tronco cresceu, para não entrar nele.
 * Devolve [x, z]; y não muda.
 */
export function deformTorso(x: number, y: number, z: number, scale: number): [number, number] {
  if (scale === 1) return [x, z];
  const weight = torsoWeight(x, y);
  const sideGrowth = (scale - 1) * 0.8;
  const armShift = (torsoHeight(y) - weight) * sideGrowth * ARM_START;
  const depth = 1 + (z > 0 ? scale ** 1.6 - 1 : (scale - 1) * 0.4) * weight;
  return [x * (1 + sideGrowth * weight) + Math.sign(x) * armShift, z * depth];
}
