import { Alert, AlertDescription } from "@/components/Shadcn/ui/alert";
import { Badge } from "@/components/Shadcn/ui/badge";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent } from "@/components/Shadcn/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Icon } from "@iconify/react";
import { AlertCircle, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { CinemaRoom } from "@/interfaces/cinemarooms.interface";
import { cinemaRoomService } from "@/services/cinemaRoomService";
import { RoomListView } from "./components/RoomListView";

type SortOption = "all" | "Standard" | "VIP" | "IMAX" | "4DX";
type RoomStatus = "ACTIVE" | "MAINTENANCE" | "CLOSED";

interface RoomFormData {
  name: string;
  type: string;
  roomNumber: number;
  fee: number;
  width: number;
  length: number;
}

const CinemaRoomManagement: React.FC = () => {
  const navigate = useNavigate();

  // State management
  const [rooms, setRooms] = useState<CinemaRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("all");

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<CinemaRoom | null>(null);
  const [newStatus, setNewStatus] = useState<RoomStatus>("ACTIVE");

  // Form data
  const [formData, setFormData] = useState<RoomFormData>({
    name: "",
    type: "Standard",
    roomNumber: 1,
    fee: 50000,
    width: 16,
    length: 10,
  });

  // Load rooms data
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const roomsData = await cinemaRoomService.getAllRooms();
      setRooms(roomsData);
    } catch (err) {
      console.error("Error loading rooms:", err);
      setError("Lỗi khi tải danh sách phòng chiếu");
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelect = (roomId: string) => {
    navigate(`/admin/cinema-room/${roomId}/seat-map`);
  };

  const handleEditRoom = (room: CinemaRoom) => {
    setSelectedRoom(room);
    setFormData({
      name: room.name,
      type: room.type,
      roomNumber: room.roomNumber || 1,
      fee: room.fee || 50000,
      width: room.width,
      length: room.length || 10,
    });
    setShowEditDialog(true);
  };

  const handleChangeStatus = (room: CinemaRoom) => {
    setSelectedRoom(room);
    setNewStatus(room.status);
    setShowStatusDialog(true);
  };

  const handleDeleteRoom = (room: CinemaRoom) => {
    setSelectedRoom(room);
    setShowDeleteDialog(true);
  };

  const handleAddRoom = () => {
    setFormData({
      name: "",
      type: "Standard",
      roomNumber: rooms.length + 1,
      fee: 50000,
      width: 16,
      length: 10,
    });
    setShowAddDialog(true);
  };

  const handleFormSubmit = async (isEdit: boolean = false) => {
    try {
      if (isEdit && selectedRoom) {
        // Update room logic
        await cinemaRoomService.updateRoom(selectedRoom.id, {
          name: formData.name,
          type: formData.type,
          roomNumber: formData.roomNumber,
          fee: formData.fee,
          width: formData.width,
          length: formData.length,
        });
        setShowEditDialog(false);
      } else {
        // Create room logic
        await cinemaRoomService.createRoom({
          name: formData.name,
          type: formData.type,
          roomNumber: formData.roomNumber,
          fee: formData.fee,
          width: formData.width,
          length: formData.length,
          capacity: formData.width * formData.length, // Calculate capacity
          status: "ACTIVE", // Default status
        });
        setShowAddDialog(false);
      }

      await loadRooms(); // Reload rooms
      console.log(isEdit ? "Cập nhật phòng thành công!" : "Tạo phòng mới thành công!");
    } catch (err) {
      console.error("Error saving room:", err);
      setError(isEdit ? "Lỗi khi cập nhật phòng" : "Lỗi khi tạo phòng mới");
    }
  };

  const handleStatusChange = async () => {
    if (!selectedRoom) return;

    try {
      await cinemaRoomService.updateRoomStatus(selectedRoom.id, newStatus);
      setShowStatusDialog(false);
      await loadRooms();
      console.log("Cập nhật trạng thái phòng thành công!");
    } catch (err) {
      console.error("Error updating room status:", err);
      setError("Lỗi khi cập nhật trạng thái phòng");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRoom) return;

    try {
      await cinemaRoomService.deleteRoom(selectedRoom.id);
      setShowDeleteDialog(false);
      await loadRooms();
      console.log("Xóa phòng thành công!");
    } catch (err) {
      console.error("Error deleting room:", err);
      setError("Lỗi khi xóa phòng");
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "MAINTENANCE":
        return "outline";
      case "CLOSED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleFormChange = (field: keyof RoomFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const roomStats = {
    total: rooms.length,
    active: rooms.filter((r) => r.status === "ACTIVE").length,
    maintenance: rooms.filter((r) => r.status === "MAINTENANCE").length,
    withSeatMap: rooms.filter((r) => r.seatMap !== null).length,
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Icon icon="mdi:loading" className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p>Đang tải danh sách phòng chiếu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý phòng chiếu</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin phòng chiếu và sơ đồ ghế</p>
        </div>

        <Button onClick={handleAddRoom} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Thêm phòng mới
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng số phòng</p>
                <p className="text-2xl font-bold">{roomStats.total}</p>
              </div>
              <Icon icon="mdi:home" className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{roomStats.active}</p>
              </div>
              <Icon icon="mdi:check-circle" className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bảo trì</p>
                <p className="text-2xl font-bold text-orange-600">{roomStats.maintenance}</p>
              </div>
              <Icon icon="mdi:wrench" className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Có sơ đồ ghế</p>
                <p className="text-2xl font-bold text-purple-600">{roomStats.withSeatMap}</p>
              </div>
              <Icon icon="mdi:seat" className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Room List */}
      <RoomListView
        rooms={rooms}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onAddRoom={handleAddRoom}
        onRoomSelect={handleRoomSelect}
        onEditRoom={handleEditRoom}
        onChangeStatus={handleChangeStatus}
        onDeleteRoom={handleDeleteRoom}
      />

      {/* Add Room Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm phòng chiếu mới</DialogTitle>
            <DialogDescription>Điền thông tin để tạo phòng chiếu mới</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Tên phòng</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleFormChange("name", e.target.value)} placeholder="Ví dụ: Phòng 1" />
            </div>

            <div>
              <Label htmlFor="type">Loại phòng</Label>
              <Select value={formData.type} onValueChange={(value) => handleFormChange("type", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="IMAX">IMAX</SelectItem>
                  <SelectItem value="4DX">4DX</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="roomNumber">Số phòng</Label>
                <Input
                  id="roomNumber"
                  type="number"
                  value={formData.roomNumber}
                  onChange={(e) => handleFormChange("roomNumber", parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <Label htmlFor="fee">Phí thuê</Label>
                <Input id="fee" type="number" value={formData.fee} onChange={(e) => handleFormChange("fee", parseInt(e.target.value) || 0)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width">Chiều rộng</Label>
                <Input
                  id="width"
                  type="number"
                  min="5"
                  max="30"
                  value={formData.width}
                  onChange={(e) => handleFormChange("width", parseInt(e.target.value) || 5)}
                />
              </div>
              <div>
                <Label htmlFor="length">Chiều dài</Label>
                <Input
                  id="length"
                  type="number"
                  min="3"
                  max="20"
                  value={formData.length}
                  onChange={(e) => handleFormChange("length", parseInt(e.target.value) || 3)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Hủy
            </Button>
            <Button onClick={() => handleFormSubmit(false)}>Tạo phòng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Room Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa phòng chiếu</DialogTitle>
            <DialogDescription>Cập nhật thông tin phòng {selectedRoom?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Tên phòng</Label>
              <Input id="edit-name" value={formData.name} onChange={(e) => handleFormChange("name", e.target.value)} placeholder="Ví dụ: Phòng 1" />
            </div>

            <div>
              <Label htmlFor="edit-type">Loại phòng</Label>
              <Select value={formData.type} onValueChange={(value) => handleFormChange("type", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="IMAX">IMAX</SelectItem>
                  <SelectItem value="4DX">4DX</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-roomNumber">Số phòng</Label>
                <Input
                  id="edit-roomNumber"
                  type="number"
                  value={formData.roomNumber}
                  onChange={(e) => handleFormChange("roomNumber", parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <Label htmlFor="edit-fee">Phí thuê</Label>
                <Input id="edit-fee" type="number" value={formData.fee} onChange={(e) => handleFormChange("fee", parseInt(e.target.value) || 0)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-width">Chiều rộng</Label>
                <Input
                  id="edit-width"
                  type="number"
                  min="5"
                  max="30"
                  value={formData.width}
                  onChange={(e) => handleFormChange("width", parseInt(e.target.value) || 5)}
                />
              </div>
              <div>
                <Label htmlFor="edit-length">Chiều dài</Label>
                <Input
                  id="edit-length"
                  type="number"
                  min="3"
                  max="20"
                  value={formData.length}
                  onChange={(e) => handleFormChange("length", parseInt(e.target.value) || 3)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Hủy
            </Button>
            <Button onClick={() => handleFormSubmit(true)}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thay đổi trạng thái phòng</DialogTitle>
            <DialogDescription>Thay đổi trạng thái cho phòng {selectedRoom?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Trạng thái hiện tại</Label>
              <div className="mt-1">
                <Badge variant={getStatusVariant(selectedRoom?.status || "")}>{selectedRoom?.status}</Badge>
              </div>
            </div>

            <div>
              <Label htmlFor="status">Trạng thái mới</Label>
              <Select value={newStatus} onValueChange={(value: RoomStatus) => setNewStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleStatusChange}>Cập nhật trạng thái</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa phòng</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa phòng <strong>{selectedRoom?.name}</strong>? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Xóa phòng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CinemaRoomManagement;
