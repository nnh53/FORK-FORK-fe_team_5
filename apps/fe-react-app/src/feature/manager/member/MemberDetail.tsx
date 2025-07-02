import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Separator } from "@/components/Shadcn/ui/separator";
import type { MEMBERSHIP_LEVEL, User } from "@/interfaces/users.interface";
import { formatUserDate } from "@/services/userService";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, CheckCircle, Clock, DollarSign, Mail, Star, UserCheck, User as UserIcon, XCircle } from "lucide-react";

// Extended User interface for display purposes (mapping old fields to new)
interface UserWithMembershipDetails extends User {
  membershipLevel?: MEMBERSHIP_LEVEL;
  totalSpent?: number;
  loyalty_point?: number;
}

interface MemberDetailProps {
  member: UserWithMembershipDetails;
  onClose?: () => void;
}

const MemberDetail = ({ member, onClose }: MemberDetailProps) => {
  // Format date with proper localization
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa cập nhật";

    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: vi });
    } catch {
      return "Định dạng ngày không hợp lệ";
    }
  };

  // Get status badge styles
  const getStatusBadge = (status: string) => {
    const styles: Record<string, { className: string; label: string }> = {
      ACTIVE: { className: "bg-green-100 text-green-800 border-green-200", label: "Đã xác minh" },
      BAN: { className: "bg-red-100 text-red-800 border-red-200", label: "Bị cấm" },
    };
    return styles[status] || { className: "bg-gray-100 text-gray-800", label: status };
  };

  // Get membership badge styles
  const getMembershipBadge = (level: MEMBERSHIP_LEVEL) => {
    if (!level) return null;

    const styles: Record<string, string> = {
      Silver: "bg-gray-200 text-gray-800 border-gray-300",
      Gold: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Platinum: "bg-blue-100 text-blue-800 border-blue-200",
      Diamond: "bg-purple-100 text-purple-800 border-purple-200",
    };

    return <Badge className={`${styles[level] || "bg-gray-100"} py-1 px-2 text-xs font-medium`}>{level}</Badge>;
  };

  // Status badge for current member
  const statusBadge = getStatusBadge(member.status);

  return (
    <DialogContent className="sm:max-w-3xl">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Thông tin chi tiết thành viên
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cột 1: Thông tin cá nhân */}
        <div className="space-y-4">
          <h3 className="font-semibold text-md">Thông tin cá nhân</h3>
          <Separator />

          {member.avatar && (
            <div className="mb-4 flex justify-center">
              <img src={member.avatar} alt={member.fullName} className="h-32 w-32 rounded-full object-cover border-2 border-gray-200" />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{member.fullName || "Chưa cập nhật"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{member.email}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{formatDate(member.dateOfBirth)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
            </div>
          </div>
        </div>

        {/* Cột 2: Thông tin tài khoản */}
        <div className="space-y-4">
          <h3 className="font-semibold text-md">Thông tin tài khoản</h3>
          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-gray-500" />
              <span>
                ID: <span className="font-medium">{member.id}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {member.status === "ACTIVE" ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
              <span>
                Trạng thái: <span className="font-medium">{statusBadge.label}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>
                Ngày tạo: <span className="font-medium">{formatUserDate(member.dateOfBirth)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Cột 3: Thông tin thành viên */}
        <div className="space-y-4">
          <h3 className="font-semibold text-md">Thông tin thành viên</h3>
          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gray-500" />
              <span>
                Hạng thành viên:{" "}
                {member.membershipLevel ? getMembershipBadge(member.membershipLevel) : <span className="text-gray-500">Chưa có</span>}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span>
                Tổng chi tiêu:{" "}
                <span className="font-medium">
                  {member.totalSpent ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(member.totalSpent) : "0 ₫"}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gray-500" />
              <span>
                Điểm tích lũy: <span className="font-medium">{member.loyalty_point || 0} điểm</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {onClose && (
        <DialogFooter>
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      )}
    </DialogContent>
  );
};

export default MemberDetail;
