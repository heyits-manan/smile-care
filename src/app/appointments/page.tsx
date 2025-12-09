"use client";

import { useState, useEffect } from "react";
import { Appointment } from "@/types/appointment";
import { useLocalStorage } from "@/utils/useLocalStorage";
import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  XMarkIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

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
  }) => {
    const appointmentDate = new Date(`${apt.date}T${apt.time}`);
    const formattedDate = appointmentDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = appointmentDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    return (
      <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Status indicator bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${
            isUpcoming
              ? "bg-gradient-to-r from-blue-500 to-blue-600"
              : "bg-gray-300"
          }`}
        />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {isUpcoming ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                ) : (
                  <CheckCircleIcon className="w-5 h-5 text-gray-400" />
                )}
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isUpcoming
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isUpcoming ? "Upcoming" : "Completed"}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {apt.dentistName}
              </h3>
            </div>
            {isUpcoming && (
              <button
                onClick={() => cancelAppointment(apt.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>

          {/* Date and Time */}
          <div className="flex items-start gap-3 mb-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
            <CalendarIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {formattedDate}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <ClockIcon className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-700">
                  {formattedTime}
                </p>
              </div>
            </div>
          </div>

          {/* Patient Info */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <UserIcon className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Patient:</span>
              <span className="font-semibold text-gray-900">
                {apt.patientName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <PhoneIcon className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">Contact:</span>
              <span className="font-medium text-gray-900">{apt.phone}</span>
            </div>
            {apt.email && (
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{apt.email}</span>
              </div>
            )}
            {apt.notes && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-1">Notes:</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg italic">
                  {apt.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-sm font-medium text-blue-700 mb-4 border border-blue-100">
            <CalendarIcon className="w-5 h-5" />
            Appointment Management
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
            My Appointments
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            View and manage your upcoming and past dental appointments
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {upcomingAppointments.length}
            </div>
            <div className="text-sm font-medium text-gray-600">Upcoming</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="text-3xl font-bold text-gray-600 mb-1">
              {pastAppointments.length}
            </div>
            <div className="text-sm font-medium text-gray-600">Past</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {appointments.length}
            </div>
            <div className="text-sm font-medium text-gray-600">Total</div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Upcoming Appointments */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                Upcoming Appointments
              </h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                {upcomingAppointments.length}
              </span>
            </div>
            {upcomingAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingAppointments.map((apt) => (
                  <AppointmentCard key={apt.id} apt={apt} isUpcoming={true} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No upcoming appointments
                </h3>
                <p className="text-gray-500 mb-4">
                  You don&apos;t have any scheduled appointments at the moment.
                </p>
                <Link
                  href="/dentists"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book an Appointment
                </Link>
              </div>
            )}
          </div>

          {/* Past Appointments */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gray-400 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                Past Appointments
              </h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                {pastAppointments.length}
              </span>
            </div>
            {pastAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastAppointments.map((apt) => (
                  <AppointmentCard key={apt.id} apt={apt} isUpcoming={false} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                <CheckCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No past appointments
                </h3>
                <p className="text-gray-500">
                  Your appointment history will appear here once you&apos;ve
                  completed appointments.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
