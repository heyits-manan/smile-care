import { db } from "@/db";
import { appointments, users, dentists } from "@/db/schema";
import { sql } from "drizzle-orm";
import Link from "next/link";

export default async function AdminDashboard() {
  // Get statistics
  const [appointmentCount, userCount, dentistCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(appointments),
    db.select({ count: sql<number>`count(*)` }).from(users),
    db.select({ count: sql<number>`count(*)` }).from(dentists),
  ]);

  const stats = [
    {
      label: "Total Appointments",
      value: appointmentCount[0]?.count || 0,
      icon: "📅",
      color: "from-blue-500 to-cyan-500",
      href: "/admin/appointments",
    },
    {
      label: "Total Users",
      value: userCount[0]?.count || 0,
      icon: "👥",
      color: "from-purple-500 to-pink-500",
      href: "/admin/users",
    },
    {
      label: "Total Dentists",
      value: dentistCount[0]?.count || 0,
      icon: "👨‍⚕️",
      color: "from-green-500 to-emerald-500",
      href: "/dentists",
    },
  ];

  // Get recent appointments
  const recentAppointments = await db.query.appointments.findMany({
    limit: 5,
    orderBy: (appointments, { desc }) => [desc(appointments.createdAt)],
    with: {
      dentist: true,
    },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome to your admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-2xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
              >
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Appointments
            </h2>
            <Link
              href="/admin/appointments"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View All →
            </Link>
          </div>
        </div>

        {recentAppointments.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {recentAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.patientName}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {appointment.date}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Dentist:</span> {appointment.dentist?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Time:</span> {appointment.time}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Phone:</span> {appointment.phone}
                      </p>
                      {appointment.email && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span> {appointment.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
}
