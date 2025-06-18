import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import React from "react";

interface DatePickerProps {
  value: Date | undefined;
  setValue: (date: Date | undefined) => void;
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, setValue, label }) => (
  <div className="mb-4 flex gap-4">
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" id="from" className="w-48 justify-between font-normal">
          {value ? value.toLocaleDateString() : label || "Select date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar mode="single" selected={value} captionLayout="dropdown" onSelect={setValue} />
      </PopoverContent>
    </Popover>
  </div>
);
