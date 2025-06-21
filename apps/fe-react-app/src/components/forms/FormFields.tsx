import React from "react";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  errors: FieldErrors;
  isRequired?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ name, label, type = "text", control, errors, isRequired = true }) => (
  <div className="flex flex-col">
    <style>
      {`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .error-message {
          animation: slideDown 0.2s ease-out forwards;
        }
      `}
    </style>
    <label htmlFor={name} className="mb-2 text-lg text-brown-700 text-left">
      {isRequired && <span className="text-red-500">*</span>} {label}
    </label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <input
          {...field}
          type={type}
          id={name}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
            errors[name] ? "border-red-500 focus:ring-red-500" : "border-brown-300 hover:border-brown-500 focus:ring-brown-500"
          }`}
          placeholder={`Nhập ${label}`}
        />
      )}
    />
    {errors[name] && <p className="error text-red-500 mt-1 text-left text-sm error-message">{errors[name]?.message as string}</p>}
  </div>
);

export default FormField;
