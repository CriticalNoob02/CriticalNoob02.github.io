import { useCallback } from "react";
import { create } from "zustand";
import type { Lang, T, ThemeId } from "./content/types";

const LANG_KEY = "portfolio.lang";
const QUEST_KEY = "portfolio.quest";

function initialQuestOff(): boolean {
  try {
    return localStorage.getItem(QUEST_KEY) === "off";
  } catch {
    return false;
  }
}

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "pt" || saved === "en") return saved;
  } catch {
    // storage blocked: fall back to the browser language
  }
  if (typeof navigator !== "undefined" && !navigator.language.toLowerCase().startsWith("pt")) {
    return "en";
  }
  return "pt";
}

type State = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Projects the visitor has scrolled through, in order: the character sheet's XP. */
  seen: ThemeId[];
  see: (id: ThemeId) => void;
  /** Chests the soldier has opened on the scroll trail. */
  loot: string[];
  collect: (ids: string[]) => void;
  /** The visitor hid the soldier; remembered on this browser. */
  questOff: boolean;
  toggleQuest: () => void;
};

export const useStore = create<State>((set) => ({
  lang: initialLang(),
  setLang: (lang) => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // not persisted, still switches for this visit
    }
    set({ lang });
  },
  seen: [],
  see: (id) => set((s) => (s.seen.includes(id) ? s : { seen: [...s.seen, id] })),
  loot: [],
  collect: (ids) =>
    set((s) => {
      const fresh = ids.filter((id) => !s.loot.includes(id));
      return fresh.length ? { loot: [...s.loot, ...fresh] } : s;
    }),
  questOff: initialQuestOff(),
  toggleQuest: () =>
    set((s) => {
      const questOff = !s.questOff;
      try {
        localStorage.setItem(QUEST_KEY, questOff ? "off" : "on");
      } catch {
        // only for this visit
      }
      return { questOff };
    }),
}));

export function useT() {
  const lang = useStore((s) => s.lang);
  return useCallback((text: T) => text[lang], [lang]);
}
