import { type ReactNode } from "react";

interface HeaderContainerProps {
  children: ReactNode;
  className?: string;
}

const HeaderContainer = ({
  children,
  className = "flex flex-1 justify-between items-center transition-all duration-300 bg-transparent px-5 w-full min-h-[70px]",
}: HeaderContainerProps) => {
  return <div className={className}>{children}</div>;
};

export default HeaderContainer;
