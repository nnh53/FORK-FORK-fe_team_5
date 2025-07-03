import FCinemaLogo from "@/assets/FCinema_Logo.webp";

interface LogoProps {
  className?: string;
  altText?: string;
  logoText?: string;
}

const Logo = ({ className = "logo", altText = "F-Cinema Logo", logoText = "F-Cinema" }: LogoProps) => {
  return (
    <div className={className}>
      <img src={FCinemaLogo} alt={altText} />
      <span>{logoText}</span>
    </div>
  );
};

export default Logo;
