"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: "📊",
      exact: true,
    },
    {
      href: "/admin/appointments",
      label: "Appointments",
      icon: "📅",
      exact: false,
    },
    {
      href: "/admin/patients",
      label: "Patients",
      icon: "🏥",
      exact: false,
    },
    {
      href: "/admin/dentists",
      label: "Dentists",
      icon: "👨‍⚕️",
      exact: false,
    },
    {
      href: "/admin/users",
      label: "Manage Admins",
      icon: "👥",
      exact: false,
    },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
            <span className="text-lg">⚙️</span>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              Admin Panel
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              isActive(item.href, item.exact)
                ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 shadow-sm"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/"
          className="mt-2 flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-200"
        >
          <span>🏠</span>
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
