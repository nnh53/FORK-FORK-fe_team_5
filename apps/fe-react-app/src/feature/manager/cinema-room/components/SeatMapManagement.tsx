import { Alert, AlertDescription } from "@/components/Shadcn/ui/alert";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Icon } from "@iconify/react";
import { ArrowLeft, RotateCcw, Save, Settings } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { Seat, SeatMap } from "@/interfaces/seat.interface";
import { getSeatMapFromRoom, transformCinemaRoomResponse, useCinemaRoom } from "@/services/cinemaRoomService";
import SeatMapEditor from "./SeatMapEditor";
import SeatMapEditorView from "./SeatMapEditorView";

const SeatMapManagement: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  // React Query hooks
  const { data: roomData, isLoading: loading, error: queryError } = useCinemaRoom(parseInt(roomId || "0"));

  // Transform data
  const room = roomData?.result ? transformCinemaRoomResponse(roomData.result) : null;
  const error = queryError ? String(queryError) : null;

  // State management
  const [seatMap, setSeatMap] = useState<SeatMap | null>(null);
  const [originalSeatMap, setOriginalSeatMap] = useState<SeatMap | null>(null);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Room settings
  const [roomSettings, setRoomSettings] = useState({
    width: 16,
    height: 10,
    name: "",
  });

  // Loading state for resetting
  const [isResetting, setIsResetting] = useState(false);

  // Function to create new seat map with current room settings
  const handleCreateNewSeatMap = useCallback(async () => {
    if (!room) return;

    setIsResetting(true);

    try {
      // Create default seats for the room
      const defaultSeats: Seat[] = [];
      // Use room dimensions directly to avoid dependency loop
      const width = room.width;
      const height = room.length;

      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          const seatRow = String.fromCharCode(65 + row); // A, B, C, etc.
          const seatColumn = (col + 1).toString(); // 1, 2, 3, etc.

          const seat: Seat = {
            id: -(Date.now() + col * 1000 + row), // Generate temporary negative ID
            name: `${seatRow}${seatColumn}`,
            roomId: room.id,
            column: seatColumn,
            row: seatRow,
            status: "AVAILABLE",
            type: {
              id: 1,
              name: "REGULAR",
              price: 0,
              seatCount: 1,
            },
            discarded: false,
          };

          defaultSeats.push(seat);
        }
      }

      const newSeatMap: SeatMap = {
        gridData: defaultSeats,
        roomId: room.id,
      };

      setSeatMap(newSeatMap);
      setOriginalSeatMap(JSON.parse(JSON.stringify(newSeatMap)));
      setIsEditing(true);

      // Show success message
    } catch {
      // Error creating seat map - handle silently or show user-friendly message
    } finally {
      setIsResetting(false);
    }
  }, [room]); // Only depend on room, not roomSettings

  // Initialize data when room data is loaded
  useEffect(() => {
    if (room) {
      setRoomSettings((prev) => {
        // Only update if different to avoid unnecessary re-renders
        if (prev.width !== room.width || prev.height !== room.length || prev.name !== room.name) {
          return {
            width: room.width,
            height: room.length, // map length to height
            name: room.name,
          };
        }
        return prev;
      });
    }
  }, [room]);

  // Separate effect for seat map initialization
  useEffect(() => {
    if (room && !seatMap) {
      // Create seat map from room seats
      const seats = getSeatMapFromRoom(room);
      const seatMapData: SeatMap = {
        gridData: seats || [], // Ensure gridData is always an array
        roomId: room.id,
      };
      setSeatMap(seatMapData);
      setOriginalSeatMap(JSON.parse(JSON.stringify(seatMapData)));
    }
  }, [room, seatMap]);

  // Check for changes
  useEffect(() => {
    if (seatMap && originalSeatMap) {
      const hasChanged = JSON.stringify(seatMap) !== JSON.stringify(originalSeatMap);
      setHasChanges(hasChanged);
    }
  }, [seatMap, originalSeatMap]);

  const handleSaveSeatMap = async () => {
    if (!seatMap || !roomId) return;

    try {
      setSaving(true);

      // Note: Save seat map API endpoint needs to be implemented
      // await saveSeatMapMutation.mutateAsync({ roomId, seatMap });

      setOriginalSeatMap(JSON.parse(JSON.stringify(seatMap)));
      setHasChanges(false);

      // Show success message
      alert("Lưu sơ đồ ghế thành công!");
    } catch {
      // Handle error appropriately - show user-friendly error message
      alert("Có lỗi xảy ra khi lưu sơ đồ ghế!");
    } finally {
      setSaving(false);
    }
  };

  const handleResetSeatMap = () => {
    if (originalSeatMap) {
      setSeatMap(JSON.parse(JSON.stringify(originalSeatMap)));
      setHasChanges(false);
    }
  };

  const handleBackToRooms = () => {
    if (hasChanges) {
      if (confirm("Bạn có thay đổi chưa được lưu. Bạn có chắc muốn quay lại?")) {
        navigate("/admin/cinema-room");
      }
    } else {
      navigate("/admin/cinema-room");
    }
  };

  const handleRoomSettingsChange = (field: string, value: string | number) => {
    setRoomSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Icon icon="mdi:loading" className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Đang tải dữ liệu phòng chiếu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="max-w-md mx-auto">
          <Icon icon="mdi:alert-circle" className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="text-center mt-4">
          <Button onClick={handleBackToRooms} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách phòng
          </Button>
        </div>
      </div>
    );
  }

  if (!room) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Loading overlay for resetting */}
      {isResetting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex items-center gap-3">
            <Icon icon="mdi:loading" className="w-6 h-6 animate-spin text-blue-600" />
            <span>Đang tạo sơ đồ ghế mới...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={handleBackToRooms} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Quản lý sơ đồ ghế</h1>
            <p className="text-gray-600">
              {room.name} - Room ID: {room.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button onClick={handleResetSeatMap} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Khôi phục
            </Button>
          )}

          <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "default" : "outline"} size="sm">
            <Settings className="w-4 h-4 mr-2" />
            {isEditing ? "Xem" : "Chỉnh sửa"}
          </Button>

          {hasChanges && (
            <Button onClick={handleSaveSeatMap} disabled={saving} size="sm">
              {saving ? <Icon icon="mdi:loading" className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          )}
        </div>
      </div>

      {/* Room Settings */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon icon="mdi:cog" className="w-5 h-5" />
              Cài đặt phòng chiếu
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="room-width">Số cột (Chiều rộng)</Label>
              <Input
                id="room-width"
                type="number"
                min="5"
                max="30"
                value={roomSettings.width}
                onChange={(e) => handleRoomSettingsChange("width", parseInt(e.target.value) || 5)}
              />
            </div>
            <div>
              <Label htmlFor="room-height">Số hàng (Chiều cao)</Label>
              <Input
                id="room-height"
                type="number"
                min="3"
                max="20"
                value={roomSettings.height}
                onChange={(e) => handleRoomSettingsChange("height", parseInt(e.target.value) || 3)}
              />
            </div>
            <div>
              <Label htmlFor="room-name">Tên phòng</Label>
              <Input
                id="room-name"
                value={roomSettings.name}
                onChange={(e) => handleRoomSettingsChange("name", e.target.value)}
                placeholder="Nhập tên phòng"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create New Seat Map */}
      {(!seatMap || seatMap.gridData.length === 0) && isEditing && (
        <Card>
          <CardContent className="text-center py-8">
            <Icon icon="mdi:seat" className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">Chưa có sơ đồ ghế</h3>
            <p className="text-gray-600 mb-4">Phòng này chưa có sơ đồ ghế. Tạo sơ đồ mới để bắt đầu thiết kế.</p>
            <Button onClick={handleCreateNewSeatMap}>
              <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
              Tạo sơ đồ ghế mới
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Seat Map Editor/View */}
      {seatMap && room && (
        <>
          {isEditing ? (
            <SeatMapEditor seatMap={seatMap} onSeatMapChange={setSeatMap} readonly={false} width={roomSettings.width} length={roomSettings.height} />
          ) : (
            <SeatMapEditorView seatMap={seatMap} showSelectable={false} width={roomSettings.width} length={roomSettings.height} />
          )}
        </>
      )}

      {/* Status Alert */}
      {hasChanges && (
        <Alert>
          <Icon icon="mdi:alert" className="h-4 w-4" />
          <AlertDescription>Bạn có thay đổi chưa được lưu. Nhấn "Lưu thay đổi" để lưu hoặc "Khôi phục" để hủy thay đổi.</AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <Icon icon="mdi:alert-circle" className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SeatMapManagement;
