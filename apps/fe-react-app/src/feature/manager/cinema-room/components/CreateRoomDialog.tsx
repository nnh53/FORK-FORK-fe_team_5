import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Icon } from "@iconify/react";
import React from "react";
import type { ComponentRoomStatus } from "../../../../interfaces/cinemarooms.interface";

type RoomStatus = ComponentRoomStatus;

interface CreateRoomData {
  name: string;
  type: string;
  capacity: number;
  status: RoomStatus;
  width: number;
  height: number;
  roomNumber: number;
  fee: number;
}

interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newRoomData: CreateRoomData;
  setNewRoomData: React.Dispatch<React.SetStateAction<CreateRoomData>>;
  onCreateRoom: () => void;
  loading: boolean;
}

export const CreateRoomDialog: React.FC<CreateRoomDialogProps> = ({ open, onOpenChange, newRoomData, setNewRoomData, onCreateRoom, loading }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-base-100 border-base-300">
        <DialogHeader>
          <DialogTitle className="text-xl text-base-content flex items-center">
            <Icon icon="material-symbols:add-home" className="mr-2 h-5 w-5 text-primary" />
            Create New Cinema Room
          </DialogTitle>
          <DialogDescription className="text-base-content/70">
            Set up a new cinema room with basic configuration. You can edit the seat layout after creation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="roomName" className="text-base-content font-medium">
                Room Name <span className="text-error">*</span>
              </Label>
              <Input
                id="roomName"
                value={newRoomData.name}
                onChange={(e) => setNewRoomData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter room name..."
                className="input input-bordered bg-base-100 border-base-300 focus:border-primary"
              />
            </div>

            <div>
              <Label htmlFor="roomType" className="text-base-content font-medium">
                Room Type
              </Label>
              <Select value={newRoomData.type} onValueChange={(value) => setNewRoomData((prev) => ({ ...prev, type: value }))}>
                <SelectTrigger className="w-full border-base-300 bg-base-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-base-100 border-base-300">
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="IMAX">IMAX</SelectItem>
                  <SelectItem value="4DX">4DX</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="capacity" className="text-base-content font-medium">
                Capacity
              </Label>
              <Input
                id="capacity"
                type="number"
                value={newRoomData.capacity}
                onChange={(e) => setNewRoomData((prev) => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                min="1"
                max="500"
                className="input input-bordered bg-base-100 border-base-300 focus:border-primary"
              />
            </div>

            <div>
              <Label htmlFor="fee" className="text-base-content font-medium">
                Base Fee (VND)
              </Label>
              <Input
                id="fee"
                type="number"
                value={newRoomData.fee}
                onChange={(e) => setNewRoomData((prev) => ({ ...prev, fee: parseInt(e.target.value) || 0 }))}
                min="0"
                step="1000"
                className="input input-bordered bg-base-100 border-base-300 focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="roomNumber" className="text-base-content font-medium">
                Room Number
              </Label>
              <Input
                id="roomNumber"
                type="number"
                value={newRoomData.roomNumber}
                onChange={(e) => setNewRoomData((prev) => ({ ...prev, roomNumber: parseInt(e.target.value) || 0 }))}
                min="1"
                className="input input-bordered bg-base-100 border-base-300 focus:border-primary"
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-base-content font-medium">
                Status
              </Label>
              <Select value={newRoomData.status} onValueChange={(value: RoomStatus) => setNewRoomData((prev) => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-full border-base-300 bg-base-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-base-100 border-base-300">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="width" className="text-base-content font-medium">
                  Width (seats)
                </Label>
                <Input
                  id="width"
                  type="number"
                  value={newRoomData.width}
                  onChange={(e) => setNewRoomData((prev) => ({ ...prev, width: parseInt(e.target.value) || 1 }))}
                  min="1"
                  max="30"
                  className="input input-bordered bg-base-100 border-base-300 focus:border-primary"
                />
              </div>
              <div>
                <Label htmlFor="height" className="text-base-content font-medium">
                  Height (rows)
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={newRoomData.height}
                  onChange={(e) => setNewRoomData((prev) => ({ ...prev, height: parseInt(e.target.value) || 1 }))}
                  min="1"
                  max="20"
                  className="input input-bordered bg-base-100 border-base-300 focus:border-primary"
                />
              </div>
            </div>

            <div className="bg-base-200 p-4 rounded-lg border border-base-300">
              <div className="text-sm text-base-content/70 mb-2">Preview Layout:</div>
              <div className="text-xs text-base-content/60">
                {newRoomData.width} × {newRoomData.height} = {newRoomData.width * newRoomData.height} potential seats
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-base-300 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-base-300 hover:bg-base-200">
            Cancel
          </Button>
          <Button onClick={onCreateRoom} disabled={!newRoomData.name.trim() || loading} className="btn btn-primary">
            {loading ? (
              <>
                <Icon icon="material-symbols:hourglass-empty" className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Icon icon="material-symbols:add" className="mr-2 h-4 w-4" />
                Create Room
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
