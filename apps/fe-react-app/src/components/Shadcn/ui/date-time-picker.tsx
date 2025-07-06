"use client";

import { Button } from "@/components/Shadcn/ui/button";
import { Calendar } from "@/components/Shadcn/ui/calendar";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Shadcn/ui/popover";
import { cn } from "@/utils/utils";
import { format, parseISO, set } from "date-fns";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import * as React from "react";

export interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label?: string;
  className?: string;
  error?: boolean;
}

export function DateTimePicker({ date, setDate, label, className, error = false }: DateTimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<string>(date ? format(date, "HH:mm") : "00:00");

  // Update the time whenever the date changes
  React.useEffect(() => {
    if (date) {
      setSelectedTime(format(date, "HH:mm"));
    }
  }, [date]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setDate(undefined);
      return;
    }

    // Keep the time information when updating the date
    if (date) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const newDate = set(selectedDate, { hours, minutes });
      setDate(newDate);
    } else {
      // If no previous date, use selected time or default to now
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const newDate = set(selectedDate, { hours, minutes });
      setDate(newDate);
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeString = event.target.value;
    setSelectedTime(timeString);

    if (!date) {
      // If no date is selected, use today
      const today = new Date();
      const [hours, minutes] = timeString.split(":").map(Number);
      const newDate = set(today, { hours, minutes });
      setDate(newDate);
      return;
    }

    // Update the time on the existing date
    const [hours, minutes] = timeString.split(":").map(Number);
    const newDate = set(date, { hours, minutes });
    setDate(newDate);
  };

  // Convert ISO string to a formatted date-time string
  const formatDateTime = (dateString?: Date | string) => {
    if (!dateString) return "Chọn ngày và giờ";

    const dateObj = typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(dateObj, "dd/MM/yyyy HH:mm");
  };

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {label && <Label className="font-medium">{label}</Label>}
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground",
                error && "border-red-500 focus-visible:ring-red-500",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? formatDateTime(date) : "Chọn ngày và giờ"}
              <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="border-b p-3">
              <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus className="rounded-md border" />
              <div className="mt-3 flex items-center justify-center">
                <Input type="time" value={selectedTime} onChange={handleTimeChange} className="w-full" />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
