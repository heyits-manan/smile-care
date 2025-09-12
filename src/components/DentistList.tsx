"use client";
import { useState } from "react";
import { dentists, Dentist } from "@/data/dentists";
import DentistCard from "./DentistCard";
import BookingModal from "./BookingModal";

export default function DentistList() {
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");

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
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-indigo-50 py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-indigo-700 mb-4 shadow-sm border border-indigo-100">
            <span className="text-lg">👨‍⚕️</span>
            Expert Medical Team
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Meet our{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              specialists
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
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
              className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                selectedSpecialty === specialty
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg scale-105"
                  : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 border border-gray-200"
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>

        {/* Dentist Grid */}
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

        {/* Empty state */}
        {filteredDentists.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No dentists found
            </h3>
            <p className="text-gray-600">
              Try selecting a different specialty.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="text-3xl font-black text-indigo-600 mb-2">
              {dentists.length}+
            </div>
            <div className="text-sm font-semibold text-gray-700">
              Expert Dentists
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="text-3xl font-black text-green-600 mb-2">15+</div>
            <div className="text-sm font-semibold text-gray-700">
              Years Experience
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="text-3xl font-black text-purple-600 mb-2">
              2000+
            </div>
            <div className="text-sm font-semibold text-gray-700">
              Happy Patients
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="text-3xl font-black text-orange-600 mb-2">24/7</div>
            <div className="text-sm font-semibold text-gray-700">
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
