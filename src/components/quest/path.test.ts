import { describe, expect, it } from "vitest";
import { facing, laneFor, laneX, reached, trailX } from "./path";

const points = [
  { id: "a", x: 900, y: 1000 },
  { id: "b", x: 100, y: 2000 },
  { id: "c", x: 900, y: 3000 },
];

describe("scroll quest path", () => {
  it("keeps the soldier on the first chest's lane before the trail starts", () => {
    expect(trailX(points, 0)).toBe(900);
  });

  it("walks straight down near a chest and crosses in the middle", () => {
    expect(trailX(points, 1100)).toBe(900);
    expect(trailX(points, 1500)).toBe(500);
    expect(trailX(points, 1900)).toBe(100);
  });

  it("stays on the last lane after the last chest", () => {
    expect(trailX(points, 9000)).toBe(900);
  });

  it("faces the way he moves", () => {
    expect(facing(0, 10)).toBe("south");
    expect(facing(0, -10)).toBe("north");
    expect(facing(10, 0)).toBe("east");
    expect(facing(-10, 0)).toBe("west");
    expect(facing(7, 7)).toBe("south-east");
    expect(facing(-7, -7)).toBe("north-west");
  });

  it("opens every chest at or above his feet", () => {
    expect(reached(points, 999)).toEqual([]);
    expect(reached(points, 2000)).toEqual(["a", "b"]);
  });

  it("uses the side gutters on wide screens and the edges on narrow ones", () => {
    expect(laneX("left", 1640, 1240, 96)).toBe(100);
    expect(laneX("right", 1640, 1240, 96)).toBe(1540);
    expect(laneX("left", 1280, 1240, 96)).toBe(52);
  });

  it("alternates lanes on desktop and keeps one lane on phones", () => {
    expect([0, 1, 2].map((i) => laneFor(i, 1440))).toEqual(["right", "left", "right"]);
    expect([0, 1].map((i) => laneFor(i, 390))).toEqual(["right", "right"]);
  });
});
