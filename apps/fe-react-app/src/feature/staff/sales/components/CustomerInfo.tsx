import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Separator } from "@/components/Shadcn/ui/separator";
import { Switch } from "@/components/Shadcn/ui/switch";
import type { Member } from "@/interfaces/member.interface";
import { User, Users } from "lucide-react";
import React from "react";

interface CustomerInfoProps {
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  memberPhone: string;
  memberInfo: Member | null;
  useUnknownCustomer?: boolean;
  onCustomerInfoChange: (field: string, value: string) => void;
  onMemberPhoneChange: (phone: string) => void;
  onSearchMember: () => void;
  onUnknownCustomerToggle?: (useUnknown: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({
  customerInfo,
  memberPhone,
  memberInfo,
  useUnknownCustomer = false,
  onCustomerInfoChange,
  onMemberPhoneChange,
  onSearchMember,
  onUnknownCustomerToggle,
  onBack,
  onNext,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Thông Tin Khách Hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Unknown Customer Toggle */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-base font-medium">Khách vãng lai</span>
            </div>
            <p className="text-muted-foreground text-sm">Sử dụng cho khách hàng không đăng ký trong hệ thống</p>
          </div>
          <Switch checked={useUnknownCustomer} onCheckedChange={onUnknownCustomerToggle} />
        </div>

        {!useUnknownCustomer && (
          <>
            {/* Member Search */}
            <div className="rounded-lg border bg-blue-50 p-4">
              <h3 className="mb-3 font-semibold">Tìm Hội Viên</h3>
              <div className="flex gap-2">
                <Input placeholder="Số điện thoại hoặc email hội viên" value={memberPhone} onChange={(e) => onMemberPhoneChange(e.target.value)} />
                <Button onClick={onSearchMember}>Tìm kiếm</Button>
              </div>

              {memberInfo && (
                <div className="mt-3 rounded border bg-green-50 p-3">
                  <p className="font-semibold">{memberInfo.name}</p>
                  <p className="text-sm text-gray-600">{memberInfo.phone}</p>
                  <p className="text-sm text-gray-600">Điểm tích lũy: {memberInfo.currentPoints}</p>
                  <p className="text-sm text-gray-600">Hạng: {memberInfo.membershipLevel}</p>
                </div>
              )}
            </div>

            <Separator />
          </>
        )}

        {/* Customer Info Form */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="name">
              Họ và tên <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={customerInfo.name}
              onChange={(e) => onCustomerInfoChange("name", e.target.value)}
              placeholder="Nhập họ và tên"
              disabled={useUnknownCustomer}
            />
          </div>
          <div>
            <Label htmlFor="phone">
              Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              value={customerInfo.phone}
              onChange={(e) => onCustomerInfoChange("phone", e.target.value)}
              placeholder="Nhập số điện thoại"
              disabled={useUnknownCustomer}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => onCustomerInfoChange("email", e.target.value)}
              placeholder="Nhập email (không bắt buộc)"
              disabled={useUnknownCustomer}
            />
          </div>
        </div>

        {useUnknownCustomer && (
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Lưu ý:</strong> Booking sẽ được tạo với thông tin khách vãng lai. Khách hàng sẽ không tích lũy điểm thưởng.
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-2">
          <Button variant="outline" onClick={onBack}>
            Quay lại
          </Button>
          <Button onClick={onNext} disabled={!useUnknownCustomer && (!customerInfo.name || !customerInfo.phone)}>
            Tiếp tục
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInfo;
