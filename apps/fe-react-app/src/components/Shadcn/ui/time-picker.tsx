"use client";

import { cn } from "@/utils/utils";
import { Clock } from "lucide-react";
import "react-clock/dist/Clock.css";
import ReactTimePicker, { type TimePickerProps } from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "./time-picker.css";

export function TimePicker({ className, ...props }: TimePickerProps) {
  return (
    <div className="relative">
      <Clock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
      <ReactTimePicker {...props} className={cn("shadcn-time-picker pl-8", className)} clearIcon={null} clockIcon={null} format="HH:mm" />
    </div>
  );
}
