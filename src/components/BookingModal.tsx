"use client";
import { useState, useEffect } from "react";
import { Dentist } from "@/data/dentists";
import { Appointment, BookingFormData } from "@/types/appointment";
import { useLocalStorage } from "@/utils/useLocalStorage";

interface BookingModalProps {
  dentist: Dentist;
  onClose: () => void;
  onBookingConfirmed?: (appointment: Appointment) => void;
}

interface FormErrors {
  patientName?: string;
  phone?: string;
  email?: string;
  date?: string;
  time?: string;
}

export default function BookingModal({
  dentist,
  onClose,
  onBookingConfirmed,
}: BookingModalProps) {
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>(
    "appointments",
    []
  );
  const [formData, setFormData] = useState<BookingFormData>({
    patientName: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    notes: "",
  });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Focus trap for accessibility
  useEffect(() => {
    const modal = document.querySelector('[role="dialog"]');
    if (modal) {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      const handleTabKey = (e: Event) => {
        const keyEvent = e as KeyboardEvent;
        if (keyEvent.key === "Tab") {
          if (keyEvent.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement?.focus();
              keyEvent.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement?.focus();
              keyEvent.preventDefault();
            }
          }
        }
      };

      modal.addEventListener("keydown", handleTabKey);
      firstElement?.focus();

      return () => modal.removeEventListener("keydown", handleTabKey);
    }
  }, [step]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s|-/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.date) {
      newErrors.date = "Please select a date";
    }

    if (!formData.time) {
      newErrors.time = "Please select a time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Reset time when date changes
    if (name === "date" && formData.time) {
      setFormData((prev) => ({ ...prev, time: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStep(2);
    setIsSubmitting(false);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);

    try {
      const newAppointment: Appointment = {
        id: `apt-${Date.now()}`,
        dentistId: dentist.id,
        dentistName: dentist.name,
        ...formData,
        createdAt: new Date().toISOString(),
      };

      setAppointments((prev) => [...prev, newAppointment]);
      onBookingConfirmed?.(newAppointment);
      onClose();
    } catch (error) {
      console.error("Failed to book appointment:", error);
      setIsSubmitting(false);
    }
  };

  const availableDates = Object.keys(dentist.availableSlots);
  const availableTimes = formData.date
    ? dentist.availableSlots[formData.date] || []
    : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-fade-in-up"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl transform transition-all animate-scale-in border border-white/50"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-50"></div>

          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/30">
                👨‍⚕️
              </div>
              <div>
                <h2 id="modal-title" className="text-2xl font-bold">
                  Book with {dentist.name}
                </h2>
                <p className="text-indigo-100 mt-1 flex items-center gap-2">
                  <span>{dentist.specialty}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span>⭐</span>
                    {dentist.rating.toFixed(1)}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close booking modal"
              className="text-white/80 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10 backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Step Indicator */}
          <div className="relative mt-6 flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {[1, 2].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      step >= stepNumber
                        ? "bg-white text-indigo-600 shadow-lg"
                        : "bg-white/20 text-white/80 border-2 border-white/30"
                    }`}
                  >
                    {step > stepNumber ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      stepNumber
                    )}

                    {step === stepNumber && (
                      <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
                    )}
                  </div>

                  {stepNumber < 2 && (
                    <div
                      className={`w-16 h-0.5 mx-2 transition-colors duration-300 ${
                        step > stepNumber ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Labels */}
          <div className="flex justify-center mt-3">
            <div className="flex items-center space-x-20 text-sm">
              <span
                className={`transition-colors duration-300 ${
                  step >= 1 ? "text-white font-semibold" : "text-white/60"
                }`}
              >
                📝 Details
              </span>
              <span
                className={`transition-colors duration-300 ${
                  step >= 2 ? "text-white font-semibold" : "text-white/60"
                }`}
              >
                ✅ Confirm
              </span>
            </div>
          </div>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="animate-fade-in-up">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  📝 Your Information
                </h3>
                <p className="text-gray-600">
                  Please provide your details to book this appointment.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="patientName"
                      className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2"
                    >
                      <span className="text-lg">👤</span>
                      Full Name *
                    </label>
                    <input
                      id="patientName"
                      name="patientName"
                      type="text"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      className={`w-full px-5 py-4 rounded-2xl border-2 text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-300 ${
                        errors.patientName
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50"
                          : "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300"
                      } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
                      placeholder="Enter your full name"
                      aria-invalid={!!errors.patientName}
                      aria-describedby={
                        errors.patientName ? "patientName-error" : undefined
                      }
                    />
                    {errors.patientName && (
                      <p
                        id="patientName-error"
                        className="mt-2 text-sm text-red-600 flex items-center gap-1"
                      >
                        <span>⚠️</span>
                        {errors.patientName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2"
                      >
                        <span className="text-lg">📞</span>
                        Phone Number *
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-5 py-4 rounded-2xl border-2 text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-300 ${
                          errors.phone
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50"
                            : "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300"
                        } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
                        placeholder="(555) 123-4567"
                        aria-invalid={!!errors.phone}
                        aria-describedby={
                          errors.phone ? "phone-error" : undefined
                        }
                      />
                      {errors.phone && (
                        <p
                          id="phone-error"
                          className="mt-2 text-sm text-red-600 flex items-center gap-1"
                        >
                          <span>⚠️</span>
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2"
                      >
                        <span className="text-lg">✉️</span>
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-5 py-4 rounded-2xl border-2 text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-300 ${
                          errors.email
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50"
                            : "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300"
                        } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
                        placeholder="your@email.com (optional)"
                        aria-invalid={!!errors.email}
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                      />
                      {errors.email && (
                        <p
                          id="email-error"
                          className="mt-2 text-sm text-red-600 flex items-center gap-1"
                        >
                          <span>⚠️</span>
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="date"
                        className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2"
                      >
                        <span className="text-lg">📅</span>
                        Appointment Date *
                      </label>
                      <select
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className={`w-full px-5 py-4 rounded-2xl border-2 text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-300 ${
                          errors.date
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50"
                            : "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300"
                        } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
                        aria-invalid={!!errors.date}
                        aria-describedby={
                          errors.date ? "date-error" : undefined
                        }
                      >
                        <option value="">📅 Select a date</option>
                        {availableDates.map((d) => (
                          <option key={d} value={d}>
                            {formatDate(d)}
                          </option>
                        ))}
                      </select>
                      {errors.date && (
                        <p
                          id="date-error"
                          className="mt-2 text-sm text-red-600 flex items-center gap-1"
                        >
                          <span>⚠️</span>
                          {errors.date}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="time"
                        className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2"
                      >
                        <span className="text-lg">🕐</span>
                        Preferred Time *
                      </label>
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        disabled={!formData.date}
                        className={`w-full px-5 py-4 rounded-2xl border-2 text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-300 ${
                          errors.time
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50"
                            : "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300"
                        } focus:outline-none focus:ring-4 focus:ring-opacity-20 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200`}
                        aria-invalid={!!errors.time}
                        aria-describedby={
                          errors.time ? "time-error" : undefined
                        }
                      >
                        <option value="">
                          {formData.date
                            ? "🕐 Select a time"
                            : "First select a date"}
                        </option>
                        {availableTimes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      {errors.time && (
                        <p
                          id="time-error"
                          className="mt-2 text-sm text-red-600 flex items-center gap-1"
                        >
                          <span>⚠️</span>
                          {errors.time}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2"
                    >
                      <span className="text-lg">📝</span>
                      Additional Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any concerns, questions, or special requests? (optional)"
                      className="w-full px-5 py-4 text-gray-900 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 transition-all duration-300 resize-none"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-indigo-700 hover:to-blue-700 focus:ring-4 focus:ring-indigo-200 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {isSubmitting && (
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="opacity-25"
                        />
                        <path
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          className="opacity-75"
                        />
                      </svg>
                    )}
                    <span className="text-lg">
                      {isSubmitting ? "⏳" : "➡️"}
                    </span>
                    {isSubmitting ? "Processing..." : "Continue to Review"}
                    {!isSubmitting && (
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
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  ✅ Review Your Appointment
                </h3>
                <p className="text-gray-600">
                  Please review your appointment details below before
                  confirming.
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-3xl p-8 border-2 border-indigo-100 shadow-lg">
                {/* Doctor Info */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-indigo-200">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white text-2xl shadow-lg">
                    👨‍⚕️
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {dentist.name}
                    </h4>
                    <p className="text-indigo-600 font-semibold">
                      {dentist.specialty}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm font-semibold">
                        {dentist.rating.toFixed(1)} rating
                      </span>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <span className="text-lg">👤</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Patient
                        </p>
                        <p className="font-bold text-gray-900">
                          {formData.patientName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <span className="text-lg">📞</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Phone
                        </p>
                        <p className="font-bold text-gray-900">
                          {formData.phone}
                        </p>
                      </div>
                    </div>

                    {formData.email && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                          <span className="text-lg">✉️</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Email
                          </p>
                          <p className="font-bold text-gray-900">
                            {formData.email}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                        <span className="text-lg">📅</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Date
                        </p>
                        <p className="font-bold text-gray-900">
                          {formatDate(formData.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                        <span className="text-lg">🕐</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Time
                        </p>
                        <p className="font-bold text-gray-900">
                          {formData.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {formData.notes && (
                  <div className="mt-6 pt-6 border-t border-indigo-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mt-1">
                        <span className="text-lg">📝</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Additional Notes
                        </p>
                        <p className="text-gray-900 bg-white/80 p-4 rounded-xl border border-indigo-200">
                          {formData.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="group flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-2xl hover:bg-gray-100 font-semibold"
                >
                  <svg
                    className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 17l-5-5m0 0l5-5m-5 5h12"
                    />
                  </svg>
                  Back to Edit
                </button>

                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-2xl font-bold hover:from-green-700 hover:to-emerald-700 focus:ring-4 focus:ring-green-200 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {isSubmitting && (
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-25"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        className="opacity-75"
                      />
                    </svg>
                  )}
                  <span className="text-lg">{isSubmitting ? "⏳" : "✅"}</span>
                  {isSubmitting ? "Confirming..." : "Confirm Booking"}
                  {!isSubmitting && (
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
