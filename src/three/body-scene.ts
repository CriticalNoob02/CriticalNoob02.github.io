import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { deformTorso, type TBodyMesh } from "./body-mesh";
import type { StageScene } from "./stage";

// Port of the Radar Hospital body map scene: a translucent human body (MakeHuman base mesh,
// CC0) with a glowing point on each region. The torso widens with BMI, the body sways slowly,
// turns when dragged, and points answer to hover.

export type RegionKey = "lungs" | "heart" | "pancreas" | "kidneys" | "joints";

const REGION_POSITION: Record<RegionKey, [number, number, number]> = {
  lungs: [-0.14, 0.86, 0.1],
  heart: [0.07, 0.8, 0.14],
  pancreas: [0.06, 0.5, 0.12],
  kidneys: [-0.13, 0.45, -0.03],
  joints: [0.26, -0.8, 0.07],
};

const HOTSPOT_RADIUS = 0.055;
const CAMERA_DISTANCE = 7.1;
const BODY_WIDTH = 1.5;
const PICK_RADIUS = 18;
const SWAY = 0.45;
const DRAG_SPEED = 2.4;

export type BodyScene = StageScene & {
  setRegions: (regions: { key: RegionKey; color: string }[]) => void;
  setTorsoScale: (scale: number) => void;
  setHighlight: (key: RegionKey | null) => void;
  onHover: (fn: (key: RegionKey | null) => void) => void;
};

const BODY_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const BODY_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.2);
    gl_FragColor = vec4(uColor, min(0.16 + 0.62 * rim, 1.0));
  }
