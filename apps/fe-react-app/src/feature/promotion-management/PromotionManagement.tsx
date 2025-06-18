import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Promotion } from "@/interfaces/promotion.interface.";
import { type TableColumns } from "@/utils/Table";
import { ChevronDownIcon, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PromotionDialog } from "./PromotionDialog";
import { PromotionTable } from "./PromotionTable";
export const PromotionManagement: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion>();
  const [open, setOpen] = useState<boolean>(false);
  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);
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
  const getPromotions = async () => {
    try {
      const res = await fetch("http://localhost:3000/promotions");
      if (res.ok) {
        const promotionData: Promotion[] = await res.json();
        setPromotions(promotionData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPromotions();
  }, []);

  const handleOpenDialog = (id?: number) => {
    if (id != undefined) {
      const promotion: Promotion | undefined = promotions.find((pro) => pro.id == id);
      if (promotion != undefined) {
        setSelectedPromotion(promotion);
        setOpen(true);
      }
    } else setOpen(true);
  };

  // const handleSearch = () => {
  //   setSearchQuery(searchInput);
  // };

  // const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     handleSearch();
  //   }
  // };

  return (
    <>
      <div className="container mx-auto p-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>Promotion Management</CardTitle>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Promotion
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex gap-4">
              {/*<Input*/}
              {/*  type="text"*/}
              {/*  placeholder="Search promotions"*/}
              {/*  value={searchInput}*/}
              {/*  onChange={(e) => setSearchInput(e.target.value)}*/}
              {/*  onKeyPress={handleKeyPress}*/}
              {/*  maxLength={28}*/}
              {/*  className="mr-2 w-1/3"*/}
              {/*/>*/}
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
              {/*<Button onClick={handleSearch}>Search</Button>*/}

              {/* <DatePicker ></DatePicker> */}
            </div>
            <PromotionTable promotions={promotions} columns={promotionColumn} onView={handleOpenDialog} />
          </CardContent>
        </Card>
      </div>
      <PromotionDialog
        open={open}
        setOpen={setOpen}
        selectedPromotion={selectedPromotion}
        setSelectedPromotion={setSelectedPromotion}
        onSubmit={(values, helpers) => {
          console.log("submit", values);
          helpers.setSubmitting(false);
        }}
      />
    </>
  );
};
