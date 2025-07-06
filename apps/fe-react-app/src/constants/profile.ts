// Types
export interface UserFormData {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  city: string;
  address: string;
  img: string;
}

// Initial data
export const INITIAL_USER_DATA: UserFormData = {
  id: "",
  name: "",
  email: "",
  phone: "",
  dob: "",
  gender: "male",
  city: "",
  address: "",
  img: "",
};

// Options
export const CITIES = [
  { value: "Hồ Chí Minh", label: "Hồ Chí Minh" },
  { value: "Hà Nội", label: "Hà Nội" },
  { value: "Đà Nẵng", label: "Đà Nẵng" },
  { value: "Cần Thơ", label: "Cần Thơ" },
  { value: "Hải Phòng", label: "Hải Phòng" },
  { value: "Nha Trang", label: "Nha Trang" },
  { value: "Huế", label: "Huế" },
  { value: "Vũng Tàu", label: "Vũng Tàu" },
  { value: "Đà Lạt", label: "Đà Lạt" },
  { value: "Phú Quốc", label: "Phú Quốc" },
] as const;

export const GENDERS = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
] as const;
