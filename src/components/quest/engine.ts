/**
 * Platformer rules of the page soldier, with no DOM: the page's cards, headlines and
 * text lines are one-way platforms (their top edge), and the stack chips are enemies.
 * The soldier plays himself: he follows the scroll, drops from card to card, climbs
 * back up by jumping, and stomps or slashes every chip he can reach on screen.
 * All positions are document pixels; y is the soldier's feet.
 */

export type Platform = {
  /** Stable id of this ledge (element + line). */
  key: string;
  l: number;
  r: number;
  /** Top edge: what he stands on. */
  y: number;
  /** Bottom edge, used to slash an enemy that is at body height. */
  b: number;
  /** Set when the ledge is an enemy chip. */
  enemy?: string;
};

export type World = {
  platforms: Platform[];
  byKey: Map<string, Platform>;
  defeated: Set<string>;
  scrollY: number;
  vh: number;
  docW: number;
  /** Sprite scale: 1 on small screens, 2 on large ones. */
  scale: number;
};

export type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: 1 | -1;
  ground: string | null;
  /** Ledge he is dropping through, ignored until he is below it. */
  dropKey: string | null;
  /** Where he steers while in the air. */
  airGoal: number | null;
  attackT: number;
  attackTarget: string | null;
  patrolT: number;
  patrolX: number | null;
  /** Running to catch up with the scroll. */
  run: boolean;
};

export type Events = {
  landed?: { key: string; speed: number };
  stomped?: string;
  slashed?: string;
  attacked?: boolean;
  jumped?: boolean;
  respawned?: boolean;
};

export const G = 2200;
export const MAX_FALL = 1500;
export const WALK = 170;
export const RUN = 340;
export const AIR_ACCEL = 1100;
export const JUMP_V = 820;
export const JUMP_H = (JUMP_V * JUMP_V) / (2 * G);
export const ATTACK = 0.36;
/** Gap between two ledges at the same height that he steps across instead of falling. */
const STEP_GAP = 14;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const mid = (p: Platform) => (p.l + p.r) / 2;

export function newBody(x: number, y: number): Body {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    facing: 1,
    ground: null,
    dropKey: null,
    airGoal: null,
    attackT: 0,
    attackTarget: null,
    patrolT: 1.5,
    patrolX: null,
    run: false,
  };
}

export function makeWorld(platforms: Platform[], view: Omit<World, "platforms" | "byKey">): World {
  return { platforms, byKey: new Map(platforms.map((p) => [p.key, p])), ...view };
}

function alive(w: World, p: Platform | undefined): p is Platform & { enemy: string } {
  return !!p?.enemy && !w.defeated.has(p.enemy);
}

/** What he wants to do this frame while standing on `g`. */
type Intent =
  | { kind: "walk"; dir: -1 | 0 | 1; airGoal: number | null }
  | { kind: "jump"; to: number }
  | { kind: "drop"; to: number }
  | { kind: "attack"; target: string; dir: -1 | 1 };

function walkTo(b: Body, x: number, airGoal: number | null = null): Intent {
  const dx = x - b.x;
  return { kind: "walk", dir: Math.abs(dx) < 4 ? 0 : dx > 0 ? 1 : -1, airGoal };
}

/** Go to (gx, gy) from ledge g: walk, step off, drop through or jump. */
function goTo(b: Body, g: Platform, gx: number, gy: number): Intent {
  if (gy > g.y + 4) {
    // Below: get off this ledge right above the goal.
    if (gx >= g.l && gx <= g.r) {
      return Math.abs(gx - b.x) < 10 ? { kind: "drop", to: gx } : walkTo(b, gx);
    }
    // Too far to the side to reach by just stepping off: run to the edge and leap.
    const edge = gx > g.r ? g.r : g.l;
    const fallT = Math.sqrt((2 * (gy - g.y)) / G);
    if (Math.abs(gx - edge) > fallT * WALK * 1.1) {
      const inside = edge === g.r ? edge - 8 : edge + 8;
      return Math.abs(b.x - inside) < 12 ? { kind: "jump", to: gx } : walkTo(b, inside);
    }
    return walkTo(b, gx, gx);
  }
  if (gy < g.y - 4) {
    // Above: jump when close enough, else walk under it, never off our own ledge.
    if (Math.abs(gx - b.x) <= 150) return { kind: "jump", to: gx };
    return walkTo(b, clamp(gx, g.l + 6, g.r - 6));
  }
  return walkTo(b, gx, gx);
}

