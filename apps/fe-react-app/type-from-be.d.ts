import type { components } from "./schema-from-be";

export type CustomAPIResponse = components["schemas"]["ApiResponseVoid"];
export type UserResponse = components["schemas"]["UserResponse"];
export type UserUpdate = components["schemas"]["UserUpdate"];
export type AuthenticationResponse = components["schemas"]["AuthenticationResponse"];
export type CinemaRoomResponse = components["schemas"]["CinemaRoomResponse"];
export type CinemaRoomRequest = components["schemas"]["CinemaRoomRequest"];
export type CinemaRoomUpdateRequest = components["schemas"]["CinemaRoomUpdateRequest"];
export type SeatResponse = components["schemas"]["SeatResponse"];
export type SeatRequest = components["schemas"]["SeatRequest"];
export type SeatTypeResponse = components["schemas"]["SeatTypeResponse"];
export type PageResponseShowtimeResponse = components["schemas"]["PageResponseShowtimeResponse"];
export type PromotionResponse = components["schemas"]["PromotionResponse"];
export type ShowtimeResponse = components["schemas"]["ShowtimeResponse"];
export type MovieResponse = components["schemas"]["MovieResponse"];
export type MovieCategoryResponse = components["schemas"]["MovieCategoryResponse"];
export type IntrospectResponse = components["schemas"]["IntrospectResponse"];
export type SnackResponse = components["schemas"]["SnackResponse"];
export type ComboResponse = components["schemas"]["ComboResponse"];
export type ComboSnackResponse = components["schemas"]["ComboSnackResponse"];

// Booking related types
export type BookingResponse = components["schemas"]["BookingResponse"];
export type BookingRequest = components["schemas"]["BookingRequest"];
export type BookingUpdate = components["schemas"]["BookingUpdate"];
export type BookingComboRequest = components["schemas"]["BookingComboRequest"];
export type BookingSnackRequest = components["schemas"]["BookingSnackRequest"];
export type BookingComboResponse = components["schemas"]["BookingComboResponse"];
export type BookingSnackResponse = components["schemas"]["BookingSnackResponse"];
export type PickingSeatResponse = components["schemas"]["PickingSeatResponse"];

// Receipt related types
export type Receipt = components["schemas"]["Receipt"];
export type ReceiptItem = components["schemas"]["ReceiptItem"];
export type ReceiptFilterRequest = components["schemas"]["ReceiptFilterRequest"];
export type MovieTrendingResponse = components["schemas"]["MovieTrendingResponse"];
export type ApiResponseListReceipt = components["schemas"]["ApiResponseListReceipt"];
export type ApiResponseListMovieTrendingResponse = components["schemas"]["ApiResponseListMovieTrendingResponse"];
