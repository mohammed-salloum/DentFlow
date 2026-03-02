import React from 'react';
import { useTranslation } from 'react-i18next';
import { IoClose } from 'react-icons/io5';
import Button from '../../ui/Button/Button';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean; // Controls whether the modal is visible
  type: 'delete' | 'cancel'; // Determines modal purpose (deletion or cancellation)
  name: string; // Name of the entity (e.g., patient or booking) being acted upon
  onCancel: () => void; // Callback for closing the modal without confirming
  onConfirm: () => void; // Callback for confirming the action
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  type,
  name,
  onCancel,
  onConfirm,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar'; // Determine RTL layout for Arabic or other RTL languages

  // Do not render the modal if `isOpen` is false
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onCancel} // Close modal when clicking outside the content
      role="dialog"
      aria-modal="true" // Accessibility: informs assistive tech this is a modal
    >
      <div
        className={`modal-content ${isRTL ? 'rtl' : 'ltr'}`}
        onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing modal
      >
        {/* Modal Header */}
        <div className="modal-header">
          <h5>
            {type === 'cancel'
              ? t('confirmationModal.confirmCancellation') // Dynamic header for cancellation
              : t('confirmationModal.confirmDeletion')}
          </h5>
          {/* Close button using IoClose icon */}
          <button
            className="modal-close-btn"
            onClick={onCancel}
            aria-label={t('confirmationModal.cancel')} // Accessible label for screen readers
          >
            <IoClose className="close-icon" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <p>
            {type === 'cancel'
              ? t('confirmationModal.cancelBookingText', { name })
              : t('confirmationModal.deletePatientText', { name })}
          </p>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          {/* Cancel button: secondary variant */}
          <Button variant="secondary" onClick={onCancel}>
            {t('confirmationModal.cancel')}
          </Button>
          {/* Confirm button: danger variant for destructive actions */}
          <Button variant="danger" onClick={onConfirm}>
            {t('confirmationModal.confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;