import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { projects } from "../content/projects";
import type { T } from "../content/types";
import { useStore, useT } from "../store";
import { BASE_LEVEL } from "./xp";

const ui = {
  gained: { pt: "+XP", en: "+XP" },
  levelUp: { pt: "Subiu de nível!", en: "Level up!" },
  allSeen: {
    pt: `Nível ${BASE_LEVEL + 1}: você viu todos os projetos.`,
    en: `Level ${BASE_LEVEL + 1}: you have seen every project.`,
  },
} satisfies Record<string, T>;

type Toast = { key: number; text: string; big: boolean };

/** Small pixel notice each time a project section comes into view for the first time. */
export function XpToast() {
  const t = useT();
  const seen = useStore((s) => s.seen);
  const [toast, setToast] = useState<Toast | null>(null);
  const shown = useRef(0);

  useEffect(() => {
    if (seen.length <= shown.current) return;
    shown.current = seen.length;
    const last = projects.find((p) => p.id === seen[seen.length - 1]);
    const done = seen.length === projects.length;
    setToast({
      key: seen.length,
      text: done ? `${t(ui.levelUp)} ${t(ui.allSeen)}` : `${t(ui.gained)} ${last?.name ?? ""}`,
      big: done,
    });
    const timer = setTimeout(() => setToast(null), done ? 4200 : 2200);
    return () => clearTimeout(timer);
  }, [seen, t]);

  return (
    <div className="xp-toast-host" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.p
            key={toast.key}
            className={toast.big ? "xp-toast is-big" : "xp-toast"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            {toast.text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
