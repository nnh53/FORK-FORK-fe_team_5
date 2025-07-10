import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Label } from "@/components/Shadcn/ui/label";
import { Separator } from "@/components/Shadcn/ui/separator";
import type { User } from "@/interfaces/users.interface";
import { formatUserDate } from "@/services/userService";
import { getUserStatusDisplay } from "@/utils/color.utils";
import { Calendar, Mail, MapPin, Phone, User as UserIcon } from "lucide-react";
import { useMemo } from "react";

interface UserWithLoyaltyPoint extends User {
  loyaltyPoint?: number;
}

interface MemberDetailProps {
  member: UserWithLoyaltyPoint | null;
  open: boolean;
  onClose: () => void;
}

// Hàm hiển thị giới tính
const formatGender = (gender?: string) => {
  if (!gender) return "Chưa cập nhật";

  switch (gender) {
    case "MALE":
      return "Nam";
    case "FEMALE":
      return "Nữ";
    case "OTHER":
      return "Khác";
    default:
      return "Chưa cập nhật";
  }
};

// Hàm lấy class cho badge giới tính
const getGenderBadgeClass = (gender: string): string => {
  switch (gender) {
    case "MALE":
      return "bg-blue-100 text-blue-800";
    case "FEMALE":
      return "bg-pink-100 text-pink-800";
    case "OTHER":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Thêm hàm để định dạng thời gian
const formatDateTime = (dateString?: string) => {
  if (!dateString) return "Chưa cập nhật";

  try {
    return formatUserDate(dateString);
  } catch {
    return "Không hợp lệ";
  }
};

const MemberDetail = ({ member, open, onClose }: MemberDetailProps) => {
  const statusDisplay = useMemo(() => {
    if (!member) return { label: "", className: "" };
    return getUserStatusDisplay(member.status);
  }, [member]);

  if (!member) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] overflow-y-auto rounded-xl bg-white shadow-2xl">
        <DialogHeader className="border-b p-6">
          <DialogTitle className="text-center text-3xl font-semibold text-gray-900">Thông tin chi tiết thành viên</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative h-36 w-36 overflow-hidden rounded-full bg-gray-100 ring-2 ring-gray-200">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={`Avatar của ${member.fullName}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullName || "User")}&size=144`;
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-600">
                  <UserIcon className="h-20 w-20" />
                </div>
              )}
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-3xl font-bold text-gray-900">{member.fullName || "Chưa cập nhật"}</h3>
              <Badge className={`px-3 py-1 text-lg ${statusDisplay.className}`}>{statusDisplay.label}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="border-gray-200 shadow-md transition-shadow duration-200 hover:shadow-lg">
              <CardHeader className="bg-gray-50 p-4">
                <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
                  <Mail className="mr-2 h-6 w-6 text-blue-600" />
                  Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <div className="text-lg text-gray-900">{member.email}</div>
                </div>
                <Separator className="bg-gray-200" />
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Số điện thoại</Label>
                  <div className="flex items-center text-lg">
                    <Phone className="mr-2 h-5 w-5 text-gray-600" />
                    <span>{member.phone ?? "Chưa cập nhật"}</span>
                  </div>
                </div>
                <Separator className="bg-gray-200" />
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Địa chỉ</Label>
                  <div className="flex items-center text-lg">
                    <MapPin className="mr-2 h-5 w-5 text-gray-600" />
                    <span>{member.address ?? "Chưa cập nhật"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-md transition-shadow duration-200 hover:shadow-lg">
              <CardHeader className="bg-gray-50 p-4">
                <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
                  <UserIcon className="mr-2 h-6 w-6 text-green-600" />
                  Thông tin cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Ngày sinh</Label>
                  <div className="flex items-center text-lg">
                    <Calendar className="mr-2 h-5 w-5 text-gray-600" />
                    <span>{formatDateTime(member.dateOfBirth)}</span>
                  </div>
                </div>
                <Separator className="bg-gray-200" />
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Giới tính</Label>
                  <div>
                    <Badge className={`px-3 py-1 text-lg ${getGenderBadgeClass(member.gender || "")}`}>{formatGender(member.gender)}</Badge>
                  </div>
                </div>
                <Separator className="bg-gray-200" />
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">ID Thành viên</Label>
                  <div className="font-mono text-lg text-gray-900">{member.id}</div>
                </div>
                <Separator className="bg-gray-200" />
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">Điểm tích lũy</Label>
                  <div className="text-xl font-bold text-green-700">{member.loyaltyPoint ?? 0} điểm</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <CardFooter className="border-t bg-gray-50 p-4">
          <Button variant="outline" className="px-6 py-2 text-lg hover:bg-gray-100" onClick={onClose}>
            Đóng
          </Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDetail;
