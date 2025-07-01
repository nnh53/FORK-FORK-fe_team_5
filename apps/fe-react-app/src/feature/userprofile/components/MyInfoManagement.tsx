import { Avatar, AvatarFallback, AvatarImage } from "@/components/Shadcn/ui/avatar";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Separator } from "@/components/Shadcn/ui/separator";
import { FormField, SelectField } from "@/components/shared/forms";
import { CITIES, GENDERS, type UserFormData } from "@/constants/userProfile.constants";
import { useUpdateUserData, useUserData } from "@/hooks/userProfile";
import { getUserIdFromCookie } from "@/utils/auth.utils";
import { Calendar, Camera, Mail, MapPin, Phone, User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const MyInfo: React.FC = () => {
  const userId = getUserIdFromCookie();
  const { userInfo, setUserInfo, isLoading, error } = useUserData(userId);
  const { updateUser, mutation } = useUpdateUserData();
  const [isEditing, setIsEditing] = useState(false);

  // Handle mutation success/error
  useEffect(() => {
    if (mutation.isSuccess) {
      setIsEditing(false);
      toast.success("Cập nhật thông tin thành công!");
    } else if (mutation.isError) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.");
      console.error("Failed to update user info:", mutation.error);
    }
  }, [mutation.isSuccess, mutation.isError, mutation.error]);

  const updateField = useCallback(
    (field: keyof UserFormData, value: string) => {
      setUserInfo((prev) => ({ ...prev, [field]: value }));
    },
    [setUserInfo],
  );

  const handleSave = useCallback(() => {
    if (!userId) return;
    updateUser(userId, userInfo);
  }, [userId, userInfo, updateUser]);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          updateField("img", e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [updateField],
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Đang tải thông tin...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Có lỗi xảy ra khi tải thông tin người dùng</div>
      </div>
    );
  }

  // No user ID
  if (!userId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-yellow-500">Không tìm thấy thông tin đăng nhập</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Thông tin tài khoản</h1>
      </div>

      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle>Ảnh đại diện</CardTitle>
          <CardDescription>Cập nhật ảnh đại diện của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userInfo.img} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" className="relative">
                <Camera className="h-4 w-4 mr-2" />
                Thay đổi ảnh
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </Button>
              <p className="text-sm text-muted-foreground">JPG, PNG. Tối đa 5MB</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <FormField id="name" label="Họ và tên" value={userInfo.name} onChange={(value) => updateField("name", value)} disabled={!isEditing} />

            {/* Email */}
            <FormField
              id="email"
              label="Email"
              value={userInfo.email}
              onChange={() => {}}
              disabled={true}
              type="email"
              placeholder="Email không thể thay đổi"
              description="Email không thể thay đổi"
              icon={<Mail className="h-4 w-4" />}
            />

            {/* Phone */}
            <FormField
              id="phone"
              label="Số điện thoại"
              value={userInfo.phone}
              onChange={(value) => updateField("phone", value)}
              disabled={!isEditing}
              icon={<Phone className="h-4 w-4" />}
            />

            {/* Date of Birth */}
            <FormField
              id="dob"
              label="Ngày sinh"
              value={userInfo.dob}
              onChange={(value) => updateField("dob", value)}
              disabled={!isEditing}
              type="date"
              icon={<Calendar className="h-4 w-4" />}
            />

            {/* Gender */}
            <SelectField
              label="Giới tính"
              value={userInfo.gender}
              onChange={(value) => updateField("gender", value)}
              disabled={!isEditing}
              options={GENDERS}
              placeholder="Chọn giới tính"
            />

            {/* City */}
            <SelectField
              label="Thành phố"
              value={userInfo.city}
              onChange={(value) => updateField("city", value)}
              disabled={!isEditing}
              options={CITIES}
              placeholder="Chọn thành phố"
              icon={<MapPin className="h-4 w-4" />}
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input id="address" value={userInfo.address} onChange={(e) => updateField("address", e.target.value)} disabled={!isEditing} />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Chỉnh sửa thông tin</Button>
            ) : (
              <>
                <Button onClick={handleSave} disabled={mutation.isPending}>
                  {mutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={mutation.isPending}>
                  Hủy
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
