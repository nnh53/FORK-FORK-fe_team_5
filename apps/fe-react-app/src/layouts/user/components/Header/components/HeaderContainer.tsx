import { type ReactNode } from "react";

interface HeaderContainerProps {
  children: ReactNode;
  className?: string;
}

const HeaderContainer = ({ children, className = "header-container" }: HeaderContainerProps) => {
  return <div className={className}>{children}</div>;
};

export default HeaderContainer;
