export interface Appointment {
  id: string;
  dentistId: string;
  dentistName: string;
  patientName: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  notes?: string;
  createdAt: string;
}

export interface BookingFormData {
  patientName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  notes: string;
}
