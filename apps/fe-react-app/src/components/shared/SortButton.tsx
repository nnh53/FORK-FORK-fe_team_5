"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";
import * as React from "react";

export type SortDirection = "asc" | "desc" | "none";

export interface SortButtonProps extends Omit<React.ComponentProps<typeof Button>, "onChange"> {
  onChange?: (direction: SortDirection) => void;
  direction?: SortDirection;
  label?: string;
}

// Tách function để render icon
const renderSortIcon = (direction: SortDirection) => {
  if (direction === "none") return <ArrowUpDownIcon className="size-4" />;
  if (direction === "asc") return <ArrowUpIcon className="size-4" />;
  return <ArrowDownIcon className="size-4" />;
};

// Tách function để get aria label
const getSortAriaLabel = (direction: SortDirection) => {
  if (direction === "none") return "Sort";
  if (direction === "asc") return "Sort ascending";
  return "Sort descending";
};

// Tách function để tính next direction
const getNextDirection = (currentDirection: SortDirection): SortDirection => {
  if (currentDirection === "none") return "asc";
  if (currentDirection === "asc") return "desc";
  return "none";
};

export function SortButton({ onChange, direction: externalDirection, label, className, ...props }: SortButtonProps) {
  const [internalDirection, setInternalDirection] = React.useState<SortDirection>("none");

  // Use external direction if provided, otherwise use internal state
  const direction = externalDirection !== undefined ? externalDirection : internalDirection;

  const handleClick = () => {
    const newDirection = getNextDirection(direction);
    setInternalDirection(newDirection);
    onChange?.(newDirection);
  };

  return (
    <Button variant="ghost" size={label ? "sm" : "icon"} className={cn(label ? "gap-1" : "size-8", className)} onClick={handleClick} {...props}>
      {label && <span>{label}</span>}
      {renderSortIcon(direction)}
      <span className="sr-only">{getSortAriaLabel(direction)}</span>
    </Button>
  );
}
