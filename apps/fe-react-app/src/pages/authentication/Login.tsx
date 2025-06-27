import { PasswordInput } from "@/components/Shadcn/password-input";
import { Button } from "@/components/Shadcn/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { RoleRouteToEachPage } from "@/feature/auth/RoleRoute";
import type { ROLE_TYPE } from "@/interfaces/roles.interface";
import AuthLayout from "@/layouts/auth/AuthLayout";
import { ROUTES } from "@/routes/route.constants";
import type { CustomAPIResponse } from "@/type-from-be";
import { $api } from "@/utils/api";
import { saveAuthData } from "@/utils/auth.utils";
import { loginFormSchema } from "@/utils/validation.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

type LoginFormSchemaType = z.infer<typeof loginFormSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const loginQuery = $api.useMutation("post", "/auth/authenticate");
  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormSchemaType) => {
    setError(null);
    setMessage(null);

    loginQuery.mutate({
      body: {
        email: data.email,
        password: data.password,
      },
    });
  };

  useEffect(() => {
    console.log(loginQuery.status);
    if (loginQuery.isSuccess) {
      // Lưu thông tin vào localStorage bằng utility function
      const authData = loginQuery.data?.result;
      if (authData) {
        console.log("Auth data received:", authData);
        saveAuthData(authData);
        console.log("Auth data saved to localStorage");

        // Debug: Log what was saved
        console.log("Token:", localStorage.getItem("token"));
        console.log("Roles:", localStorage.getItem("roles"));
        console.log("FullName:", localStorage.getItem("fullName"));
        console.log("ID:", localStorage.getItem("id"));
      }

      setMessage("Đăng nhập thành công!");
      toast.success("Đăng nhập thành công!");
      form.reset();
      setTimeout(() => {
        navigate(RoleRouteToEachPage(loginQuery.data?.result?.roles as unknown as ROLE_TYPE));
      }, 1000);
    } else if (loginQuery.isError) {
      setError((loginQuery.error as CustomAPIResponse).message ?? "Có lỗi xảy ra. Vui lòng thử lại.");
      toast.error((loginQuery.error as CustomAPIResponse).message ?? "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  }, [
    form,
    navigate,
    loginQuery.error,
    loginQuery.isError,
    loginQuery.isSuccess,
    loginQuery.status,
    loginQuery.data?.result?.roles,
    loginQuery.data?.result,
  ]);

  return (
    <AuthLayout
      title="Đăng Nhập"
      subtitle="Đăng nhập để trải nghiệm dịch vụ tốt nhất"
      bannerTitle="Chào mừng trở lại"
      bannerSubtitle="Trải nghiệm những bộ phim tuyệt vời nhất tại rạp chiếu phim hiện đại"
      direction="right"
      formPosition="right"
    >
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

          <div className="flex justify-between items-center">
            <Link to={ROUTES.AUTH.FORGOT_PASSWORD || "/forgot-password"} className="text-sm text-red-600 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          <Button type="submit" disabled={loginQuery.isPending} className="w-full bg-red-600 hover:bg-red-700">
            {loginQuery.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">Chưa có tài khoản? </span>
            <Link to={ROUTES.AUTH.REGISTER || "/register"} className="text-red-600 hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default Login;
