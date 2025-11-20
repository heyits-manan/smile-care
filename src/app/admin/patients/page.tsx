"use client";
import { useState, useEffect } from "react";

interface Appointment {
  id: string;
  dentistId: string;
  dentistName: string;
  patientName: string;
  phone: string;
  email: string | null;
  date: string;
  time: string;
  notes: string | null;
  createdAt: string;
}

interface Patient {
  name: string;
  phone: string;
  email: string | null;
  totalAppointments: number;
  lastVisit: {
    date: string;
    time: string;
    dentistName: string;
  };
  firstVisit: string;
  dentists: Set<string>;
  isActive: boolean;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/appointments");
        if (response.ok) {
          const appointments: Appointment[] = await response.json();

          const patientsMap = new Map<string, Patient>();

          appointments.forEach((apt) => {
            const key = apt.email || apt.phone;

            if (!patientsMap.has(key)) {
              patientsMap.set(key, {
                name: apt.patientName,
                phone: apt.phone,
                email: apt.email,
                totalAppointments: 0,
                lastVisit: {
                  date: apt.date,
                  time: apt.time,
                  dentistName: apt.dentistName,
                },
                firstVisit: apt.createdAt,
                dentists: new Set(),
                isActive: false,
              });
            }

            const patient = patientsMap.get(key)!;
            patient.totalAppointments++;
            patient.dentists.add(apt.dentistName);

            const currentVisitDate = new Date(apt.date);
            const lastVisitDate = new Date(patient.lastVisit.date);

            if (currentVisitDate > lastVisitDate) {
              patient.lastVisit = {
                date: apt.date,
                time: apt.time,
                dentistName: apt.dentistName,
              };
            }

            const firstVisitDate = new Date(patient.firstVisit);
            const aptDate = new Date(apt.createdAt);
            if (aptDate < firstVisitDate) {
              patient.firstVisit = apt.createdAt;
            }
          });

          const now = new Date();
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

          const patientsArray = Array.from(patientsMap.values()).map((patient) => ({
            ...patient,
            isActive: new Date(patient.lastVisit.date) >= thirtyDaysAgo,
          }));

          patientsArray.sort(
            (a, b) => new Date(b.lastVisit.date).getTime() - new Date(a.lastVisit.date).getTime()
          );

          setPatients(patientsArray);
        }
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const totalPatients = patients.length;

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const newThisMonth = patients.filter(
    (p) => new Date(p.firstVisit) >= thirtyDaysAgo
  ).length;

  const returningPatients = patients.filter((p) => p.totalAppointments > 1).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
        <p className="text-gray-600 mt-2">View and manage patient information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalPatients}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl shadow-lg">
              🏥
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{newThisMonth}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-lg">
              ✨
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Returning Patients</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{returningPatients}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl shadow-lg">
              🔄
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading...</h3>
            <p className="text-gray-600">Fetching patient data</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🏥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Patients Yet</h3>
            <p className="text-gray-600">Patients will appear here after they book appointments</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Appointments
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Visit
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.map((patient, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                          {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {patient.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {patient.dentists.size} dentist{patient.dentists.size !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{patient.phone}</div>
                      {patient.email && (
                        <div className="text-sm text-gray-600">{patient.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {patient.totalAppointments}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(patient.lastVisit.date)} at {patient.lastVisit.time}
                      </div>
                      <div className="text-sm text-gray-600">
                        with {patient.lastVisit.dentistName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          patient.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {patient.isActive ? "✓ Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
