import { Button } from "@/components/Shadcn/ui/button";
import { DatePicker } from "@/components/Shadcn/ui/date-picker";
import { DialogFooter } from "@/components/Shadcn/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import type { StaffRequest, StaffUpdate, StaffUser } from "@/interfaces/staff.interface";
import type { USER_GENDER, USER_STATUS } from "@/interfaces/users.interface";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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

const StaffForm = ({ staff, onSubmit, onCancel, isLoading }: StaffFormProps) => {
  // Store the initial values for comparison when updating
  const [initialValues, setInitialValues] = useState<StaffFormData | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<StaffFormData>({
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

      form.reset(values);
      setInitialValues(values);
    }
  }, [staff, form]);

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Họ và tên */}
          <FormField
            control={form.control}
            name="fullName"
            rules={{ required: "Vui lòng nhập họ tên" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input placeholder="Họ và tên" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: !staff ? "Vui lòng nhập email" : false,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email không hợp lệ",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email {staff && <span className="text-muted-foreground text-xs">(không thể thay đổi)</span>}</FormLabel>
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} readOnly={!!staff} className={staff ? "bg-muted cursor-not-allowed" : ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ngày sinh */}
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày sinh</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    setDate={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Giới tính - chỉ hiển thị khi đang cập nhật (edit) */}
          {staff && (
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính</FormLabel>
                  <Select defaultValue={field.value} value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Nam</SelectItem>
                      <SelectItem value="FEMALE">Nữ</SelectItem>
                      <SelectItem value="OTHER">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          )}

          {/* Số điện thoại */}
          <FormField
            control={form.control}
            name="phone"
            rules={{
              pattern: {
                value: /^\d{9,11}$/,
                message: "Số điện thoại phải từ 9-11 chữ số",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="Số điện thoại" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Địa chỉ - chỉ hiển thị khi đang cập nhật (edit) */}
          {staff && (
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Địa chỉ" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {/* Trạng thái - chỉ hiển thị khi đang cập nhật (edit) */}
          {staff && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select defaultValue={field.value} value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Đã xác minh</SelectItem>
                      <SelectItem value="BAN">Bị cấm</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          )}

          {/* Mật khẩu */}
          <FormField
            control={form.control}
            name="password"
            rules={
              !staff
                ? {
                    required: "Vui lòng nhập mật khẩu",
                    minLength: {
                      value: 8,
                      message: "Mật khẩu phải có ít nhất 8 ký tự",
                    },
                    maxLength: {
                      value: 20,
                      message: "Mật khẩu không được quá 20 ký tự",
                    },
                  }
                : {
                    minLength: {
                      value: 8,
                      message: "Mật khẩu phải có ít nhất 8 ký tự",
                    },
                    maxLength: {
                      value: 20,
                      message: "Mật khẩu không được quá 20 ký tự",
                    },
                  }
            }
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu {staff ? "(để trống nếu không thay đổi)" : ""}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input placeholder="Mật khẩu" type={showPassword ? "text" : "password"} {...field} />
                  </FormControl>
                  <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Xác nhận mật khẩu */}
          {!staff && (
            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{ required: "Vui lòng xác nhận mật khẩu" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input placeholder="Xác nhận mật khẩu" type={showConfirmPassword ? "text" : "password"} {...field} />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} type="button">
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {staff ? "Cập nhật" : "Thêm"} Nhân viên
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default StaffForm;
