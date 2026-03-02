import { useState, useEffect, useMemo } from 'react';
import type { Patient } from '../../../types/patient';
import { useTranslation } from 'react-i18next';
import { FaHourglassHalf, FaChair, FaStethoscope, FaCheck } from 'react-icons/fa';
import PatientCard from '../../common/PatientCard/PatientCard';
import ConfirmationModal from '../../common/ConfirmationModal/ConfirmationModal';
import './PatientsBoard.css';

// ---------------------------------------------
// Props for PatientsBoard component
// ---------------------------------------------
interface PatientsBoardProps {
  patients: Patient[];                                 // Array of all patients
  selectedStatus: 'all' | Patient['status'];           // Filter for a specific status or show all
  onUpdateStatus: (id: string, newStatus: Patient['status']) => void; // Callback to update patient status
  onCancelBooking?: (id: string) => void;             // Optional callback to cancel a pre-booked appointment
  onDeletePatient?: (id: string) => void;             // Optional callback to delete a patient record
}

// Type for modal state, tracking patient and modal action type
type ModalState = { patient: Patient; type: 'delete' | 'cancel' } | null;

// Utility: Convert kebab-case strings to camelCase
const kebabToCamel = (str: string) =>
  str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

// ---------------------------------------------
// PatientsBoard Component
// Renders patient columns by status with optional filter and confirmation modals
// ---------------------------------------------
const PatientsBoard: React.FC<PatientsBoardProps> = ({
  patients,
  selectedStatus,
  onUpdateStatus,
  onCancelBooking,
  onDeletePatient,
}) => {
  const { t } = useTranslation();

  // State for currently active confirmation modal
  const [modalState, setModalState] = useState<ModalState>(null);

  // ---------------------------------------------
  // Prevent body scroll when modal is open
  // ---------------------------------------------
  useEffect(() => {
    if (modalState) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [modalState]);

  // ---------------------------------------------
  // Statuses metadata (icon + label) memoized for i18n
  // ---------------------------------------------
  const statuses = useMemo(() => {
    const list = [
      { key: 'incoming', icon: FaHourglassHalf },
      { key: 'waiting', icon: FaChair },
      { key: 'in-treatment', icon: FaStethoscope },
      { key: 'done', icon: FaCheck },
    ];

    // Return as an object keyed by status for easy lookup
    return Object.fromEntries(
      list.map(s => [
        s.key,
        { ...s, label: t(`patientsBoard.${kebabToCamel(s.key)}`) },
      ])
    );
  }, [t]);

  // Status ordering for board layout
  const topStatuses: Patient['status'][] = ['incoming', 'waiting', 'in-treatment'];
  const bottomStatuses: Patient['status'][] = ['done'];

  // Filter patients by status
  const filterByStatus = (status: Patient['status']) =>
    patients.filter(p => p.status === status);

  // ---------------------------------------------
  // Render a column for a specific patient status
  // ---------------------------------------------
  const renderStatusColumn = (statusKey: Patient['status']) => {
    const status = statuses[statusKey];
    const list = filterByStatus(statusKey);
    const Icon = status.icon;

    return (
      <div className="patients-board-col" key={statusKey}>
        {/* Status header with icon and label */}
        <div className="status-header">
          <Icon className={`status-icon ${statusKey}`} />
          <h5>{status.label}</h5>

          {/* Display message if no patients exist in this status */}
          {list.length === 0 && (
            <p className="no-patients">
              {t('patientsBoard.noPatients')}
            </p>
          )}
        </div>

        {/* Render patient cards if any */}
        {list.length > 0 && (
          <div className="patients-grid">
            {list.map(patient => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onUpdateStatus={onUpdateStatus}
                onOpenDeleteModal={() => {
                  // Determine modal type based on booking type
                  const type =
                    patient.bookingType === 'pre-booked'
                      ? 'cancel'
                      : 'delete';
                  setModalState({ patient, type });
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // ---------------------------------------------
  // Render multiple status columns (top or bottom row)
  // Applies filter if a specific status is selected
  // ---------------------------------------------
  const renderStatusRow = (statusesList: Patient['status'][]) =>
    statusesList
      .filter(status => selectedStatus === 'all' || selectedStatus === status)
      .map(renderStatusColumn);

  const isSingleFilter = selectedStatus !== 'all';

  return (
    <div className="patients-board-container">
      {/* Top section: incoming, waiting, in-treatment */}
      <div
        className={`patients-board-row top-section ${
          isSingleFilter ? 'single-filter' : 'no-wrap'
        }`}
      >
        {renderStatusRow(topStatuses)}
      </div>

      {/* Divider between top and bottom sections */}
      <hr className="patients-board-divider" />

      {/* Bottom section: done */}
      <div
        className={`patients-board-row bottom-section ${
          isSingleFilter ? 'single-filter' : ''
        }`}
      >
        {renderStatusRow(bottomStatuses)}
      </div>

      {/* Confirmation Modal for cancel or delete actions */}
      {modalState && (
        <ConfirmationModal
          isOpen={true}
          type={modalState.type}
          name={modalState.patient.name}
          onCancel={() => setModalState(null)}
          onConfirm={() => {
            if (modalState.type === 'cancel')
              onCancelBooking?.(modalState.patient.id);
            else
              onDeletePatient?.(modalState.patient.id);

            setModalState(null); // Close modal after action
          }}
        />
      )}
    </div>
  );
};

export default PatientsBoard;