import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Button.css";

/* ================================
   Button Component Props
   --------------------------------
   Defines the accepted props for the Button component:
   - children: content inside the button
   - variant: styling variant (primary, secondary, success, etc.)
   - fullWidth: whether the button should span full container width
   - disabled: disables interaction
   - to: optional link URL, renders a <Link> if provided
   - onClick: callback when button is clicked
   - className: additional custom classes
   - type: HTML button type (button, submit, reset)
================================ */
type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger" | "danger-outline" | "ghost";
  fullWidth?: boolean;
  disabled?: boolean;
  to?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
};

/* ================================
   Button Component
   --------------------------------
   Handles both <button> and <Link> rendering.
   Supports:
   - Localization (RTL support)
   - Dynamic variants and styles
   - Disabled state management
================================ */
export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  to,
  onClick,
  className = "",
  type = "button",
}: ButtonProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const isRTL = lang === "ar"; // Right-to-left support

  /* ================================
     Compute CSS classes
     --------------------------------
     Dynamically builds the button's class string based on:
     - variant
     - fullWidth
     - disabled
     - any additional classes passed via props
  ================================= */
  const classes = [
    "btn",
    `btn-${variant}`,
    fullWidth && "full-width",
    disabled && "disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Disable click handler if button is disabled
  const handleClick = disabled ? undefined : onClick;

  /* ================================
     Render Link if `to` prop is provided
     --------------------------------
     - Uses React Router <Link> for internal navigation
     - Automatically localizes the URL with current language
     - Disabled links point to "#" and prevent clicks
  ================================= */
  if (to) {
    const localizedTo = to.startsWith(`/${lang}`)
      ? to
      : `/${lang}${to.startsWith("/") ? to : "/" + to}`;

    return (
      <Link
        to={disabled ? "#" : localizedTo}
        onClick={handleClick as any}
        className={classes}
      >
        {/* RTL support */}
        <span className={isRTL ? "rtl" : ""}>{children}</span>
      </Link>
    );
  }

  /* ================================
     Default: render as HTML <button>
     --------------------------------
     - Supports disabled state
     - Uses type attribute for forms
     - RTL text support
  ================================= */
  return (
    <button
      onClick={handleClick as any}
      disabled={disabled}
      className={classes}
      type={type}
    >
      <span className={isRTL ? "rtl" : ""}>{children}</span>
    </button>
  );
}