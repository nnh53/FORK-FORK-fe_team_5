import FCinemaLogo from "@/assets/FCinema_Logo.webp";
import { Image } from "@unpic/react";

interface LogoProps {
  className?: string;
  altText?: string;
}

const Logo = ({ className = "flex items-center", altText = "F-Cinema Logo" }: LogoProps) => {
  return (
    <div className={className}>
      <Image src={FCinemaLogo} alt={altText} layout="fixed" width={52} height={52} />
    </div>
  );
};

export default Logo;
