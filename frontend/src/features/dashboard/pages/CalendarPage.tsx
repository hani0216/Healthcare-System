import React, { useState, useEffect } from "react";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import { Calendar as BigCalendar, dateFnsLocalizer, Views, Event as RBCEvent } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../style/dash.css';
import { getAppointments } from '../services/appointmentService';

const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const TYPE_COLORS: Record<string, string> = {
  MEDICAL_APPOINTMENT: '#38bdf8', // blue
  TREATMENT: '#22c55e', // green
  VACCINATION: '#f59e42', // orange
};
const TYPE_LABELS: Record<string, string> = {
  MEDICAL_APPOINTMENT: 'Medical Appointment',
  TREATMENT: 'Treatment',
  VACCINATION: 'Vaccination',
};

export default function CalendarPage() {
  const userName = localStorage.getItem("userName") || "Patient";
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const specificId = localStorage.getItem("specificId");

  useEffect(() => {
    if (!specificId) return;
    getAppointments(specificId).then((apps) => {
      setEvents(
        apps.map((a: any) => ({
          id: a.id,
          title: a.title,
          start: new Date(a.date),
          end: new Date(new Date(a.date).getTime() + 60 * 60 * 1000),
          type: a.type,
          status: a.status,
        }))
      );
    });
  }, [specificId]);

  // Custom event style by type
  function eventStyleGetter(event: any) {
    const color = TYPE_COLORS[event.type] || '#38bdf8';
    return {
      style: {
        backgroundColor: color,
        borderRadius: '8px',
        color: '#fff',
        border: 'none',
        fontWeight: 600,
        fontSize: 15,
        padding: 4,
      },
    };
  }

  // Custom event content
  function EventContent({ event }: { event: any }) {
    return (
      <div>
        <div style={{ fontWeight: 700 }}>{event.title}</div>
        <div style={{ fontSize: 12 }}>{event.status}</div>
      </div>
    );
  }

  return (
    <div style={{ height: "auto", display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, background: "#f5f6fa", position: "relative", minHeight: "100vh" }}>
        <DashboardActionsBar userName={userName} />
        <div className="container mx-auto p-6 max-w-5xl" style={{ marginTop: "20px" }}>
          <div className="rounded-2xl shadow-lg p-10" style={{ background: 'linear-gradient(90deg, #f0f9ff 0%, #e0e7ff 100%)', borderRadius: '2rem', boxShadow: '0 4px 24px rgba(40,166,167,0.08)' }}>
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#28A6A7' }}>My Calendar</h2>
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500, background: 'white', borderRadius: '1rem', padding: 10 }}
              views={[Views.DAY, Views.WEEK, Views.MONTH]}
              view={view}
              onView={(v) => setView(v)}
              date={date}
              onNavigate={setDate}
              popup
              selectable
              eventPropGetter={eventStyleGetter}
              components={{ event: EventContent }}
              messages={{
                week: 'Week',
                day: 'Day',
                month: 'Month',
                today: 'Today',
                previous: '<',
                next: '>',
              }}
            />
            {/* Légende des types d'appointments */}
            <div className="flex gap-6 justify-center mt-6">
              {Object.entries(TYPE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <span style={{ display: 'inline-block', width: 18, height: 18, background: color, borderRadius: 6 }}></span>
                  <span style={{ fontWeight: 500 }}>{TYPE_LABELS[type]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 