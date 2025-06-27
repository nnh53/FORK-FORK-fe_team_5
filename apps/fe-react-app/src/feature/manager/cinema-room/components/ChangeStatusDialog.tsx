import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Label } from "@/components/Shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Icon } from "@iconify/react";
import React from "react";
import type { CinemaRoomWithSeatMap, ComponentRoomStatus } from "../../../../interfaces/cinemarooms.interface";

type RoomStatus = ComponentRoomStatus;

interface ChangeStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomToChangeStatus: CinemaRoomWithSeatMap | null;
  newStatus: RoomStatus;
  setNewStatus: (status: RoomStatus) => void;
  onChangeStatus: () => void;
  loading: boolean;
}

export const ChangeStatusDialog: React.FC<ChangeStatusDialogProps> = ({
  open,
  onOpenChange,
  roomToChangeStatus,
  newStatus,
  setNewStatus,
  onChangeStatus,
  loading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-base-100 border-base-300">
        <DialogHeader>
          <DialogTitle className="text-xl text-base-content flex items-center">
            <Icon icon="material-symbols:swap-horiz" className="mr-2 h-5 w-5 text-primary" />
            Change Room Status
          </DialogTitle>
          <DialogDescription className="text-base-content/70">
            {roomToChangeStatus && `Update the status of "${roomToChangeStatus.name}"`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Label htmlFor="newStatus" className="text-base-content font-medium">
            New Status
          </Label>
          <Select value={newStatus} onValueChange={(value: RoomStatus) => setNewStatus(value)}>
            <SelectTrigger className="w-full border-base-300 bg-base-100 mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-base-100 border-base-300">
              <SelectItem value="active">
                <div className="flex items-center">
                  <Icon icon="material-symbols:check-circle" className="mr-2 h-4 w-4 text-success" />
                  Active
                </div>
              </SelectItem>
              <SelectItem value="maintenance">
                <div className="flex items-center">
                  <Icon icon="material-symbols:build" className="mr-2 h-4 w-4 text-warning" />
                  Maintenance
                </div>
              </SelectItem>
              <SelectItem value="closed">
                <div className="flex items-center">
                  <Icon icon="material-symbols:cancel" className="mr-2 h-4 w-4 text-error" />
                  Closed
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="border-t border-base-300 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-base-300 hover:bg-base-200">
            Cancel
          </Button>
          <Button onClick={onChangeStatus} disabled={loading} className="btn btn-primary">
            <Icon icon="material-symbols:save" className="mr-2 h-4 w-4" />
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
