import type { User } from "./auth";

export type TrackedWebsite = {
    id: number,
    owner: User;
    url: string;
    created_at: Date;
};