export async function fetchReceivedMessages(receiverId: number) {
    console.log("Fetching messages for receiver ID:", receiverId);
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`http://localhost:8088/api/sharing-messages/receiver/${receiverId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération des messages");
  return await res.json();
}