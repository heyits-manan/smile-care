"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Facebook", icon: "📘", href: "#" },
    { name: "Instagram", icon: "📷", href: "#" },
    { name: "Twitter", icon: "🐦", href: "#" },
    { name: "LinkedIn", icon: "💼", href: "#" },
  ];

  const quickLinks = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Dentists", href: "/dentists", icon: "👨‍⚕️" },
    { name: "Appointments", href: "/appointments", icon: "📅" },
    { name: "Services", href: "#services", icon: "🦷" },
  ];

  const services = [
    { name: "General Dentistry", href: "#" },
    { name: "Orthodontics", href: "#" },
    { name: "Cosmetic Dentistry", href: "#" },
    { name: "Emergency Care", href: "#" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                    <span className="text-lg">✨</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur opacity-20"></div>
                </div>
                <div>
                  <div className="text-2xl font-black bg-gradient-to-r from-white via-blue-100 to-indigo-100 bg-clip-text text-transparent">
                    SmileCare Clinic
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    🌟 Gentle. Modern. Trusted.
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                Experience world-class dental care with our expert team. From
                routine cleanings to advanced procedures, we make every visit
                comfortable and effective.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <span className="text-lg">📍</span>
                  <span>123 Health Street, Medical District, City 12345</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <span className="text-lg">📞</span>
                  <span>+91 7618796366</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <span className="text-lg">✉️</span>
                  <span>info@smilecareclinic.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <span className="text-lg">🕐</span>
                  <span>Mon-Fri: 8AM-6PM, Sat: 9AM-4PM</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-lg hover:bg-white/20 hover:scale-110 transition-all duration-300 border border-white/20"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-blue-400">🔗</span>
                Quick Links
              </h4>
              <div className="space-y-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-3 text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 group"
                  >
                    <span className="text-sm group-hover:scale-110 transition-transform duration-300">
                      {link.icon}
                    </span>
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-green-400">🦷</span>
                Services
              </h4>
              <div className="space-y-3">
                {services.map((service) => (
                  <a
                    key={service.name}
                    href={service.href}
                    className="block text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300"
                  >
                    {service.name}
                  </a>
                ))}
              </div>

              {/* Emergency CTA */}
              <div className="mt-8 p-4 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-2xl border border-red-500/30">
                <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
                  <span className="text-lg">🚨</span>
                  Emergency Care
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  24/7 emergency dental services available
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors duration-300"
                >
                  <span>📞</span>
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              &copy; {currentYear} SmileCare Clinic. All rights reserved.
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors duration-300"
              >
                Cookie Policy
              </a>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              <span className="text-red-400 animate-pulse">❤️</span>
              <span>for better smiles</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
