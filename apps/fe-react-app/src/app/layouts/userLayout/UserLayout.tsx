import React from 'react';
import Header from './components/header/Header'; // Assuming Header.tsx is the correct path
import Footer from './components/footer/Footer';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default UserLayout;
