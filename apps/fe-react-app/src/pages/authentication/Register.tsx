import AuthLogo from "@/components/auth/AuthLogo";
import { PasswordInput } from "@/components/Shadcn/password-input";
import { Button } from "@/components/Shadcn/ui/button";
import { Calendar } from "@/components/Shadcn/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Shadcn/ui/popover";
import BannerTransition from "@/components/shared/BannerTransition";
import { ROLE_TYPE } from "@/interfaces/roles.interface";

import { ROUTES } from "@/routes/route.constants";
import type { CustomAPIResponse } from "@/type-from-be";
import { $api } from "@/utils/api";
import { cn } from "@/utils/utils";
import { registerFormSchema } from "@/utils/validation.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { animated, useSpring } from "@react-spring/web";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

type RegisterFormSchemaType = z.infer<typeof registerFormSchema>;

// Cinema-related images for background transition
const slides = [
  "photo-1524985069026-dd778a71c7b4",
  "photo-1489599849927-2ee91cede3ba",
  "photo-1536440136628-1c6cb5a2a869",
  "photo-1542204637-e9f12f144cca",
];

const Register: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const registerQuery = $api.useMutation("post", "/users");
  const pageAnimation = useSpring({
    from: {
      opacity: 0,
      transform: "translateX(-50px)",
    },
    to: {
      opacity: 1,
      transform: "translateX(0px)",
    },
    config: {
      tension: 280,
      friction: 20,
    },
  });
  const form = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: undefined,
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const onSubmit = (data: RegisterFormSchemaType) => {
    setError(null);
    setMessage(null);
    const dateOfBirthSimpleFormat = data.dateOfBirth?.toISOString().split("T")[0];
    console.log(dateOfBirthSimpleFormat);
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    registerQuery.mutate({
      body: {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: ROLE_TYPE.MEMBER,
        dateOfBirth: dateOfBirthSimpleFormat,
        phone: data.phone,
      },
    });
  };

  useEffect(() => {
    console.log(registerQuery.status);
    if (registerQuery.isSuccess) {
      setMessage("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
      toast.success("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
      form.reset();
      setTimeout(() => {
        navigate(ROUTES.AUTH.LOGIN);
      }, 2000);
    } else if (registerQuery.isError) {
      setError((registerQuery.error as CustomAPIResponse).message || "Có lỗi xảy ra. Vui lòng thử lại.");
      toast.error((registerQuery.error as CustomAPIResponse).message || "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  }, [form, navigate, registerQuery.error, registerQuery.isError, registerQuery.isSuccess, registerQuery.status]);

  return (
    <animated.div style={pageAnimation} className="flex h-screen">
      {/* Left Banner*/}
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <AuthLogo />
            <h3 className="text-2xl font-semibold">Đăng Ký</h3>
            <p className="text-gray-600">Tạo tài khoản mới để trải nghiệm dịch vụ tốt nhất</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md" role="alert">
                  {error}
                </div>
              )}

              {message && (
                <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-400 rounded-md" role="alert">
                  {message}
                </div>
              )}

              {/* Group 1: Họ và tên và Ngày sinh */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày sinh</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày sinh</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Nhập email của bạn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Group 2: Mật khẩu và Xác nhận mật khẩu */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <PasswordInput id="password" placeholder="Nhập mật khẩu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <PasswordInput id="confirmPassword" placeholder="Nhập lại mật khẩu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={registerQuery.isPending} className="w-full bg-red-600 hover:bg-red-700">
                {registerQuery.isPending ? "Đang đăng ký..." : "Đăng ký"}
              </Button>

              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">Đã có tài khoản? </span>
                <Link to={ROUTES.AUTH.LOGIN} className="text-red-600 hover:underline">
                  Đăng nhập ngay
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Right Banner with Animated Background */}
      <BannerTransition slides={slides}>
        <h2 className="text-3xl font-bold">Tham gia cùng chúng tôi</h2>
        <p className="text-lg">Khám phá thế giới điện ảnh đầy màu sắc với hàng ngàn bộ phim hấp dẫn</p>
      </BannerTransition>
    </animated.div>
  );
};

export default Register;
