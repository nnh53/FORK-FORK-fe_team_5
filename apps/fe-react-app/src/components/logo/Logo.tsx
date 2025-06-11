import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', width = 120, height = 120 }) => {
  return <img src="/images/logo.png" alt="F Cinema Logo" className={`${className}`} style={{ width, height, objectFit: 'contain' }} />;
};
