import FCinemaLogo from "@/assets/FCinema_Logo.webp";

interface LogoProps {
  className?: string;
  altText?: string;
}

const Logo = ({ className = "flex items-center", altText = "F-Cinema Logo" }: LogoProps) => {
  return (
    <div className={className}>
      <img src={FCinemaLogo} alt={altText} className="h-10" />
    </div>
  );
};

export default Logo;
