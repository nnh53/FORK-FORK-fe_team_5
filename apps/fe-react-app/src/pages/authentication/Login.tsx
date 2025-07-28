import { PasswordInput } from "@/components/Shadcn/password-input";
import { Button } from "@/components/Shadcn/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import { RoleRouteToEachPage } from "@/feature/auth/RoleRoute";
import { useAuth } from "@/hooks/useAuth";
import type { ROLE_TYPE } from "@/interfaces/roles.interface";
import AuthLayout from "@/layouts/auth/AuthLayout";
import { ROUTES } from "@/routes/route.constants";
import type { components } from "@/schema-from-be";
import { transformLoginRequest, transformUserLoginResponse, useLogin } from "@/services/userService";
import { loginFormSchema } from "@/utils/validation.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
type CustomAPIResponse = components["schemas"]["ApiResponseVoid"];

type LoginFormSchemaType = z.infer<typeof loginFormSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { authLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const loginQuery = useLogin();

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
      body: transformLoginRequest(data),
    });
  };

  useEffect(() => {
    console.log(loginQuery.status);
    if (loginQuery.isSuccess) {
      // Sử dụng AuthContext để lưu thông tin authentication
      const authData = loginQuery.data?.result;
      if (authData) {
        console.log("Auth data received:", authData);
        // Convert AuthenticationResponse to UserLoginResponse format
        const userLoginData = transformUserLoginResponse(authData);

        authLogin(userLoginData);
        console.log("Auth data saved to cookies via AuthContext");
      }

      toast.success("Đăng nhập thành công!");
      form.reset();
      navigate(RoleRouteToEachPage(authData?.roles as ROLE_TYPE));
    } else if (loginQuery.isError) {
      toast.error((loginQuery.error as CustomAPIResponse).message ?? "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  }, [form, navigate, authLogin, loginQuery.error, loginQuery.isError, loginQuery.isSuccess, loginQuery.status, loginQuery.data?.result]);

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
            <div className="rounded-md border border-red-400 bg-red-100 p-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-md border border-green-400 bg-green-100 p-3 text-sm text-green-700" role="alert">
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput id="password" placeholder="Nhập mật khẩu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <Link to={ROUTES.AUTH.FORGOT_PASSWORD} className="text-sm text-red-600 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          <Button type="submit" disabled={loginQuery.isPending} className="w-full bg-red-600 hover:bg-red-700">
            {loginQuery.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">Chưa có tài khoản? </span>
            <Link to={ROUTES.AUTH.REGISTER} className="text-red-600 hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default Login;
