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
      <DialogContent className="max-w-lg bg-base-100 border-base-300">
        <DialogHeader>
          <DialogTitle className="text-xl text-base-content flex items-center">
            <Icon icon="material-symbols:edit" className="mr-2 h-5 w-5 text-primary" />
            Edit Room Information
          </DialogTitle>
          <DialogDescription className="text-base-content/70">
            Update basic room information. Layout changes should be done through the seat editor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="editRoomName" className="text-base-content font-medium">
              Room Name <span className="text-error">*</span>
            </Label>
            <Input
              id="editRoomName"
              value={editRoomData.name}
              onChange={(e) => setEditRoomData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter room name..."
              className="input input-bordered bg-base-100 border-base-300 focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="editRoomType" className="text-base-content font-medium">
              Room Type
            </Label>
            <Select value={editRoomData.type} onValueChange={(value) => setEditRoomData((prev) => ({ ...prev, type: value }))}>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="editWidth" className="text-base-content font-medium">
                Width
              </Label>
              <Input
                id="editWidth"
                type="number"
                value={editRoomData.width}
                onChange={(e) => setEditRoomData((prev) => ({ ...prev, width: parseInt(e.target.value) || 1 }))}
                min="1"
                max="30"
                className="input input-bordered bg-base-100 border-base-300 focus:border-primary"
              />
            </div>
            <div>
              <Label htmlFor="editHeight" className="text-base-content font-medium">
                Height
              </Label>
              <Input
                id="editHeight"
                type="number"
                value={editRoomData.height}
                onChange={(e) => setEditRoomData((prev) => ({ ...prev, height: parseInt(e.target.value) || 1 }))}
                min="1"
                max="20"
                className="input input-bordered bg-base-100 border-base-300 focus:border-primary"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-base-300 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-base-300 hover:bg-base-200">
            Cancel
          </Button>
          <Button onClick={onEditRoom} disabled={loading} className="btn btn-primary">
            <Icon icon="material-symbols:save" className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
