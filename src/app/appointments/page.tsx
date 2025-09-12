"use client";

import { useState, useEffect } from "react";
import { Appointment } from "@/types/appointment";
import { useLocalStorage } from "@/utils/useLocalStorage";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>(
    "appointments",
    []
  );
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    Appointment[]
  >([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const now = new Date();
    const upcoming = appointments
      .filter((apt) => new Date(`${apt.date}T${apt.time}`) >= now)
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}`).getTime() -
          new Date(`${b.date}T${b.time}`).getTime()
      );
    const past = appointments
      .filter((apt) => new Date(`${apt.date}T${apt.time}`) < now)
      .sort(
        (a, b) =>
          new Date(`${b.date}T${b.time}`).getTime() -
          new Date(`${a.date}T${a.time}`).getTime()
      );

    setUpcomingAppointments(upcoming);
    setPastAppointments(past);
  }, [appointments]);

  const cancelAppointment = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      const updatedAppointments = appointments.filter((apt) => apt.id !== id);
      setAppointments(updatedAppointments);
    }
  };

  const AppointmentCard = ({
    apt,
    isUpcoming,
  }: {
    apt: Appointment;
    isUpcoming: boolean;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6 transition-shadow duration-200 hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xl font-bold text-gray-800">{apt.dentistName}</p>
          <p className="text-md text-gray-600">
            {new Date(apt.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            at {apt.time}
          </p>
        </div>
        {isUpcoming && (
          <button
            onClick={() => cancelAppointment(apt.id)}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Booked for:{" "}
          <span className="font-medium text-gray-700">{apt.patientName}</span>
        </p>
        <p className="text-sm text-gray-500">
          Contact:{" "}
          <span className="font-medium text-gray-700">{apt.phone}</span>
        </p>
        {apt.notes && (
          <p className="text-sm text-gray-500 mt-2">
            Notes: <span className="italic text-gray-600">{apt.notes}</span>
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8">
        My Appointments
      </h1>

      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingAppointments.map((apt) => (
                <AppointmentCard key={apt.id} apt={apt} isUpcoming={true} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You have no upcoming appointments.</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Past Appointments</h2>
          {pastAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastAppointments.map((apt) => (
                <AppointmentCard key={apt.id} apt={apt} isUpcoming={false} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You have no past appointments.</p>
          )}
        </div>
      </div>
    </div>
  );
}
