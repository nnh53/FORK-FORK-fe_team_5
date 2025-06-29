import { Badge } from "@/components/Shadcn/ui/badge";
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
      <DialogContent className="max-w-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center text-2xl">
            <Icon icon="material-symbols:add-home" className="mr-3 h-6 w-6" />
            Create New Cinema Room
          </DialogTitle>
          <DialogDescription className="text-base">
            Set up a new cinema room with basic configuration. You can edit the seat layout after creation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
          {/* Left Column */}
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="roomName" className="text-sm font-medium">
                Room Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="roomName"
                value={newRoomData.name}
                onChange={(e) => setNewRoomData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter room name..."
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomType" className="text-sm font-medium">
                Room Type
              </Label>
              <Select value={newRoomData.type} onValueChange={(value) => setNewRoomData((prev) => ({ ...prev, type: value }))}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">
                    <div className="flex items-center">
                      <Icon icon="material-symbols:movie" className="mr-2 h-4 w-4" />
                      Standard
                    </div>
                  </SelectItem>
                  <SelectItem value="VIP">
                    <div className="flex items-center">
                      <Icon icon="material-symbols:star" className="mr-2 h-4 w-4" />
                      VIP
                    </div>
                  </SelectItem>
                  <SelectItem value="IMAX">
                    <div className="flex items-center">
                      <Icon icon="material-symbols:theaters" className="mr-2 h-4 w-4" />
                      IMAX
                    </div>
                  </SelectItem>
                  <SelectItem value="4DX">
                    <div className="flex items-center">
                      <Icon icon="material-symbols:rocket-launch" className="mr-2 h-4 w-4" />
                      4DX
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-sm font-medium">
                Capacity
              </Label>
              <Input
                id="capacity"
                type="number"
                value={newRoomData.capacity}
                onChange={(e) => setNewRoomData((prev) => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                min="1"
                max="500"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee" className="text-sm font-medium">
                Base Fee (VND)
              </Label>
              <Input
                id="fee"
                type="number"
                value={newRoomData.fee}
                onChange={(e) => setNewRoomData((prev) => ({ ...prev, fee: parseInt(e.target.value) || 0 }))}
                min="0"
                step="1000"
                className="h-11"
                placeholder="50,000"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="roomNumber" className="text-sm font-medium">
                Room Number
              </Label>
              <Input
                id="roomNumber"
                type="number"
                value={newRoomData.roomNumber}
                onChange={(e) => setNewRoomData((prev) => ({ ...prev, roomNumber: parseInt(e.target.value) || 0 }))}
                min="1"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select value={newRoomData.status} onValueChange={(value: RoomStatus) => setNewRoomData((prev) => ({ ...prev, status: value }))}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center">
                      <Icon icon="material-symbols:check-circle" className="mr-2 h-4 w-4 text-green-500" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="maintenance">
                    <div className="flex items-center">
                      <Icon icon="material-symbols:build" className="mr-2 h-4 w-4 text-yellow-500" />
                      Maintenance
                    </div>
                  </SelectItem>
                  <SelectItem value="closed">
                    <div className="flex items-center">
                      <Icon icon="material-symbols:cancel" className="mr-2 h-4 w-4 text-red-500" />
                      Closed
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width" className="text-sm font-medium">
                  Width (seats)
                </Label>
                <Input
                  id="width"
                  type="number"
                  value={newRoomData.width}
                  onChange={(e) => setNewRoomData((prev) => ({ ...prev, width: parseInt(e.target.value) || 1 }))}
                  min="1"
                  max="30"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="text-sm font-medium">
                  Height (rows)
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={newRoomData.height}
                  onChange={(e) => setNewRoomData((prev) => ({ ...prev, height: parseInt(e.target.value) || 1 }))}
                  min="1"
                  max="20"
                  className="h-11"
                />
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-muted/50 p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Layout Preview</span>
                <Badge variant="secondary">{newRoomData.width * newRoomData.height} seats</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {newRoomData.width} columns × {newRoomData.height} rows
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-6 gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-11">
            Cancel
          </Button>
          <Button onClick={onCreateRoom} disabled={!newRoomData.name.trim() || loading} className="h-11">
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
