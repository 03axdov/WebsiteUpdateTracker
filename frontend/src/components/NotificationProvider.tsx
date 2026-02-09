// notifications/NotificationProvider.tsx
import React, { useCallback, useState } from "react";
import { NotificationContext, type NotifyFn } from "../contexts/notify";

type NotificationType = "success" | "error" | "info";

type Notification = {
  id: number;
  message: string;
  type: NotificationType;
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify: NotifyFn = useCallback((message, options) => {
    const id = Date.now();

    const type: NotificationType = options?.type ?? "info";
    const duration = options?.duration ?? 3000;

    setNotifications(prev => [...prev, { id, message, type }]);

    window.setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  return (
    <NotificationContext.Provider value={notify}>
      {children}

      <div className="notifications">
        {notifications.map(n => (
          <div key={n.id} className={`notification ${n.type}`}>
            {n.type == "success" && <img src="images/success.png" />}
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
