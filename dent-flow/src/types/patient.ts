/* ==============================
   Booking Types
   Defines how a patient booked their appointment
============================== */
export type BookingType = 
  | 'pre-booked'   // Patient booked via phone or online
  | 'walk-in'      // Patient came directly without prior booking
  | 'emergency';   // Emergency case requiring immediate attention

/* ==============================
   Patient Status
   Represents patient flow inside the clinic
============================== */
export type PatientStatus =
  | 'incoming'       // Patient not yet arrived
  | 'waiting'        // Patient waiting in the clinic
  | 'in-treatment'   // Patient is currently being treated
  | 'done';          // Treatment completed

/* ==============================
   Patient Interface
   Main entity representing a patient record
============================== */
export interface Patient {
  id: string;                // Unique patient identifier
  name: string;              // Full name
  phone: string;             // Contact number
  bloodType?: string;        // Optional: blood type
  bookingDate: string;       // Appointment date in ISO format
  bookingType: BookingType;  // Type of booking
  status: PatientStatus;     // Current status in clinic workflow
}