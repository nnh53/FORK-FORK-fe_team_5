import { yupResolver } from '@hookform/resolvers/yup';
import { animated, useSpring, useTransition } from '@react-spring/web';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Logo } from '../../components/logo/Logo';
import NavigateButton from '../../components/shared/NavigateButton';
import { registerValidationSchema } from '../../utils/validation';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Cinema-related images for background transition
const slides = [
  'photo-1524985069026-dd778a71c7b4',
  'photo-1489599849927-2ee91cede3ba',
  'photo-1536440136628-1c6cb5a2a869',
  'photo-1542204637-e9f12f144cca',
];

const Register: React.FC = () => {
  const [index, setIndex] = useState(0);

  // Background transition using useTransition
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
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerValidationSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    //từ từ add sau nhé
    console.log('Registration attempt', data);
  };

  // Page entrance animation
  const pageAnimation = useSpring({
    from: {
      opacity: 0,
      transform: 'translateX(-50px)',
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
      {/* Left Banner*/}
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo className="mx-auto mb-4" />
            <h3 className="text-2xl font-semibold">Đăng Ký</h3>
            <p className="text-gray-600">Tạo tài khoản mới để trải nghiệm dịch vụ tốt nhất</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-700">
                Họ và tên
              </label>
              <input
                type="text"
                id="fullName"
                {...register('fullName')}
                placeholder="Nhập họ và tên"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                  ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'}`}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                placeholder="Nhập email của bạn"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                  ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block  font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                {...register('password')}
                placeholder="Nhập mật khẩu"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                  ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'}`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register('confirmPassword')}
                placeholder="Nhập lại mật khẩu"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
                  ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300">
              Đăng ký
            </button>

            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">Đã có tài khoản? </span>
              <NavigateButton to="/login">Đăng nhập ngay</NavigateButton>
            </div>
          </form>
        </div>
      </div>

      {/* Right Banner with Animated Background */}
      <div className="w-1/2 bg-red-700 text-white flex flex-col justify-center p-12 relative overflow-hidden">
        {/* Animated Background Images */}
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

        {/* Dark Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50" style={{ zIndex: 1 }} />

        {/* Text Overlay */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold">Tham gia cùng chúng tôi</h2>
          <p className="text-lg">Khám phá thế giới điện ảnh đầy màu sắc với hàng ngàn bộ phim hấp dẫn</p>
        </div>
      </div>
    </animated.div>
  );
};

export default Register;

