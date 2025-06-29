import { ArrowLeft, Plus, Save } from "lucide-react";
import React from "react";
import { Badge } from "../../../../components/Shadcn/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../../../../components/Shadcn/ui/breadcrumb";
import { Button } from "../../../../components/Shadcn/ui/button";
import { Card, CardContent } from "../../../../components/Shadcn/ui/card";
import type { SeatMapGrid } from "../../../../interfaces/seatmap.interface";

interface PageHeaderProps {
  isEditorView: boolean;
  seatMap: SeatMapGrid | null;
  loading: boolean;
  onAddRoom: () => void;
  onBackToRooms: () => void;
  onSaveSeatMap: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ isEditorView, seatMap, loading, onAddRoom, onBackToRooms, onSaveSeatMap }) => {
  return (
    <Card className="bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-950 dark:to-blue-950/50 border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 space-y-3">
            {/* Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-muted-foreground hover:text-primary transition-colors">Management</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    Cinema Rooms
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {isEditorView && seatMap && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                      >
                        {seatMap.roomName}
                      </Badge>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>

            {/* Title */}
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                {isEditorView ? `Editing: ${seatMap?.roomName || "Room"}` : "Cinema Room Management"}
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {isEditorView ? "Design and configure the seat layout for this cinema room" : "Manage cinema rooms and seat layouts efficiently"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 ml-6">
            {!isEditorView ? (
              <Button
                onClick={onAddRoom}
                disabled={loading}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="mr-2 h-5 w-5" />
                {loading ? "Creating..." : "Create Room"}
              </Button>
            ) : (
              <>
                <Button
                  onClick={onBackToRooms}
                  variant="outline"
                  size="default"
                  className="border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-800 dark:hover:border-orange-700 dark:hover:bg-orange-950/20 text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-all duration-300"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Rooms
                </Button>
                <Button
                  onClick={onSaveSeatMap}
                  disabled={loading}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  <Save className="mr-2 h-5 w-5" />
                  {loading ? "Saving..." : "Save Layout"}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
