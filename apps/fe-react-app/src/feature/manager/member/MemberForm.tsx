import { Button } from "@/components/Shadcn/ui/button";
import { DateTimePicker } from "@/components/Shadcn/ui/datetime-picker";
import { DialogFooter } from "@/components/Shadcn/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Shadcn/ui/select";
import { ROLES } from "@/interfaces/roles.interface";
import type { USER_STATUS, User, UserRequest, UserUpdate } from "@/interfaces/users.interface";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface MemberFormProps {
  member?: User;
  onSubmit: (values: UserRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface MemberFormData extends UserRequest {
  confirmPassword?: string;
  loyaltyPoint?: number;
  gender?: "MALE" | "FEMALE" | "OTHER";
  address?: string;
  status?: USER_STATUS;
}

const MemberForm = ({ member, onSubmit, onCancel }: MemberFormProps) => {
  // Store initial values for comparison when updating
  const [initialValues, setInitialValues] = useState<MemberFormData | null>(null);

  const form = useForm<MemberFormData>({
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
          status: member.status as USER_STATUS,
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
          status: "ACTIVE",
        },
  });

  useEffect(() => {
    if (member) {
      const values: MemberFormData = {
        fullName: member.fullName ?? "",
        email: member.email ?? "",
        password: "",
        dateOfBirth: member.dateOfBirth ?? "",
        phone: member.phone ?? "",
        role: ROLES.MEMBER,
        gender: member.gender,
        address: member.address ?? "",
        status: member.status as USER_STATUS,
      };

      form.reset(values);
      setInitialValues(values);
    }
  }, [member, form]);

  const handleFormSubmit = (data: MemberFormData) => {
    if (!member && data.password !== data.confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    // For new member, send all required fields
    if (!member) {
      const userData: UserRequest = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        role: ROLES.MEMBER,
      };

      onSubmit(userData);
      return;
    }

    // For existing member, only send changed fields
    const changedFields: Partial<UserUpdate & { password?: string }> = {
      role: ROLES.MEMBER, // Always include role
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
    onSubmit(changedFields as UserRequest);
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
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input id="fullName" placeholder="Họ và tên" {...field} />
                </FormControl>
                {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: !member ? "Vui lòng nhập email" : false,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email không hợp lệ",
              },
            }}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email {member && <span className="text-muted-foreground text-xs">(không thể thay đổi)</span>}</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="Email"
                    type="email"
                    {...field}
                    readOnly={!!member}
                    className={member ? "bg-muted cursor-not-allowed" : ""}
                  />
                </FormControl>
                {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
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
                  <DateTimePicker
                    date={field.value ? new Date(field.value) : undefined}
                    setDate={(date) => field.onChange(date ? date.toICTISOString().split("T")[0] : "")}
                    placeholder="Chọn ngày sinh"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Giới tính - chỉ hiển thị khi đang cập nhật (edit) */}
          {member && (
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính</FormLabel>
                  <Select defaultValue={field.value} value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
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

          {/* Trạng thái - chỉ hiển thị khi đang cập nhật (edit) */}
          {member && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select defaultValue={field.value} value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                      <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                      <SelectItem value="BANNED">Bị cấm</SelectItem>
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
                  <Input id="phone" placeholder="Số điện thoại" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Địa chỉ - chỉ hiển thị khi đang cập nhật (edit) */}
          {member && (
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input id="address" placeholder="Địa chỉ" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} type="button">
            Hủy
          </Button>
          <Button type="submit">{member ? "Cập nhật" : "Thêm"} Thành viên</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default MemberForm;
