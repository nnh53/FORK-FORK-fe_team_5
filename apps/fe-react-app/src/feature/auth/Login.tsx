import { yupResolver } from '@hookform/resolvers/yup';
import { animated, useSpring, useTransition } from '@react-spring/web';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/logo/Logo';
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
}

const Login: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const transitions = useTransition(index, {
    key: index,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 3000 },
    onRest: (_a, _b, item) => {
      if (index === item) {
        setIndex((state) => (state + 1) % slides.length);
      }
    },
    exitBeforeEnter: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginValidationSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);
    try {
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

  // reactspring-page transition
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
      {/*left-banner*/}
      <div className="w-1/2 bg-red-700 text-white flex flex-col justify-center p-12 relative overflow-hidden">
        {transitions((style, i) => (
          <animated.div
            key={i}
            style={{
              ...style,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(https://images.unsplash.com/${slides[i]}?w=1920&q=80&auto=format&fit=crop)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}

        {/*text form*/}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold">Chào mừng trở lại</h2>
          <p className="text-lg">Trải nghiệm những bộ phim tuyệt vời nhất tại rạp chiếu phim hiện đại</p>
        </div>
      </div>

      {/*right banner*/}
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo className="mx-auto mb-4" />
            <h3 className=" text-2xl font-semibold">Đăng Nhập</h3>
            <p className="text-gray-600">Tạo tài khoản mới để trải nghiệm dịch vụ tốt nhất</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                placeholder="Nhập email của bạn"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
                  ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-blue-300 hover:border-blue-500 focus:ring-blue-500'}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password')}
                  placeholder="Nhập mật khẩu"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10
                    ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-blue-300 hover:border-blue-500 focus:ring-blue-500'}`}
                />
                <a
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <img
                    src={showPassword ? '/icons/eye-open.svg' : '/icons/eye-closed.svg'}
                    alt="toggle password visibility"
                    className="w-5 h-5 cursor-pointer"
                  />
                </a>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              <a href="#" className="text-sm text-red-600 hover:underline float-right mt-1">
                Quên mật khẩu?
              </a>
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors" disabled={loading}>
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
