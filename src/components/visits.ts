import { useEffect, useState } from "react";

/**
 * Visit counter on Abacus (abacus.jasoncameron.dev), a free counter API with open CORS:
 * the site is static, so the count has to live somewhere else. Each browser session
 * counts once; reloads and dev runs only read the number.
 */
const API = "https://abacus.jasoncameron.dev";
const COUNTER = "criticalnoob02-portfolio/visits";
const SESSION_KEY = "portfolio.visited";

function counted(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markCounted() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // counted again next load; harmless
  }
}

let pending: Promise<number | null> | null = null;

function load(): Promise<number | null> {
  if (pending) return pending;
  const hit = !import.meta.env.DEV && !counted();
  pending = fetch(`${API}/${hit ? "hit" : "get"}/${COUNTER}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((data: { value?: number } | null) => {
      if (hit && data) markCounted();
      return typeof data?.value === "number" ? data.value : null;
    })
    .catch(() => null);
  return pending;
}

/** Total visits: undefined while loading, null when the counter is unreachable. */
export function useVisits(): number | null | undefined {
  const [value, setValue] = useState<number | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    load().then((v) => {
      if (alive) setValue(v);
    });
    return () => {
      alive = false;
    };
  }, []);
  return value;
}
