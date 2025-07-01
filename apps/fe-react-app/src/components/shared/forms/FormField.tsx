import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import React from "react";

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  type?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  description?: string;
}

/**
 * Reusable form field component with consistent styling
 */
export const FormField: React.FC<FormFieldProps> = ({ id, label, value, onChange, disabled, type = "text", icon, placeholder, description }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className={icon ? "flex items-center gap-2" : ""}>
      {icon}
      {label}
    </Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className={disabled && type === "email" ? "bg-gray-50" : ""}
    />
    {description && <p className="text-xs text-muted-foreground">{description}</p>}
  </div>
);
