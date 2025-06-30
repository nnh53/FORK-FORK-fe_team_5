import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Label } from "@/components/Shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Icon } from "@iconify/react";
import React from "react";
import type { CinemaRoom } from "../../../../interfaces/cinemarooms.interface";

type RoomStatus = "ACTIVE" | "MAINTENANCE" | "CLOSED";

interface ChangeStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomToChangeStatus: CinemaRoom | null;
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Icon icon="material-symbols:swap-horiz" className="mr-2 h-5 w-5" />
            Change Room Status
          </DialogTitle>
          <DialogDescription>{roomToChangeStatus && `Update the status of "${roomToChangeStatus.name}"`}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Label htmlFor="newStatus">New Status</Label>
          <Select value={newStatus} onValueChange={(value: RoomStatus) => setNewStatus(value)}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">
                <div className="flex items-center">
                  <Icon icon="material-symbols:check-circle" className="mr-2 h-4 w-4" />
                  Active
                </div>
              </SelectItem>
              <SelectItem value="maintenance">
                <div className="flex items-center">
                  <Icon icon="material-symbols:build" className="mr-2 h-4 w-4" />
                  Maintenance
                </div>
              </SelectItem>
              <SelectItem value="closed">
                <div className="flex items-center">
                  <Icon icon="material-symbols:cancel" className="mr-2 h-4 w-4" />
                  Closed
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onChangeStatus} disabled={loading}>
            <Icon icon="material-symbols:save" className="mr-2 h-4 w-4" />
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
