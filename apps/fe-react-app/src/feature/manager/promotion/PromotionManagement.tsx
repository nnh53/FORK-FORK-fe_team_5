import { type TableColumns } from "@/components/CustomTable";
import { Button } from "@/components/Shadcn/ui/button";
import { Calendar } from "@/components/Shadcn/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Shadcn/ui/popover";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Promotion } from "@/interfaces/promotion.interface";
import { transformPromotionsResponse, usePromotions } from "@/services/promotionService";
import { ChevronDownIcon, Plus, RefreshCw } from "lucide-react";
import React, { useState } from "react";
import { PromotionDialog } from "./PromotionDialog";
import { PromotionTable } from "./PromotionTable";

export const PromotionManagement: React.FC = () => {
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion>();
  const [open, setOpen] = useState<boolean>(false);
  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);

  // Use the promotionService hook instead of direct fetch
  const { data: promotionsData, isLoading, refetch } = usePromotions();
  const promotions = promotionsData?.result ? transformPromotionsResponse(promotionsData.result) : [];

  const promotionColumn: TableColumns[] = [
    {
      header: "#",
      accessorKey: "id",
      width: "w-[5%]",
    },
    {
      header: "Tên",
      accessorKey: "title",
      width: "w-[10%]",
    },
    {
      header: "Nội dung",
      accessorKey: "description",
      width: "w-[20%]",
    },
    {
      header: "Mức giảm giá",
      accessorKey: "discountValue",
    },
    {
      header: "Mức áp dụng",
      accessorKey: "minPurchase",
      width: "w-[10%]",
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
    },
    {
      header: "Loại",
      accessorKey: "type",
    },
    {
      header: "Bắt đầu",
      accessorKey: "startTime",
    },
    {
      header: "Kết thúc",
      accessorKey: "endTime",
    },
  ];

  const handleOpenDialog = (id?: number) => {
    if (id !== undefined) {
      const promotion: Promotion | undefined = promotions.find((pro) => pro.id === id);
      if (promotion !== undefined) {
        setSelectedPromotion(promotion);
        setOpen(true);
      }
    } else {
      setSelectedPromotion(undefined);
      setOpen(true);
    }
  };

  // Handle dialog close with refresh if needed
  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedPromotion(undefined);
    refetch();
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>Promotion Management</CardTitle>
              <Button variant="outline" size="icon" onClick={() => refetch()} title="Refresh">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Promotion
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex gap-4">
              <div className="mb-4 flex gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" id="from" className="w-48 justify-between font-normal">
                      {from ? from.toLocaleDateString() : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={from}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setFrom(date);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" id="to" className="w-48 justify-between font-normal">
                      {to ? to.toLocaleDateString() : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={to}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setTo(date);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {isLoading ? (
              <LoadingSpinner name="khuyến mãi" />
            ) : (
              <PromotionTable promotions={promotions} columns={promotionColumn} onView={handleOpenDialog} />
            )}
          </CardContent>
        </Card>
      </div>
      <PromotionDialog open={open} setOpen={handleCloseDialog} selectedPromotion={selectedPromotion} setSelectedPromotion={setSelectedPromotion} />
    </>
  );
};
