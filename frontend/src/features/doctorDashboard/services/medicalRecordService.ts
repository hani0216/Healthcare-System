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

export async function fetchPatientDocuments(mrId: string) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`http://localhost:8088/medical-records/${mrId}/documents`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Erreur lors de la récupération des documents');
  return res.json();
}

export async function fetchPatientDocumentsByPatientId(patientId: string) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`http://localhost:8088/patients/${patientId}/documents`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Erreur lors de la récupération des documents du patient');
  return res.json();
}

export async function fetchDoctorName(authorId: number) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`http://localhost:8088/doctors/${authorId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Erreur lors de la récupération du nom du docteur');
  const data = await res.json();
  return data.doctorInfo?.name || 'Unknown';
}

export async function fetchDoctorInfo(authorId: number) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`http://localhost:8088/doctors/${authorId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Erreur lors de la récupération du docteur');
  const data = await res.json();
  return data.doctorInfo || 'Unknown';
}

export async function fetchInvoicesByMedicalRecordId(medicalRecordId: string) {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`http://localhost:8088/api/invoices/medical-record/${medicalRecordId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Erreur lors de la récupération des factures');
  return res.json();
}

export async function fetchReimbursementByInvoiceId(invoiceId: string) {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`http://localhost:8088/api/reimbursements/invoice/${invoiceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Erreur lors de la récupération du remboursement');
  return res.json();
}

export async function fetchMedicalRecordById(mrId: string) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`http://localhost:8082/medical-records/${mrId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) throw new Error("Error fetching medical record");
  return await response.json();
}

export async function fetchNoteIdFromMedicalRecord(mrId: string, token: string): Promise<number> {
  const res = await fetch(`http://localhost:8088/medical-records/${mrId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération du dossier médical");
  const data = await res.json();
  if (!data.note || typeof data.note.id !== "number") throw new Error("Note introuvable");
  return data.note.id;
}

export async function updateMainNote(noteId: number, specificId: string, title: string, description: string, token: string) {
  const res = await fetch(`http://localhost:8088/medical-records/${noteId}/updateNoteForMr/${specificId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, description })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Erreur lors de la mise à jour de la note");
  }
  
  return await res.json();
}

export async function deleteDocument(documentId: number, token: string) {
  const res = await fetch(`http://localhost:8088/medical-records/document/${documentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Erreur lors de la suppression du document");
  }
  return true;
}

/**
 * Crée une note pour un document spécifique
 * @param documentId ID du document
 * @param specificId ID spécifique (ex: patient, medicalRecord, etc.)
 * @param title Titre de la note
 * @param description Description de la note
 * @param token Bearer token
 */
export async function initializeNote(documentId: string, specificId: string, title: string, description: string, token: string) {
  const res = await fetch(`http://localhost:8088/medical-records/document/${documentId}/addNoteForDocument/${specificId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, description })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Erreur lors de la création de la note");
  }
  
  return await res.json();
}

/**
 * Met à jour une note existante d'un document
 * @param noteId ID de la note à mettre à jour
 * @param title Titre de la note
 * @param description Description de la note
 * @param token Bearer token
 */
export async function updateNote(noteId: string, title: string, description: string, token: string) {
  const res = await fetch(`http://localhost:8088/medical-records/noteDocument/${noteId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, description })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Erreur lors de la mise à jour de la note");
  }
  return await res.json();
}

/**
 * Récupère la liste des spécialités de médecins
 */
export async function fetchSpecialities(): Promise<string[]> {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('http://localhost:8088/doctors/specialities', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Erreur lors de la récupération des spécialités');
    return await response.json();
  } catch (error) {
    console.error('Error fetching specialities:', error);
    throw error;
  }
}

/**
 * Récupère la liste des médecins selon la spécialité
 * @param speciality La spécialité à rechercher
 */
