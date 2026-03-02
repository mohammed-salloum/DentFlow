import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { FieldError, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import "./FormField.css";

interface Option {
  label: string;
  value: string;
}

interface FormFieldProps {
  label: string; // Field label text
  name: string; // Unique field name
  placeholder?: string; // Placeholder text
  register?: UseFormRegister<any>; // react-hook-form registration
  error?: FieldError | undefined; // Field error object
  successMessage?: string; // Message to show on successful input
  type?: "text" | "email" | "phone" | "select" | "date"; // Input type
  required?: boolean; // Marks field as required
  options?: Option[]; // Options for select input
  value?: string | null; // Controlled input value
  onChange?: (value: string) => void; // Callback for value changes
  onBlur?: () => void; // Callback for blur events
  isRTL?: boolean; // Right-to-left layout flag
  touched?: boolean; // Indicates if field has been interacted with
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  placeholder,
  register,
  name,
  error,
  successMessage,
  type = "text",
  required = false,
  options,
  value,
  onChange,
  onBlur,
  isRTL = false,
  touched = false,
}) => {
  const { t } = useTranslation();
  const showError = Boolean(error && touched); // Only show error if touched
  const isBloodType = name === "bloodType"; // Special handling for blood type select

  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Show success message temporarily when input is valid and touched
  useEffect(() => {
    if (!showError && touched && value?.toString().trim() !== "") {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 4000); // Hide after 4 seconds
      return () => clearTimeout(timer);
    } else {
      setShowSuccess(false);
    }
  }, [value, touched, showError]);

  // Compose dynamic className for input based on error, success, and RTL/LTR
  const inputClass = `
    form-input
    ${showError ? "error-border" : ""}
    ${showSuccess ? "success-border" : ""}
    ${isRTL ? "rtl-input" : "ltr-input"}
  `;

  return (
    <div className={`form-field-wrapper ${isRTL ? "rtl" : "ltr"}`}>
      {/* Field label */}
      <label className={required ? "required" : ""}>{label}</label>

      <div className="field-wrapper">
        {/* ===== Phone Input ===== */}
        {type === "phone" ? (
          <PhoneInput
            country="ae"
            value={value || ""}
            onChange={onChange || (() => {})}
            onBlur={onBlur}
            inputProps={{
              name,
              dir: isRTL ? "rtl" : "ltr", // Adjust input direction based on language
              autoComplete: "off",
            }}
            placeholder={placeholder}
            containerClass="phone-container"
            inputClass={inputClass}
            buttonClass="flag-dropdown"
            specialLabel="" // Remove default country label
          />
        ) : type === "select" && options ? (
          /* ===== Select Input ===== */
          <select
            value={value || ""}
            onChange={(e) => onChange && onChange(e.target.value)}
            onBlur={onBlur}
            className={inputClass}
            dir={isRTL ? "rtl" : "ltr"} // Adjust select direction
          >
            {/* Placeholder option */}
            <option value="" disabled>
              {placeholder}
            </option>

            {/* Render options dynamically */}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                dir={isBloodType ? "ltr" : undefined} // Blood type values always LTR
              >
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === "date" ? (
          /* ===== Date Picker ===== */
          <DatePicker
            selected={value ? new Date(value) : null}
            onChange={(date: Date | null) =>
              onChange &&
              onChange(date ? date.toISOString().split("T")[0] : "")
            }
            onBlur={onBlur}
            placeholderText={placeholder || "YYYY-MM-DD"}
            className={inputClass}
            dateFormat="yyyy-MM-dd"
            wrapperClassName="datepicker-wrapper"
            calendarClassName="datepicker-calendar"
          />
        ) : (
          /* ===== Default Input (text, email, etc.) ===== */
          <input
            {...(register ? register(name) : {})} // Integrate with react-hook-form if provided
            type={type}
            placeholder={placeholder}
            className={inputClass}
            dir={isRTL ? "rtl" : "ltr"} // Adjust input direction
          />
        )}

        {/* ===== Error / Success Messages ===== */}
        <div className="field-message">
          {showError && <div className="error">{t(error?.message || "")}</div>}
          {showSuccess && successMessage && (
            <div className="success">{t(successMessage)}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormField;