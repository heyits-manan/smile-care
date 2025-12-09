"use client";

import Link from "next/link";
import {
  SparklesIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Dentists", href: "/dentists" },
    { name: "Appointments", href: "/appointments" },
  ];

  const services = [
    { name: "General Dentistry", href: "#" },
    { name: "Orthodontics", href: "#" },
    { name: "Cosmetic Dentistry", href: "#" },
    { name: "Emergency Care", href: "#" },
  ];

  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-700 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-700 flex items-center justify-center text-white shadow-lg">
                  <SparklesIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    SmileCare
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    Gentle. Modern. Trusted.
                  </div>
                </div>
              </div>

              <p className="text-gray-400 mb-8 leading-relaxed max-w-md">
                Experience world-class dental care with our expert team. From
                routine cleanings to advanced procedures, we make every visit
                comfortable and effective.
              </p>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPinIcon className="w-5 h-5 mt-0.5 shrink-0" />
                  <span>123 Health Street, Medical District, City 12345</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <PhoneIcon className="w-5 h-5 shrink-0" />
                  <span>+91 7618796366</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <EnvelopeIcon className="w-5 h-5 shrink-0" />
                  <span>info@smilecareclinic.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <ClockIcon className="w-5 h-5 shrink-0" />
                  <span>Mon-Fri: 8AM-6PM, Sat: 9AM-4PM</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
              <div className="space-y-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6">Services</h4>
              <div className="space-y-3">
                {services.map((service) => (
                  <a
                    key={service.name}
                    href={service.href}
                    className="block text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {service.name}
                  </a>
                ))}
              </div>

              {/* Emergency CTA */}
              <div className="mt-8 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
                  <PhoneIcon className="w-5 h-5" />
                  Emergency Care
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  24/7 dental services
                </p>
                <a
                  href="#"
                  className="block text-center bg-red-600/90 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-500 text-sm">
              &copy; {currentYear} SmileCare Clinic. All rights reserved.
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
