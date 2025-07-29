import { Button } from "@/components/Shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { useChangePassword } from "@/services/userService";
import { getUserIdFromCookie } from "@/utils/auth.utils";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// Validation error messages
/* eslint-disable */
const VALIDATION_MESSAGES = {
  OLD_PASSWORD_REQUIRED: "Vui lòng nhập mật khẩu cũ",
  NEW_PASSWORD_REQUIRED: "Vui lòng nhập mật khẩu mới",
  NEW_PASSWORD_MIN_LENGTH: "Mật khẩu mới phải có ít nhất 6 ký tự",
  CONFIRM_PASSWORD_REQUIRED: "Vui lòng xác nhận mật khẩu mới",
  PASSWORDS_NOT_MATCH: "Mật khẩu xác nhận không khớp",
  SAME_PASSWORD: "Mật khẩu mới phải khác mật khẩu cũ",
} as const;
/* eslint-enable */

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ open, onOpenChange }) => {
  const userId = getUserIdFromCookie();
  const changePasswordMutation = useChangePassword();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Helper function to extract error message from API response
  const getErrorMessage = useCallback((error: unknown, defaultMessage = "Có lỗi xảy ra khi đổi mật khẩu"): string => {
    let errorMessage = defaultMessage;

    if (error && typeof error === "object") {
      // Check if error has a response property with data.message (axios style)
      if ("response" in error && error.response && typeof error.response === "object") {
        const response = error.response as { data?: { message?: string } };
        if (response.data?.message) {
          errorMessage = response.data.message;
        }
      }
      // Check if error has a message property directly
      else if ("message" in error && typeof error.message === "string") {
        errorMessage = error.message;
      }
      // Check if error has an error property with message (openapi-fetch specific)
      else if ("error" in error && error.error && typeof error.error === "object" && "message" in error.error) {
        errorMessage = error.error.message as string;
      }
      // Check if error has a data property with message
      else if ("data" in error && error.data && typeof error.data === "object" && "message" in error.data) {
        errorMessage = (error.data as { message: string }).message;
      }
    }

    return errorMessage;
  }, []);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      setShowPasswords({ old: false, new: false, confirm: false });
    }
  }, [open]);

  // Handle mutation success/error
  useEffect(() => {
    if (changePasswordMutation.isSuccess) {
      toast.success("Đổi mật khẩu thành công!");
      onOpenChange(false);
    } else if (changePasswordMutation.isError) {
      const errorMessage = getErrorMessage(changePasswordMutation.error);
      toast.error(errorMessage);
    }
  }, [changePasswordMutation.isSuccess, changePasswordMutation.isError, changePasswordMutation.error, onOpenChange, getErrorMessage]);

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = VALIDATION_MESSAGES.OLD_PASSWORD_REQUIRED;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = VALIDATION_MESSAGES.NEW_PASSWORD_REQUIRED;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = VALIDATION_MESSAGES.NEW_PASSWORD_MIN_LENGTH;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.PASSWORDS_NOT_MATCH;
    }

    if (formData.oldPassword && formData.newPassword && formData.oldPassword === formData.newPassword) {
      newErrors.newPassword = VALIDATION_MESSAGES.SAME_PASSWORD;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!userId) {
        toast.error("Không tìm thấy thông tin đăng nhập");
        return;
      }

      if (!validateForm()) {
        return;
      }

      console.log("🔍 ChangePasswordDialog - Submitting password change");
      console.log("🔍 UserId:", userId);

      changePasswordMutation.mutate({
        params: { path: { userId } },
        body: {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
      });
    },
    [userId, formData, validateForm, changePasswordMutation],
  );

  const updateField = useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors],
  );

  const togglePasswordVisibility = useCallback((field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="text-primary h-5 w-5" />
            Đổi mật khẩu
          </DialogTitle>
          <DialogDescription>Vui lòng nhập mật khẩu cũ và mật khẩu mới để thay đổi mật khẩu của bạn.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password */}
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Mật khẩu cũ *</Label>
            <div className="relative">
              <Input
                id="oldPassword"
                type={showPasswords.old ? "text" : "password"}
                value={formData.oldPassword}
                onChange={(e) => updateField("oldPassword", e.target.value)}
                className={errors.oldPassword ? "border-red-500" : ""}
                disabled={changePasswordMutation.isPending}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("old")}
                disabled={changePasswordMutation.isPending}
              >
                {showPasswords.old ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
              </Button>
            </div>
            {errors.oldPassword && <p className="text-sm text-red-500">{errors.oldPassword}</p>}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới *</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => updateField("newPassword", e.target.value)}
                className={errors.newPassword ? "border-red-500" : ""}
                disabled={changePasswordMutation.isPending}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("new")}
                disabled={changePasswordMutation.isPending}
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
              </Button>
            </div>
            {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                className={errors.confirmPassword ? "border-red-500" : ""}
                disabled={changePasswordMutation.isPending}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("confirm")}
                disabled={changePasswordMutation.isPending}
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
              </Button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={changePasswordMutation.isPending}>
              Hủy
            </Button>
            <Button type="submit" disabled={changePasswordMutation.isPending}>
              {changePasswordMutation.isPending ? "Đang xử lý..." : "Đổi mật khẩu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
