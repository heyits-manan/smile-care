"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      icon: "🚨",
      title: "Emergency",
      description: "Walk-ins welcome",
      gradient: "from-red-100 via-orange-50 to-white",
      color: "text-red-700",
    },
    {
      icon: "✨",
      title: "Cosmetic",
      description: "Smile makeovers",
      gradient: "from-pink-100 via-rose-50 to-white",
      color: "text-pink-700",
    },
    {
      icon: "🦷",
      title: "Orthodontics",
      description: "Clear aligners",
      gradient: "from-blue-100 via-cyan-50 to-white",
      color: "text-blue-700",
    },
    {
      icon: "👶",
      title: "Pediatric",
      description: "Kid-friendly care",
      gradient: "from-purple-100 via-indigo-50 to-white",
      color: "text-purple-700",
    },
  ];

  const stats = [
    { number: "2,000+", label: "Happy Patients", icon: "😊" },
    { number: "15+", label: "Expert Dentists", icon: "👨‍⚕️" },
    { number: "5⭐", label: "Average Rating", icon: "⭐" },
    { number: "24/7", label: "Emergency Care", icon: "🚨" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div
            className={`transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-indigo-700 mb-6 shadow-sm border border-indigo-100">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Available for appointments today
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
              Brighten your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                smile
              </span>{" "}
              with modern care
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
              Experience world-class dental care with our expert team. From
              routine cleanings to advanced procedures, we make every visit
              comfortable and effective.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/dentists"
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-3">
                  <span className="text-xl">📅</span>
                  Book Appointment
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
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
                </span>
              </Link>

              <Link
                href="/appointments"
                className="group inline-flex items-center justify-center gap-3 py-4 px-8 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300"
              >
                <span className="text-xl">📋</span>
                My Appointments
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 transform transition-all duration-700 ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.number}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Services Card */}
          <div
            className={`transform transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="relative">
              {/* Floating background elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-xl opacity-20 animate-pulse"></div>

              <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Our Services
                  </h3>
                  <p className="text-gray-600">
                    Comprehensive dental care for everyone
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {services.map((service, index) => (
                    <div
                      key={service.title}
                      className={`group p-6 bg-gradient-to-br ${service.gradient} rounded-2xl border border-white/50 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer`}
                      style={{
                        animationDelay: `${600 + index * 100}ms`,
                        animation: isVisible
                          ? "fadeInUp 0.8s ease-out forwards"
                          : "none",
                        opacity: isVisible ? 1 : 0,
                      }}
                    >
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {service.icon}
                      </div>
                      <h4 className={`text-lg font-bold ${service.color} mb-1`}>
                        {service.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {service.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Link
                    href="/dentists"
                    className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors duration-300"
                  >
                    View all services
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
