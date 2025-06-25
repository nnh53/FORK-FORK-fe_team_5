import * as Yup from "yup";
import { z } from "zod";
import type { MyInfoData } from "../interfaces/users.interface";

// Zod version of login validation schema
export const loginFormSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

// Zod schema based on the original Yup validation rules
export const registerFormSchema = z
  .object({
    fullName: z.string().trim().min(2, "Họ và tên phải có ít nhất 2 ký tự").max(50, "Họ và tên không được vượt quá 50 ký tự"),
    dateOfBirth: z.date({
      required_error: "Ngày sinh là bắt buộc",
    }),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
    phone: z.string().regex(/^\d{9,11}$/, "Số điện thoại không hợp lệ"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export const registerValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(50, "Họ và tên không được vượt quá 50 ký tự")
    .required("Họ và tên là bắt buộc"),
  dateOfBirth: Yup.string(),
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    //   'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
    // )
    .required("Mật khẩu là bắt buộc"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
  phone: Yup.string()
    .matches(/^\d{9,11}$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại là bắt buộc"),
});

export const forgotPasswordValidationSchema = Yup.object().shape({
  password: Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Mật khẩu là bắt buộc"),
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

export function formatDateTime(isoString: string): string[] {
  // Return a placeholder if the input string is empty or null
  if (!isoString) {
    return [];
  }

  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    return [];
  }

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return [formattedDate.toString(), formattedTime.toString()];
}

export const promotionValidationSchema = Yup.object({
  image: Yup.string().url("Must be a valid URL").required("Image URL is required"),
  title: Yup.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters").required("Title is required"),
  type: Yup.string().oneOf(["percentage", "fixed", "buy_one_get_one", "free_shipping"], "Invalid promotion type").required("Type is required"),
  minPurchase: Yup.number().min(0, "Minimum purchase must be at least 0").required("Minimum purchase is required"),
  discountValue: Yup.number()
    .min(0, "Discount value must be at least 0")
    .when("type", {
      is: "percentage",
      then: (schema) => schema.max(100, "Percentage discount cannot exceed 100%"),
      otherwise: (schema) => schema,
    })
    .required("Discount value is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string()
    .required("End time is required")
    .test("end-after-start", "End time must be after start time", function (value) {
      const { startTime } = this.parent;
      if (!startTime || !value) return true;
      return new Date(value) > new Date(startTime);
    }),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),
  status: Yup.string().oneOf(["active", "inactive", "scheduled", "expired"], "Invalid status").required("Status is required"),
});
