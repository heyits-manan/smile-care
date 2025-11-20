"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Dentist } from "@/db/schema";
import BookingModal from "@/components/BookingModal";
import Image from "next/image";

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
      <div className="p-12 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h3 className="text-2xl font-bold text-gray-900">Loading...</h3>
      </div>
    );

  if (!dentist)
    return <div className="p-12 text-center">Dentist not found</div>;

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const availableSlots = dentist.availableSlots as Record<string, string[]>;
  const todaySlots = availableSlots?.[dayName] || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <Image
              className="h-56 w-full object-cover md:w-56"
              src={dentist.photo}
              alt={dentist.name}
              width={224}
              height={224}
            />
          </div>
          <div className="p-8">
            <div className="text-sm text-indigo-600 font-semibold">
              {dentist.specialty}
            </div>
            <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
              {dentist.name}
            </h1>
            <p className="mt-4 text-gray-600">{dentist.bio}</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Available Slots Today
          </h2>
          <div className="flex flex-wrap gap-2">
            {todaySlots.length > 0 ? (
              todaySlots.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-full bg-white border text-sm"
                >
                  {s}
                </span>
              ))
            ) : (
              <div className="text-gray-500">No slots for today</div>
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
