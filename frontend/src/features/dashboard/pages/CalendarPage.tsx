import React, { useState } from "react";
import SideBar from "../components/sideBar";
import DashboardActionsBar from "../components/DashboardActionsBar";
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../style/dash.css';

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

const dummyAppointments = [
  { id: 1, title: "Consultation with Dr. Smith", start: new Date(), end: new Date(new Date().getTime() + 60 * 60 * 1000) },
  { id: 2, title: "Dental checkup", start: new Date(Date.now() + 86400000), end: new Date(Date.now() + 86400000 + 60 * 60 * 1000) },
];

export default function CalendarPage() {
  const userName = localStorage.getItem("userName") || "Patient";
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [events] = useState(dummyAppointments);

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
              onView={setView}
              date={date}
              onNavigate={setDate}
              popup
              selectable
              messages={{
                week: 'Week',
                day: 'Day',
                month: 'Month',
                today: 'Today',
                previous: '<',
                next: '>',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 