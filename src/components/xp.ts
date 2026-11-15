import { projects } from "../content/projects";

export const BASE_LEVEL = 9;

/** XP bar fill (0..1): starts a quarter full and fills as projects are seen. */
export function xpFill(seen: number): number {
  return Math.min(1, 0.25 + (0.75 * seen) / projects.length);
}

export function level(seen: number): number {
  return seen >= projects.length ? BASE_LEVEL + 1 : BASE_LEVEL;
}
