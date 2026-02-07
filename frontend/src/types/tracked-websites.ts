import type { User } from "./auth";

export type TrackedWebsite = {
  id: number,
  owner: User;
  url: string;
  title: string;
  description: string;
  created_at: Date;
  last_scraped: Date
};

export type TrackedWebsiteCreateInput = {
  url: string;
  title?: string;
  description?: string;
  notify_email?: boolean;
};

export type TrackedWebsiteSortKey = "created_at" | "url" | "title";

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