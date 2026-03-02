import React, { useState, useRef, useEffect } from "react";
import type { Patient } from "../../../types/patient";
import Settings from "../../modals/Settings/Settings";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaSearch,
  FaUserCircle,
  FaCog,
  FaGlobe,
  FaUsers,
  FaHourglassHalf,
  FaChair,
  FaStethoscope,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaSignOutAlt,
  FaTimes,
  FaSyncAlt,
} from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
import "./PatientsToolbar.css";

// ---------------------------------------------
// Type for active dropdown/modal in toolbar
// ---------------------------------------------
type ActiveModal = "settings" | "language" | "notifications" | "user" | null;

// ---------------------------------------------
// Props for PatientsToolbar component
// ---------------------------------------------
interface PatientsToolbarProps {
  patients: Patient[];                                // Array of all patients
  selectedStatus: "all" | Patient["status"];          // Current status filter
  onStatusChange: (status: "all" | Patient["status"]) => void; // Callback to change status filter
  search: string;                                     // Current search input
  onSearchChange: (value: string) => void;           // Callback to update search input
}

// ---------------------------------------------
// PatientsToolbar Component
// Toolbar for patient board with search, filters, language & settings dropdowns
// ---------------------------------------------
const PatientsToolbar: React.FC<PatientsToolbarProps> = ({
  patients,
  selectedStatus,
  onStatusChange,
  search,
  onSearchChange,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang: currentLang } = useParams();

  // Active modal/dropdown state
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // Refs for detecting clicks outside dropdowns
  const userDropdownRef = useRef<HTMLDivElement | null>(null);
  const langDropdownRef = useRef<HTMLDivElement | null>(null);

  // Refresh animation state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ---------------------------------------------
  // Status metadata: icon, label, and color class for toolbar stats
  // ---------------------------------------------
  const statuses = [
    { key: "all", label: t("patientsToolbar.status.all"), icon: FaUsers, colorClass: "status-all" },
    { key: "incoming", label: t("patientsToolbar.status.incoming"), icon: FaHourglassHalf, colorClass: "status-incoming" },
    { key: "waiting", label: t("patientsToolbar.status.waiting"), icon: FaChair, colorClass: "status-waiting" },
    { key: "in-treatment", label: t("patientsToolbar.status.inTreatment"), icon: FaStethoscope, colorClass: "status-inTreatment" },
    { key: "done", label: t("patientsToolbar.status.done"), icon: FaCheck, colorClass: "status-done" },
  ];

  // ---------------------------------------------
  // Count patients by status and search filter
  // ---------------------------------------------
  const countByStatus = (status: string) =>
    patients.filter((p) => {
      const matchesStatus = status === "all" || p.status === status;
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.phone.includes(search);
      return matchesStatus && matchesSearch;
    }).length;

  const isFiltered = search || selectedStatus !== "all";

  // ---------------------------------------------
  // Close dropdowns if click occurs outside
  // ---------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setActiveModal((prev) => (prev === "user" ? null : prev));
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setActiveModal((prev) => (prev === "language" ? null : prev));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------------------------------------
  // Switch language and navigate
  // ---------------------------------------------
  const switchLanguage = (newLang: "ar" | "en") => {
    if (newLang === currentLang) return;
    navigate(`/${newLang}`);
    setActiveModal(null); // Close language dropdown
  };

  return (
    <div className="patients-toolbar">
      {/* Top toolbar: Search and refresh */}
      <div className="toolbar-top">
        <div className="search-wrapper">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={t("patientsToolbar.searchPlaceholder")}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="toolbar-input"
            />
            {search && (
              <FaTimes
                className="clear-search"
                onClick={() => onSearchChange("")} // Clear search input
              />
            )}
          </div>

          {/* Refresh button clears filters */}
          <div
            className={`refresh-icon-wrapper ${!isFiltered ? "hidden" : ""}`}
            title={t("patientsToolbar.clearFilters")}
            onClick={() => {
              setIsRefreshing(true);
              setTimeout(() => setIsRefreshing(false), 1000); // Animate refresh
              onSearchChange("");
              onStatusChange("all");
            }}
          >
            <FaSyncAlt
              className={`refresh-icon ${isRefreshing ? "spin" : ""}`}
              size={20}
            />
          </div>
        </div>

        {/* Toolbar action icons */}
        <div className="toolbar-icons">
          {/* Settings modal */}
          <div
            className="icon-tooltip toolbar-icon"
            title={t("patientsToolbar.settings")}
            onClick={() =>
              setActiveModal(activeModal === "settings" ? null : "settings")
            }
          >
            <FaCog size={24} />
          </div>

          {/* User dropdown */}
          <div className="icon-tooltip toolbar-icon" title={t("patientsToolbar.account")}>
            <FaUserCircle
              size={24}
              onClick={() =>
                setActiveModal(activeModal === "user" ? null : "user")
              }
            />
            {activeModal === "user" && (
              <div className="user-dropdown" ref={userDropdownRef}>
                <button>
                  <FaUserCircle className="dropdown-icon" /> {t("patientsToolbar.user.profile")}
                </button>
                <button>
                  <FaCog className="dropdown-icon" /> {t("patientsToolbar.user.settings")}
                </button>
                <button>
                  <FaSignOutAlt className="dropdown-icon" /> {t("patientsToolbar.user.logout")}
                </button>
              </div>
            )}
          </div>

          {/* Language dropdown */}
          <div className="icon-tooltip toolbar-icon" title={t("patientsToolbar.language")}>
            <button
              className="lang-btn"
              onClick={() =>
                setActiveModal(activeModal === "language" ? null : "language")
              }
            >
              <FaGlobe size={24} color="currentColor" />
              <span className="lang-short">{i18n.language.toUpperCase()}</span>
              {activeModal === "language" ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>

            {activeModal === "language" && (
              <div className="user-dropdown lang-dropdown" ref={langDropdownRef}>
                {i18n.language !== "ar" && (
                  <button onClick={() => switchLanguage("ar")}>
                    <ReactCountryFlag countryCode="AE" svg className="flag-icon" />{" "}
                    {t("patientsToolbar.lang.ar")}
                  </button>
                )}
                {i18n.language !== "en" && (
                  <button onClick={() => switchLanguage("en")}>
                    <ReactCountryFlag countryCode="GB" svg className="flag-icon" />{" "}
                    {t("patientsToolbar.lang.en")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Results Info */}
      <div className={`search-results-info ${!search ? "empty" : ""}`}>
        {search &&
          (countByStatus(selectedStatus) > 0 ? (
            <span>
              {t("patientsToolbar.resultsFound", {
                count: countByStatus(selectedStatus),
              })}
            </span>
          ) : (
            <span className="no-results">{t("patientsToolbar.noResults")}</span>
          ))}
      </div>

      {/* Status statistics cards */}
      <div className="stats-container">
        {statuses.map((status) => {
          const Icon = status.icon;
          return (
            <div
              key={status.key}
              className={`stat-card ${selectedStatus === status.key ? "active" : ""}`}
              onClick={() => onStatusChange(status.key as any)}
            >
              <span className={`stat-badge ${status.colorClass}`}>
                {countByStatus(status.key)}
              </span>
              <Icon size={28} className="stat-icon" />
              <p>{status.label}</p>
            </div>
          );
        })}
      </div>

      {/* Settings modal */}
      {activeModal === "settings" && <Settings onClose={() => setActiveModal(null)} />}
    </div>
  );
};

export default PatientsToolbar;