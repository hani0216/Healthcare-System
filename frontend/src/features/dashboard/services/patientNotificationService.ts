export async function fetchPatientNotifications(specificId: string) {
  const token = localStorage.getItem("accessToken");
  const url = `http://localhost:8088/medical-records/appointmentBypatient/${specificId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des notifications du patient");
  }
  return response.json();
}

export async function fetchNotificationsByReceiverId(receiverId: string) {
  const token = localStorage.getItem("accessToken");
  const url = `http://localhost:8088/api/notifications/notifications/receiver/${receiverId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des notifications par receiverId");
  }
  return response.json();
}

/**
 * Retourne les notifications dont le temps est arrivé ou passé, triées de la plus récente à la plus ancienne.
 * @param notifications Liste des notifications reçues du backend (doit contenir timeToSend).
 * @returns Liste triée prête à l'affichage.
 */
export function getDisplayableNotifications(notifications: any[]): any[] {
  const now = new Date();

  return notifications
    .filter(n => new Date(n.timeToSend) <= now)
    .sort((a, b) => new Date(b.timeToSend).getTime() - new Date(a.timeToSend).getTime());
}

export async function markNotificationAsSeen(notifId: string) {
  const token = localStorage.getItem("accessToken");
  const url = `http://localhost:8088/api/notifications/${notifId}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ seen: true })
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la mise à jour de la notification");
  }
  return response.json();
}

export async function deleteNotification(notifId: string) {
  const token = localStorage.getItem("accessToken");
  const url = `http://localhost:/8088/api/notifications/notifications/${notifId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de la notification");
  }
  return true;
}