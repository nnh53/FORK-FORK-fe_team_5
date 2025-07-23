import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/Shadcn/ui/accordion";
import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { CardFooter } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Label } from "@/components/Shadcn/ui/label";
import { Separator } from "@/components/Shadcn/ui/separator";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/Shadcn/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query"; // Import hook
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
    return getUserStatusDisplay(member.status ?? "ACTIVE");
  }, [member]);

  const isMobile = useMediaQuery("(max-width: 700px)"); // Kiểm tra màn hình dưới 700px

  if (!member) {
    return null;
  }

  return (
    <>
      {isMobile ? (
        <Sheet open={open} onOpenChange={onClose}>
          <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-xl">
            <SheetHeader className="border-b p-4">
              <SheetTitle className="text-center text-2xl font-semibold text-gray-900">Thông tin chi tiết thành viên</SheetTitle>
            </SheetHeader>

            <div className="p-4">
              <div className="mb-5 flex flex-row items-center gap-6">
                <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 ring-2 ring-gray-200">
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
                      <UserIcon className="h-16 w-16" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">{member.fullName || "Chưa cập nhật"}</h3>
                    <Badge className={`px-3 py-1 text-base ${statusDisplay.className}`}>{statusDisplay.label}</Badge>
                  </div>
                  <div className="mb-2 flex items-center">
                    <Mail className="mr-2 h-5 w-5 text-blue-600" />
                    <span className="text-base text-gray-700">{member.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-5 w-5 text-gray-600" />
                    <span className="text-base text-gray-700">{member.phone ?? "Chưa cập nhật"}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="contact" className="mb-4 overflow-hidden rounded-md border">
                    <AccordionTrigger className="bg-gray-50 px-4 py-3 text-lg font-semibold text-gray-800">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                        Thông tin liên hệ
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 p-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Địa chỉ</Label>
                        <div className="mt-1 text-base text-gray-900">{member.address ?? "Chưa cập nhật"}</div>
                      </div>
                      <Separator className="bg-gray-200" />
                      <div>
                        <Label className="text-sm font-medium text-gray-600">ID Thành viên</Label>
                        <div className="mt-1 font-mono text-base text-gray-900">{member.id}</div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="personal" className="overflow-hidden rounded-md border">
                    <AccordionTrigger className="bg-gray-50 px-4 py-3 text-lg font-semibold text-gray-800">
                      <div className="flex items-center">
                        <UserIcon className="mr-2 h-5 w-5 text-green-600" />
                        Thông tin cá nhân
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 p-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Ngày sinh</Label>
                          <div className="mt-1 flex items-center text-base">
                            <Calendar className="mr-2 h-4 w-4 text-gray-600" />
                            <span>{formatDateTime(member.dateOfBirth)}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Giới tính</Label>
                          <div className="mt-1">
                            <Badge className={`px-3 py-1 ${getGenderBadgeClass(member.gender || "")}`}>{formatGender(member.gender)}</Badge>
                          </div>
                        </div>
                      </div>
                      <Separator className="bg-gray-200" />
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Điểm tích lũy</Label>
                        <div className="mt-1 text-lg font-bold text-green-700">{member.loyaltyPoint ?? 0} điểm</div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            <SheetFooter className="flex justify-end border-t bg-gray-50 p-3">
              <Button variant="outline" className="px-5 py-1.5 text-base hover:bg-gray-100" onClick={onClose}>
                Đóng
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent className="max-h-[99vh] min-w-[700px] overflow-y-auto rounded-xl bg-white p-5 shadow-2xl">
            <DialogHeader className="border-b p-4">
              <DialogTitle className="text-center text-2xl font-semibold text-gray-900">Thông tin chi tiết thành viên</DialogTitle>
            </DialogHeader>

            <div className="mb-5 flex flex-row items-center gap-6">
              <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 ring-2 ring-gray-200">
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
                    <UserIcon className="h-16 w-16" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">{member.fullName || "Chưa cập nhật"}</h3>
                  <Badge className={`px-3 py-1 text-base ${statusDisplay.className}`}>{statusDisplay.label}</Badge>
                </div>
                <div className="mb-2 flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-blue-600" />
                  <span className="text-base text-gray-700">{member.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-gray-600" />
                  <span className="text-base text-gray-700">{member.phone ?? "Chưa cập nhật"}</span>
                </div>
              </div>
            </div>

            <div className={`grid ${!isMobile ? "grid-cols-2" : "grid-cols-1"} gap-5`}>
              {isMobile ? (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="contact" className="mb-4 overflow-hidden rounded-md border">
                    <AccordionTrigger className="bg-gray-50 px-4 py-3 text-lg font-semibold text-gray-800">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                        Thông tin liên hệ
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 p-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Địa chỉ</Label>
                        <div className="mt-1 text-base text-gray-900">{member.address ?? "Chưa cập nhật"}</div>
                      </div>
                      <Separator className="bg-gray-200" />
                      <div>
                        <Label className="text-sm font-medium text-gray-600">ID Thành viên</Label>
                        <div className="mt-1 font-mono text-base text-gray-900">{member.id}</div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="personal" className="overflow-hidden rounded-md border">
                    <AccordionTrigger className="bg-gray-50 px-4 py-3 text-lg font-semibold text-gray-800">
                      <div className="flex items-center">
                        <UserIcon className="mr-2 h-5 w-5 text-green-600" />
                        Thông tin cá nhân
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 p-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Ngày sinh</Label>
                          <div className="mt-1 flex items-center text-base">
                            <Calendar className="mr-2 h-4 w-4 text-gray-600" />
                            <span>{formatDateTime(member.dateOfBirth)}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Giới tính</Label>
                          <div className="mt-1">
                            <Badge className={`px-3 py-1 ${getGenderBadgeClass(member.gender || "")}`}>{formatGender(member.gender)}</Badge>
                          </div>
                        </div>
                      </div>
                      <Separator className="bg-gray-200" />
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Điểm tích lũy</Label>
                        <div className="mt-1 text-lg font-bold text-green-700">{member.loyaltyPoint ?? 0} điểm</div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                // Desktop view with expanded accordions
                <>
                  <div className="overflow-hidden rounded-md border">
                    <div className="bg-gray-50 px-4 py-3 text-lg font-semibold text-gray-800">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                        Thông tin liên hệ
                      </div>
                    </div>
                    <div className="space-y-3 p-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Địa chỉ</Label>
                        <div className="mt-1 text-base text-gray-900">{member.address ?? "Chưa cập nhật"}</div>
                      </div>
                      <Separator className="bg-gray-200" />
                      <div>
                        <Label className="text-sm font-medium text-gray-600">ID Thành viên</Label>
                        <div className="mt-1 font-mono text-base text-gray-900">{member.id}</div>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-md border">
                    <div className="bg-gray-50 px-4 py-3 text-lg font-semibold text-gray-800">
                      <div className="flex items-center">
                        <UserIcon className="mr-2 h-5 w-5 text-green-600" />
                        Thông tin cá nhân
                      </div>
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Ngày sinh</Label>
                          <div className="mt-1 flex items-center text-base">
                            <Calendar className="mr-2 h-4 w-4 text-gray-600" />
                            <span>{formatDateTime(member.dateOfBirth)}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Giới tính</Label>
                          <div className="mt-1">
                            <Badge className={`px-3 py-1 ${getGenderBadgeClass(member.gender || "")}`}>{formatGender(member.gender)}</Badge>
                          </div>
                        </div>
                      </div>
                      <Separator className="bg-gray-200" />
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Điểm tích lũy</Label>
                        <div className="mt-1 text-lg font-bold text-green-700">{member.loyaltyPoint ?? 0} điểm</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <CardFooter className="flex justify-end border-t bg-gray-50 p-3">
              <Button variant="outline" className="px-5 py-1.5 text-base hover:bg-gray-100" onClick={onClose}>
                Đóng
              </Button>
            </CardFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default MemberDetail;
