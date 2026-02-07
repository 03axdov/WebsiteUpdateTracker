import type { User } from "./auth";

export type TrackedWebsite = {
  id: number,
  owner?: User;
  url: string;
  title: string;
  description: string;
  notify_email?: boolean;
  created_at: Date | string;
  last_scraped: Date | string | null;
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
