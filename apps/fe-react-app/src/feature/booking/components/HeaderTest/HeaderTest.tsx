import { ROUTES } from "@/routes/route.constants";
import { Link } from "react-router-dom";
import ScrollVelocity from "../../../../../Reactbits/ScrollVelocity/ScrollVelocity";
import FCinemaLogo from "../../../../assets/FCinema_Logo.png";
import { useHeader } from "../../../../hooks";
import "./HeaderTest.css";

const HeaderTest = () => {
  // Use combined header hook
  const { isMenuOpen, scrolled, scrollVelocityProps } = useHeader({
    headerSelector: ".header-test",
    logoSelector: ".logo",
    navLinkSelector: ".nav-link",
    scrolledHeight: "120px",
    scrollVelocityConfig: {
      defaultVelocity: 100,
      texts: ["F CINEMA"],
      className: "text-2xl font-bold text-white",
    },
  });

  return (
    <header className={`header-test ${scrolled ? "scrolled" : ""}`}>
      {/* Red Demo ScrollVelocity at the top inside header */}
      <div className="bg-red-600 p-2">
        <div className="w-full overflow-hidden">
          <ScrollVelocity {...scrollVelocityProps} />
        </div>
      </div>

      <div className="header-container">
        <div className="logo">
          <img src={FCinemaLogo} alt="F-Cinema Logo" />
          <span>F-Cinema</span>
        </div>
        <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <ul>
            <li>
              <a href="#" className="nav-link">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Movies
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Theaters
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Offers
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Membership
              </a>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          <button className="login-button">
            <Link to={ROUTES.AUTH.LOGIN}>Login</Link>
          </button>
          <button className="book-button">Book Now</button>{" "}
        </div>
      </div>
    </header>
  );
};

export default HeaderTest;
