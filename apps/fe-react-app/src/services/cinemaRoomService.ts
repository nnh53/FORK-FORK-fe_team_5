import type { CinemaRoom, CinemaRoomWithSeatMap } from "@/interfaces/cinemarooms.interface";
import type { Seat, SeatMap, SeatType } from "@/interfaces/seat.interface";
import type { CinemaRoomRequest, CinemaRoomResponse, CinemaRoomUpdateRequest, SeatRequest, SeatResponse, SeatTypeResponse } from "@/type-from-be";
import { $api } from "@/utils/api";

// Type aliases for status enums
type CinemaRoomStatus = "ACTIVE" | "MAINTENANCE" | "CLOSED";
type SeatStatus = "AVAILABLE" | "MAINTENANCE";
type SeatTypeEnum = "REGULAR" | "VIP" | "PATH" | "BLOCK" | "COUPLE";

// React Query hooks using $api
export const useCinemaRooms = () => {
  return $api.useQuery("get", "/cinema-rooms", {});
};

export const useCinemaRoom = (roomId: number) => {
  return $api.useQuery("get", "/cinema-rooms/{roomId}", {
    params: { path: { roomId } },
  });
};

export const useCreateCinemaRoom = () => {
  return $api.useMutation("post", "/cinema-rooms");
};

export const useUpdateCinemaRoom = () => {
  return $api.useMutation("put", "/cinema-rooms/{roomId}");
};

export const useDeleteCinemaRoom = () => {
  return $api.useMutation("delete", "/cinema-rooms/{roomId}");
};

export const useSeatTypes = () => {
  return $api.useQuery("get", "/seat-types", {});
};

export const useUpdateSeat = () => {
  return $api.useMutation("put", "/seats/{id}");
};

// Utility functions to transform API responses to our interfaces
export const transformSeatTypeResponse = (seatTypeResponse: SeatTypeResponse): SeatType => {
  return {
    id: seatTypeResponse.id ?? 0,
    name: seatTypeResponse.name as SeatTypeEnum,
    price: seatTypeResponse.price ?? 0,
    seatCount: seatTypeResponse.seatCount ?? 1,
  };
};

export const transformSeatResponse = (seatResponse: SeatResponse): Seat => {
  return {
    id: seatResponse.id ?? 0,
    name: seatResponse.name ?? "",
    roomId: seatResponse.roomId ?? 0,
    row: seatResponse.row ?? "",
    column: seatResponse.column ?? "",
    status: seatResponse.status ?? "AVAILABLE",
    selected: false, // SeatResponse doesn't have selected field, default to false
    type: seatResponse.type
      ? transformSeatTypeResponse(seatResponse.type)
      : {
          id: 0,
          name: "REGULAR" as SeatTypeEnum,
          price: 0,
          seatCount: 1,
        },
    discarded: seatResponse.discarded ?? false,
  };
};

export const transformCinemaRoomResponse = (roomResponse: CinemaRoomResponse): CinemaRoom => {
  return {
    id: roomResponse.id ?? 0,
    name: roomResponse.name ?? "",
    type: roomResponse.type ?? "",
    fee: roomResponse.fee ?? 0,
    capacity: roomResponse.capacity ?? 0,
    status: roomResponse.status as CinemaRoomStatus,
    width: roomResponse.width ?? 0,
    length: roomResponse.length ?? 0,
    seats: roomResponse.seats ? roomResponse.seats.map(transformSeatResponse) : [],
  };
};

export const transformCinemaRoomsResponse = (roomsResponse: CinemaRoomResponse[]): CinemaRoom[] => {
  return roomsResponse.map(transformCinemaRoomResponse);
};

export const transformSeatTypesResponse = (seatTypesResponse: SeatTypeResponse[]): SeatType[] => {
  return seatTypesResponse.map(transformSeatTypeResponse);
};

// Utility function to transform CinemaRoom to backend format
export const transformCinemaRoomToRequest = (room: Partial<CinemaRoom>): CinemaRoomRequest => {
  return {
    name: room.name ?? "",
    type: room.type ?? "",
    fee: room.fee ?? 0,
    capacity: room.capacity ?? 0,
    width: room.width ?? 0,
    length: room.length ?? 0,
  };
};

