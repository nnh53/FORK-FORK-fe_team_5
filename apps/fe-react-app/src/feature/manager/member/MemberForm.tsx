import { Button } from "@/components/Shadcn/ui/button";
import { DatePicker } from "@/components/Shadcn/ui/date-picker";
import { DialogFooter } from "@/components/Shadcn/ui/dialog";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { ROLES } from "@/interfaces/roles.interface";
import type { User, UserRequest } from "@/interfaces/users.interface";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface MemberFormProps {
  member?: User;
  onSubmit: (values: UserRequest) => void;
  onCancel: () => void;
}

interface MemberFormData extends UserRequest {
  confirmPassword?: string;
  membershipLevel?: string | null;
  totalSpent?: number;
  loyalty_point?: number;
  gender?: "MALE" | "FEMALE" | "OTHER";
  address?: string;
}

const MemberForm = ({ member, onSubmit, onCancel }: MemberFormProps) => {
  const { control, handleSubmit, reset } = useForm<MemberFormData>({
    defaultValues: member
      ? {
          fullName: member.fullName ?? "",
          email: member.email ?? "",
          password: "",
          dateOfBirth: member.dateOfBirth ?? "",
          phone: member.phone ?? "",
          role: ROLES.MEMBER,
          gender: member.gender,
          address: member.address ?? "",
        }
      : {
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          dateOfBirth: "",
          phone: "",
          role: ROLES.MEMBER,
          gender: undefined,
          address: "",
        },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (member) {
      reset({
        fullName: member.fullName ?? "",
        email: member.email ?? "",
        password: "",
        dateOfBirth: member.dateOfBirth ?? "",
        phone: member.phone ?? "",
        role: ROLES.MEMBER,
        gender: member.gender,
        address: member.address ?? "",
      });
    }
  }, [member, reset]);

  const handleFormSubmit = (data: MemberFormData) => {
    if (!member && data.password !== data.confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    const userData: UserRequest = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      role: ROLES.MEMBER,
      gender: data.gender,
      address: data.address,
    };

    onSubmit(userData);
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

        {/* Giới tính */}
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

        {/* Số điện thoại */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Số điện thoại
          </label>
          <Controller name="phone" control={control} render={({ field }) => <Input id="phone" placeholder="Số điện thoại" {...field} />} />
        </div>

        {/* Địa chỉ */}
        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium">
            Địa chỉ
          </label>
          <Controller name="address" control={control} render={({ field }) => <Input id="address" placeholder="Địa chỉ" {...field} />} />
        </div>

        {/* Mật khẩu */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Mật khẩu {member ? "(để trống nếu không thay đổi)" : ""}
          </label>
          <div className="relative flex">
            <Controller
              name="password"
              control={control}
              rules={!member ? { required: "Vui lòng nhập mật khẩu" } : {}}
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
        {!member && (
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
          {member ? "Cập nhật" : "Thêm"} Thành viên
        </Button>
      </DialogFooter>
    </div>
  );
};

export default MemberForm;
