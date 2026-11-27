import { describe, expect, it } from "vitest";
import { type Body, type Events, jump, makeWorld, newBody, type Platform, step } from "./engine";

const ledge = (key: string, l: number, r: number, y: number, enemy?: string): Platform => ({
  key,
  l,
  r,
  y,
  b: y + 30,
  enemy,
});

function run(
  b: Body,
  platforms: Platform[],
  seconds: number,
  scrollY = 0,
  defeated = new Set<string>(),
) {
  const w = makeWorld(platforms, { defeated, scrollY, vh: 1000, docW: 1600, scale: 1 });
  const events: Events[] = [];
  for (let t = 0; t < seconds; t += 1 / 60) {
    const ev = step(b, w, 1 / 60, () => 0.5);
    events.push(ev);
    if (ev.stomped) defeated.add(ev.stomped);
    if (ev.slashed) defeated.add(ev.slashed);
  }
  return { events, defeated };
}

describe("page soldier", () => {
  it("falls and lands on the top edge of a card", () => {
    const b = newBody(500, 300);
    run(b, [ledge("card", 300, 900, 600)], 1.5);
    expect(b.ground).toBe("card");
    expect(b.y).toBe(600);
  });

  it("stomps a chip he falls on and keeps the count", () => {
    const b = newBody(500, 300);
    const { defeated } = run(b, [ledge("chip", 470, 530, 600, "chip-a")], 1.5);
    expect([...defeated]).toEqual(["chip-a"]);
  });

  it("walks along a row of chips, across the gaps, defeating each one", () => {
    const b = newBody(410, 500);
    const row = [0, 1, 2, 3].map((i) =>
      ledge(`c${i}`, 400 + i * 90, 480 + i * 90, 600, `chip-${i}`),
    );
    const { defeated } = run(b, row, 8);
    expect(defeated.size).toBe(4);
    expect(b.ground).not.toBeNull();
  });

  it("walks off the edge to reach a chip below and to the side", () => {
    const b = newBody(500, 400);
    const { defeated } = run(
      b,
      [ledge("card", 300, 700, 400), ledge("chip", 900, 960, 650, "chip-x")],
      5,
    );
    expect(defeated.has("chip-x")).toBe(true);
  });

  it("climbs back up by jumping when the page scrolls up past him", () => {
    const b = newBody(500, 950);
    const ledges = [
      ledge("low", 300, 700, 950),
      ledge("mid", 450, 800, 830),
      ledge("high", 400, 900, 700),
    ];
    run(b, ledges, 4, 0);
    expect(b.y).toBeLessThanOrEqual(830);
  });

  it("drops back in from the top when he ends up off screen", () => {
    const b = newBody(500, 100);
    const { events } = run(b, [ledge("far", 0, 1600, 5600)], 0.1, 5000);
    expect(events[0].respawned).toBe(true);
  });

  it("jumps when asked, only from the ground", () => {
    const b = newBody(500, 600);
    expect(jump(b)).toBe(false);
    run(b, [ledge("card", 300, 900, 600)], 0.5);
    expect(jump(b)).toBe(true);
    expect(b.vy).toBeLessThan(0);
  });
});
