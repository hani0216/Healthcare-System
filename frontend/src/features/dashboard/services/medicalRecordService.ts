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
