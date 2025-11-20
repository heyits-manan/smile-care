"use client";
import Image from "next/image";
import Link from "next/link";
import { Dentist } from "@/db/schema";

interface DentistCardProps {
  dentist: Dentist;
  onBookClick: (dentist: Dentist) => void;
}

export default function DentistCard({
  dentist,
  onBookClick,
}: DentistCardProps) {
  const availableSlots = dentist.availableSlots as Record<string, string[]>;

  const getNextAvailableSlot = () => {
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      if (
        availableSlots[dayName] &&
        availableSlots[dayName].length > 0
      ) {
        const time = availableSlots[dayName][0];
        const displayDate =
          i === 0
            ? "Today"
            : i === 1
            ? "Tomorrow"
            : date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
        return `${displayDate} • ${time}`;
      }
    }
    return "No slots";
  };

  const getSpecialtyIcon = (specialty: string) => {
    const icons: Record<string, string> = {
      Orthodontist: "🦷",
      "General Dentist": "👨‍⚕️",
      Endodontist: "🔬",
      "Pediatric Dentist": "👶",
      Prosthodontist: "🦾",
      Periodontist: "🌱",
    };
    return icons[specialty] || "👨‍⚕️";
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors: Record<string, string> = {
      Orthodontist: "bg-gradient-to-r from-blue-500 to-cyan-500",
      "General Dentist": "bg-gradient-to-r from-green-500 to-emerald-500",
      Endodontist: "bg-gradient-to-r from-purple-500 to-indigo-500",
      "Pediatric Dentist": "bg-gradient-to-r from-pink-500 to-rose-500",
      Prosthodontist: "bg-gradient-to-r from-orange-500 to-red-500",
      Periodontist: "bg-gradient-to-r from-teal-500 to-green-500",
    };
    return colors[specialty] || "bg-gradient-to-r from-gray-500 to-slate-500";
  };

  const isAvailable = getNextAvailableSlot() !== "No slots";

  return (
    <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-indigo-200 hover:scale-105">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Availability indicator */}
      <div
        className={`absolute top-4 left-4 z-10 px-2 py-1 rounded-full text-xs font-medium ${
          isAvailable
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-gray-100 text-gray-600 border border-gray-200"
        }`}
      >
        <span
          className={`inline-block w-2 h-2 rounded-full mr-1 ${
            isAvailable ? "bg-green-400 animate-pulse" : "bg-gray-400"
          }`}
        ></span>
        {isAvailable ? "Available" : "Busy"}
      </div>

      <div className="relative p-6">
        {/* Header with photo and rating */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <Image
                src={dentist.photo}
                alt={dentist.name}
                width={80}
                height={80}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            {/* Specialty icon overlay */}
            <div
              className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-xl ${getSpecialtyColor(
                dentist.specialty
              )} flex items-center justify-center text-white text-sm shadow-lg`}
            >
              {getSpecialtyIcon(dentist.specialty)}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">
                  {dentist.name}
                </h3>
                <p className="text-sm font-semibold text-indigo-600 mt-1">
                  {dentist.specialty}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
          {dentist.bio}
        </p>

        {/* Next appointment info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Next available:</span>
            <span
              className={`font-semibold px-2 py-1 rounded-lg ${
                isAvailable
                  ? "text-green-700 bg-green-50 border border-green-200"
                  : "text-gray-600 bg-gray-50 border border-gray-200"
              }`}
            >
              <span className="text-xs mr-1">📅</span>
              {getNextAvailableSlot()}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Link
            href={`/dentists/${dentist.id}`}
            className="flex-1 group/btn text-center py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300"
          >
            <span className="flex items-center justify-center gap-2">
              <span className="text-sm">👁️</span>
              View Profile
            </span>
          </Link>

          <button
            onClick={() => onBookClick(dentist)}
            disabled={!isAvailable}
            className={`flex-1 group/btn py-3 px-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl ${
              isAvailable
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="text-sm">{isAvailable ? "📞" : "⏰"}</span>
              {isAvailable ? "Book Now" : "No Slots"}
              {isAvailable && (
                <svg
                  className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Subtle bottom accent */}
      <div
        className={`h-1 ${getSpecialtyColor(
          dentist.specialty
        )} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
      ></div>
    </div>
  );
}
