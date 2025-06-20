import { ROUTES } from "@/routes/route.constants";
import { Link } from "react-router-dom";

interface AuthSectionProps {
  className?: string;
  loginButtonClassName?: string;
  bookButtonClassName?: string;
  showBookButton?: boolean;
  loginText?: string;
  bookText?: string;
  onLoginClick?: () => void;
  onBookClick?: () => void;
}

const AuthSection = ({
  className = "header-actions",
  loginButtonClassName = "login-button",
  bookButtonClassName = "book-button",
  showBookButton = true,
  loginText = "Login",
  bookText = "Book Now",
  onLoginClick,
  onBookClick,
}: AuthSectionProps) => {
  return (
    <div className={className}>
      <button className={loginButtonClassName} onClick={onLoginClick}>
        <Link to={ROUTES.AUTH.LOGIN}>{loginText}</Link>
      </button>
      {showBookButton && (
        <button className={bookButtonClassName} onClick={onBookClick}>
          {bookText}
        </button>
      )}
    </div>
  );
};

export default AuthSection;

