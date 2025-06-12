import * as Yup from "yup";
import type { MyInfoData } from "../interfaces/users.interface";

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Mật khẩu là bắt buộc"),
  rememberMe: Yup.boolean(),
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
    .matches(/^[0-9]{9,11}$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại bắt buộc"),
  dob: Yup.string()
    .nullable()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh không hợp lệ")
    .default(null),
  email: Yup.string().email("Email không hợp lệ").required("Email bắt buộc"),
  gender: Yup.mixed<"Nam" | "Nu" | "BD">().oneOf(["Nam", "Nu", "BD"], "Giới tính không hợp lệ").nullable("").default(null),
  city: Yup.string().nullable().default(null),
  district: Yup.string().nullable().default(null),
  address: Yup.string().nullable().default(null),
  img: Yup.string().nullable().url("Ảnh phải là một URL hợp lệ").default(null),
});

export function formatMovieSlot(isoString: string) {
  // Return a placeholder if the input string is empty or null
  if (!isoString) {
    return "N/A";
  }

  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
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

  return `${formattedDate} - ${formattedTime}`;
}
