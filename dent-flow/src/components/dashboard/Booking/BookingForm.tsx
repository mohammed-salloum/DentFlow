import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import FormField from "../../common/FormField/FormField";
import Button from "../../ui/Button/Button";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { FaCalendarCheck  } from "react-icons/fa";

// ----------------- Types -----------------

/**
 * Define all possible blood types
 */
export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

/**
 * Patient object structure
 */
export interface Patient {
  id: string;
  name: string;
  phone: string;
  bloodType?: BloodType;
  bookingDate: string;
  bookingType: "pre-booked" | "walk-in" | "emergency";
  status: "incoming" | "waiting" | "in-treatment" | "done";
}

/**
 * Props passed to the BookingForm component
 */
interface BookingFormProps {
  onAddPatient: (patient: Patient) => void;
}

/**
 * Structure of the form values managed by react-hook-form
 */
interface FormValues {
  name: string;
  phone: string;
  bloodType?: BloodType;
  bookingDate: string;
  bookingType: "pre-booked" | "walk-in" | "emergency" | "";
}

// ----------------- Constants -----------------

const bloodTypes: BloodType[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const bookingTypes = [
  { value: "pre-booked" },
  { value: "walk-in" },
  { value: "emergency" },
];

// ----------------- Helper Functions -----------------

/**
 * Enum-like type to represent phone validation results
 */
type PhoneValidationResult = "valid" | "invalid" | "prefixError";

/**
 * Validate phone numbers according to general and Syria-specific rules
 */
const validatePhone = (value: string): PhoneValidationResult => {
  if (!value) return "invalid";

  const cleaned = value.replace(/\s+/g, "").replace(/^0+/, ""); // remove spaces and leading zeros

  try {
    const phoneNumber = parsePhoneNumberFromString(
      cleaned.startsWith("+") ? cleaned : `+${cleaned}`
    );

    if (!phoneNumber || !phoneNumber.isValid()) return "invalid";

    // Syria-specific validation
    if (phoneNumber.country === "SY") {
      const national = phoneNumber.nationalNumber;
      const validStarts = ["3", "4", "5", "6", "8", "9"];
      if (national[0] !== "9" || !validStarts.includes(national[1])) return "prefixError";
    }

    return "valid";
  } catch {
    return "invalid";
  }
};

/**
 * ControlledField component to reduce repeated Controller usage
 */
const ControlledField = ({ name, control, ...rest }: any) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => <FormField {...field} {...rest} />}
  />
);

// ----------------- BookingForm Component -----------------

