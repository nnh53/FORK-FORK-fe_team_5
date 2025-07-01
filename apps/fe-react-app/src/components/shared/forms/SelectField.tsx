import { Label } from "@/components/Shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import React from "react";

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  options: readonly { readonly value: string; readonly label: string }[] | { value: string; label: string }[];
  placeholder?: string;
  icon?: React.ReactNode;
}

/**
 * Reusable select field component with consistent styling
 */
export const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, disabled, options, placeholder, icon }) => (
  <div className="space-y-2">
    <Label className={icon ? "flex items-center gap-2" : ""}>
      {icon}
      {label}
    </Label>
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