export async function fetchDoctorsBySpeciality(speciality: string) {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`http://localhost:8081/doctors/speciality/${speciality}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erreur lors de la récupération des médecins par spécialité");
    return await res.json();
  } catch (error) {
    console.error("Error fetching doctors by speciality:", error);
    throw error;
  }
}

/**
 * Récupère la liste des médecins par nom
 * @param doctorName Le nom du médecin à rechercher
 */
export async function fetchDoctorsByName(doctorName: string) {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`http://localhost:8088/doctors/name/${doctorName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erreur lors de la récupération des médecins par nom");
    return await res.json();
  } catch (error) {
    console.log("Error fetching doctors by name:", error);
    throw error;
  }
}

/**
 * Envoie un message de partage de document à un autre médecin
 * @param senderId ID de l'expéditeur (médecin courant)
 * @param receiverId ID du destinataire (médecin sélectionné)
 * @param description Message à envoyer
 * @param resourceId ID du document à partager
 */
export async function sendDocument(senderId: number, receiverId: number, description: string, resourceId: number) {
  const token = localStorage.getItem("accessToken");
  const body = {
    receiverId,
    description,
    resourceType: "DOCUMENT",
    resourceId,
    senderId
  };

  const res = await fetch(`http://localhost:8088/api/sharing-messages/${senderId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Erreur lors du partage du document");
  }

  return await res.json();
}

export async function fetchDocumentById(documentId: number) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`http://localhost:8088/medical-records/document/${documentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération du document");
  return await res.json();
}

export const addAppointment = async (medicalRecordId: number, appointmentData: {
  date: string;
  title: string;
  status: string;
  type: string;
}) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`http://localhost:8088/medical-records/addAppointment/${medicalRecordId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(appointmentData)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const createInvoice = async (
  medicalRecordId: number,
  authorId: number,
  invoiceData: {
    amount: number;
    description: string;
    status: string;
  }
) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const payload = {
    invoiceDate: new Date().toISOString(),
    amount: invoiceData.amount,
    description: invoiceData.description,
    status: invoiceData.status,
    generatedBy: authorId,
    medicalRecordId: medicalRecordId
  };

  const response = await fetch(`http://localhost:8088/api/invoices/createInvoice/${medicalRecordId}/${authorId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const fetchInvoices = async (medicalRecordId: number, generatedById: number) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`http://localhost:8088/api/invoices/medical-record/${medicalRecordId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const invoices = await response.json();
  // Filtrer les factures pour ne garder que celles générées par le docteur spécifié
  return invoices.filter((invoice: any) => invoice.generatedBy === generatedById);
};

export const updateInvoice = async (
  invoiceId: number,
  authorId: number,
  invoiceData: {
    amount: number;
    description: string;
    status: string;
    medicalRecordId: number;
  }
) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const payload = {
    invoiceDate: new Date().toISOString(),
    amount: invoiceData.amount,
    description: invoiceData.description,
    status: invoiceData.status,
    generatedBy: authorId,
    medicalRecordId: invoiceData.medicalRecordId
  };

  const response = await fetch(`http://localhost:8088/api/invoices/${invoiceId}/${authorId}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export async function shareInvoice(senderId: number, receiverId: number, description: string, resourceId: number) {
  const token = localStorage.getItem("accessToken");
  const body = {
    receiverId,
    description,
    resourceType: "INVOICE",
    resourceId,
    senderId
  };

  const res = await fetch(`http://localhost:8088/api/sharing-messages/${senderId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Erreur lors du partage de la facture");
  }

  return await res.json();
}

export async function fetchInsuranceAdminByName(insuranceName: string) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`http://localhost:8088/insurance-admins/insuranceByName/${insuranceName}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (!data || data.length === 0) {
    throw new Error("No insurance admin found");
  }

  return data[0].id; // Retourne l'ID du premier administrateur d'assurance trouvé
}

export async function fetchPatientById(patientId: number) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`http://localhost:8088/patients/id/${patientId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}


