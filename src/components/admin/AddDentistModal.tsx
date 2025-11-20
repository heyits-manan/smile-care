"use client";
import { useState, useEffect } from "react";

interface AddDentistModalProps {
  onClose: () => void;
  onDentistAdded: () => void;
}

interface FormData {
  name: string;
  specialty: string;
  photo: string;
  bio: string;
}

interface FormErrors {
  name?: string;
  specialty?: string;
  photo?: string;
  bio?: string;
  schedule?: string;
}

type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

const DAYS_OF_WEEK: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const SPECIALTIES = [
  "General Dentist",
  "Orthodontist",
  "Endodontist",
  "Pediatric Dentist",
  "Prosthodontist",
  "Periodontist",
];

export default function AddDentistModal({ onClose, onDentistAdded }: AddDentistModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    specialty: "",
    photo: "",
    bio: "",
  });

  const [schedule, setSchedule] = useState<Record<DayOfWeek, string[]>>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  const [enabledDays, setEnabledDays] = useState<DayOfWeek[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleDay = (day: DayOfWeek) => {
    setEnabledDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );

    if (!enabledDays.includes(day) && schedule[day].length === 0) {
      setSchedule((prev) => ({ ...prev, [day]: ["09:00"] }));
    }
  };

  const addTimeSlot = (day: DayOfWeek) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: [...prev[day], "09:00"],
    }));
  };

  const removeTimeSlot = (day: DayOfWeek, index: number) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  const updateTimeSlot = (day: DayOfWeek, index: number, value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].map((time, i) => (i === index ? value : time)),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Dentist name is required";
    }

    if (!formData.specialty) {
      newErrors.specialty = "Specialty is required";
    }

    if (!formData.photo.trim()) {
      newErrors.photo = "Photo URL is required";
    } else if (!/^https?:\/\/.+/.test(formData.photo)) {
      newErrors.photo = "Please enter a valid URL";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    }

    const hasAtLeastOneSlot = enabledDays.some(
      (day) => schedule[day].length > 0
    );

    if (!hasAtLeastOneSlot) {
      newErrors.schedule = "Please add at least one time slot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const availableSlots: Record<string, string[]> = {};
      enabledDays.forEach((day) => {
        if (schedule[day].length > 0) {
          availableSlots[day] = schedule[day].filter((time) => time !== "");
        }
      });

      const response = await fetch("/api/dentists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          availableSlots,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add dentist");
      }

      onDentistAdded();
      onClose();
    } catch (error) {
      console.error("Failed to add dentist:", error);
      setErrors({ bio: error instanceof Error ? error.message : "Failed to add dentist" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-fade-in-up"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-4xl max-h-[90vh] overflow-auto bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl transform transition-all animate-scale-in border border-white/50"
      >
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/30">
                👨‍⚕️
              </div>
              <div>
                <h2 id="modal-title" className="text-2xl font-bold">
                  Add New Dentist
                </h2>
                <p className="text-purple-100 mt-1">
                  Fill in the details to add a new dentist to the system
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
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
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2"
              >
                <span className="text-lg">👤</span>
                Dentist Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-5 py-4 rounded-2xl border-2 text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-300 ${
                  errors.name
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50"
                    : "border-gray-200 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300"
                } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
                placeholder="Dr. John Smith"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="specialty"
                className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2"
              >
                <span className="text-lg">⚕️</span>
                Specialty *
              </label>
              <select
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                className={`w-full px-5 py-4 rounded-2xl border-2 text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-300 ${
                  errors.specialty
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50"
                    : "border-gray-200 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300"
                } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
              >
                <option value="">Select specialty</option>
                {SPECIALTIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              {errors.specialty && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.specialty}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="photo"
              className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2"
            >
              <span className="text-lg">🖼️</span>
              Photo URL *
            </label>
            <input
              id="photo"
              name="photo"
              type="text"
              value={formData.photo}
              onChange={handleInputChange}
              className={`w-full px-5 py-4 rounded-2xl border-2 text-gray-900 bg-white/80 backdrop-blur-sm transition-all duration-300 ${
                errors.photo
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50"
                  : "border-gray-200 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300"
              } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
              placeholder="https://example.com/photo.jpg"
            />
            {errors.photo && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span>
                {errors.photo}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="bio"
              className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2"
            >
              <span className="text-lg">📝</span>
              Bio *
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Brief description about the dentist..."
              className={`w-full px-5 py-4 text-gray-900 rounded-2xl border-2 bg-white/80 backdrop-blur-sm transition-all duration-300 resize-none ${
                errors.bio
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50"
                  : "border-gray-200 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300"
              } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
              rows={4}
            />
            {errors.bio && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span>
                {errors.bio}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
              <span className="text-lg">📅</span>
              Weekly Schedule *
            </label>

            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day}
                  className="border-2 border-gray-200 rounded-2xl p-4 hover:border-purple-300 transition-colors"
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabledDays.includes(day)}
                      onChange={() => toggleDay(day)}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="font-bold text-gray-900">{day}</span>
                  </label>

                  {enabledDays.includes(day) && (
                    <div className="mt-4 space-y-2 pl-8">
                      {schedule[day].map((time, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="time"
                            value={time}
                            onChange={(e) => updateTimeSlot(day, idx, e.target.value)}
                            className="px-4 py-2 rounded-xl border-2 border-gray-200 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeTimeSlot(day, idx)}
                            className="px-3 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addTimeSlot(day)}
                        className="mt-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors font-medium"
                      >
                        + Add Time Slot
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {errors.schedule && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span>
                {errors.schedule}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
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
              {isSubmitting ? "Adding..." : "Add Dentist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
