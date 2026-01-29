import { ref } from "vue";

// Simple notification composable
// In production, you might want to use a library like vue-toastification
export interface Notification {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

const notifications = ref<Notification[]>([]);
let notificationId = 0;

export function useNotification() {
  const show = (message: string, type: Notification["type"] = "info") => {
    const id = ++notificationId;
    notifications.value.push({ id, message, type });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      remove(id);
    }, 5000);
  };

  const remove = (id: number) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  const success = (message: string) => show(message, "success");
  const error = (message: string) => show(message, "error");
  const info = (message: string) => show(message, "info");
  const warning = (message: string) => show(message, "warning");

  return {
    notifications,
    show,
    remove,
    success,
    error,
    info,
    warning,
  };
}
