#!/usr/bin/env node
/**
 * Fails when any forbidden term shows up in what gets published.
 *
 * The term list lives OUTSIDE this public repo (default
 * ~/.config/portfolio-denylist.txt, override with DENYLIST=path), because
 * the list itself names things that must not leak. One term per line,
 * case-insensitive, "#" starts a comment.
 *
 * Text files are searched as UTF-8. Images are searched too, as latin1, to
 * catch strings left in metadata chunks.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { extname, join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const listPath = process.env.DENYLIST ?? join(homedir(), ".config", "portfolio-denylist.txt");

if (!existsSync(listPath)) {
  console.error(`leak-check: term list not found at ${listPath}`);
  console.error("Create it (one term per line) or point DENYLIST to it.");
  process.exit(2);
}

const terms = readFileSync(listPath, "utf8")
  .split("\n")
  .map((l) => l.replace(/#.*/, "").trim())
  .filter(Boolean)
  .map((t) => t.toLowerCase());

// Whole-word match, so a short term does not fire inside a longer word.
const escapeRe = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const patterns = terms.map(
  (t) => new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(t)}(?![\\p{L}\\p{N}])`, "u"),
);

const targets = ["src", "public", "dist", "index.html", "README.md", "scripts", ".github"];
const skipDirs = new Set(["node_modules", ".git"]);
const binary = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".webm",
  ".mp4",
  ".woff2",
  ".ico",
]);

function* walk(path) {
  if (!existsSync(path)) return;
  const st = statSync(path);
  if (st.isFile()) {
    yield path;
    return;
  }
  for (const name of readdirSync(path)) {
    if (skipDirs.has(name)) continue;
    yield* walk(join(path, name));
  }
}

let hits = 0;
for (const target of targets) {
  for (const file of walk(join(root, target))) {
    if (file.endsWith("leak-check.mjs")) continue;
    const isBinary = binary.has(extname(file).toLowerCase());
    const text = readFileSync(file, isBinary ? "latin1" : "utf8").toLowerCase();
    terms.forEach((term, i) => {
      // Short terms match random bytes in images; only long ones are searched there.
      if (isBinary && term.length < 6) return;
      if (patterns[i].test(text)) {
        hits++;
        // Print the file only, never the term, so CI logs do not leak it either.
        console.error(`leak-check: forbidden term #${i + 1} in ${relative(root, file)}`);
      }
    });
  }
}

if (hits > 0) {
  console.error(`leak-check: ${hits} hit(s). Nothing should be published until they are gone.`);
  process.exit(1);
}
console.log(`leak-check: clean (${terms.length} terms).`);
