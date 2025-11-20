import { db } from "@/db";
import { appointments } from "@/db/schema";
import { desc } from "drizzle-orm";

export default async function AppointmentsPage() {
  // Get all appointments
  const allAppointments = await db.query.appointments.findMany({
    orderBy: [desc(appointments.createdAt)],
    with: {
      dentist: true,
      user: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Appointments
        </h1>
        <p className="text-gray-600 mt-2">
          Manage all appointment bookings
        </p>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {allAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Dentist
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Booked On
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {appointment.patientName}
                        </div>
                        {appointment.user && (
                          <div className="text-sm text-gray-500">
                            User ID: {appointment.user.fullName}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {appointment.dentist?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.dentist?.specialty || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit">
                          📅 {appointment.date}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                          🕐 {appointment.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        <div className="text-gray-900">📞 {appointment.phone}</div>
                        {appointment.email && (
                          <div className="text-gray-500">✉️ {appointment.email}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {appointment.notes ? (
                        <div className="text-sm text-gray-600 max-w-xs truncate" title={appointment.notes}>
                          {appointment.notes}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No notes</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {new Date(appointment.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No appointments yet
            </h3>
            <p className="text-gray-600">
              Appointments will appear here when users book them
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      {allAppointments.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-xl">
              📊
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {allAppointments.length} Total Appointments
              </div>
              <div className="text-sm text-gray-600">
                Showing all appointment bookings
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
