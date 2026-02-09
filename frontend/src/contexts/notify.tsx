// notifications/NotificationContext.tsx
import { createContext, useContext } from "react";

export type NotifyFn = (message: string, options?: {
  type?: "success" | "error" | "info";
  duration?: number;
}) => void;

export const NotificationContext = createContext<NotifyFn | null>(null);

export function useNotify() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotify must be used inside NotificationProvider");
  }
  return ctx;
}
