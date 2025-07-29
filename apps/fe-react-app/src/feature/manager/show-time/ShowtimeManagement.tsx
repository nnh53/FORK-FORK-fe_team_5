"use client";

import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import type { FilterCriteria } from "@/components/shared/Filter";
import { Filter } from "@/components/shared/Filter";
import { SearchBar } from "@/components/shared/SearchBar";
import { SHOWTIME_STATUS } from "@/constants/status";
import type { Showtime } from "@/interfaces/showtime.interface";
import { Calendar, Plus } from "lucide-react";
import { useState } from "react";
import { ShowtimeCalendar } from "./ShowtimeCalendar";
import { ShowtimeForm } from "./ShowtimeForm";

const searchOptions = [
  { value: "movieName", label: "Tên phim" },
  { value: "date", label: "Ngày chiếu" },
];

const filterOptions = [
  {
    label: "Trạng thái",
    value: "status",
    type: "select" as const,
    selectOptions: [
      { value: SHOWTIME_STATUS.SCHEDULE, label: "Đã lập lịch" },
      { value: SHOWTIME_STATUS.ONSCREEN, label: "Đang chiếu" },
      { value: SHOWTIME_STATUS.COMPLETED, label: "Hoàn thành" },
    ],
    placeholder: "Chọn trạng thái",
  },
];

interface ShowtimeManagementState {
  mode: "list" | "create" | "edit";
  selectedShowtime?: Showtime;
}

export function ShowtimeManagement() {
  const [state, setState] = useState<ShowtimeManagementState>({ mode: "list" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);

  const handleCreateNew = () => {
    setState({ mode: "create" });
  };

  const handleSuccess = () => {
    setState({ mode: "list" });
  };

  const handleCancel = () => {
    setState({ mode: "list" });
  };

  if (state.mode === "create") {
    return (
      <div className="container mx-auto p-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <h1 className="text-2xl font-bold">Tạo lịch chiếu mới</h1>
            </div>
            <Button variant="outline" onClick={handleCancel}>
              Quay lại danh sách
            </Button>
          </div>
          <ShowtimeForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </div>
    );
  }

  if (state.mode === "edit" && state.selectedShowtime) {
    return (
      <div className="container mx-auto p-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleCancel}>
              Quay lại danh sách
            </Button>
          </div>
          <ShowtimeForm initialData={state.selectedShowtime} onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-2xl font-bold">Quản lý lịch chiếu</CardTitle>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm lịch chiếu
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            {/* SearchBar */}
            <SearchBar
              searchOptions={searchOptions}
              onSearchChange={(value) => {
                setSearchTerm(value);
              }}
              placeholder="Tìm kiếm theo tên phim hoặc ngày chiếu..."
              className="flex-1"
            />
            {/* Filter */}
            <Filter
              filterOptions={filterOptions}
              onFilterChange={(criteria) => {
                setFilterCriteria(criteria);
              }}
              className="flex-1"
            />
          </div>
          <ShowtimeCalendar searchTerm={searchTerm} filterCriteria={filterCriteria} />
        </CardContent>
      </Card>
    </div>
  );
}
