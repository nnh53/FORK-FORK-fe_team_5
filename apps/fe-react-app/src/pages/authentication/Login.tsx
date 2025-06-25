import { PasswordInput } from "@/components/Shadcn/password-input";
import { Button } from "@/components/Shadcn/ui/button";
import AuthLogo from "@/components/auth/AuthLogo";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/Shadcn/ui/form";
import { Input } from "@/components/Shadcn/ui/input";
import BannerTransition from "@/components/shared/BannerTransition";
import type { ROLE_TYPE } from "@/interfaces/roles.interface";
import { Logo } from "@/layouts/user/components/Header";
import { ROUTES } from "@/routes/route.constants";
import type { CustomAPIResponse } from "@/type-from-be";
import { $api } from "@/utils/api";
import { loginFormSchema } from "@/utils/validation.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { animated, useSpring } from "@react-spring/web";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

type LoginFormSchemaType = z.infer<typeof loginFormSchema>;

// Mock user data for direct login
const mockUserData = {
  guest: {
    token: "mock-jwt-token-for-guest-user",
    roles: ["GUEST" as ROLE_TYPE],
    id: 1,
    username: "Guest User",
    refresh_token: "mock-refresh-token-for-guest-user",
  },
};

// Cinema-related images for background transition
const slides = [
  "photo-1524985069026-dd778a71c7b4",
  "photo-1489599849927-2ee91cede3ba",
  "photo-1536440136628-1c6cb5a2a869",
  "photo-1542204637-e9f12f144cca",
];

const Login: React.FC = () => {
  // const { authLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const loginQuery = $api.useMutation("post", "/auth/authenticate");
  const pageAnimation = useSpring({
    from: {
      opacity: 0,
      transform: "translateX(50px)",
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

    // chỗ này hàm login
    // login()

    // authLogin({
    //   token: userData.token,
    //   roles: userData.roles,
    //   id: userData.id,
    //   username: userData.username,
    //   refresh_token: userData.refresh_token,
    // });
  };

  useEffect(() => {
    console.log(loginQuery.status);
    if (loginQuery.isSuccess) {
      setMessage("Đăng nhập thành công!");
      toast.success("Đăng nhập thành công!");
      form.reset();
      setTimeout(() => {
        // navigate(RoleRouteToEachPage(loginMutationQuery.data?.roles));
      }, 1000);
    } else if (loginQuery.isError) {
      setError((loginQuery.error as CustomAPIResponse).message || "Có lỗi xảy ra. Vui lòng thử lại.");
      toast.error((loginQuery.error as CustomAPIResponse).message || "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  }, [form, navigate, loginQuery.error, loginQuery.isError, loginQuery.isSuccess, loginQuery.status]);

  return (
    <animated.div style={pageAnimation} className="flex h-screen">
      {/* Left Banner with Animated Background */}
      <BannerTransition slides={slides}>
        <h2 className="text-3xl font-bold">Chào mừng trở lại</h2>
        <p className="text-lg">Trải nghiệm những bộ phim tuyệt vời nhất tại rạp chiếu phim hiện đại</p>
      </BannerTransition>

      {/* Right Form */}
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <AuthLogo />
            <h3 className="text-2xl font-semibold">Đăng Nhập</h3>
            <p className="text-gray-600">Đăng nhập để trải nghiệm dịch vụ tốt nhất</p>
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
        </div>
      </div>
    </animated.div>
  );
};

export default Login;
