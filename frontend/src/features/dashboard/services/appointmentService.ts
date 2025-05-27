export async function fetchAppointments() {
  const response = await fetch("http://localhost:8088/medical-records/appointments"); // adapte l'URL si besoin
  if (!response.ok) throw new Error("Erreur lors de la récupération des rendez-vous");
  return response.json();
}

export async function fetchMedicalRecord(specificId: string) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`http://localhost:8088/medical-records/patient/${specificId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) throw new Error("Erreur lors de la récupération du dossier médical");
  return await response.json();
}

export async function getAppointments(specificId: string) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`http://localhost:8088/medical-records/appointmentBypatient/${specificId}`, {
    method: "GET",                     
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) throw new Error("Erreur lors de la récupération des rendez-vous du patient");
  return response.json();
}

/**
 * Retourne le rendez-vous le plus proche (après la date système) depuis une liste d'appointments.
 * @param appointments Liste des rendez-vous (type Appointment)
 */
export function getNextAppointment(
  appointments: Array<{
    id: number;
    date: string;
    title: string;
    status: string;
    type: string;
  }>
) {
  const now = new Date();
  // Filtrer les rendez-vous futurs
  const futureAppointments = appointments
    .filter(app => new Date(app.date) > now);
  // Trier par date croissante
  futureAppointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  // Retourner le plus proche ou null si aucun
  return futureAppointments.length > 0 ? futureAppointments[0] : null;
}