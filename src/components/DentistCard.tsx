"use client";
import Image from "next/image";
import Link from "next/link";
import { Dentist } from "@/db/schema";
import { CalendarIcon, EyeIcon, ClockIcon } from "@heroicons/react/24/outline";

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
      if (availableSlots[dayName] && availableSlots[dayName].length > 0) {
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

  const isAvailable = getNextAvailableSlot() !== "No slots";

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Availability indicator */}
      <div
        className={`absolute top-4 left-4 z-10 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
          isAvailable
            ? "bg-green-100/90 text-green-700"
            : "bg-gray-100/90 text-gray-600"
        }`}
      >
        <span
          className={`inline-block w-2 h-2 rounded-full mr-1 ${
            isAvailable ? "bg-green-500 animate-pulse" : "bg-gray-400"
          }`}
        ></span>
        {isAvailable ? "Available" : "Busy"}
      </div>

      <div className="p-6">
        {/* Header with photo */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm bg-gray-100">
            <Image
              src={dentist.photo}
              alt={dentist.name}
              width={80}
              height={80}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {dentist.name}
            </h3>
            <p className="text-sm font-medium text-blue-600 mt-0.5 truncate">
              {dentist.specialty}
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 h-10 font-medium">
          {dentist.bio}
        </p>

        {/* Next appointment info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
            <ClockIcon className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700 text-xs font-semibold">Next:</span>
            <span
              className={`font-bold ${
                isAvailable ? "text-green-700" : "text-gray-700"
              }`}
            >
              {getNextAvailableSlot()}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Link
            href={`/dentists/${dentist.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-gray-200 text-gray-700 font-medium text-sm hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
            Profile
          </Link>

          <button
            onClick={() => onBookClick(dentist)}
            disabled={!isAvailable}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-sm transition-all shadow-sm ${
              isAvailable
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isAvailable ? (
              <CalendarIcon className="w-4 h-4" />
            ) : (
              <ClockIcon className="w-4 h-4" />
            )}
            {isAvailable ? "Book" : "Busy"}
          </button>
        </div>
      </div>
    </div>
  );
}
