export async function fetchReceivedMessages(receiverId: number) {
    console.log("Fetching messages for receiver ID:", receiverId);
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`http://localhost:8088/api/sharing-messages/receiver/${receiverId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération des messages");
  return await res.json();
}

export async function updateMessageSeen(message) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`http://localhost:8088/api/sharing-messages/${message.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...message,
      seen: true
    })
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour du message");
  return await res.json();
}

export async function deleteMessage(messageId) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`http://localhost:8088/api/sharing-messages/${messageId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression du message");
  return true;
}

export async function getMedicalRecordIdFromDocument(documentId) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`http://localhost:8088/medical-records/document/${documentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération du document");
  const doc = await res.json();
  return doc.medicalRecord; // ou doc.medicalRecordId selon la structure réelle
}

export async function getPatientIdFromMedicalRecord(medicalRecordId) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`http://localhost:8088/medical-records/${medicalRecordId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération du dossier médical");
  const mr = await res.json();
  return mr.patientId;
}

export async function getPatientIdByDocumentId(documentId) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`http://localhost:8088/medical-records/${documentId}/patient-id`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération du patientId via documentId");
  const data = await res.json();
  return data.patientId || data.id || data; // selon la structure de la réponse
}