const BookingForm: React.FC<BookingFormProps> = ({ onAddPatient }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const [formMessage, setFormMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  // ----------------- Validation Schema -----------------
  const schema = useMemo(() =>
    yup.object().shape({
      name: yup
        .string()
        .trim()
        .required(t("bookingForm.nameRequired"))
        .test("no-double-spaces", t("bookingForm.nameDoubleSpaces"), (v) => !/\s{2,}/.test(v || ""))
        .test("valid-fullname", t("bookingForm.nameInvalid"), (v) => {
          if (!v) return false;
          const words = v.split(" ").filter(Boolean);
          return words.length >= 2 && words.length <= 4 && words.every(word => /^[\u0621-\u064A A-Za-z]{3,}$/.test(word));
        })
        .max(50, t("bookingForm.max50Chars")),
      phone: yup
        .string()
        .required(t("bookingForm.phoneRequired"))
        .test("phone-valid", "", (v, ctx) => {
          const result = validatePhone(v || "");
          if (result === "valid") return true;
          if (result === "prefixError") return ctx.createError({ message: t("bookingForm.phonePrefixError") });
          return ctx.createError({ message: t("bookingForm.phoneInvalid") });
        }),
      bloodType: yup
        .mixed<BloodType>()
        .oneOf(bloodTypes as any)
        .required(t("bookingForm.bloodTypeRequired")),
      bookingDate: yup
        .string()
        .required(t("bookingForm.dateRequired"))
        .test("future-date", t("bookingForm.dateFuture"), (value) => {
          if (!value) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return new Date(value) >= today;
        }),
      bookingType: yup
        .mixed<"pre-booked" | "walk-in" | "emergency">()
        .oneOf(["pre-booked", "walk-in", "emergency"], t("bookingForm.bookingTypeRequired"))
        .required(t("bookingForm.bookingTypeRequired")),
    }),
    [t]
  );

  // ----------------- React Hook Form -----------------
  const { register, handleSubmit, control, formState: { errors, isSubmitting, touchedFields }, reset, trigger } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone: "",
      bloodType: undefined,
      bookingDate: "",
      bookingType: "",
    },
  });

  // Trigger validation when language changes (for translated error messages)
  useEffect(() => { trigger(); }, [i18n.language, trigger]);

  // Clear form messages automatically after 4 seconds
  useEffect(() => {
    if (!formMessage) return;
    const timer = setTimeout(() => setFormMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [formMessage]);

  // ----------------- Form Submission Handler -----------------
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const newPatient: Patient = {
      id: crypto.randomUUID(),
      name: data.name,
      phone: data.phone,
      bloodType: data.bloodType,
      bookingDate: data.bookingDate,
      bookingType: data.bookingType as "pre-booked" | "walk-in" | "emergency",
      status: "incoming",
    };

    onAddPatient(newPatient);
    setFormMessage({ type: "success", text: t("bookingForm.successMessage") });
    reset();
  };

  // ----------------- Booking Type Options with Translations -----------------
  const bookingOptions = useMemo(
    () =>
      bookingTypes.map(b => ({
        label: t(`bookingForm.bookingType.${b.value === "pre-booked" ? "preBooked" : b.value === "walk-in" ? "walkIn" : "emergency"}`),
        value: b.value
      })),
    [t]
  );

  // ----------------- Render -----------------
  return (
    <div className={`booking-form-card mb-4 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="card-body">
        {/* Form Header */}
        <div className="booking-form-header">
          <h5>
            <span className="icon-wrapper"><FaCalendarCheck  /></span>
            {t("bookingForm.title")}
          </h5>
          <p>{t("bookingForm.subText")}</p>
        </div>

        {/* Form Fields */}
        <form
          onSubmit={handleSubmit(
            onSubmit,
            () => setFormMessage({ type: "error", text: t("bookingForm.errorMessage") })
          )}
        >
          {/* Name Field */}
          <FormField
            name="name"
            label={t("bookingForm.nameLabel")}
            placeholder={t("bookingForm.namePlaceholder")}
            register={register}
            error={errors.name}
            touched={!!touchedFields.name}
            isRTL={isRTL}
          />

          {/* Phone Field */}
          <ControlledField
            name="phone"
            control={control}
            type="phone"
            label={t("bookingForm.phoneLabel")}
            placeholder={t("bookingForm.phonePlaceholder")}
            error={errors.phone}
            touched={!!touchedFields.phone}
            isRTL={isRTL}
          />

          {/* Blood Type Field */}
          <ControlledField
            name="bloodType"
            control={control}
            type="select"
            label={t("bookingForm.bloodTypeLabel")}
            placeholder={t("bookingForm.bloodTypePlaceholder")}
            options={bloodTypes.map(bt => ({ label: bt, value: bt }))}
            error={errors.bloodType}
            touched={!!touchedFields.bloodType}
            isRTL={isRTL}
          />

          {/* Booking Date Field */}
          <ControlledField
            name="bookingDate"
            control={control}
            type="date"
            label={t("bookingForm.dateLabel")}
            placeholder={t("bookingForm.datePlaceholder")}
            error={errors.bookingDate}
            touched={!!touchedFields.bookingDate}
            isRTL={isRTL}
          />

          {/* Booking Type Field */}
          <ControlledField
            name="bookingType"
            control={control}
            type="select"
            label={t("bookingForm.bookingTypeLabel")}
            placeholder={t("bookingForm.bookingTypePlaceholder")}
            options={bookingOptions}
            error={errors.bookingType}
            touched={!!touchedFields.bookingType}
            isRTL={isRTL}
          />

          {/* Form Messages */}
          {formMessage && (
            <div className={`field-message ${formMessage.type === "error" ? "error" : "success"} text-center mt-3`}>
              {formMessage.text}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
            className="mt-3"
          >
            {isSubmitting ? t("bookingForm.submitting") : t("bookingForm.submitButton")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;