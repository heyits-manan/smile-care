"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  BoltIcon,
  SparklesIcon,
  FaceSmileIcon,
  UserGroupIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  StarIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      icon: BoltIcon,
      title: "Emergency",
      description: "Walk-ins welcome",
      className: "bg-red-50 text-red-600 border-red-100",
    },
    {
      icon: SparklesIcon,
      title: "Cosmetic",
      description: "Smile makeovers",
      className: "bg-pink-50 text-pink-600 border-pink-100",
    },
    {
      icon: FaceSmileIcon,
      title: "Orthodontics",
      description: "Clear aligners",
      className: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      icon: HeartIcon,
      title: "Pediatric",
      description: "Kid-friendly care",
      className: "bg-purple-50 text-purple-600 border-purple-100",
    },
  ];

  const stats = [
    { number: "2,000+", label: "Happy Patients", icon: FaceSmileIcon },
    { number: "15+", label: "Expert Dentists", icon: UserGroupIcon },
    { number: "4.9", label: "Average Rating", icon: StarIcon },
    { number: "24/7", label: "Emergency Care", icon: BoltIcon },
  ];

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl opacity-50"></div>

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
            <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full text-sm font-medium text-green-700 mb-6 border border-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Available for appointments today
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
              Brighten your <span className="text-blue-600 italic">smile</span>{" "}
              with modern care
            </h1>

            <p className="text-lg text-gray-700 mb-8 max-w-xl leading-relaxed font-medium">
              Experience world-class dental care with our expert team. From
              routine cleanings to advanced procedures, we make every visit
              comfortable and effective.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/dentists"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 group"
              >
                <CalendarIcon className="w-5 h-5" />
                Book Appointment
              </Link>

              <Link
                href="/appointments"
                className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
              >
                <ClipboardDocumentCheckIcon className="w-5 h-5" />
                My Appointments
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-gray-100">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className={`text-center transform transition-all duration-700 ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    }`}
                    style={{ transitionDelay: `${300 + index * 100}ms` }}
                  >
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-blue-600 mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.number}
                    </div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Services Card - Right Side */}
          <div
            className={`transform transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-teal-500/20 rounded-[2rem] transform rotate-3 scale-105"></div>

              <div className="relative bg-white rounded-[2rem] p-8 shadow-2xl border border-gray-100">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Our Services
                  </h3>
                  <p className="text-gray-500">
                    Comprehensive dental care for everyone
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {services.map((service, index) => {
                    const Icon = service.icon;
                    return (
                      <div
                        key={service.title}
                        className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 cursor-pointer ${service.className}`}
                        style={{
                          animationDelay: `${600 + index * 100}ms`,
                          animation: isVisible
                            ? "fadeInUp 0.8s ease-out forwards"
                            : "none",
                          opacity: isVisible ? 1 : 0,
                        }}
                      >
                        <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold mb-1">{service.title}</h4>
                        <p className="text-xs opacity-80">
                          {service.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 text-center">
                  <Link
                    href="/dentists"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    View all services
                    <ArrowRightIcon className="w-4 h-4" />
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

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
      />
    </svg>
  );
}
