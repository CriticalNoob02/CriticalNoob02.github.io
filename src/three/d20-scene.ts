import {
  AmbientLight,
  CanvasTexture,
  DirectionalLight,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import type { StageScene } from "./stage";

/** A d20 that tumbles and lands with the rolled face towards the viewer. */
export type D20Scene = StageScene & {
  /** Starts a roll that ends on `value` (1..20); `done` fires when it lands. */
  roll: (value: number, done: () => void) => void;
};

const ROLL_SECONDS = 1.5;

function numberTexture(n: number, ink: string): CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = ink;
    ctx.font = `600 ${n >= 10 ? 58 : 68}px "Fraunces Variable", Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(n), size / 2, size / 2 + 4);
    // 6 and 9 get a mark so they read the right way up, as on real dice.
    if (n === 6 || n === 9) ctx.fillRect(size / 2 - 14, size / 2 + 34, 28, 5);
  }
  const texture = new CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

const easeOut = (t: number) => 1 - (1 - t) ** 3;

export function createD20Scene(canvas: HTMLCanvasElement, still: boolean): D20Scene {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 5.2);

  scene.add(new AmbientLight(0xffffff, 1.1));
  const key = new DirectionalLight(0xfff1d6, 2.2);
  key.position.set(2.5, 3, 4);
  scene.add(key);
  const rim = new DirectionalLight(0xffd9a0, 0.5);
  rim.position.set(-3, -2, -2);
  scene.add(rim);

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  const die = new Group();
  scene.add(die);

  const geometry = track(new IcosahedronGeometry(1, 0));
  const body = new Mesh(
    geometry,
    track(
      new MeshStandardMaterial({
        color: 0xd9a45b,
        roughness: 0.45,
        metalness: 0.15,
        flatShading: true,
      }),
    ),
  );
  die.add(body);
  die.add(
    new LineSegments(
      track(new EdgesGeometry(geometry)),
      track(new LineBasicMaterial({ color: 0x5a3d16, transparent: true, opacity: 0.6 })),
    ),
  );

  // One number per face, on a small plane lying on the face.
  const pos = geometry.getAttribute("position");
  const normals: Vector3[] = [];
  const plane = track(new PlaneGeometry(0.46, 0.46));
  for (let f = 0; f < pos.count / 3; f++) {
    const a = new Vector3().fromBufferAttribute(pos, f * 3);
    const b = new Vector3().fromBufferAttribute(pos, f * 3 + 1);
    const c = new Vector3().fromBufferAttribute(pos, f * 3 + 2);
    const center = a.clone().add(b).add(c).divideScalar(3);
    const normal = center.clone().normalize();
    normals.push(normal);
    const label = new Mesh(
      plane,
      track(
        new MeshBasicMaterial({
          map: track(numberTexture(f + 1, "#1c1407")),
          transparent: true,
          depthWrite: false,
        }),
      ),
    );
    label.position.copy(center.clone().add(normal.clone().multiplyScalar(0.002)));
    label.lookAt(center.clone().add(normal));
    // Point each number's top towards the face's first corner, so they do not all lean the same way.
    const up = a.clone().sub(center).normalize();
    label.up.copy(up);
    label.lookAt(center.clone().add(normal));
    die.add(label);
  }

  const toViewer = new Vector3(0, 0, 1);
  let rollState: {
    start: number | null;
    from: Quaternion;
    to: Quaternion;
    axis: Vector3;
    spins: number;
    done: () => void;
  } | null = null;
  let lastTime = 0;
  const spin = new Quaternion();

  return {
    render: (time) => {
      const delta = Math.min(0.1, Math.max(0, time - lastTime));
      lastTime = time;
      if (rollState) {
        if (rollState.start === null) rollState.start = time;
        const t = Math.min(1, (time - rollState.start) / (still ? 0.001 : ROLL_SECONDS));
        const e = easeOut(t);
        die.quaternion.slerpQuaternions(rollState.from, rollState.to, e);
        spin.setFromAxisAngle(rollState.axis, (1 - e) * rollState.spins);
        die.quaternion.premultiply(spin);
        die.position.y = still ? 0 : Math.abs(Math.sin(e * Math.PI * 2.5)) * (1 - e) * 0.6;
        if (t >= 1) {
          const done = rollState.done;
          rollState = null;
          die.position.y = 0;
          done();
        }
      } else if (!still) {
        die.rotateOnWorldAxis(new Vector3(0, 1, 0), delta * 0.25);
      }
      renderer.render(scene, camera);
    },
    resize: (width, height) => {
      if (width <= 0 || height <= 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    },
    roll: (value, done) => {
      const face = normals[Math.min(19, Math.max(0, value - 1))];
      // Rotation that turns the chosen face to the viewer, plus a random twist around the view.
      const to = new Quaternion().setFromUnitVectors(face, toViewer);
      const twist = new Quaternion().setFromAxisAngle(toViewer, (Math.random() - 0.5) * 0.8);
      to.premultiply(twist);
      rollState = {
        start: null,
        from: die.quaternion.clone(),
        to,
        axis: new Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5,
        ).normalize(),
        spins: Math.PI * (6 + Math.random() * 4),
        done,
      };
    },
    dispose: () => {
      for (const item of disposables) item.dispose();
      renderer.dispose();
    },
  };
}
