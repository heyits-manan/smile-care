// /data/dentists.ts
export type Dentist = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  photo: string;
  bio: string;
  availableSlots: Record<string, string[]>; // e.g. { "2025-09-12": ["09:30","10:30"] }
};

export const dentists: Dentist[] = [
  {
    id: "d1",
    name: "Dr. Asha Rai",
    specialty: "Orthodontist",
    rating: 4.8,
    photo:
      "https://ui-avatars.com/api/?name=Asha+Rai&background=0D8ABC&color=fff",
    bio: "Dr. Asha Rai has 10+ years of experience in orthodontics, specializing in braces and clear aligners.",
    availableSlots: {
      "2025-09-02": ["09:30", "10:30", "14:00"],
      "2025-09-23": ["11:00", "15:00"],
      "2025-09-14": ["10:00", "13:30"],
    },
  },
  {
    id: "d2",
    name: "Dr. Kiran Sharma",
    specialty: "General Dentist",
    rating: 4.6,
    photo:
      "https://ui-avatars.com/api/?name=Kiran+Sharma&background=F39C12&color=fff",
    bio: "General dentist focusing on preventive care, fillings, and routine checkups for all ages.",
    availableSlots: {
      "2025-09-12": ["10:00", "11:30", "16:00"],
      "2025-11-13": ["09:00", "13:00"],
      "2025-12-14": ["10:30", "15:30"],
    },
  },
  {
    id: "d3",
    name: "Dr. Meera Joshi",
    specialty: "Endodontist",
    rating: 4.9,
    photo:
      "https://ui-avatars.com/api/?name=Meera+Joshi&background=27AE60&color=fff",
    bio: "Expert in root canal treatments and saving natural teeth with advanced endodontic procedures.",
    availableSlots: {
      "2025-02-12": ["09:00", "12:30", "15:00"],
      "2025-08-13": ["10:30", "14:30"],
      "2025-010-14": ["09:00", "12:00", "16:00"],
    },
  },
  {
    id: "d4",
    name: "Dr. Rajan Thapa",
    specialty: "Pediatric Dentist",
    rating: 4.7,
    photo:
      "https://ui-avatars.com/api/?name=Rajan+Thapa&background=8E44AD&color=fff",
    bio: "Specialized in providing gentle, friendly dental care for children of all ages.",
    availableSlots: {
      "2025-09-12": ["09:30", "11:00", "14:30"],
      "2025-09-13": ["10:00", "12:30"],
      "2025-09-14": ["09:30", "11:30", "15:00"],
    },
  },
  {
    id: "d5",
    name: "Dr. Sneha Shrestha",
    specialty: "Prosthodontist",
    rating: 4.5,
    photo:
      "https://ui-avatars.com/api/?name=Sneha+Shrestha&background=E74C3C&color=fff",
    bio: "Experienced in dental implants, crowns, and full-mouth rehabilitations.",
    availableSlots: {
      "2025-09-12": ["10:00", "13:00", "16:00"],
      "2025-09-13": ["09:30", "11:30"],
      "2025-09-14": ["10:00", "12:30", "14:30"],
    },
  },
  {
    id: "d6",
    name: "Dr. Prakash Lama",
    specialty: "Periodontist",
    rating: 4.4,
    photo:
      "https://ui-avatars.com/api/?name=Prakash+Lama&background=34495E&color=fff",
    bio: "Focused on gum care, periodontal surgery, and preventing advanced gum disease.",
    availableSlots: {
      "2025-09-12": ["09:00", "12:00", "15:30"],
      "2025-09-13": ["10:00", "13:00"],
      "2025-09-14": ["11:00", "14:00", "16:00"],
    },
  },
];
