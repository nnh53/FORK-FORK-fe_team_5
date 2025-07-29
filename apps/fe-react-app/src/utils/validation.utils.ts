import * as Yup from "yup";
import { z } from "zod";
import type { MyInfoData } from "../interfaces/users.interface";

// Zod version of login validation schema
export const loginFormSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 8 ký tự"),
});

// Zod schema based on the original Yup validation rules
export const registerFormSchema = z.object({
  fullName: z.string().trim().min(2, "Tối thiểu 2 ký tự").max(50, "Tối đa 50 ký tự"),
  dateOfBirth: z.date({
    required_error: "Ngày sinh là bắt buộc",
  }),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 8 ký tự"),
  confirmPassword: z.string(),
  phone: z.string().regex(/^\d{9,11}$/, "Số điện thoại không hợp lệ"),
});

// Updated showtime form validation schema with Date object for showDate
export const showtimeFormSchema = z.object({
  movieId: z.string().min(1, "Vui lòng chọn phim"),
  roomId: z.string().min(1, "Vui lòng chọn phòng chiếu"),
  showDate: z.date({
    required_error: "Vui lòng chọn ngày chiếu",
  }),
  startTime: z.string().min(1, "Vui lòng chọn giờ bắt đầu"),
  endTime: z.string().min(1, "Vui lòng chọn giờ kết thúc"),
  manualEndTime: z.boolean(),
});

export const forgotPasswordValidationSchema = Yup.object().shape({
  password: Yup.string().min(6, "Mật khẩu phải có ít nhất 8 ký tự").required("Mật khẩu là bắt buộc"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
});

type MyInfoFormData = Omit<MyInfoData, "id">;
export const MyInfoSchema: Yup.ObjectSchema<MyInfoFormData> = Yup.object().shape({
  name: Yup.string().required("Họ tên bắt buộc"),
  phone: Yup.string()
    .matches(/^\d{9,11}$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại bắt buộc"),
  dob: Yup.string()
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh không hợp lệ"),
  email: Yup.string().email("Email không hợp lệ").required("Email bắt buộc"),
  gender: Yup.mixed<"Nam" | "Nu" | "BD">().oneOf(["Nam", "Nu", "BD"], "Giới tính không hợp lệ").optional(),
  city: Yup.string().optional(),
  district: Yup.string().optional(),
  address: Yup.string().optional(),
  img: Yup.mixed<string | Blob>().optional(),
});

export const promotionValidationSchema = Yup.object({
  image: Yup.mixed().nullable(),
  title: Yup.string().min(3, "Tiêu đề phải có ít nhất 3 ký tự").max(100, "Tiêu đề không quá 100 ký tự").required("Tiêu đề là bắt buộc"),
  type: Yup.string().oneOf(["PERCENTAGE", "AMOUNT"], "Loại khuyến mãi không hợp lệ").required("Loại khuyến mãi là bắt buộc"),
  minPurchase: Yup.number().min(0, "Đơn tối thiểu phải lớn hơn hoặc bằng 0").required("Đơn tối thiểu là bắt buộc"),
  discountValue: Yup.number()
    .min(0, "Giá trị giảm giá phải lớn hơn hoặc bằng 0")
    .when("type", {
      is: "PERCENTAGE",
      then: (schema) => schema.max(100, "Phần trăm giảm giá không được vượt quá 100%"),
      otherwise: (schema) => schema,
    })
    .required("Giá trị giảm giá là bắt buộc"),
  startTime: Yup.string().required("Thời gian bắt đầu là bắt buộc"),
  endTime: Yup.string()
    .required("Thời gian kết thúc là bắt buộc")
    .test("end-after-start", "Thời gian kết thúc phải sau thời gian bắt đầu", function (value) {
      const { startTime } = this.parent;
      if (!startTime || !value) return true;
      return new Date(value) > new Date(startTime);
    }),
  description: Yup.string().min(10, "Mô tả phải có ít nhất 10 ký tự").max(500, "Mô tả không quá 500 ký tự").required("Mô tả là bắt buộc"),
  status: Yup.string().oneOf(["ACTIVE", "INACTIVE"], "Trạng thái không hợp lệ").required("Trạng thái là bắt buộc"),
});
