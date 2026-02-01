import type { User } from "./auth";

export type TrackedWebsite = {
    id: number,
    owner: User;
    url: string;
    created_at: Date;
};

export type TrackedWebsiteSortKey = "created_at" | "url";

export function formatNiceDate(
  input: Date | string | null | undefined,
  locale: string = "en-GB"
): string {
  if (input == null) return "—";

  const d = input instanceof Date ? input : new Date(input);

  // Invalid Date -> getTime() is NaN
  if (Number.isNaN(d.getTime())) return "—";

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}