export const transformCinemaRoomToUpdateRequest = (room: Partial<CinemaRoom>): CinemaRoomUpdateRequest => {
  return {
    name: room.name,
    type: room.type,
    fee: room.fee,
    capacity: room.capacity,
    status: room.status,
    width: room.width,
    length: room.length,
  };
};

export const transformSeatToRequest = (seat: { type?: string; status?: SeatStatus; linkSeatId?: number }): SeatRequest => {
  return {
    type: seat.type,
    status: seat.status,
    linkSeatId: seat.linkSeatId,
  };
};

// Helper function to create seat status update request
export const updateSeatStatus = (seat: Seat, newStatus: SeatStatus): SeatRequest => {
  return transformSeatToRequest({
    status: newStatus,
    type: seat.type.name,
  });
};

// Helper function to convert cinema room with seat map for UI components
export const convertToRoomWithSeatMap = (room: CinemaRoom): CinemaRoomWithSeatMap => {
  const seatMap: SeatMap = {
    gridData: room.seats,
    roomId: room.id,
  };

  return {
    ...room,
    seatMap: room.seats.length > 0 ? seatMap : null,
  };
};

// Helper functions for statistics
export const calculateRoomStats = (rooms: CinemaRoom[]) => {
  return {
    total: rooms.length,
    active: rooms.filter((room) => room.status === "ACTIVE").length,
    maintenance: rooms.filter((room) => room.status === "MAINTENANCE").length,
    withSeatMap: rooms.filter((room) => room.seats.length > 0).length,
  };
};

// Helper function to get seat map from room
export const getSeatMapFromRoom = (room: CinemaRoom): Seat[] => {
  return room.seats || [];
};

// Helper function to get room status label
export const getRoomStatusLabel = (status: CinemaRoomStatus): string => {
  switch (status) {
    case "ACTIVE":
      return "Hoạt động";
    case "MAINTENANCE":
      return "Bảo trì";
    case "CLOSED":
      return "Đóng cửa";
    default:
      return status;
  }
};

// Helper function to get seat status label
export const getSeatStatusLabel = (status: SeatStatus): string => {
  switch (status) {
    case "AVAILABLE":
      return "Có sẵn";
    case "MAINTENANCE":
      return "Bảo trì";
    default:
      return status;
  }
};

// Helper functions for couple seat operations
export const updateSeatToCouple = (seat: Seat, linkedSeatId: number): SeatRequest => {
  // Only need to update one seat with linkSeatId, backend handles the other
  return transformSeatToRequest({
    type: "COUPLE",
    status: seat.status as SeatStatus,
    linkSeatId: linkedSeatId,
  });
};

export const updateCoupleToSingle = (seat: Seat): SeatRequest => {
  // Convert couple seat back to regular seat
  return transformSeatToRequest({
    type: "REGULAR",
    status: seat.status as SeatStatus,
  });
};

export const updateSeatType = (seat: Seat, newType: string, linkSeatId?: number): SeatRequest => {
  return transformSeatToRequest({
    type: newType,
    status: seat.status as SeatStatus,
    linkSeatId: linkSeatId,
  });
};

/**
 * Example usage in components:
 *
 * // Convert single seat to couple
 * const updateSeatMutation = useUpdateSeat();
 * const seatUpdate = updateSeatToCouple(currentSeat, targetSeat.id);
 * await updateSeatMutation.mutateAsync({
 *   params: { path: { id: currentSeat.id } },
 *   body: seatUpdate,
 * });
 *
 * // Convert couple seat back to single
 * const seatUpdate = updateCoupleToSingle(currentSeat);
 * await updateSeatMutation.mutateAsync({
 *   params: { path: { id: currentSeat.id } },
 *   body: seatUpdate,
 * });
 *
 * // Update any seat type with optional linking
 * const seatUpdate = updateSeatType(currentSeat, "VIP", linkSeatId);
 * await updateSeatMutation.mutateAsync({
 *   params: { path: { id: currentSeat.id } },
 *   body: seatUpdate,
 * });
 */
