import React from 'react';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  control: Control<any>;
  errors: FieldErrors;
}

const FormField: React.FC<FormFieldProps> = ({ name, label, type = 'text', control, errors }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-lg text-gray-700 text-left">
      <span className="text-red-500">*</span> {label}
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
            errors[name] ? 'border-red-500 focus:ring-red-500' : 'border-blue-300 hover:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder={`Enter your ${label}`}
        />
      )}
    />
    {errors[name] && <p className="error text-red-500 mt-1 text-left text-sm">{errors[name]?.message as string}</p>}
  </div>
);

export default FormField;
