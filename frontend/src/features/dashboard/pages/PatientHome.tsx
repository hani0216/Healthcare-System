import { useState, useRef, useEffect } from "react";
import SideBar from "../components/sideBar";
import Agenda from "../components/Agenda";
import DashboardActionsBar from "../components/DashboardActionsBar";
import Dashboard from "../components/Dashboard";
 
export default function PatientHome() {

  return (
    <div style={{ height: "auto", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, background: "#f5f6fa", position: "relative" }}>
        <Dashboard />
        <div style={{ padding: "40px" }}>
        </div>
        

        
      </div>
    </div>
  );
}
