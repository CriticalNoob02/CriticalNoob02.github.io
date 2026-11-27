/**
 * Pure geometry of the scroll quest: where the soldier stands for a given scroll
 * position, which way he faces and which chests he has reached. No DOM here.
 */

/** Sheet rows, in the order the angle math below produces them (0° = east, clockwise). */
export const DIRS = [
  "east",
  "south-east",
  "south",
  "south-west",
  "west",
  "north-west",
  "north",
  "north-east",
] as const;

export type Dir = (typeof DIRS)[number];

/** A chest on the trail, in document pixels (x is the centre). */
export type Waypoint = { id: string; x: number; y: number };

export type Lane = "left" | "right";

/** Below this width there is no room for two lanes, so the trail keeps to the right edge. */
export const ONE_LANE_BELOW = 760;

/** Horizontal centre of a lane for a page of `width` px whose content is at most `wrap` px. */
export function laneX(lane: Lane, width: number, wrap: number, sprite: number): number {
  const gutter = Math.max(0, (width - Math.min(width, wrap)) / 2);
  const side = gutter >= sprite * 0.9 ? gutter / 2 : sprite / 2 + 4;
  return lane === "left" ? side : width - side;
}

/** Lanes alternate so the soldier crosses the page between chests; one lane on phones. */
export function laneFor(index: number, width: number): Lane {
  if (width < ONE_LANE_BELOW) return "right";
  return index % 2 === 0 ? "right" : "left";
}

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smooth = (t: number) => t * t * (3 - 2 * t);

/**
 * Trail x for a document y: straight down near each chest, a diagonal walk in the
 * middle stretch between two chests on different lanes.
 */
export function trailX(points: Waypoint[], y: number): number {
  if (points.length === 0) return 0;
  if (y <= points[0].y) return points[0].x;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (y <= b.y) {
      const t = clamp01(((y - a.y) / Math.max(1, b.y - a.y) - 0.25) / 0.5);
      return a.x + (b.x - a.x) * smooth(t);
    }
  }
  return points[points.length - 1].x;
}

/** One of 8 facings for a step of (dx, dy); screen y grows downward. */
export function facing(dx: number, dy: number): Dir {
  const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
  const k = Math.round((deg + 360) / 45) % 8;
  return DIRS[k];
}

/** Ids of the chests at or above document y `y` (the soldier's feet). */
export function reached(points: Waypoint[], y: number): string[] {
  return points.filter((p) => p.y <= y).map((p) => p.id);
}
