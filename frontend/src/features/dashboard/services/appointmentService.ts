export async function fetchAppointments() {
  const response = await fetch("/api/appointments"); // adapte l'URL si besoin
  if (!response.ok) throw new Error("Erreur lors de la récupération des rendez-vous");
  return response.json();
}