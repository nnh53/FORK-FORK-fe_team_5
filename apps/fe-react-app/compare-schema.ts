import type { ApiBooking, ApiBookingCombo, ApiBookingRequest, ApiBookingSnack, ApiBookingUpdate } from './src/interfaces/booking.interface.ts';
import type { ApiCombo } from './src/interfaces/combo.interface.ts';
import type { ApiMovie, ApiMovieCategory, ApiShowtime } from './src/interfaces/movies.interface.ts';
import type { ApiPromotion } from './src/interfaces/promotion.interface.ts';
import type { ApiSnack } from './src/interfaces/snacks.interface.ts';
import type { ApiUser } from './src/interfaces/users.interface.ts';
import type { ApiResponseListMovieTrendingResponse, ApiResponseListReceipt } from './src/interfaces/receipt.interface.ts';
import type {
  BookingResponse,
  BookingComboResponse,
  BookingRequest,
  BookingSnackResponse,
  BookingUpdate,
  ComboResponse,
  MovieCategoryResponse,
  MovieResponse,
  PromotionResponse,
  ApiResponseListMovieTrendingResponse as ApiResponseListMovieTrendingResponseBE,
  ApiResponseListReceipt as ApiResponseListReceiptBE,
  ShowtimeResponse,
  SnackResponse,
  UserResponse,
} from './type-from-be';

// Utility type to ensure two types are mutually assignable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AssertEqual<A, B> = [A] extends [B]
  ? ([B] extends [A] ? true : never)
  : never;

// Booking related
type _Booking = AssertEqual<ApiBooking, BookingResponse>;
type _BookingCombo = AssertEqual<ApiBookingCombo, BookingComboResponse>;
type _BookingSnack = AssertEqual<ApiBookingSnack, BookingSnackResponse>;
type _BookingRequest = AssertEqual<ApiBookingRequest, BookingRequest>;
type _BookingUpdate = AssertEqual<ApiBookingUpdate, BookingUpdate>;

// Other entities
type _Combo = AssertEqual<ApiCombo, ComboResponse>;
type _Movie = AssertEqual<ApiMovie, MovieResponse>;
type _MovieCat = AssertEqual<ApiMovieCategory, MovieCategoryResponse>;
type _Promotion = AssertEqual<ApiPromotion, PromotionResponse>;
type _Showtime = AssertEqual<ApiShowtime, ShowtimeResponse>;
type _Snack = AssertEqual<ApiSnack, SnackResponse>;
type _User = AssertEqual<ApiUser, UserResponse>;

// API responses
type _ApiReceiptList = AssertEqual<ApiResponseListReceipt, ApiResponseListReceiptBE>;
type _ApiTrending = AssertEqual<ApiResponseListMovieTrendingResponse, ApiResponseListMovieTrendingResponseBE>;

export {};
