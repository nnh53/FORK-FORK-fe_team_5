import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Icon } from "@iconify/react";
import React from "react";

interface EditRoomData {
  name: string;
  type: string;
  width: number;
  height: number;
}

interface EditRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editRoomData: EditRoomData;
  setEditRoomData: React.Dispatch<React.SetStateAction<EditRoomData>>;
  onEditRoom: () => void;
  loading: boolean;
}

export const EditRoomDialog: React.FC<EditRoomDialogProps> = ({ open, onOpenChange, editRoomData, setEditRoomData, onEditRoom, loading }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Icon icon="material-symbols:edit" className="mr-2 h-5 w-5" />
            Edit Room Information
          </DialogTitle>
          <DialogDescription>Update basic room information. Layout changes should be done through the seat editor.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="editRoomName">
              Room Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="editRoomName"
              value={editRoomData.name}
              onChange={(e) => setEditRoomData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter room name..."
            />
          </div>

          <div>
            <Label htmlFor="editRoomType">Room Type</Label>
            <Select value={editRoomData.type} onValueChange={(value) => setEditRoomData((prev) => ({ ...prev, type: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="IMAX">IMAX</SelectItem>
                <SelectItem value="4DX">4DX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="editWidth">Width</Label>
              <Input
                id="editWidth"
                type="number"
                value={editRoomData.width}
                onChange={(e) => setEditRoomData((prev) => ({ ...prev, width: parseInt(e.target.value) || 1 }))}
                min="1"
                max="30"
              />
            </div>
            <div>
              <Label htmlFor="editHeight">Height</Label>
              <Input
                id="editHeight"
                type="number"
                value={editRoomData.height}
                onChange={(e) => setEditRoomData((prev) => ({ ...prev, height: parseInt(e.target.value) || 1 }))}
                min="1"
                max="20"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onEditRoom} disabled={loading}>
            <Icon icon="material-symbols:save" className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
