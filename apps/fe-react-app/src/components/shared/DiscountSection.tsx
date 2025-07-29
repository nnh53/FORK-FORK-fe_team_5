import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import type { Member } from "@/interfaces/member.interface";
import { memberService } from "@/services/memberService";
import { formatVND } from "@/utils/currency.utils";
import { Coins, Gift, Loader2, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface DiscountSectionProps {
  orderAmount: number;
  movieId?: string;
  onPointsChange: (points: number, discount: number) => void;
  onVoucherChange: (code: string, discount: number) => void;
  onMemberChange?: (member: Member | null) => void;
  className?: string;
  // Mode: 'auto' for checkout page (use logged in user), 'manual' for staff page (search by phone/email)
  mode?: "auto" | "manual";
  // Current logged in user (for auto mode)
  currentUser?: {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    loyalty_point?: number;
  } | null;
}

const DiscountSection: React.FC<DiscountSectionProps> = ({
  orderAmount,
  movieId,
  onPointsChange,
  onVoucherChange,
  onMemberChange,
  className = "",
  mode = "manual", // Default to manual mode for backward compatibility
  currentUser = null,
}) => {
  // State for manual mode (staff search)
  const [searchValue, setSearchValue] = useState(""); // Can be phone or email
  const [member, setMember] = useState<Member | null>(null);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [isLoadingMember, setIsLoadingMember] = useState(false);

  // Auto load member from current user in auto mode
  React.useEffect(() => {
    if (mode === "auto" && currentUser && !member) {
      // Convert current user to member format
      const autoMember: Member = {
        id: currentUser.id,
        name: currentUser.full_name,
        phone: currentUser.phone,
        email: currentUser.email,
        currentPoints: currentUser.loyalty_point || 0,
        membershipLevel: "Silver", // Default level
        totalSpent: 0,
        createdAt: new Date().toICTISOString(),
        updatedAt: new Date().toICTISOString(),
      };
      setMember(autoMember);
      onMemberChange?.(autoMember);
    }
  }, [mode, currentUser, member, onMemberChange]);

  // Search for member by phone or email (manual mode)
  const searchMember = async () => {
    if (!searchValue.trim()) {
      toast.error("Vui lòng nhập số điện thoại hoặc email");
      return;
    }

    try {
      setIsLoadingMember(true);
      const memberData = await memberService.searchMember(searchValue.trim());
      if (memberData) {
        setMember(memberData);
        onMemberChange?.(memberData);
        toast.success(`Tìm thấy thành viên: ${memberData.name}`);
      } else {
        setMember(null);
        onMemberChange?.(null);
        toast.error("Không tìm thấy thành viên với thông tin này");
      }
    } catch {
      toast.error("Có lỗi khi tìm kiếm thành viên");
      setMember(null);
    } finally {
      setIsLoadingMember(false);
    }
  };

  // Calculate points discount (1 point = 1000 VND)
  const pointsDiscount = pointsToUse * 1000;
  const maxPointsCanUse = member ? Math.min(member.currentPoints, Math.floor(orderAmount / 1000)) : 0;

  const handlePointsChange = (value: number) => {
    const validPoints = Math.min(Math.max(0, value), maxPointsCanUse);
    setPointsToUse(validPoints);
    onPointsChange(validPoints, validPoints * 1000);
  };

  const clearPoints = () => {
    setPointsToUse(0);
    onPointsChange(0, 0);
  };
  const clearMember = () => {
    // Only allow clearing member in manual mode
    if (mode === "manual") {
      setMember(null);
      setSearchValue("");
      onMemberChange?.(null);
      clearPoints();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Đổi điểm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Member Search Section */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Coins className="h-4 w-4 text-yellow-500" />
            Tìm kiếm thành viên để sử dụng điểm
          </Label>

          {!member ? (
            <div className="flex gap-2">
              <Input
                placeholder="Nhập số điện thoại thành viên..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchMember()}
                className="flex-1"
                disabled={isLoadingMember}
              />
              <Button onClick={searchMember} disabled={!searchValue.trim() || isLoadingMember} size="sm" className="min-w-[80px]">
                {isLoadingMember ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tìm"}
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-blue-900">{member.name}</div>
                  <div className="text-sm text-blue-700">{member.phone}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {member.membershipLevel}
                    </Badge>
                    <span className="text-xs text-blue-600">{member.currentPoints.toLocaleString()} điểm</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={clearMember}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Points Section */}
        {member && (
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Coins className="h-4 w-4 text-yellow-500" />
              Sử dụng điểm tích lũy
            </Label>

            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Nhập số điểm..."
                  value={pointsToUse || ""}
                  onChange={(e) => handlePointsChange(parseInt(e.target.value) || 0)}
                  max={maxPointsCanUse}
                  min={0}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={() => handlePointsChange(maxPointsCanUse)} disabled={maxPointsCanUse === 0}>
                  Dùng hết
                </Button>
                {pointsToUse > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearPoints}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="text-xs text-gray-600">
                Tối đa {maxPointsCanUse.toLocaleString()} điểm (= {formatVND(maxPointsCanUse * 1000)})
                {pointsToUse > 0 && <span className="ml-2 font-medium text-green-600">Giảm {formatVND(pointsDiscount)}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Total discount summary */}
        {pointsDiscount > 0 && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3">
            <div className="text-sm font-medium text-green-700">Tổng giảm giá:</div>
            <div className="space-y-1 text-xs text-green-600">
              {pointsDiscount > 0 && <div>• Điểm tích lũy: -{formatVND(pointsDiscount)}</div>}
              <div className="border-t border-green-200 pt-1 font-medium text-green-700">Tổng cộng: -{formatVND(pointsDiscount)}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiscountSection;
