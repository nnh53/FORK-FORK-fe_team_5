import { AuthSection, HeaderContainer, Logo, Navigation } from ".";
import { useHeader } from "../../../../hooks";

const Header = () => {
  // Use combined header hook
  const { isMenuOpen, scrolled } = useHeader({
    logoSelector: ".logo",
    navLinkSelector: ".nav-link",
  });

  return (
    <header
      className={`bg-background/80 border-border fixed left-0 top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300 ease-in-out ${scrolled ? "h-16 shadow-md" : "h-20"} `}
    >
      <HeaderContainer>
        <Logo />
        <Navigation isMenuOpen={isMenuOpen} />
        <AuthSection />
      </HeaderContainer>
    </header>
  );
};

export default Header;
