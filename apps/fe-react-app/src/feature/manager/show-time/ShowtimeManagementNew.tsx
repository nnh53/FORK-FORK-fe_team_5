"use client";

import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import type { Showtime } from "@/interfaces/showtime.interface";
import { Calendar, Plus } from "lucide-react";
import { useState } from "react";
import { ShowtimeForm } from "./ShowtimeFormNew";
import { ShowtimeList } from "./ShowtimeList";

interface ShowtimeManagementState {
  mode: "list" | "create" | "edit";
  selectedShowtime?: Showtime;
}

export function ShowtimeManagementNew() {
  const [state, setState] = useState<ShowtimeManagementState>({ mode: "list" });

  const handleCreateNew = () => {
    setState({ mode: "create" });
  };

  const handleEditShowtime = (showtime: Showtime) => {
    setState({ mode: "edit", selectedShowtime: showtime });
  };

  const handleSuccess = () => {
    setState({ mode: "list" });
  };

  const handleCancel = () => {
    setState({ mode: "list" });
  };

  if (state.mode === "create") {
    return (
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
    );
  }

  if (state.mode === "edit" && state.selectedShowtime) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <h1 className="text-2xl font-bold">Chỉnh sửa lịch chiếu</h1>
          </div>
          <Button variant="outline" onClick={handleCancel}>
            Quay lại danh sách
          </Button>
        </div>
        <ShowtimeForm initialData={state.selectedShowtime} onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Quản lý lịch chiếu
            </CardTitle>
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo lịch chiếu mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ShowtimeList onEditShowtime={handleEditShowtime} onCreateNew={handleCreateNew} />
        </CardContent>
      </Card>
    </div>
  );
}
