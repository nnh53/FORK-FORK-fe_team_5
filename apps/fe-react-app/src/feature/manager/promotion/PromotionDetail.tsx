import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Separator } from "@/components/Shadcn/ui/separator";

import type { Promotion } from "@/interfaces/promotion.interface";
import { formatPromotionDate, getPromotionStatusLabel, getPromotionTypeLabel } from "@/services/promotionService";
import { formatVND } from "@/utils/currency.utils";
import { Icon } from "@iconify/react";
import React from "react";

interface PromotionDetailProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  promotion?: Promotion;
}

export const PromotionDetail: React.FC<PromotionDetailProps> = ({ open, setOpen, promotion }) => {
  if (!promotion) return null;

  const statusColor = promotion.status === "ACTIVE" ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200";

  const typeColor =
    promotion.type === "PERCENTAGE" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : "bg-purple-100 text-purple-800 hover:bg-purple-200";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-[700px]">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Icon icon="tabler:ticket-discount" className="h-5 w-5 text-blue-600" />
            Chi tiết khuyến mãi
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết về khuyến mãi "{promotion.title}"</DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Hình ảnh khuyến mãi */}
            <div>
              <div className="flex min-h-[240px] w-full items-center justify-center overflow-hidden rounded-md border bg-gray-100 p-4">
                {promotion.image ? (
                  <div className="flex h-full max-h-[400px] w-full items-center justify-center">
                    <img
                      src={promotion.image}
                      alt={promotion.title}
                      className="max-h-[400px] min-h-[200px] w-auto min-w-[200px] max-w-[95%] object-contain transition-transform duration-300 hover:scale-105"
                      style={{ objectFit: "contain", objectPosition: "center" }}
                    />
                  </div>
                ) : (
                  <div className="flex aspect-square w-full flex-col items-center justify-center text-gray-400">
                    <Icon icon="tabler:photo" className="mb-2 h-16 w-16" />
                    <p>Không có hình ảnh</p>
                  </div>
                )}
              </div>

              {/* ID and Status */}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-md bg-gray-50 p-2">
                  <p className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Icon icon="tabler:id" className="h-3 w-3" /> ID
                  </p>
                  <p className="font-medium">{promotion.id}</p>
                </div>

                <div className="rounded-md bg-gray-50 p-2">
                  <p className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Icon icon="tabler:activity" className="h-3 w-3" /> Trạng thái
                  </p>
                  <Badge className={statusColor}>{getPromotionStatusLabel(promotion.status as "ACTIVE" | "INACTIVE")}</Badge>
                </div>
              </div>
            </div>

            {/* Thông tin khuyến mãi */}
            <div className="md:col-span-2">
              {/* Basic Info */}
              <Card className="border shadow-sm">
                <CardContent className="space-y-4 p-4">
                  {/* Tiêu đề + Loại */}
                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1 text-sm font-medium text-gray-500">
                        <Icon icon="tabler:tag" className="h-4 w-4" /> Tên khuyến mãi
                      </p>
                      <p className="text-lg font-semibold">{promotion.title}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="flex items-center gap-1 text-sm font-medium text-gray-500">
                        <Icon icon="tabler:discount-2" className="h-4 w-4" /> Loại khuyến mãi
                      </p>
                      <Badge className={typeColor + " px-2 py-1 text-sm"}>{getPromotionTypeLabel(promotion.type as "PERCENTAGE" | "AMOUNT")}</Badge>
                    </div>
                  </div>

                  <Separator className="bg-blue-50" />

                  {/* Discount details */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1 text-sm font-medium text-gray-500">
                        <Icon icon="tabler:discount-check" className="h-4 w-4" /> Giá trị giảm giá
                      </p>
                      <p className="flex items-center gap-1 font-medium">
                        {promotion.type === "PERCENTAGE" ? (
                          <>
                            <span className="text-xl font-semibold">{promotion.discountValue}%</span>
                            <Icon icon="tabler:percentage" className="h-5 w-5 text-blue-600" />
                          </>
                        ) : (
                          <>
                            <span className="text-xl font-semibold">{formatVND(promotion.discountValue, 0, "")}</span>
                            <Icon icon="tabler:currency-dong" className="h-5 w-5 text-green-600" />
                          </>
                        )}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="flex items-center gap-1 text-sm font-medium text-gray-500">
                        <Icon icon="tabler:shopping-cart" className="h-4 w-4" /> Đơn hàng tối thiểu
                      </p>
                      <p className="flex items-center gap-1 font-medium">
                        <span className="text-xl font-semibold">{formatVND(promotion.minPurchase, 0, "")}</span>
                        <Icon icon="tabler:currency-dong" className="h-5 w-5 text-green-600" />
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-blue-50" />

                  {/* Time details */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1 text-sm font-medium text-gray-500">
                        <Icon icon="tabler:calendar-plus" className="h-4 w-4" /> Thời gian bắt đầu
                      </p>
                      <p className="flex items-center gap-2 font-medium">
                        <Icon icon="tabler:calendar" className="h-4 w-4 text-blue-600" />
                        {formatPromotionDate(promotion.startTime)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="flex items-center gap-1 text-sm font-medium text-gray-500">
                        <Icon icon="tabler:calendar-minus" className="h-4 w-4" /> Thời gian kết thúc
                      </p>
                      <p className="flex items-center gap-2 font-medium">
                        <Icon icon="tabler:calendar" className="h-4 w-4 text-red-600" />
                        {formatPromotionDate(promotion.endTime)}
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-blue-50" />

                  {/* Description */}
                  <div className="space-y-2">
                    <p className="flex items-center gap-1 text-sm font-medium text-gray-500">
                      <Icon icon="tabler:file-description" className="h-4 w-4" /> Mô tả
                    </p>
                    <div className="rounded-md bg-gray-50 p-3">
                      <p className="whitespace-pre-wrap text-gray-700">{promotion.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2 border-t pt-3">
          <Button onClick={() => setOpen(false)} className="w-auto transition-colors">
            <Icon icon="tabler:x" className="mr-2 h-4 w-4" />
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
