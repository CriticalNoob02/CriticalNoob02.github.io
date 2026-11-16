import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ui } from "../i18n/strings";
import { character } from "./character";
import { projects, quests } from "./projects";

const PUBLIC = join(__dirname, "..", "..", "public");
const content = { projects, quests, character, ui };

/** Walks any value and returns the path of every {pt, en} pair that is incomplete. */
function missingTranslations(value: unknown, path = "$"): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => missingTranslations(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if ("pt" in obj || "en" in obj) {
      const ok =
        typeof obj.pt === "string" && obj.pt.trim() && typeof obj.en === "string" && obj.en.trim();
      return ok ? [] : [path];
    }
    return Object.entries(obj).flatMap(([k, v]) => missingTranslations(v, `${path}.${k}`));
  }
  return [];
}

function allStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(allStrings);
  return [];
}

describe("content", () => {
  it("has every text in Portuguese and English", () => {
    expect(missingTranslations(content)).toEqual([]);
  });

  it("only references media that exists", () => {
    const files = [
      character.portrait,
      ...projects.flatMap((p) => [
        ...p.shots.map((s) => s.src),
        ...(p.slides ?? []).map((s) => s.src),
        ...(p.logo.src ? [p.logo.src] : []),
      ]),
      ...quests.flatMap((q) => (q.shot ? [q.shot.src] : [])),
    ];
    for (const f of files) expect(existsSync(join(PUBLIC, f)), f).toBe(true);
  });

  it("links only to https pages", () => {
    const hrefs = [
      ...projects.flatMap((p) => p.links.map((l) => l.href)),
      ...quests.flatMap((q) => (q.href ? [q.href] : [])),
    ];
    for (const h of hrefs) expect(h).toMatch(/^https:\/\//);
  });

  it("uses no long dashes in visible copy", () => {
    const bad = allStrings(content).filter((s) => /[–—]/.test(s));
    expect(bad).toEqual([]);
  });
});
