"use client";

import { ChevronDown, Filter as FilterIcon, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
  type: "select" | "dateRange";
  selectOptions?: { value: string; label: string }[];
  placeholder?: string;
}

interface FilterCriteria {
  field: string;
  value: string | { from: Date | undefined; to: Date | undefined };
  label: string;
  type: "select" | "dateRange";
}

interface FilterProps {
  filterOptions: FilterOption[];
  onFilterChange: (criteria: FilterCriteria[]) => void;
  className?: string;
  showActiveFilters?: boolean;
}

// Type for temp values
type TempFilterValue = string | { from: Date | undefined; to: Date | undefined } | undefined;

function Filter({ filterOptions, onFilterChange, className, showActiveFilters = true }: FilterProps) {
  const [appliedFilters, setAppliedFilters] = useState<FilterCriteria[]>([]);
  const [tempValues, setTempValues] = useState<Record<string, TempFilterValue>>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Khi mở dropdown, load giá trị hiện tại vào temp
      const currentValues: Record<string, TempFilterValue> = {};
      appliedFilters.forEach((filter) => {
        currentValues[filter.field] = filter.value;
      });
      setTempValues(currentValues);
    }
    setIsOpen(open);
  };

  const handleTempValueChange = (field: string, value: TempFilterValue) => {
    setTempValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    // Tạo danh sách filters từ các giá trị đã nhập
    const validFilters: FilterCriteria[] = [];

    filterOptions.forEach((option) => {
      const value = tempValues[option.value];
      let isValid = false;

      if (option.type === "dateRange") {
        const range = value as { from: Date | undefined; to: Date | undefined };
        isValid = range && (range.from || range.to);
      } else {
        isValid = value && value !== "";
      }

      if (isValid) {
        validFilters.push({
          field: option.value,
          value: value as string | { from: Date | undefined; to: Date | undefined },
          label: option.label,
          type: option.type,
        });
      }
    });

    setAppliedFilters(validFilters);
    onFilterChange(validFilters);
    setIsOpen(false);
  };

  const handleCancel = () => {
    // Reset temp values về applied values
    const currentValues: Record<string, TempFilterValue> = {};
    appliedFilters.forEach((filter) => {
      currentValues[filter.field] = filter.value;
    });
    setTempValues(currentValues);
    setIsOpen(false);
  };

  const handleClearAllFilters = () => {
    setAppliedFilters([]);
    setTempValues({});
    onFilterChange([]);
  };

  const handleRemoveAppliedFilter = (index: number) => {
    const newFilters = appliedFilters.filter((_, i) => i !== index);
    setAppliedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    return appliedFilters.length;
  };

  const renderDateRangeFilter = (option: FilterOption) => {
    const value = (tempValues[option.value] as { from: Date | undefined; to: Date | undefined }) || { from: undefined, to: undefined };
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium">{option.label}</div>
        <div className="flex gap-2">
          <div className="flex-1">
            <DatePicker date={value.from} setDate={(date) => handleTempValueChange(option.value, { ...value, from: date })} placeholder="Từ ngày" />
          </div>
          <div className="flex-1">
            <DatePicker date={value.to} setDate={(date) => handleTempValueChange(option.value, { ...value, to: date })} placeholder="Đến ngày" />
          </div>
        </div>
      </div>
    );
  };

  const renderSelectFilter = (option: FilterOption) => {
    const value = (tempValues[option.value] as string) || "";
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium">{option.label}</div>
        <Select value={value} onValueChange={(val) => handleTempValueChange(option.value, val)}>
          <SelectTrigger>
            <SelectValue placeholder={option.placeholder || `Chọn ${option.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {option.selectOptions?.map((selectOption) => (
              <SelectItem key={selectOption.value} value={selectOption.value}>
                {selectOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const hasAnyValues = () => {
    return Object.values(tempValues).some((value) => {
      if (typeof value === "object" && value !== null && value !== undefined) {
        const range = value as { from: Date | undefined; to: Date | undefined };
        return range.from || range.to;
      }
      return value && value !== "";
    });
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Filter trigger button and clear button */}
      <div className="flex justify-end gap-2">
        {/* Clear all filters button - chỉ hiện khi có applied filters */}
        {appliedFilters.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearAllFilters} className="gap-1">
            <X className="h-3 w-3" />
            Xóa bộ lọc
          </Button>
        )}

        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <FilterIcon className="h-4 w-4" />
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="h-4 px-1 text-xs ml-1">
                  {getActiveFiltersCount()}
                </Badge>
              )}
              <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", isOpen && "rotate-180")} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end" side="bottom">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-sm">Bộ lọc</h4>
                {hasAnyValues() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTempValues({})}
                    className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Xóa tất cả
                  </Button>
                )}
              </div>

              {/* Filter inputs */}
              <div className="space-y-4">
                {filterOptions.map((option) => (
                  <div key={option.value}>
                    {option.type === "dateRange" && renderDateRangeFilter(option)}
                    {option.type === "select" && renderSelectFilter(option)}
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Hủy
                </Button>
                <Button size="sm" onClick={handleApplyFilters}>
                  Áp dụng
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Applied filters display */}
      {showActiveFilters && appliedFilters.length > 0 && (
        <div className="flex justify-end">
          <div className="flex flex-wrap gap-2 justify-end">
            {appliedFilters.map((filter, index) => (
              <Badge key={`applied-${filter.field}-${index}`} variant="secondary" className="flex items-center gap-1">
                <span className="text-xs">
                  {filter.label}
                  {filter.type === "dateRange"
                    ? (() => {
                        const range = filter.value as { from: Date | undefined; to: Date | undefined };
                        const fromStr = range.from ? range.from.toLocaleDateString() : "";
                        const toStr = range.to ? range.to.toLocaleDateString() : "";
                        if (fromStr && toStr) return `: ${fromStr} - ${toStr}`;
                        if (fromStr) return `: từ ${fromStr}`;
                        if (toStr) return `: đến ${toStr}`;
                        return "";
                      })()
                    : `: ${filter.value}`}
                </span>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveAppliedFilter(index)} className="h-3 w-3 p-0 hover:bg-destructive/20">
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { Filter, type FilterCriteria, type FilterOption, type FilterProps };
