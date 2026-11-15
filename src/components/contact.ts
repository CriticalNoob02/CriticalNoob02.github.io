import { character } from "../content/character";

/** One contact intent on the page: e-mail first, then LinkedIn, then GitHub. */
export function contactHref(): string {
  if (character.email) return `mailto:${character.email}`;
  if (character.linkedin) return character.linkedin;
  return character.github;
}
