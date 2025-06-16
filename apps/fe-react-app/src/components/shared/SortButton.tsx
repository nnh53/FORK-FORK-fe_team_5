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

export function SortButton({ onChange, direction: externalDirection, label, className, ...props }: SortButtonProps) {
  const [internalDirection, setInternalDirection] = React.useState<SortDirection>("none");

  // Use external direction if provided, otherwise use internal state
  const direction = externalDirection !== undefined ? externalDirection : internalDirection;

  const handleClick = () => {
    const newDirection = direction === "none" ? "asc" : direction === "asc" ? "desc" : "none";
    setInternalDirection(newDirection);
    onChange?.(newDirection);
  };

  return (
    <Button variant="ghost" size={label ? "sm" : "icon"} className={cn(label ? "gap-1" : "size-8", className)} onClick={handleClick} {...props}>
      {label && <span>{label}</span>}
      {direction === "none" && <ArrowUpDownIcon className="size-4" />}
      {direction === "asc" && <ArrowUpIcon className="size-4" />}
      {direction === "desc" && <ArrowDownIcon className="size-4" />}
      <span className="sr-only">{direction === "none" ? "Sort" : direction === "asc" ? "Sort ascending" : "Sort descending"}</span>
    </Button>
  );
}

/**
 * A hook to manage sortable data collections
 */
export function useSortable<T extends Record<string, unknown>>(initialData: T[]) {
  const [sortKey, setSortKey] = React.useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("none");

  // Sort the data based on current sort configuration
  const sortedData = React.useMemo(() => {
    if (sortDirection === "none" || !sortKey) {
      return initialData;
    }

    return [...initialData].sort((a, b) => {
      const valueA = a[sortKey];
      const valueB = b[sortKey];

      // Handle null/undefined values
      if (valueA === null || valueA === undefined) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (valueB === null || valueB === undefined) {
        return sortDirection === "asc" ? 1 : -1;
      }

      // Handle different types
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }

      // Handle numbers and other comparable types
      if (valueA < valueB) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === "asc" ? 1 : -1;
      }

      return 0;
    });
  }, [initialData, sortKey, sortDirection]);

  // Generate props for SortButton components
  const getSortProps = (key: keyof T) => ({
    direction: sortKey === key ? sortDirection : ("none" as SortDirection),
    onChange: (direction: SortDirection) => {
      setSortKey(direction === "none" ? null : key);
      setSortDirection(direction);
    },
  });

  return {
    sortedData,
    sortKey,
    sortDirection,
    getSortProps,
  };
}
