import { useState, useRef, useEffect } from "react";
import SideBar from "../components/sideBar";
import Agenda from "../components/Agenda";
import DashboardActionsBar from "../components/DashboardActionsBar";
 
export default function DoctorHome() {
  return (
    <div style={{ height: "100vh", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, background: "#f5f6fa", position: "relative" }}>
        <DashboardActionsBar />
        <div style={{ padding: "40px" }}>
        </div>
        

        
      </div>
    </div>
  );
}