function decide(b: Body, w: World, g: Platform, rnd: () => number): Intent {
  const top = w.scrollY;
  const bandTop = top + w.vh * 0.22;
  const bandBot = top + w.vh * 0.82;
  const bodyH = 56 * w.scale;
  b.run = b.y < bandTop;

  // Standing on a live chip: stab it.
  if (alive(w, g)) return { kind: "attack", target: g.enemy, dir: b.facing };

  // A live chip right ahead at body height: slash it.
  for (const p of w.platforms) {
    if (!alive(w, p)) continue;
    if (p.y >= b.y - 2 || p.b <= b.y - bodyH) continue;
    const reach = (p.r - p.l) / 2 + 20 * w.scale;
    if (Math.abs(mid(p) - b.x) < reach) {
      return { kind: "attack", target: p.enemy, dir: mid(p) >= b.x ? 1 : -1 };
    }
  }

  // Fell behind the scroll (page went up): climb by jumping to a ledge above.
  if (b.y > bandBot) {
    let best: Platform | undefined;
    for (const p of w.platforms) {
      if (p.key === g.key || p.y > b.y - 24 || p.y < b.y - JUMP_H * 0.9) continue;
      const dist = b.x < p.l ? p.l - b.x : b.x > p.r ? b.x - p.r : 0;
      if (dist > 180) continue;
      if (!best || p.y < best.y) best = p;
    }
    if (best) return goTo(b, g, clamp(b.x, best.l + 12, best.r - 12), best.y);
  }

  // The nearest live chip on screen that he can reach.
  let target: Platform | undefined;
  let cost = Number.POSITIVE_INFINITY;
  for (const p of w.platforms) {
    if (!alive(w, p)) continue;
    if (p.y < top + w.vh * 0.12 || p.y > top + w.vh * 0.95) continue;
    if (p.y < b.y - JUMP_H * 0.85) continue;
    const c = Math.abs(mid(p) - b.x) + Math.abs(p.y - b.y) * 0.6;
    if (c < cost) {
      cost = c;
      target = p;
    }
  }
  if (target) return goTo(b, g, mid(target), target.y);

  // Ahead of the scroll (page went down): walk off the nearer edge, or drop through.
  if (b.y < bandTop) {
    const toL = b.x - g.l;
    const toR = g.r - b.x;
    if (Math.min(toL, toR) > 120) return { kind: "drop", to: b.x };
    return toL < toR ? walkTo(b, g.l - 30, g.l - 30) : walkTo(b, g.r + 30, g.r + 30);
  }

  // Nothing to do: idle, with a short stroll now and then.
  if (b.patrolX !== null) {
    if (Math.abs(b.patrolX - b.x) < 4) b.patrolX = null;
    else return walkTo(b, b.patrolX);
  }
  if (b.patrolT <= 0) {
    b.patrolT = 2.5 + rnd() * 3;
    const span = 40 + rnd() * 90;
    b.patrolX = clamp(b.x + (rnd() < 0.5 ? -span : span), g.l + 14, g.r - 14);
  }
  return { kind: "walk", dir: 0, airGoal: null };
}

