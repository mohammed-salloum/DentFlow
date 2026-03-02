import { useTranslation } from "react-i18next";
import BookingForm from "../../components/dashboard/Booking/BookingForm";
import PatientsBoard from "../../components/dashboard/Patients/PatientsBoard";
import PatientsToolbar from "../../components/dashboard/Patients/PatientsToolbar";
import AppBrand from "../../components/common/AppBrand/AppBrand";
import type { Patient } from "../../types/patient";
import { usePersistedState } from "../../hooks/usePersistedState";
import "./Dashboard.css";

/**
 * Dashboard Component
 * Main SPA view for managing patients and bookings.
 *
 * Features:
 * - Persistent state for patients, search query, and status filter
 * - Filtering by status and search
 * - Add, update, cancel, delete patients
 * - Automatic RTL support for Arabic
 */
export default function Dashboard() {
  const { t, i18n } = useTranslation(); // Translation hook
  const isRTL = i18n.language === "ar"; // Determine RTL layout

  /* -----------------------------
     Persistent State
     Using custom hook usePersistedState for localStorage persistence.
     This ensures that patients, search, and status filter remain after reload.
  ----------------------------- */
  const [patients, setPatients] = usePersistedState<Patient[]>("patients", []);
  const [search, setSearch] = usePersistedState("dashboard_search", "");
  const [selectedStatus, setSelectedStatus] =
    usePersistedState<Patient["status"] | "all">("dashboard_status", "all");

  /* -----------------------------
     Handlers
     Functions to manage patients state
  ----------------------------- */

  // Add a new patient to the list
  const handleAddPatient = (patient: Patient) => {
    setPatients((prev) => [...prev, patient]);
  };

  // Update a patient's status
  const handleUpdateStatus = (id: string, newStatus: Patient["status"]) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  // Cancel a booking (removes patient)
  const handleCancelBooking = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  // Delete a patient permanently
  const handleDeletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  /* -----------------------------
     Filter patients for display
     Combines status filter and search query
     Only patients matching both criteria will appear
  ----------------------------- */
  const filteredPatients = patients.filter((patient) => {
    const matchesStatus =
      selectedStatus === "all" || patient.status === selectedStatus;

    const matchesSearch =
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.phone.includes(search);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="dashboard-layout" dir={isRTL ? "rtl" : "ltr"}>
      {/* Left Column: Brand + Booking Form */}
      <div className="dashboard-form-column">
        {/* ===== Brand ===== */}
        <div className="dashboard-brand-wrapper">
          <AppBrand /> {/* Company/app logo */}
        </div>

        <hr className="dashboard-divider" />

        {/* ===== Booking Form ===== */}
        <div className="dashboard-form-wrapper">
          <BookingForm onAddPatient={handleAddPatient} /> {/* Form to add new patients */}
        </div>

        <hr className="dashboard-divider" />
      </div>

      {/* Vertical Divider */}
      <div className="vertical-divider"></div>

      {/* Right Column: Toolbar + Patients Board */}
      <div className="dashboard-dashboard-column">
        {/* Dashboard Title */}
        <div className="dashboard-title">
          <h2>{t("dashboard.title")}</h2>
          <p>{t("dashboard.subtitle")}</p>
        </div>

        {/* Toolbar: Search, Status Filters, Language, Settings */}
        <div className="dashboard-header">
          <PatientsToolbar
            patients={patients} // Full patient list for stats
            selectedStatus={selectedStatus} // Currently selected filter
            onStatusChange={setSelectedStatus} // Updates filter state
            search={search} // Current search query
            onSearchChange={setSearch} // Updates search state
          />
        </div>

        {/* Patients Board: Displays filtered patients */}
        <PatientsBoard
          patients={filteredPatients} // Uses filtered results
          selectedStatus={selectedStatus} // Status filter for visual highlights
          onUpdateStatus={handleUpdateStatus} // Handler to change status
          onCancelBooking={handleCancelBooking} // Handler to cancel bookings
          onDeletePatient={handleDeletePatient} // Handler to delete patient
        />
      </div>
    </div>
  );
}