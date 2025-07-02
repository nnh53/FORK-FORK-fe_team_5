import { Button } from "@/components/Shadcn/ui/button";
import { DatePicker } from "@/components/Shadcn/ui/date-picker";
import { DialogFooter } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Shadcn/ui/tabs";
import type { StaffRequest, StaffUser } from "@/interfaces/staff.interface";
import type { USER_GENDER } from "@/interfaces/users.interface";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface StaffFormProps {
  staff?: StaffUser;
  onSubmit: (values: StaffRequest) => void;
  onCancel: () => void;
}

// Extended form data for staff
interface StaffFormData extends StaffRequest {
  confirmPassword?: string;
  gender?: USER_GENDER;
}

const StaffForm = ({ staff, onSubmit, onCancel }: StaffFormProps) => {
  const { control, handleSubmit, reset } = useForm<StaffFormData>({
    defaultValues: staff
      ? {
          fullName: staff.fullName || "",
          email: staff.email || "",
          password: "",
          dateOfBirth: staff.dateOfBirth ?? "",
          phone: staff.phone ?? "",
          role: "STAFF",
          gender: staff.gender,
        }
      : {
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          dateOfBirth: "",
          phone: "",
          role: "STAFF",
        },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (staff) {
      reset({
        fullName: staff.fullName || "",
        email: staff.email || "",
        password: "", // Empty password field for security
        dateOfBirth: staff.dateOfBirth ?? "",
        phone: staff.phone ?? "",
        role: "STAFF",
        gender: staff.gender,
      });
    }
  }, [staff, reset]);

  // Trình xử lý submit form - chỉ gửi các trường cần thiết
  const handleFormSubmit = (data: StaffFormData) => {
    // Verify password match if this is a new staff
    if (!staff && data.password !== data.confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    // Convert to StaffRequest format
    const staffData: StaffRequest = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      role: "STAFF",
    };

    onSubmit(staffData);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="account">Tài khoản</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Họ và tên
              </label>
              <Controller
                name="fullName"
                control={control}
                rules={{ required: "Vui lòng nhập họ tên" }}
                render={({ field, fieldState }) => (
                  <div>
                    <Input id="fullName" placeholder="Họ và tên" {...field} />
                    {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="text-sm font-medium">
                Ngày sinh
              </label>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    setDate={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="gender" className="text-sm font-medium">
                Giới tính
              </label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Nam</SelectItem>
                      <SelectItem value="FEMALE">Nữ</SelectItem>
                      <SelectItem value="OTHER">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Số điện thoại
              </label>
              <Controller name="phone" control={control} render={({ field }) => <Input id="phone" placeholder="Số điện thoại" {...field} />} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                }}
                render={({ field, fieldState }) => (
                  <div>
                    <Input id="email" placeholder="Email" type="email" {...field} />
                    {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Mật khẩu {staff ? "(để trống nếu không thay đổi)" : ""}
              </label>
              <div className="flex relative">
                <Controller
                  name="password"
                  control={control}
                  rules={!staff ? { required: "Vui lòng nhập mật khẩu" } : {}}
                  render={({ field, fieldState }) => (
                    <div className="w-full">
                      <div className="relative">
                        <Input id="password" placeholder="Mật khẩu" type={showPassword ? "text" : "password"} {...field} />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                    </div>
                  )}
                />
              </div>
            </div>

            {!staff && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Xác nhận mật khẩu
                </label>
                <div className="flex relative">
                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{ required: "Vui lòng xác nhận mật khẩu" }}
                    render={({ field, fieldState }) => (
                      <div className="w-full">
                        <div className="relative">
                          <Input id="confirmPassword" placeholder="Xác nhận mật khẩu" type={showConfirmPassword ? "text" : "password"} {...field} />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {fieldState.error && <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>}
                      </div>
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" onClick={handleSubmit(handleFormSubmit)}>
          {staff ? "Cập nhật" : "Thêm"} Nhân viên
        </Button>
      </DialogFooter>
    </div>
  );
};

export default StaffForm;
