export async function fetchReceivedMessages(receiverId: number) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`http://localhost:8088/api/sharing-messages/receiver/${receiverId}`, {
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

export async function fetchDoctorName(doctorId: number) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`http://localhost:8088/doctors/${doctorId}`, {
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
  return data.doctorInfo?.name || 'Unknown Doctor';
}

export async function fetchInvoiceById(invoiceId: number) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`http://localhost:8088/api/invoices/${invoiceId}`, {
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

export async function initializeReimbursement(reimbursementData: {
  status: string;
  amount: number;
  invoiceId: number;
  insuredId: number;
  medicalRecordId: number;
}) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`http://localhost:8088/api/reimbursements`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(reimbursementData)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function fetchReimbursementsByInsuredId(insuredId: string) {
  const token = localStorage.getItem("accessToken");
  const url = `http://localhost:8088/api/reimbursements/insured/${insuredId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des remboursements de l'assuré");
  }
  return response.json();
}

export async function fetchReimbursementsByInvoiceId(invoiceId: number) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`http://localhost:8088/api/reimbursements/invoice/${invoiceId}`, {
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

export async function checkReimbursementExistsForInvoice(invoiceId: number): Promise<boolean> {
  try {
    console.log(`Checking reimbursement existence for invoice ID: ${invoiceId}`);
    
    // Récupérer l'ID de l'assuré depuis le localStorage
    const insuredId = localStorage.getItem('specificId');
    if (!insuredId) {
      console.error('Insured ID not found in local storage');
      return false;
    }

    // Récupérer tous les remboursements de l'assuré
    const reimbursements = await fetchReimbursementsByInsuredId(insuredId);
    
    console.log(`All reimbursements for insured ${insuredId}:`, reimbursements);
    
    // Vérifier si un remboursement existe pour cette facture spécifique
    const existingReimbursement = reimbursements.find((reimbursement: any) => 
      reimbursement.invoiceId === invoiceId
    );
    
    const exists = existingReimbursement !== undefined;
    console.log(`Reimbursement exists for invoice ${invoiceId}: ${exists}`);
    
    return exists;
  } catch (error) {
    console.error("Error checking reimbursement existence:", error);
    return false;
  }
}

export async function fetchInsuranceAdminProfile(specificId) {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No access token found");
  const response = await fetch(`http://localhost:8088/insurance-admins/${specificId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}

// Notifications pour Insurance Admin
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
  const url = `http://localhost:8088/api/notifications/${notifId}`;
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

// Récupérer tous les remboursements liés à l'admin assurance
export async function fetchReimbursementsByInsuranceAdmin(insuranceAdminId: string) {
  const token = localStorage.getItem("accessToken");
  const url = `http://localhost:8088/api/reimbursements/insurance-admin/${insuranceAdminId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des remboursements de l'assurance");
  }
  return response.json();
}

// Récupérer toutes les factures traitées par l'admin assurance
export async function fetchInvoicesByInsuranceAdmin(insuranceAdminId: string) {
  const token = localStorage.getItem("accessToken");
  const url = `http://localhost:8088/api/invoices/insurance-admin/${insuranceAdminId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des factures de l'assurance");
  }
  return response.json();
} 