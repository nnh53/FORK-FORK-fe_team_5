import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AuthFormContainerProps {
  children: React.ReactNode;
  transparent?: boolean;
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = ({ children, transparent = false }) => (
  <div className={`min-h-screen flex items-center justify-center p-4 ${transparent ? "" : "bg-gray-100"}`}>
    {children}
    <ToastContainer />
  </div>
);

export default AuthFormContainer;
