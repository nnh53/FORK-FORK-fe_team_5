import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import React, { useEffect, useRef } from "react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";

// Register DrawSVG plugin
gsap.registerPlugin(DrawSVGPlugin);

interface CheckboxProps {
  name: string;
  label: string;
  control: Control<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  errors?: FieldErrors;
}

const CheckboxForm: React.FC<CheckboxProps> = ({ name, label, control, errors }) => {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const checkbox = checkboxRef.current;
    const path = pathRef.current;

    if (checkbox && path) {
      const tl = gsap.timeline({ paused: true, reversed: true });

      tl.fromTo(
        path,
        {
          drawSVG: "90% 100%",
          stroke: "#27BDBE",
          strokeWidth: 2,
          opacity: 0,
        },
        {
          duration: 0.5,
          drawSVG: "0% 20%",
          stroke: "#E70000",
          strokeWidth: 3,
          opacity: 1,
        },
      );

      const handleChange = () => {
        if (tl.reversed()) {
          tl.play();
        } else {
          tl.reverse();
        }
      };

      checkbox.addEventListener("change", handleChange);

      return () => {
        checkbox.removeEventListener("change", handleChange);
      };
    }
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const { ref, ...inputProps } = field;
          return (
            <div className="checkbox-wrapper">
              <label className="checkbox path relative block w-5 h-5 border-2 border-brown-500 rounded">
                <input
                  type="checkbox"
                  {...inputProps}
                  ref={(r) => {
                    ref(r);
                    checkboxRef.current = r;
                  }}
                  className="custom-checkbox absolute opacity-0 cursor-pointer w-full h-full"
                />
                <svg
                  viewBox="0 0 21 21"
                  className="absolute top-0 left-0 w-5 h-5 -translate-x-0.5
                "
                >
                  <path
                    ref={pathRef}
                    d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"
                    fill="none"
                    stroke="#1e2235"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </label>
            </div>
          );
        }}
      />
      <label htmlFor={name} className="text-sm text-gray-600">
        {label}
      </label>
      {errors && errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]?.message as string}</p>}
    </div>
  );
};

export default CheckboxForm;
