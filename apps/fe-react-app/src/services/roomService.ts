import type { components } from "@/schema-from-be";
import { $api } from "@/utils/api";
type CinemaRoomResponse = components["schemas"]["CinemaRoomResponse"];

// Interface cho Room để match với ShowtimeManagement
export interface Room {
  id: number;
  name: string;
}

// React Query hooks using $api
export const useRooms = () => {
  return $api.useQuery("get", "/cinema-rooms", {});
};

export const useRoom = (roomId: number) => {
  return $api.useQuery("get", "/cinema-rooms/{roomId}", {
    params: { path: { roomId } },
  });
};

export const useCreateRoom = () => {
  return $api.useMutation("post", "/cinema-rooms");
};

export const useUpdateRoom = () => {
  return $api.useMutation("put", "/cinema-rooms/{roomId}");
};

export const useDeleteRoom = () => {
  return $api.useMutation("delete", "/cinema-rooms/{roomId}");
};

// Utility functions to transform API responses to Room interface
export const transformRoomResponse = (roomResponse: CinemaRoomResponse): Room => {
  return {
    id: roomResponse.id ?? 0,
    name: roomResponse.name ?? "",
  };
};

export const transformRoomsResponse = (roomsResponse: CinemaRoomResponse[]): Room[] => {
  return roomsResponse.map(transformRoomResponse);
};
