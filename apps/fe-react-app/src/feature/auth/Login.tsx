import { yupResolver } from '@hookform/resolvers/yup';
import { animated, useSpring } from '@react-spring/web';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RoleRouteToEachPage } from '../../components/auth/RoleRoute';
import CheckboxForm from '../../components/forms/CheckboxForm';
import FormField from '../../components/forms/FormFields';
import { Logo } from '../../components/logo/Logo';
import BannerTransition from '../../components/shared/BannerTransition';
import { useAuth } from '../../contexts/AuthContext';
import type { Role } from '../../interfaces/roles.interface';
import type { LoginDTO } from '../../interfaces/users.interface';
import { loginValidationSchema } from '../../utils/validation.utils';

// Mock user data for direct login
const mockUserData = {
  guest: {
    token: 'mock-jwt-token-for-guest-user',
    roles: ['ROLE_GUEST' as Role],
    id: 1,
    username: 'Guest User',
    refresh_token: 'mock-refresh-token-for-guest-user',
  },
};

const Login: React.FC = () => {
  const { authLogin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginDTO) => {
    setIsLoading(true);
    try {
      // Mock login - check if email is guest@example.com
      if (data.email === 'guest@example.com') {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Use mock data instead of API call
        const userData = mockUserData.guest;

        authLogin({
          token: userData.token,
          roles: userData.roles,
          id: userData.id,
          username: userData.username,
          refresh_token: userData.refresh_token,
        });

        toast.success('Login successfully!');
        setTimeout(() => {
          navigate(RoleRouteToEachPage(userData.roles[0]));
        }, 1000);
      } else {
        // For any other email, show error
        toast.error('Invalid email or password');
      }
    } catch (error) {
      const errorMessage = (error as Error).message || 'An error occurred during login';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const pageAnimation = useSpring({
    from: {
      opacity: 0,
      transform: 'translateX(50px)',
    },
    to: {
      opacity: 1,
      transform: 'translateX(0px)',
    },
    config: {
      tension: 280,
      friction: 20,
    },
  });

  return (
    <animated.div style={pageAnimation} className="flex h-screen">
      <BannerTransition>
        <h2 className="text-3xl font-bold">Chào mừng trở lại</h2>
        <p className="text-lg">Trải nghiệm những bộ phim tuyệt vời nhất tại rạp chiếu phim hiện đại</p>
      </BannerTransition>

      {/*right banner*/}
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo className="mx-auto mb-4" />
            <h3 className="text-2xl font-semibold">Đăng Nhập</h3>
            <p className="text-gray-600">Tạo tài khoản mới để trải nghiệm dịch vụ tốt nhất</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="email" label="Email" type="email" control={control} errors={errors} />
            <FormField name="password" label="Mật khẩu" type="password" control={control} errors={errors} />

            <div className="flex justify-between items-center">
              <a href="/forgot-password">Quên mật khẩu?</a>
              <CheckboxForm name="rememberMe" label="Ghi nhớ tôi" control={control} errors={errors} />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors justify-center"
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">Chưa có tài khoản? </span>
              <a href="/register" className="text-sm text-red-600 hover:underline">
                Đăng ký ngay
              </a>
            </div>
          </form>
        </div>
      </div>
    </animated.div>
  );
};

export default Login;
