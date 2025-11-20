"use client";
import { useState, useEffect } from "react";
import AddDentistModal from "@/components/admin/AddDentistModal";

interface Dentist {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  bio: string;
  availableSlots: Record<string, string[]>;
  appointmentCount?: number;
}

export default function DentistsPage() {
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDentists = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/dentists");
      if (response.ok) {
        const data = await response.json();

        const appointmentsResponse = await fetch("/api/appointments");
        let appointmentCounts: Record<string, number> = {};

        if (appointmentsResponse.ok) {
          const appointments = await appointmentsResponse.json();
          appointmentCounts = appointments.reduce((acc: Record<string, number>, apt: { dentistId: string }) => {
            acc[apt.dentistId] = (acc[apt.dentistId] || 0) + 1;
            return acc;
          }, {});
        }

        const dentistsWithCounts = data.map((dentist: Dentist) => ({
          ...dentist,
          appointmentCount: appointmentCounts[dentist.id] || 0,
        }));

        setDentists(dentistsWithCounts);
      }
    } catch (error) {
      console.error("Failed to fetch dentists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDentists();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/dentists/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete dentist");
      }

      await fetchDentists();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete dentist");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDentistAdded = () => {
    fetchDentists();
  };

  const totalAppointments = dentists.reduce((sum, d) => sum + (d.appointmentCount || 0), 0);
  const uniqueSpecialties = new Set(dentists.map((d) => d.specialty)).size;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dentist Management</h1>
          <p className="text-gray-600 mt-2">Manage dentist profiles and availability</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Add New Dentist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Dentists</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dentists.length}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl shadow-lg">
              👨‍⚕️
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Specialties</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{uniqueSpecialties}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl shadow-lg">
              ⚕️
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalAppointments}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-lg">
              📅
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading...</h3>
            <p className="text-gray-600">Fetching dentist data</p>
          </div>
        ) : dentists.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">👨‍⚕️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Dentists Yet</h3>
            <p className="text-gray-600">Click &quot;Add New Dentist&quot; to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Dentist
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Specialty
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Appointments
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Available Days
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dentists.map((dentist) => (
                  <tr
                    key={dentist.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={dentist.photo}
                          alt={dentist.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {dentist.name}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-1">
                            {dentist.bio}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                        {dentist.specialty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {dentist.appointmentCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {Object.keys(dentist.availableSlots).length} days
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(dentist.id, dentist.name)}
                        disabled={deletingId === dentist.id}
                        className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === dentist.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddDentistModal
          onClose={() => setIsModalOpen(false)}
          onDentistAdded={handleDentistAdded}
        />
      )}
    </div>
  );
}
