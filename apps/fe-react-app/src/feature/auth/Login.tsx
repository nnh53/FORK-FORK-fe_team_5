import { yupResolver } from '@hookform/resolvers/yup';
import { animated, useSpring } from '@react-spring/web';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import CheckboxForm from '../../components/forms/CheckboxForm';
import FormField from '../../components/forms/FormFields';
import { Logo } from '../../components/logo/Logo';
import BannerTransition from '../../components/shared/BannerTransition';
import { supaClient } from '../../services/supabase';
import { loginValidationSchema } from '../../utils/validation.utils';

const slides = [
  'photo-1524985069026-dd778a71c7b4',
  'photo-1489599849927-2ee91cede3ba',
  'photo-1536440136628-1c6cb5a2a869',
  'photo-1542204637-e9f12f144cca',
];

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);
    try {
      console.log('Form Data:', data);

      const { data: loginData, error: authError } = await supaClient.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (authError) {
        setError(authError.message || 'Đăng nhập thất bại.');
      } else if (loginData.user) {
        navigate('/welcome');
      } else {
        setError('Đăng nhập thất bại.');
      }
    } catch {
      setError('Có lỗi xảy ra.');
    } finally {
      setLoading(false);
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
      <BannerTransition slides={slides}>
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

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors justify-center"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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
