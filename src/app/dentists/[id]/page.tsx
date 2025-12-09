"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Dentist } from "@/db/schema";
import BookingModal from "@/components/BookingModal";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function DentistDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [dentist, setDentist] = useState<Dentist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDentist = async () => {
      try {
        const response = await fetch(`/api/dentists/${id}`);
        if (response.ok) {
          const data = await response.json();
          setDentist(data);
        }
      } catch (error) {
        console.error("Failed to fetch dentist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDentist();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900">
            Loading dentist profile...
          </h3>
        </div>
      </div>
    );

  if (!dentist)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Dentist not found
          </h3>
          <Link
            href="/dentists"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Dentists
          </Link>
        </div>
      </div>
    );

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const availableSlots = dentist.availableSlots as Record<string, string[]>;
  const todaySlots = availableSlots?.[dayName] || [];

  // Get next available slot
  const getNextAvailableSlot = () => {
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
    return null;
  };

  const nextSlot = getNextAvailableSlot();
  const isAvailable = nextSlot !== null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/dentists"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Dentists
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 px-8 py-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Photo */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                  <Image
                    src={dentist.photo}
                    alt={dentist.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                {isAvailable && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-md"></div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full mb-3">
                  <span className="text-xs font-semibold text-blue-700">
                    {dentist.specialty}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {dentist.name}
                </h1>
                {nextSlot && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <ClockIcon className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">Next available:</span>
                    <span className="text-green-700 font-bold">{nextSlot}</span>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={!isAvailable}
                  className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 flex items-center gap-2 ${
                    isAvailable
                      ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <CalendarIcon className="w-5 h-5" />
                  {isAvailable ? "Book Appointment" : "Not Available"}
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Bio */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {dentist.bio}
              </p>
            </div>

            {/* Availability Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Weekly Availability
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => {
                  const slots = availableSlots[day] || [];
                  const hasSlots = slots.length > 0;
                  return (
                    <div
                      key={day}
                      className={`p-4 rounded-xl border-2 ${
                        hasSlots
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{day}</h3>
                        {hasSlots ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        ) : (
                          <span className="text-xs text-gray-500">Closed</span>
                        )}
                      </div>
                      {hasSlots ? (
                        <div className="flex flex-wrap gap-2">
                          {slots.map((slot) => (
                            <span
                              key={slot}
                              className="px-2.5 py-1 bg-white text-sm font-medium text-gray-700 rounded-lg border border-green-200"
                            >
                              {slot}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No available slots
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today's Slots Highlight */}
            {todaySlots.length > 0 && (
              <div className="mt-8 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Available Today ({dayName})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {todaySlots.map((slot) => (
                    <span
                      key={slot}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <BookingModal
          dentist={dentist}
          onClose={() => setIsModalOpen(false)}
          onBookingConfirmed={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
