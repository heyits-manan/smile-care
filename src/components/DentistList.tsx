"use client";
import { useState, useEffect } from "react";
import { Dentist } from "@/db/schema";
import DentistCard from "./DentistCard";
import BookingModal from "./BookingModal";
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function DentistList() {
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const response = await fetch("/api/dentists");
        if (response.ok) {
          const data = await response.json();
          setDentists(data);
        }
      } catch (error) {
        console.error("Failed to fetch dentists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDentists();
  }, []);

  const handleBookClick = (dentist: Dentist) => setSelectedDentist(dentist);
  const handleCloseModal = () => setSelectedDentist(null);

  const specialties = [
    "All",
    ...Array.from(new Set(dentists.map((d) => d.specialty))),
  ];

  const filteredDentists =
    selectedSpecialty === "All"
      ? dentists
      : dentists.filter((d) => d.specialty === selectedSpecialty);

  return (
    <section className="relative bg-white py-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-sm font-medium text-blue-700 mb-4 border border-blue-100">
            <UserGroupIcon className="w-5 h-5" />
            Expert Medical Team
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Meet our <span className="text-blue-600 italic">specialists</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Skilled, compassionate dentists with years of experience, ready to
            provide you with the best care possible.
          </p>
        </div>

        {/* Specialty Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 shadow-sm ${
                selectedSpecialty === specialty
                  ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transform hover:scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-medium text-gray-900">
              Loading dentists...
            </h3>
          </div>
        )}

        {/* Dentist Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDentists.map((dentist, index) => (
              <div
                key={dentist.id}
                className="transform transition-all duration-500"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                <DentistCard dentist={dentist} onBookClick={handleBookClick} />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredDentists.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No dentists found
            </h3>
            <p className="text-gray-500">
              Try selecting a different specialty.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {dentists.length}+
            </div>
            <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
              Expert Dentists
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-green-600 mb-1">15+</div>
            <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
              Years Experience
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-teal-600 mb-1">2000+</div>
            <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
              Happy Patients
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-amber-600 mb-1">24/7</div>
            <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
              Emergency Care
            </div>
          </div>
        </div>
      </div>

      {selectedDentist && (
        <BookingModal
          dentist={selectedDentist}
          onClose={handleCloseModal}
          onBookingConfirmed={() => handleCloseModal()}
        />
      )}
    </section>
  );
}
