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

export async function fetchReimbursementsByInsuredId(insuredId: number) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found");
  }

  const response = await fetch(`http://localhost:8088/api/reimbursements/insured/${insuredId}`, {
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
    const reimbursements = await fetchReimbursementsByInsuredId(parseInt(insuredId));
    
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