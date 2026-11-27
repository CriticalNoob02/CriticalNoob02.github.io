/**
 * Sprite sheets of the page soldier, drawn and animated in PixelLab (side view,
 * character b510e18d…). Frames sit on 96 px cells with the feet on the FEET line,
 * one row each, facing east; west is the same sheet mirrored in CSS.
 */
export const CELL = 96;
export const FEET = 90;

export type Sheet = { src: string; frames: number; fps: number; ms: number };

export const IDLE: Sheet = { src: "/media/quest/idle.png", frames: 4, fps: 5, ms: 800 };
export const WALK: Sheet = { src: "/media/quest/walk.png", frames: 8, fps: 10, ms: 800 };
export const JUMP: Sheet = { src: "/media/quest/jump.png", frames: 9, fps: 10, ms: 900 };
/** Plays once per strike; its length matches the engine's ATTACK time. */
export const ATTACK: Sheet = { src: "/media/quest/attack.png", frames: 7, fps: 20, ms: 360 };
