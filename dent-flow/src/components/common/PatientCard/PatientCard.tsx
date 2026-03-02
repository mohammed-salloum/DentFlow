import type { Patient } from '../../../types/patient';
import { FaUser, FaPhone, FaCalendarAlt, FaHeartbeat, FaBookmark } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button/Button';
import './PatientCard.css';

// ---------------------------------------------
// Type: ButtonVariant
// Matches the allowed variant prop of Button component
// ---------------------------------------------
type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "danger-outline" | "ghost";

// ---------------------------------------------
// Props for PatientCard component
// ---------------------------------------------
interface PatientCardProps {
  patient: Patient; // Patient data object
  onUpdateStatus: (id: string, newStatus: Patient['status']) => void; // Callback to update patient status
  onOpenDeleteModal?: (patient: Patient) => void; // Optional callback for opening delete confirmation modal
}

// ---------------------------------------------
// Utility: Format international phone numbers
// Ensures '+' prefix and groups digits for readability
// ---------------------------------------------
const formatPhone = (phone: string) => {
  let cleaned = phone.replace(/[^\d+]/g, ''); // Remove all non-digit/non-plus characters
  if (!cleaned.startsWith('+')) cleaned = '+' + cleaned; // Ensure '+' at start

  // Extract country code and the rest of the number
  const match = cleaned.match(/^(\+\d{1,3})(\d+)/);
  if (!match) return phone;

  const countryCode = match[1];
  let number = match[2];
  const chunks: string[] = [];

  // Split the rest of the number into groups of 3 digits for readability
  while (number.length > 4) {
    chunks.push(number.slice(0, 3));
    number = number.slice(3);
  }
  if (number) chunks.push(number);

  return [countryCode, ...chunks].join(' ');
};

// ---------------------------------------------
// Utility: Map internal booking types to translation keys
// Ensures consistent i18n keys for different booking types
// ---------------------------------------------
const bookingTypeKey = (type: Patient['bookingType']) => {
  switch (type) {
    case 'pre-booked': return 'preBooked';
    case 'walk-in': return 'walkIn';
    case 'emergency': return 'emergency';
    default: return type; // Return as-is for unknown types
  }
};

// ---------------------------------------------
// Utility: Capitalize first letter of each word
// Useful for English display of labels
// ---------------------------------------------
const capitalizeWords = (str: string) => str.replace(/\b\w/g, char => char.toUpperCase());

// ---------------------------------------------
// PatientCard Component
// Displays detailed patient information along with context-aware action buttons
// ---------------------------------------------
const PatientCard: React.FC<PatientCardProps> = ({ patient, onUpdateStatus, onOpenDeleteModal }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl'; // Detect RTL languages

  // ---------------------------------------------
  // Define dynamic action buttons based on patient status
  // Each button includes a label, variant, and action callback
  // ---------------------------------------------
  const actionsByStatus: { label: string; variant: ButtonVariant; action: () => void }[] = [];

  if (patient.status === 'incoming') {
    // Action: Move patient from incoming to waiting
    actionsByStatus.push({
      label: t('patientCard.moveToWaiting'),
      variant: 'primary',
      action: () => onUpdateStatus(patient.id, 'waiting'),
    });

    // Action: Cancel booking (available if modal handler provided)
    if (onOpenDeleteModal) {
      actionsByStatus.push({
        label: t('patientCard.cancelBooking'),
        variant: 'danger-outline',
        action: () => onOpenDeleteModal(patient),
      });
    }
  } else if (patient.status === 'waiting') {
    // Action: Start treatment for waiting patient
    actionsByStatus.push({
      label: t('patientCard.startTreatment'),
      variant: 'success',
      action: () => onUpdateStatus(patient.id, 'in-treatment'),
    });
  } else if (patient.status === 'in-treatment') {
    // Action: Finish treatment for in-treatment patient
    actionsByStatus.push({
      label: t('patientCard.finishTreatment'),
      variant: 'secondary',
      action: () => onUpdateStatus(patient.id, 'done'),
    });
  } else if (patient.status === 'done' && onOpenDeleteModal) {
    // Action: Delete completed patient (requires delete modal)
    actionsByStatus.push({
      label: t('patientCard.deletePatient'),
      variant: 'danger-outline',
      action: () => onOpenDeleteModal(patient),
    });
  }

  return (
    <div className="patient-card" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top colored status bar indicating patient status */}
      <div className={`status-bar ${patient.status}`} />

      {/* Patient Information Section */}
      <div className="patient-info">
        {/* Name Header */}
        <div className="header">
          <FaUser className="icon" />
          <h4>{patient.name}</h4>
        </div>

        {/* Phone Number */}
        <div className="info-row">
          <FaPhone className="icon subtle" />
          <a href={`tel:${patient.phone.replace(/\s+/g, '')}`} className="phone-link" dir="ltr">
            {formatPhone(patient.phone)}
          </a>
        </div>

        {/* Booking Date */}
        <div className="info-row">
          <FaCalendarAlt className="icon subtle" />
          <span>{patient.bookingDate}</span>
        </div>

        {/* Booking Type */}
        <div className="info-row">
          <FaBookmark className="icon subtle" />
          <span className="booking-badge">
            {patient.bookingType
              ? i18n.language === 'en'
                ? capitalizeWords(t(`bookingForm.bookingType.${bookingTypeKey(patient.bookingType)}`))
                : t(`bookingForm.bookingType.${bookingTypeKey(patient.bookingType)}`)
              : 'N/A'}
          </span>
        </div>

        {/* Blood Type */}
        <div className="info-row">
          <FaHeartbeat className="icon subtle" />
          <span className="blood-badge" dir="ltr">
            {patient.bloodType || 'N/A'}
          </span>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="card-actions">
        {actionsByStatus.map((btn, idx) => (
          <Button key={idx} variant={btn.variant} onClick={btn.action}>
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PatientCard;