import { Button } from "@/components/Shadcn/ui/button";
import { DatePicker } from "@/components/Shadcn/ui/date-picker";
import { DialogFooter } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import type { StaffRequest, StaffUpdate, StaffUser } from "@/interfaces/staff.interface";
import type { USER_GENDER, USER_STATUS } from "@/interfaces/users.interface";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface StaffFormProps {
  staff?: StaffUser;
  onSubmit: (values: StaffRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Extended form data for staff
interface StaffFormData extends StaffRequest {
  confirmPassword?: string;
  gender?: USER_GENDER;
  address?: string;
  status?: USER_STATUS;
}

const StaffForm = ({ staff, onSubmit, onCancel }: StaffFormProps) => {
  // Store the initial values for comparison when updating
  const [initialValues, setInitialValues] = useState<StaffFormData | null>(null);

  const { control, handleSubmit, reset } = useForm<StaffFormData>({
    defaultValues: staff
      ? {
          fullName: staff.fullName ?? "",
          email: staff.email ?? "",
          password: "",
          dateOfBirth: staff.dateOfBirth ?? "",
          phone: staff.phone ?? "",
          role: "STAFF",
          gender: staff.gender as USER_GENDER,
          address: staff.address ?? "",
          status: staff.status as USER_STATUS,
        }
      : {
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          dateOfBirth: "",
          phone: "",
          role: "STAFF",
          gender: undefined,
          address: "",
          status: "ACTIVE",
        },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (staff) {
      const values: StaffFormData = {
        fullName: staff.fullName ?? "",
        email: staff.email ?? "",
        password: "", // Empty password field for security
        dateOfBirth: staff.dateOfBirth ?? "",
        phone: staff.phone ?? "",
        role: "STAFF",
        gender: staff.gender as USER_GENDER,
        address: staff.address ?? "",
        status: staff.status as USER_STATUS,
      };

      reset(values);
      setInitialValues(values);
    }
  }, [staff, reset]);

  // Trình xử lý submit form - chỉ gửi các trường cần thiết
  const handleFormSubmit = (data: StaffFormData) => {
    // Verify password match if this is a new staff
    if (!staff && data.password !== data.confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    // For new staff, send all required fields
    if (!staff) {
      const staffData: StaffRequest = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone ?? "",
        dateOfBirth: data.dateOfBirth,
        role: "STAFF",
      };

      onSubmit(staffData);
      return;
    }

    // For existing staff, only send changed fields
    const changedFields: Partial<StaffUpdate & { password?: string }> = {
      role: "STAFF", // Always include role
    };

    if (!initialValues) return;

    // Compare each field with initial values and only include changed ones
    if (data.fullName !== initialValues.fullName) {
      changedFields.fullName = data.fullName;
    }

    // Email field is read-only when editing

    // Only include password if it's not empty (user wants to change password)
    if (data.password) {
      changedFields.password = data.password;
    }

    if (data.phone !== initialValues.phone) {
      changedFields.phone = data.phone;
    }

    if (data.dateOfBirth !== initialValues.dateOfBirth) {
      changedFields.dateOfBirth = data.dateOfBirth;
    }

    if (data.gender !== initialValues.gender) {
      changedFields.gender = data.gender;
    }

    if (data.address !== initialValues.address) {
      changedFields.address = data.address;
    }

    if (data.status !== initialValues.status) {
      changedFields.status = data.status;
    }

    // Log the changed fields for debugging
    console.log("Changed fields:", changedFields);

    // Submit the changed fields
    onSubmit(changedFields as StaffRequest);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Họ và tên */}
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
                {fieldState.error && <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>}
              </div>
            )}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email {staff && <span className="text-muted-foreground text-xs">(không thể thay đổi)</span>}
          </label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: !staff ? "Vui lòng nhập email" : false,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email không hợp lệ",
              },
            }}
            render={({ field, fieldState }) => (
              <div>
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  {...field}
                  readOnly={!!staff}
                  className={staff ? "bg-muted cursor-not-allowed" : ""}
                />
                {fieldState.error && <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>}
              </div>
            )}
          />
        </div>

        {/* Ngày sinh */}
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

        {/* Giới tính - chỉ hiển thị khi đang cập nhật (edit) */}
        {staff && (
          <div className="space-y-2">
            <label htmlFor="gender" className="text-sm font-medium">
              Giới tính
            </label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select defaultValue={field.value} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
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
        )}

        {/* Số điện thoại */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Số điện thoại
          </label>
          <Controller name="phone" control={control} render={({ field }) => <Input id="phone" placeholder="Số điện thoại" {...field} />} />
        </div>

        {/* Địa chỉ - chỉ hiển thị khi đang cập nhật (edit) */}
        {staff && (
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              Địa chỉ
            </label>
            <Controller name="address" control={control} render={({ field }) => <Input id="address" placeholder="Địa chỉ" {...field} />} />
          </div>
        )}

        {/* Trạng thái - chỉ hiển thị khi đang cập nhật (edit) */}
        {staff && (
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Trạng thái
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select defaultValue={field.value} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Đã xác minh</SelectItem>
                    <SelectItem value="BAN">Bị cấm</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}

        {/* Mật khẩu */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mật khẩu {staff ? "(để trống nếu không thay đổi)" : ""}
          </label>
          <div className="relative flex">
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
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {fieldState.error && <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>}
                </div>
              )}
            />
          </div>
        </div>

        {/* Xác nhận mật khẩu */}
        {!staff && (
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Xác nhận mật khẩu
            </label>
            <div className="relative flex">
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
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {fieldState.error && <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>}
                  </div>
                )}
              />
            </div>
          </div>
        )}
      </div>

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
