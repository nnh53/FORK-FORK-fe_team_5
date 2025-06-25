import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Separator } from "@/components/Shadcn/ui/separator";
import type { MEMBERSHIP_LEVEL, USER_STATUS, UserBase } from "@/interfaces/users.interface";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, CheckCircle, Clock, DollarSign, Mail, Star, User, UserCheck, XCircle } from "lucide-react";

interface MemberDetailProps {
  member: UserBase;
  onClose?: () => void;
}

const MemberDetail = ({ member, onClose }: MemberDetailProps) => {
  // Format date with proper localization
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa cập nhật";

    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: vi });
    } catch {
      // Xử lý lỗi đúng cách: Trả về thông báo lỗi cụ thể thay vì bỏ qua exception
      return "Định dạng ngày không hợp lệ";
    }
  };

  // Get status badge styles
  const getStatusBadge = (status: USER_STATUS) => {
    const styles: Record<USER_STATUS, { className: string; label: string }> = {
      ACTIVE: { className: "bg-green-100 text-green-800 border-green-200", label: "Đã xác minh" },
      UNVERIFY: { className: "bg-gray-100 text-gray-800 border-gray-200", label: "Chưa xác minh" },
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
  const statusBadge = getStatusBadge(member.status_name);

  return (
    <DialogContent className="sm:max-w-3xl">
      <DialogHeader className="space-y-2">
        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
          <User className="h-6 w-6 text-blue-600" />
          Chi tiết thành viên
        </DialogTitle>
        <p className="text-sm text-gray-500">Thông tin chi tiết về thành viên {member.full_name}</p>
        <Separator />
      </DialogHeader>

      {/* Avatar display at top if available */}
      {member.avatar_url && (
        <div className="flex justify-center -mt-2 mb-4">
          <div className="relative">
            <img
              src={member.avatar_url}
              alt={`Avatar của ${member.full_name}`}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
            />
            <Badge className={`absolute bottom-0 right-0 ${statusBadge.className} px-2 py-1 shadow-sm`}>{statusBadge.label}</Badge>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin cơ bản */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-700">
            <UserCheck className="h-5 w-5" />
            Thông tin cơ bản
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="font-medium w-32 text-gray-500 text-sm">ID:</span>
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{member.id}</span>
            </div>
            <div className="flex items-start">
              <span className="font-medium w-32 text-gray-500 text-sm">Họ và tên:</span>
              <span className="font-semibold">{member.full_name}</span>
            </div>
            <div className="flex items-start">
              <span className="font-medium w-32 text-gray-500 text-sm">Email:</span>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-gray-500" />
                <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                  {member.email}
                </a>
              </div>
            </div>
            <div className="flex items-start">
              <span className="font-medium w-32 text-gray-500 text-sm">Ngày sinh:</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{formatDate(member.date_of_birth)}</span>
              </div>
            </div>
            <div className="flex items-start">
              <span className="font-medium w-32 text-gray-500 text-sm">Trạng thái:</span>
              <Badge className={`${statusBadge.className} py-1`}>{statusBadge.label}</Badge>
            </div>
          </div>
        </div>

        {/* Thông tin thành viên */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-700">
            <Star className="h-5 w-5" />
            Thông tin thành viên
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-dashed">
              <span className="font-medium text-gray-500 text-sm">Hạng thành viên:</span>
              {getMembershipBadge(member.membershipLevel) || <span className="text-gray-500 italic">Không có</span>}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-500 text-sm">Điểm tích lũy:</span>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{member.loyalty_point.toLocaleString("vi-VN")}</span>
                <span className="text-xs text-gray-500">điểm</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-500 text-sm">Tổng chi tiêu:</span>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-700">{member.totalSpent.toLocaleString("vi-VN")} VND</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-500 text-sm">Kích hoạt:</span>
              <div className="flex items-center gap-1">
                {member.is_active ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">Đã kích hoạt</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">Chưa kích hoạt</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-500 text-sm">Đăng ký thông báo:</span>
              <div className="flex items-center gap-1">
                {member.is_subscription ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">Đã đăng ký</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">Chưa đăng ký</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin thời gian */}
      <div className="mt-2 pt-3 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1 mb-1 sm:mb-0">
            <Clock className="h-3 w-3" />
            <span>Ngày tạo: {formatDate(member.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Cập nhật lần cuối: {formatDate(member.updatedAt)}</span>
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
