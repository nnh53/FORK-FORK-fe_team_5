import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import type { SeatType } from "@/interfaces/seat.interface";
import { getSeatTypeLabel, SEAT_TYPE_OPTIONS, transformSeatTypeToRequest, useSeatTypes, useUpdateSeatType } from "@/services/seatTypeService";
import { Edit, Save, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const SeatTypeAdminPage: React.FC = () => {
  const { data: seatTypesData, isLoading, refetch } = useSeatTypes();
  const updateMutation = useUpdateSeatType();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    price: number;
  }>({
    name: "REGULAR",
    price: 0,
  });

  // Transform API response to get seat types array
  const seatTypes: SeatType[] = seatTypesData?.result || [];

  const handleEdit = (seatType: SeatType) => {
    setEditingId(seatType.id ?? null);
    setEditForm({
      name: seatType.name ?? "REGULAR",
      price: seatType.price ?? 0,
    });
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      const requestData = transformSeatTypeToRequest({
        name: editForm.name as "VIP" | "REGULAR" | "COUPLE" | "PATH" | "BLOCK",
        price: editForm.price,
      });

      await updateMutation.mutateAsync({
        params: { path: { id: editingId } },
        body: requestData,
      });

      toast.success("Cập nhật loại ghế thành công!");
      setEditingId(null);
      refetch();
    } catch (error) {
      console.log("Error updating seat type:", error);
      toast.error("Cập nhật loại ghế thất bại!");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ name: "REGULAR", price: 0 });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý loại ghế</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {seatTypes.map((seatType) => (
              <div key={seatType.id} className="flex items-center justify-between rounded-lg border bg-gray-50 p-4 dark:bg-gray-800">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="min-w-[80px]">
                    {getSeatTypeLabel(seatType.name ?? "REGULAR")}
                  </Badge>
                  <div className="text-sm text-gray-600 dark:text-gray-300">ID: {seatType.id}</div>
                  {editingId === seatType.id ? (
                    <div className="flex items-center space-x-2">
                      <div>
                        <Label className="text-xs">Loại</Label>
                        <Select value={editForm.name} onValueChange={(value) => setEditForm((prev) => ({ ...prev, name: value }))}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SEAT_TYPE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Giá (VNĐ)</Label>
                        <Input
                          type="number"
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              price: Number(e.target.value),
                            }))
                          }
                          className="w-24"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">Giá: {seatType.price?.toLocaleString() ?? 0} VNĐ</span>
                      {seatType.seatCount && <span className="text-sm text-gray-600 dark:text-gray-300">Số ghế: {seatType.seatCount}</span>}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {editingId === seatType.id ? (
                    <>
                      <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
                        <Save className="h-4 w-4" />
                        Lưu
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleEdit(seatType)}>
                      <Edit className="h-4 w-4" />
                      Chỉnh sửa
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {seatTypes.length === 0 && <div className="py-8 text-center text-gray-500">Không có loại ghế nào được tìm thấy</div>}
          </div>
        </CardContent>
      </Card>

      {/* Summary statistics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Thống kê</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{seatTypes.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Tổng số loại ghế</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{seatTypes.filter((t) => t.name === "VIP").length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Loại VIP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{seatTypes.filter((t) => t.name === "REGULAR").length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Loại thường</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{seatTypes.filter((t) => t.name === "COUPLE").length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Loại đôi</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeatTypeAdminPage;
