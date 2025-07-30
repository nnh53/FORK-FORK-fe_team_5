import TimePicker from "@ashwinthomas/react-time-picker-dropdown";
import "@ashwinthomas/react-time-picker-dropdown/src/timePicker/timePicker.css";
import "./ShadcnTimePicker.css";
import React from "react";

interface ShadcnTimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function ShadcnTimePicker({ value, onChange, disabled }: ShadcnTimePickerProps) {
  const handleChange = (val: string | null) => {
    if (!onChange) return;
    if (val) {
      const parts = val.split(":");
      if (parts.length >= 2) {
        onChange(`${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`);
      } else {
        onChange("");
      }
    } else {
      onChange("");
    }
  };

  return (
    <div className={disabled ? "pointer-events-none opacity-50" : ""}>
      <TimePicker
        key={value || ""}
        defaultValue={value ? `${value}:00` : undefined}
        onTimeChange={handleChange}
        showClockIcon
        showCloseIcon
        useTwelveHourFormat={false}
        allowBackdrop={false}
      />
    </div>
  );
}
