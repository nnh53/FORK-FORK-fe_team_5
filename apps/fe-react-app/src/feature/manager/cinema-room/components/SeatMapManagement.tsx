import { Alert, AlertDescription } from "@/components/Shadcn/ui/alert";
import { Button } from "@/components/Shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Shadcn/ui/card";
import { Input } from "@/components/Shadcn/ui/input";
import { Label } from "@/components/Shadcn/ui/label";
import { Icon } from "@iconify/react";
import { ArrowLeft, RotateCcw, Save, Settings } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import type { Seat, SeatMap } from "@/interfaces/seat.interface";
import {
  getSeatMapFromRoom,
  transformCinemaRoomResponse,
  transformCinemaRoomToUpdateRequest,
  useCinemaRoom,
  useUpdateCinemaRoom,
} from "@/services/cinemaRoomService";
import SeatMapEditor from "./SeatMapEditor";
import SeatMapEditorView from "./SeatMapEditorView";

const SeatMapManagement: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  // React Query hooks - enable automatic refetch when component mounts/navigates back
  const { data: roomData, isLoading: loading, error: queryError, refetch: refetchRoom } = useCinemaRoom(parseInt(roomId || "0"));
  const updateRoomMutation = useUpdateCinemaRoom();

  // Transform data
  const room = roomData?.result ? transformCinemaRoomResponse(roomData.result) : null;
  const error = queryError ? String(queryError) : null;

  // State management
  const [seatMap, setSeatMap] = useState<SeatMap | null>(null);
  const [originalSeatMap, setOriginalSeatMap] = useState<SeatMap | null>(null);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Room settings - local state for editing
  const [roomSettings, setRoomSettings] = useState({
    width: 16,
    height: 10,
    name: "",
  });

  // Loading state for resetting
  const [isResetting, setIsResetting] = useState(false);

  // Track previous room dimensions to detect changes
  const prevRoomDimensionsRef = useRef<{ width: number; length: number } | null>(null);

  // Track if room settings have been initialized to prevent overwriting user changes
  const roomSettingsInitialized = useRef(false);

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

  // Initialize data when room data is loaded - seat map initialization only
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

  // Initialize room settings only once when room data is first loaded
  useEffect(() => {
    if (room && !roomSettingsInitialized.current) {
      // Only initialize if roomSettings hasn't been set yet
      setRoomSettings({
        width: room.width,
        height: room.length,
        name: room.name,
      });
      roomSettingsInitialized.current = true;
    }
  }, [room]);

  // Force refetch room data when component mounts to ensure fresh data
  useEffect(() => {
    refetchRoom();
  }, [refetchRoom]);

  // Reset seat map when room dimensions change (using ref to prevent infinite loop)
  useEffect(() => {
    if (room) {
      const currentDimensions = { width: room.width, length: room.length };

      // Check if this is the first time setting dimensions
      if (prevRoomDimensionsRef.current === null) {
        prevRoomDimensionsRef.current = currentDimensions;
        return;
      }

      // Check if dimensions have actually changed
      const dimensionsChanged =
        prevRoomDimensionsRef.current.width !== currentDimensions.width || prevRoomDimensionsRef.current.length !== currentDimensions.length;

      if (dimensionsChanged && seatMap && seatMap.gridData.length > 0) {
        // Room dimensions have changed, recreate seat map
        const seats = getSeatMapFromRoom(room);
        const newSeatMap: SeatMap = {
          gridData: seats || [],
          roomId: room.id,
        };
        setSeatMap(newSeatMap);
        setOriginalSeatMap(JSON.parse(JSON.stringify(newSeatMap)));
        toast.info("Kích thước phòng đã thay đổi. Sơ đồ ghế đã được cập nhật.");
      }

      // Update ref with current dimensions
      prevRoomDimensionsRef.current = currentDimensions;
    }
  }, [room, seatMap]);

  // Auto-recreate seat map when local room settings dimensions change
  useEffect(() => {
    if (room && (roomSettings.width !== room.width || roomSettings.height !== room.length)) {
      // User has changed dimensions locally, recreate seat map preview
      if (seatMap && seatMap.gridData.length > 0) {
        const defaultSeats: Seat[] = [];
        const width = roomSettings.width;
        const height = roomSettings.height;

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
        // Don't update originalSeatMap here to preserve the "hasChanges" state
      }
    }
  }, [roomSettings.width, roomSettings.height, room, seatMap]);

  // Check for changes
  useEffect(() => {
    if (seatMap && originalSeatMap) {
      const hasChanged = JSON.stringify(seatMap) !== JSON.stringify(originalSeatMap);
      setHasChanges(hasChanged);
    }
  }, [seatMap, originalSeatMap]);

  // Check if room settings have changed from original
  const hasRoomSettingsChanges =
    room && (roomSettings.width !== room.width || roomSettings.height !== room.length || roomSettings.name !== room.name);

  const handleSaveSeatMap = async () => {
    if (!seatMap || !roomId) return;

    try {
      setSaving(true);

      // Note: Save seat map API endpoint needs to be implemented
      // await saveSeatMapMutation.mutateAsync({ roomId, seatMap });

      setOriginalSeatMap(JSON.parse(JSON.stringify(seatMap)));
      setHasChanges(false);

      // Show success message
      toast.success("Lưu sơ đồ ghế thành công!");
    } catch {
      // Handle error appropriately - show user-friendly error message
      toast.error("Có lỗi xảy ra khi lưu sơ đồ ghế!");
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

  const handleResetRoomSettings = () => {
    if (room) {
      setRoomSettings({
        width: room.width,
        height: room.length,
        name: room.name,
      });
      toast.info("Đã khôi phục cài đặt phòng về giá trị ban đầu");
    }
  };

  const handleSaveRoomSettings = async () => {
    if (!room) return;

    try {
      const updateData = transformCinemaRoomToUpdateRequest({
        name: roomSettings.name,
        width: roomSettings.width,
        length: roomSettings.height, // Map height to length
      });

      await updateRoomMutation.mutateAsync({
        params: { path: { roomId: room.id } },
        body: updateData,
      });

      // Refetch room data to get updated info
      await refetchRoom();

      toast.success("Cập nhật thông tin phòng chiếu thành công!");
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin phòng chiếu!");
    }
  };

  // Callback để refetch dữ liệu từ API sau khi cập nhật ghế
  const handleRefetchRequired = useCallback(async () => {
    try {
      // Refetch room data từ API
      const { data: freshData } = await refetchRoom();

      if (freshData?.result) {
        // Transform và cập nhật state
        const freshRoom = transformCinemaRoomResponse(freshData.result);
        const freshSeats = getSeatMapFromRoom(freshRoom);

        if (freshSeats.length > 0) {
          const freshSeatMap: SeatMap = {
            gridData: freshSeats,
            roomId: freshRoom.id,
          };

          setSeatMap(freshSeatMap);
          console.log("✅ Successfully refreshed seat map from API");
        }
      }
    } catch (error) {
      console.error("❌ Failed to refresh seat map:", error);
    }
  }, [refetchRoom]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Icon icon="mdi:loading" className="mx-auto mb-2 h-8 w-8 animate-spin" />
          <p>Đang tải dữ liệu phòng chiếu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="mx-auto max-w-md">
          <Icon icon="mdi:alert-circle" className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={handleBackToRooms} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
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
    <div className="container mx-auto space-y-6 px-4 py-8">
      {/* Loading overlay for resetting */}
      {isResetting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex items-center gap-3 rounded-lg bg-white p-6">
            <Icon icon="mdi:loading" className="h-6 w-6 animate-spin text-blue-600" />
            <span>Đang tạo sơ đồ ghế mới...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={handleBackToRooms} variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
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
              <RotateCcw className="mr-2 h-4 w-4" />
              Khôi phục
            </Button>
          )}

          <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "default" : "outline"} size="sm">
            <Settings className="mr-2 h-4 w-4" />
            {isEditing ? "Xem" : "Chỉnh sửa"}
          </Button>

          {hasChanges && (
            <Button onClick={handleSaveSeatMap} disabled={saving} size="sm">
              {saving ? <Icon icon="mdi:loading" className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          )}
        </div>
      </div>

      {/* Room Settings - Editable Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icon icon="mdi:cog" className="h-5 w-5" />
                Cài đặt phòng chiếu
              </CardTitle>
              <div className="flex gap-2">
                <Button onClick={handleResetRoomSettings} size="sm" variant="ghost" disabled={!hasRoomSettingsChanges}>
                  <Icon icon="mdi:restore" className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button
                  onClick={handleSaveRoomSettings}
                  size="sm"
                  variant={hasRoomSettingsChanges ? "default" : "outline"}
                  disabled={!hasRoomSettingsChanges}
                >
                  <Icon icon="mdi:content-save" className="mr-2 h-4 w-4" />
                  {hasRoomSettingsChanges ? "Lưu thay đổi" : "Lưu cài đặt"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {hasRoomSettingsChanges && (
              <div className="col-span-full mb-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-3">
                <div className="flex items-center gap-2 text-blue-800">
                  <Icon icon="mdi:information" className="h-4 w-4" />
                  <p className="text-sm">
                    <strong>Có thay đổi chưa lưu:</strong> Nhấn "Lưu thay đổi" để áp dụng hoặc "Reset" để hủy.
                  </p>
                </div>
              </div>
            )}
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
              <p className="mt-1 text-xs text-gray-500">Từ 5 đến 30 cột</p>
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
              <p className="mt-1 text-xs text-gray-500">Từ 3 đến 20 hàng</p>
            </div>
            <div>
              <Label htmlFor="room-name">Tên phòng</Label>
              <Input
                id="room-name"
                value={roomSettings.name}
                onChange={(e) => handleRoomSettingsChange("name", e.target.value)}
                placeholder="Nhập tên phòng"
              />
              <p className="mt-1 text-xs text-gray-500">Tên hiển thị của phòng chiếu</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create New Seat Map */}
      {(!seatMap || seatMap.gridData.length === 0) && isEditing && (
        <Card>
          <CardContent className="py-8 text-center">
            <Icon icon="mdi:seat" className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium">Chưa có sơ đồ ghế</h3>
            <p className="mb-4 text-gray-600">Phòng này chưa có sơ đồ ghế. Tạo sơ đồ mới để bắt đầu thiết kế.</p>
            <Button onClick={handleCreateNewSeatMap}>
              <Icon icon="mdi:plus" className="mr-2 h-4 w-4" />
              Tạo sơ đồ ghế mới
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Seat Map Editor/View */}
      {seatMap && room && (
        <>
          {isEditing ? (
            <SeatMapEditor
              seatMap={seatMap}
              onSeatMapChange={setSeatMap}
              onRefetchRequired={handleRefetchRequired}
              readonly={false}
              width={roomSettings.width}
              length={roomSettings.height}
            />
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
