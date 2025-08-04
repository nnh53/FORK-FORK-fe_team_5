import { Avatar, AvatarFallback, AvatarImage } from "@/components/Shadcn/ui/avatar";
import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Separator } from "@/components/Shadcn/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useImageUploadAndUpdate } from "@/hooks/useImageUploadAndUpdate";
import { useUserData } from "@/hooks/userProfile";
import { getUserIdFromCookie } from "@/utils/auth.utils";
import { Calendar, Camera, Edit, Gem, KeyRound, Mail, MapPin, Phone, User } from "lucide-react";
import { useCallback, useState } from "react";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { EditUserInfoDialog } from "./EditUserInfoDialog";

export const MyInfo: React.FC = () => {
  const userId = getUserIdFromCookie();
  const { userInfo, isLoading, error } = useUserData(userId);
  const { uploadAndUpdateAvatar, isUploading: isUploadingAndUpdating } = useImageUploadAndUpdate();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Use media query to detect small screens
  const isSmallScreen = useMediaQuery("(max-width: 544px)");
  const isExtraSmallScreen = useMediaQuery("(max-width: 444px)");

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !userId) return;

      try {
        console.log("🔍 MyInfoManagement - Starting image upload and user update");

        // Use the combined hook to upload and update user immediately
        await uploadAndUpdateAvatar(file, userId, userInfo);

        console.log("🔍 MyInfoManagement - Upload and update completed");
      } catch (error) {
        console.error("Upload and update failed:", error);
        // Error message is already handled in the hook
      }
    },
    [uploadAndUpdateAvatar, userId, userInfo],
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">Đang tải thông tin...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg text-red-500">Có lỗi xảy ra khi tải thông tin người dùng</div>
      </div>
    );
  }

  // No user ID
  if (!userId) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg text-yellow-500">Không tìm thấy thông tin đăng nhập</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <User className="text-primary h-6 w-6" />
        <h1 className="text-3xl font-bold">Thông tin tài khoản</h1>
      </div>

      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle>Ảnh đại diện</CardTitle>
          <CardDescription>Cập nhật ảnh đại diện của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`flex ${isSmallScreen ? "flex-col" : "items-center justify-between"} gap-6`}>
            <div className={`flex ${isExtraSmallScreen ? "flex-col items-center" : "gap-4"}`}>
              <Avatar className="h-24 w-24">
                <AvatarImage src={userInfo.img} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div className={` ${isExtraSmallScreen ? "mt-1 flex flex-col items-center space-y-1 text-center" : "space-y-2"}`}>
                <Button variant="outline" className="relative" disabled={isUploadingAndUpdating}>
                  <Camera className="mr-2 h-4 w-4" />
                  {isUploadingAndUpdating ? "Đang tải lên và cập nhật..." : "Thay đổi ảnh"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 cursor-pointer opacity-0"
                    disabled={isUploadingAndUpdating}
                  />
                </Button>
                <p className="text-muted-foreground text-sm">JPG, PNG. Tối đa 4MB (sẽ được nén thành WebP và tự động cập nhật)</p>
              </div>
            </div>

            {/* Loyalty Points Display */}
            <div className={`p-4 ${isSmallScreen ? "mx-auto" : ""}`}>
              <div className="flex flex-col items-center space-y-2">
                <Badge variant="secondary" className="px-3 py-1">
                  <Gem className="text-primary mr-1 h-4 w-4" />
                  Điểm thành viên
                </Badge>
                <div className="text-primary text-3xl font-bold">{userInfo.loyaltyPoint || 0}</div>
                <p className="text-muted-foreground text-xs">Điểm tích lũy của bạn</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin cá nhân
          </CardTitle>
          <CardDescription>Quản lý thông tin cá nhân của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Name */}
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                Họ và tên
              </div>
              <div className="text-base">{userInfo.name || "Chưa cập nhật"}</div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <div className="text-base">{userInfo.email || "Chưa cập nhật"}</div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <Phone className="h-4 w-4" />
                Số điện thoại
              </div>
              <div className="text-base">{userInfo.phone || "Chưa cập nhật"}</div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                Ngày sinh
              </div>
              <div className="text-base">{userInfo.dob || "Chưa cập nhật"}</div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4" />
                Giới tính
              </div>
              <div className="text-base">
                {(() => {
                  if (userInfo.gender === "male") return "Nam";
                  if (userInfo.gender === "female") return "Nữ";
                  return "Chưa cập nhật";
                })()}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4" />
              Địa chỉ
            </div>
            <div className="text-base">{userInfo.address || "Chưa cập nhật"}</div>
          </div>

          {/* Action Buttons */}
          <div className={`flex ${isExtraSmallScreen ? "flex-col" : ""} gap-2`}>
            <Button onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa thông tin
            </Button>
            <Button variant="outline" onClick={() => setIsChangePasswordOpen(true)}>
              <KeyRound className="mr-2 h-4 w-4" />
              Đổi mật khẩu
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <ChangePasswordDialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen} />

      {/* Edit User Info Dialog */}
      {userId && <EditUserInfoDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} userInfo={userInfo} userId={userId} />}
    </div>
  );
};