`;

type Hotspot = {
  key: RegionKey;
  group: Group;
  core: Mesh;
  coreMaterial: MeshBasicMaterial;
  halo: Mesh;
  haloMaterial: MeshBasicMaterial;
  phase: number;
  base: [number, number, number];
};

export function createBodyScene(
  canvas: HTMLCanvasElement,
  mesh: TBodyMesh,
  bodyColor: string,
): BodyScene {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, CAMERA_DISTANCE);

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  const bodyMaterial = track(
    new ShaderMaterial({
      uniforms: { uColor: { value: new Color(bodyColor) } },
      vertexShader: BODY_VERTEX,
      fragmentShader: BODY_FRAGMENT,
      transparent: true,
      depthWrite: false,
    }),
  );

  const figure = new Group();
  scene.add(figure);

  const geometry = track(new BufferGeometry());
  const positions = new BufferAttribute(new Float32Array(mesh.positions), 3);
  geometry.setAttribute("position", positions);
  geometry.setIndex(new BufferAttribute(mesh.indices, 1));
  geometry.computeVertexNormals();
  // Depth pre-pass then colour pass: only the front surface shows through the transparency.
  const depthMaterial = track(new MeshBasicMaterial({ colorWrite: false }));
  const colorPass = new Mesh(geometry, bodyMaterial);
  colorPass.renderOrder = 1;
  figure.add(new Mesh(geometry, depthMaterial), colorPass);

  const hotspotGeometry = track(new SphereGeometry(HOTSPOT_RADIUS, 20, 16));
  let hotspots: Hotspot[] = [];
  let torsoScale = 1;
  let highlight: RegionKey | null = null;
  let hovered: RegionKey | null = null;
  let onHover: (key: RegionKey | null) => void = () => {};

  let yaw = 0;
  let dragYaw = 0;
  let swayPhase = 0;
  let lastTime: number | null = null;
  let drag: { x: number } | null = null;
  const size = { width: 1, height: 1 };
  const projected = new Vector3();

  const placeHotspots = () => {
    for (const h of hotspots) {
      const [x, z] = deformTorso(h.base[0], h.base[1], h.base[2], torsoScale);
      h.group.position.set(x, h.base[1], z);
    }
  };

  const pick = (x: number, y: number): RegionKey | null => {
    let best: { key: RegionKey; distance: number } | null = null;
    for (const h of hotspots) {
      h.group.getWorldPosition(projected).project(camera);
      const dx = ((projected.x - x) * size.width) / 2;
      const dy = ((-projected.y - y) * size.height) / 2;
      const distance = Math.hypot(dx, dy);
      if (distance <= PICK_RADIUS && (!best || distance < best.distance)) {
        best = { key: h.key, distance };
      }
    }
    return best?.key ?? null;
  };

  return {
    render: (time) => {
      const delta = lastTime === null ? 0 : Math.min(0.1, Math.max(0, time - lastTime));
      lastTime = time;
      if (!highlight && !drag) swayPhase += delta * 0.5;
      yaw += (Math.sin(swayPhase) * SWAY + dragYaw - yaw) * 0.12;
      figure.rotation.y = yaw;
      for (const h of hotspots) {
        const active = highlight === h.key;
        const dimmed = highlight !== null && !active;
        const pulse = (time * 0.9 + h.phase) % 1;
        const target = active ? 1.7 : 1;
        h.core.scale.setScalar(h.core.scale.x + (target - h.core.scale.x) * 0.2);
        h.coreMaterial.opacity = dimmed ? 0.35 : 1;
        h.halo.scale.setScalar(1.4 + pulse * (active ? 3.2 : 2.2));
        h.haloMaterial.opacity = (1 - pulse) * (dimmed ? 0.08 : active ? 0.55 : 0.3);
      }
      renderer.render(scene, camera);
    },
    resize: (width, height) => {
      if (width <= 0 || height <= 0) return;
      size.width = width;
      size.height = height;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const fit = BODY_WIDTH / 3.6;
      camera.position.z =
        camera.aspect < fit ? CAMERA_DISTANCE * (fit / camera.aspect) : CAMERA_DISTANCE;
      camera.updateProjectionMatrix();
    },
    setRegions: (regions) => {
      for (const h of hotspots) {
        figure.remove(h.group);
        h.coreMaterial.dispose();
        h.haloMaterial.dispose();
      }
      hotspots = regions.map((region, index) => {
        const coreMaterial = new MeshBasicMaterial({
          color: region.color,
          transparent: true,
          depthTest: false,
        });
        const haloMaterial = new MeshBasicMaterial({
          color: region.color,
          transparent: true,
          opacity: 0.3,
          depthTest: false,
          depthWrite: false,
        });
        const core = new Mesh(hotspotGeometry, coreMaterial);
        const halo = new Mesh(hotspotGeometry, haloMaterial);
        core.renderOrder = 3;
        halo.renderOrder = 2;
        const group = new Group();
        group.add(halo, core);
        figure.add(group);
        return {
          key: region.key,
          group,
          core,
          coreMaterial,
          halo,
          haloMaterial,
          phase: (index * 0.37) % 1,
          base: REGION_POSITION[region.key],
        };
      });
      placeHotspots();
    },
    setTorsoScale: (scale) => {
      if (scale === torsoScale) return;
      torsoScale = scale;
      const base = mesh.positions;
      for (let i = 0; i < base.length; i += 3) {
        const [x, z] = deformTorso(base[i], base[i + 1], base[i + 2], scale);
        positions.setXYZ(i / 3, x, base[i + 1], z);
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      placeHotspots();
    },
    setHighlight: (key) => {
      highlight = key;
    },
    onHover: (fn) => {
      onHover = fn;
    },
    pointerMove: (x, y) => {
      if (drag) {
        dragYaw += (x - drag.x) * DRAG_SPEED;
        drag.x = x;
        return;
      }
      const key = pick(x, y);
      canvas.style.cursor = key ? "pointer" : "grab";
      if (key !== hovered) {
        hovered = key;
        onHover(key);
      }
    },
    pointerLeave: () => {
      drag = null;
      if (hovered) {
        hovered = null;
        onHover(null);
      }
    },
    pointerDown: (x) => {
      drag = { x };
      canvas.style.cursor = "grabbing";
    },
    pointerUp: () => {
      drag = null;
      canvas.style.cursor = "grab";
    },
    dispose: () => {
      for (const h of hotspots) {
        h.coreMaterial.dispose();
        h.haloMaterial.dispose();
      }
      for (const item of disposables) item.dispose();
      renderer.dispose();
    },
  };
}