function physics(b: Body, w: World, dt: number, ev: Events) {
  const g = b.ground ? w.byKey.get(b.ground) : undefined;
  if (g) {
    b.x += b.vx * dt;
    if (b.x < g.l - 2 || b.x > g.r + 2) {
      const next = w.platforms.find(
        (p) =>
          p !== g && Math.abs(p.y - g.y) <= 6 && b.x >= p.l - STEP_GAP && b.x <= p.r + STEP_GAP,
      );
      if (next) {
        b.ground = next.key;
        b.y = next.y;
      } else {
        b.ground = null;
        b.vy = 0;
      }
    }
  } else {
    b.vy = Math.min(MAX_FALL, b.vy + G * dt);
    if (b.airGoal !== null) {
      const top = b.run ? RUN : WALK * 1.4;
      const want = clamp((b.airGoal - b.x) * 4, -top, top);
      b.vx += clamp(want - b.vx, -AIR_ACCEL * dt, AIR_ACCEL * dt);
    }
    b.x += b.vx * dt;
    const ny = b.y + b.vy * dt;
    if (b.vy > 0) {
      let land: Platform | undefined;
      for (const p of w.platforms) {
        if (p.key === b.dropKey) continue;
        if (b.x < p.l - 3 || b.x > p.r + 3) continue;
        if (p.y >= b.y - 1 && p.y <= ny && (!land || p.y < land.y)) land = p;
      }
      if (land) {
        if (alive(w, land) && b.vy > 150) {
          ev.stomped = land.enemy;
          b.y = land.y;
          b.vy = -520;
          return;
        }
        ev.landed = { key: land.key, speed: b.vy };
        b.ground = land.key;
        b.y = land.y;
        b.vy = 0;
        b.vx = 0;
        b.dropKey = null;
        b.airGoal = null;
        return;
      }
    }
    b.y = ny;
    const dropped = b.dropKey ? w.byKey.get(b.dropKey) : undefined;
    if (b.dropKey && (!dropped || b.y > dropped.y + 8)) b.dropKey = null;
  }
  b.x = clamp(b.x, 10, w.docW - 10);
}

/** Advance the soldier by dt seconds. Mutates `b`; returns what happened. */
export function step(b: Body, w: World, dt: number, rnd: () => number = Math.random): Events {
  const ev: Events = {};
  const top = w.scrollY;

  // Off screen (a long fling or a jump to an anchor): he drops back in from the top.
  if (b.y < top - 60 || b.y > top + w.vh + 140) {
    b.x = clamp(b.x, 40, w.docW - 40);
    b.y = top - 10;
    b.vx = 0;
    b.vy = 0;
    b.ground = null;
    b.dropKey = null;
    b.airGoal = null;
    b.attackT = 0;
    b.attackTarget = null;
    ev.respawned = true;
  }

  let g = b.ground ? w.byKey.get(b.ground) : undefined;
  if (b.ground && (!g || Math.abs(g.y - b.y) > 40)) {
    b.ground = null;
    g = undefined;
  }
  if (g) b.y = g.y; // follow layout shifts (late images)
  b.patrolT -= dt;

  if (b.attackT > 0) {
    b.attackT -= dt;
    b.vx = 0;
    if (b.attackT <= 0 && b.attackTarget) {
      ev.slashed = b.attackTarget;
      b.attackTarget = null;
    }
    physics(b, w, dt, ev);
    return ev;
  }

  if (g) {
    const intent = decide(b, w, g, rnd);
    if (intent.kind === "attack") {
      b.attackT = ATTACK;
      b.attackTarget = intent.target;
      b.facing = intent.dir;
      b.vx = 0;
      ev.attacked = true;
    } else if (intent.kind === "jump") {
      const dx = intent.to - b.x;
      b.ground = null;
      b.vy = -JUMP_V;
      b.vx = clamp(dx / 0.5, -WALK * 1.4, WALK * 1.4);
      b.airGoal = intent.to;
      if (dx !== 0) b.facing = dx > 0 ? 1 : -1;
      ev.jumped = true;
    } else if (intent.kind === "drop") {
      b.dropKey = g.key;
      b.ground = null;
      b.vy = 60;
      b.vx = 0;
      b.airGoal = intent.to;
    } else {
      b.vx = intent.dir * (b.run ? RUN : WALK);
      b.airGoal = intent.airGoal;
      if (intent.dir !== 0) b.facing = intent.dir;
    }
  }
  physics(b, w, dt, ev);
  return ev;
}

/** A jump on request (the visitor clicked him). */
export function jump(b: Body): boolean {
  if (!b.ground || b.attackT > 0) return false;
  b.ground = null;
  b.vy = -JUMP_V;
  b.airGoal = b.x;
  b.patrolT = 2;
  return true;
}
