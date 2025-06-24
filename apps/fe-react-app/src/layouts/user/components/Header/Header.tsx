import { AuthSection, HeaderContainer, Logo, Navigation } from ".";
import { useHeader } from "../../../../hooks";
import "./css/Header.css";

const Header = () => {
  // Use combined header hook
  const { isMenuOpen, scrolled } = useHeader({
    logoSelector: ".logo",
    navLinkSelector: ".nav-link",
  });
  return (
    <header className={`header-test ${scrolled ? "scrolled" : ""}`}>
      <HeaderContainer>
        <Logo />
        <Navigation isMenuOpen={isMenuOpen} />
        <AuthSection />
      </HeaderContainer>
    </header>
  );
};

export default Header;
