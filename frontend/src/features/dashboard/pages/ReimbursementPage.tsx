import React, { useState } from "react";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import '../style/dash.css';

const dummyReimbursements = [
  { id: 1, amount: 120, status: "Pending", date: new Date() },
  { id: 2, amount: 80, status: "Paid", date: new Date(Date.now() - 86400000) },
];

export default function ReimbursementPage() {
  const userName = localStorage.getItem("userName") || "Patient";
  const [reimbursements] = useState(dummyReimbursements);

  return (
    <div style={{ height: "auto", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, background: "#f5f6fa", position: "relative", minHeight: "100vh" }}>
        <DashboardActionsBar userName={userName} />
        <div className="container mx-auto p-6 max-w-2xl" style={{ marginTop: "40px" }}>
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-8" >
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#28A6A7' }}>My Reimbursements</h2>
            <ul>
              {reimbursements.map(r => (
                <li key={r.id} className="mb-3 p-4 rounded-lg flex justify-between items-center bg-blue-50">
                  <div>
                    <span className="font-semibold text-blue-700">{r.amount} €</span>
                    <span className="ml-4 text-gray-500">{r.date.toLocaleDateString()}</span>
                  </div>
                  <span className={
                    r.status === "Paid"
                      ? "bg-green-200 text-green-800 px-3 py-1 rounded-full font-semibold"
                      : "bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full font-semibold"
                  }>
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 