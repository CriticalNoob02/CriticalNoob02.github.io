export type Lang = "pt" | "en";

/** Text in both languages. The parity test walks every field of this shape. */
export type T = Record<Lang, string>;

export type Shot = { src: string; alt: T; pixel?: boolean };

export type Stat = { value: string; label: T };

export type Link = { label: T; href: string };

/** Each project paints its section with its own colours and type (see styles.css). */
export type ThemeId =
  | "radar"
  | "brio"
  | "forja"
  | "prosaude"
  | "idle"
  | "arena"
  | "mesa"
  | "royale";

export type Logo = {
  /** Symbol or full logo image; omitted when the mark is drawn in CSS (Forja). */
  src?: string;
  /** True when the image already contains the name, so the wordmark is hidden. */
  full?: boolean;
  pixel?: boolean;
  /** Small line under the name, as the brand itself writes it. */
  sub?: string;
};

export type Layout = "wide" | "split" | "split-reverse";

/** One project: one full section of the page, in the project's own identity. */
export type Project = {
  id: ThemeId;
  group: "work" | "games";
  name: string;
  logo: Logo;
  layout: Layout;
  /** Who it was for, in one short line. */
  role: T;
  /** Section headline, at most about ten words. */
  headline: T;
  summary: T;
  feats: T[];
  stack: string[];
  stats: Stat[];
  shots: Shot[];
  /** Optional phone screenshot laid over the shots. */
  phone?: Shot;
  links: Link[];
};

/** A small tool or side project. */
export type Quest = {
  id: string;
  name: string;
  summary: T;
  stack: string[];
  shot?: Shot;
  href?: string;
};
