import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import type { Member } from "@/interfaces/member.interface";
import type { VoucherValidationResult } from "@/interfaces/voucher.interface";
import { Check, Coins, Gift, Loader2, Ticket, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { memberService } from "../services/memberService";
import { voucherService } from "../services/voucherService";

interface DiscountSectionProps {
  orderAmount: number;
  movieId?: string;
  onPointsChange: (points: number, discount: number) => void;
  onVoucherChange: (code: string, discount: number) => void;
  onMemberChange?: (member: Member | null) => void;
  className?: string;
}

const DiscountSection: React.FC<DiscountSectionProps> = ({
  orderAmount,
  movieId,
  onPointsChange,
  onVoucherChange,
  onMemberChange,
  className = "",
}) => {
  // For demo, we'll allow manual phone input to find member
  const [memberPhone, setMemberPhone] = useState("");
  const [member, setMember] = useState<Member | null>(null);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherValidation, setVoucherValidation] = useState<VoucherValidationResult | null>(null);
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);
  const [isLoadingMember, setIsLoadingMember] = useState(false);

  // Search for member by phone
  const searchMember = async () => {
    if (!memberPhone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    try {
      setIsLoadingMember(true);
      const memberData = await memberService.getMemberByPhone(memberPhone.trim());
      if (memberData) {
        setMember(memberData);
        onMemberChange?.(memberData);
        toast.success(`Tìm thấy thành viên: ${memberData.name}`);
      } else {
        setMember(null);
        onMemberChange?.(null);
        toast.error("Không tìm thấy thành viên với số điện thoại này");
      }
    } catch (error) {
      console.error("Error searching member:", error);
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

  const handleVoucherValidation = async () => {
    if (!voucherCode.trim()) {
      setVoucherValidation(null);
      onVoucherChange("", 0);
      return;
    }

    try {
      setIsValidatingVoucher(true);
      const result = await voucherService.validateVoucher(
        voucherCode.trim(),
        orderAmount - pointsDiscount, // Apply points discount first
        movieId,
      );

      setVoucherValidation(result);

      if (result.isValid) {
        onVoucherChange(voucherCode.trim(), result.discount);
        toast.success(`Áp dụng mã giảm giá thành công! Giảm ${result.discount.toLocaleString()} VNĐ`);
      } else {
        onVoucherChange("", 0);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error validating voucher:", error);
      setVoucherValidation({
        isValid: false,
        discount: 0,
        message: "Có lỗi khi kiểm tra mã giảm giá",
      });
      onVoucherChange("", 0);
      toast.error("Có lỗi khi kiểm tra mã giảm giá");
    } finally {
      setIsValidatingVoucher(false);
    }
  };

  const clearVoucher = () => {
    setVoucherCode("");
    setVoucherValidation(null);
    onVoucherChange("", 0);
  };

  const clearPoints = () => {
    setPointsToUse(0);
    onPointsChange(0, 0);
  };
  const clearMember = () => {
    setMember(null);
    setMemberPhone("");
    onMemberChange?.(null);
    clearPoints();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Ưu đãi & Giảm giá
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Member Search Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Coins className="h-4 w-4 text-yellow-500" />
            Tìm kiếm thành viên để sử dụng điểm
          </Label>

          {!member ? (
            <div className="flex gap-2">
              <Input
                placeholder="Nhập số điện thoại thành viên..."
                value={memberPhone}
                onChange={(e) => setMemberPhone(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchMember()}
                className="flex-1"
                disabled={isLoadingMember}
              />
              <Button onClick={searchMember} disabled={!memberPhone.trim() || isLoadingMember} size="sm" className="min-w-[80px]">
                {isLoadingMember ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tìm"}
              </Button>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-blue-900">{member.name}</div>
                  <div className="text-sm text-blue-700">{member.phone}</div>
                  <div className="flex items-center gap-2 mt-1">
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
            <Label className="text-sm font-medium flex items-center gap-2">
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
                Tối đa {maxPointsCanUse.toLocaleString()} điểm (= {(maxPointsCanUse * 1000).toLocaleString()} VNĐ)
                {pointsToUse > 0 && <span className="text-green-600 font-medium ml-2">Giảm {pointsDiscount.toLocaleString()} VNĐ</span>}
              </div>
            </div>
          </div>
        )}

        {/* Voucher Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Ticket className="h-4 w-4 text-purple-500" />
            Mã giảm giá
          </Label>

          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Nhập mã giảm giá..."
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === "Enter" && handleVoucherValidation()}
                className="flex-1"
                disabled={isValidatingVoucher}
              />
              <Button onClick={handleVoucherValidation} disabled={!voucherCode.trim() || isValidatingVoucher} size="sm" className="min-w-[80px]">
                {isValidatingVoucher ? <Loader2 className="h-4 w-4 animate-spin" /> : "Áp dụng"}
              </Button>
              {voucherValidation?.isValid && (
                <Button variant="ghost" size="sm" onClick={clearVoucher}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Voucher validation result */}
            {voucherValidation && (
              <div
                className={`flex items-center gap-2 text-xs p-2 rounded ${
                  voucherValidation.isValid ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {voucherValidation.isValid ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                <span>{voucherValidation.message}</span>
                {voucherValidation.isValid && voucherValidation.discount > 0 && (
                  <span className="font-medium">(-{voucherValidation.discount.toLocaleString()} VNĐ)</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Demo voucher codes */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-700 mb-2">Mã demo để test:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2 rounded border">
              <div className="font-medium">WELCOME10</div>
              <div className="text-gray-600">Giảm 10%</div>
            </div>
            <div className="bg-white p-2 rounded border">
              <div className="font-medium">MOVIE50K</div>
              <div className="text-gray-600">Giảm 50K</div>
            </div>
            <div className="bg-white p-2 rounded border">
              <div className="font-medium">WEEKEND20</div>
              <div className="text-gray-600">Giảm 20%</div>
            </div>
            <div className="bg-white p-2 rounded border">
              <div className="font-medium">SUMMER100</div>
              <div className="text-gray-600">Giảm 100K</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">SĐT thành viên demo: 0123456789, 0987654321, 0555123456</div>
        </div>

        {/* Total discount summary */}
        {(pointsDiscount > 0 || (voucherValidation?.isValid && voucherValidation.discount > 0)) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-sm font-medium text-green-700">Tổng giảm giá:</div>
            <div className="space-y-1 text-xs text-green-600">
              {pointsDiscount > 0 && <div>• Điểm tích lũy: -{pointsDiscount.toLocaleString()} VNĐ</div>}
              {voucherValidation?.isValid && voucherValidation.discount > 0 && (
                <div>• Mã giảm giá: -{voucherValidation.discount.toLocaleString()} VNĐ</div>
              )}
              <div className="font-medium text-green-700 pt-1 border-t border-green-200">
                Tổng cộng: -{(pointsDiscount + (voucherValidation?.discount || 0)).toLocaleString()} VNĐ
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiscountSection;
