import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { FormField, SelectField } from "@/components/shared/forms";
import { GENDERS, type UserFormData } from "@/constants/profile";
import { useUpdateUserData } from "@/hooks/userProfile";
import { Calendar, Phone, User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface EditUserInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userInfo: UserFormData;
  userId: string;
}

export const EditUserInfoDialog: React.FC<EditUserInfoDialogProps> = ({ open, onOpenChange, userInfo, userId }) => {
  const { updateUser, mutation } = useUpdateUserData();
  const [formData, setFormData] = useState<UserFormData>(userInfo);
  const [originalData, setOriginalData] = useState<UserFormData>(userInfo);

  // Initialize form data when dialog opens
  useEffect(() => {
    if (open) {
      setFormData(userInfo);
      setOriginalData(userInfo);
    }
  }, [open, userInfo]);

  // Handle mutation success/error
  useEffect(() => {
    if (mutation.isSuccess) {
      console.log("✅ EditUserInfoDialog - Update successful");
      toast.success("Cập nhật thông tin thành công!");
      onOpenChange(false);
    } else if (mutation.isError) {
      console.error("❌ EditUserInfoDialog - Update failed:", mutation.error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.");
    }
  }, [mutation.isSuccess, mutation.isError, mutation.error, onOpenChange]);

  const updateField = useCallback((field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const getChangedFields = useCallback(() => {
    const fieldsToCompare = ["name", "phone", "address", "dob", "gender"] as const;
    const changedFields: Partial<{
      name: string;
      email: string;
      phone: string;
      address: string;
      avatar?: string;
      dob?: string;
      gender?: string;
    }> = {};

    fieldsToCompare.forEach((field) => {
      const original = originalData[field] || "";
      const current = formData[field] || "";
      if (original !== current) {
        changedFields[field] = current;
      }
    });

    console.log("🔍 Changed fields detected:", changedFields);
    return changedFields;
  }, [originalData, formData]);

  const hasChanges = useCallback(() => {
    return Object.keys(getChangedFields()).length > 0;
  }, [getChangedFields]);

  const handleSave = useCallback(() => {
    if (!userId || !hasChanges()) return;

    const changedFields = getChangedFields();
    console.log("🔍 EditUserInfoDialog - Saving only changed fields:", changedFields);
    updateUser(userId, changedFields);
  }, [userId, getChangedFields, updateUser, hasChanges]);

  const handleCancel = useCallback(() => {
    // Reset form data
    setFormData(originalData);
    onOpenChange(false);
  }, [originalData, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Chỉnh sửa thông tin cá nhân
          </DialogTitle>
          <DialogDescription>Cập nhật thông tin cá nhân của bạn. Chỉ những field có thay đổi sẽ được gửi lên server.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Name */}
            <FormField id="edit-name" label="Họ và tên" value={formData.name} onChange={(value) => updateField("name", value)} disabled={false} />

            {/* Phone */}
            <FormField
              id="edit-phone"
              label="Số điện thoại"
              value={formData.phone}
              onChange={(value) => updateField("phone", value)}
              disabled={false}
              icon={<Phone className="h-4 w-4" />}
            />

            {/* Date of Birth */}
            <FormField
              id="edit-dob"
              label="Ngày sinh"
              value={formData.dob}
              onChange={(value) => updateField("dob", value)}
              disabled={false}
              type="date"
              icon={<Calendar className="h-4 w-4" />}
            />

            {/* Gender */}
            <SelectField
              label="Giới tính"
              value={formData.gender}
              onChange={(value) => updateField("gender", value)}
              disabled={false}
              options={GENDERS}
              placeholder="Chọn giới tính"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="edit-address">Địa chỉ</Label>
            <Input id="edit-address" value={formData.address} onChange={(e) => updateField("address", e.target.value)} disabled={false} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={mutation.isPending}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={mutation.isPending || !hasChanges()}>
            {mutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
