/**
 * Sprite sheets of the scroll quest, all drawn and animated in PixelLab
 * (soldier: character 48d96496…, chest: object c2a76363…). Cells are 64 px.
 * Walk and idle have one row per facing, in the order of DIRS in path.ts.
 */
export const CELL = 64;

export type Sheet = { src: string; frames: number; rows: number; fps: number; ms: number };

export const WALK: Sheet = { src: "/media/quest/walk.png", frames: 8, rows: 8, fps: 10, ms: 800 };
export const IDLE: Sheet = { src: "/media/quest/idle.png", frames: 4, rows: 8, fps: 5, ms: 800 };
export const JUMP: Sheet = { src: "/media/quest/jump.png", frames: 7, rows: 1, fps: 10, ms: 700 };
/** The chest opening plays once in CSS (`steps(8)` in styles.css matches these 9 frames). */
export const CHEST: Sheet = { src: "/media/quest/chest.png", frames: 9, rows: 1, fps: 12, ms: 750 };
