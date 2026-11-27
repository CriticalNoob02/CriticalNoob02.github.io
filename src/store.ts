import { useCallback } from "react";
import { create } from "zustand";
import type { Lang, T, ThemeId } from "./content/types";

const LANG_KEY = "portfolio.lang";
const QUEST_KEY = "portfolio.quest";

/** Hidden when the visitor said so, or by default when they ask for reduced motion. */
function initialQuestOff(): boolean {
  try {
    const saved = localStorage.getItem(QUEST_KEY);
    if (saved) return saved === "off";
  } catch {
    // storage blocked: decide from the motion preference
  }
  return (
    typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches
  );
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
  /** Stack chips the page soldier has beaten. */
  defeated: string[];
  defeat: (id: string) => void;
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
  defeated: [],
  defeat: (id) => set((s) => (s.defeated.includes(id) ? s : { defeated: [...s.defeated, id] })),
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
