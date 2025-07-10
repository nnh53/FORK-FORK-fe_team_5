import FlowingMenuSection from "@/feature/views/FlowingMenuSection/FlowingMenuSection";
import { AuthSection, HeaderContainer, Logo, Navigation } from ".";
import { useHeader } from "../../../../hooks";
import "./Header.css";

const Header = () => {
  // Use combined header hook
  const { isMenuOpen, scrolled } = useHeader({
    logoSelector: ".logo",
    navLinkSelector: ".nav-link",
  });

  return (
    <>
      <div className="fixed left-0 top-0 z-[51] w-full">
        <FlowingMenuSection />
      </div>
      <header
        className={`bg-background/80 border-border fixed left-0 top-[60px] z-50 w-full border-b backdrop-blur-md transition-all duration-300 ease-in-out ${scrolled ? "h-16 shadow-md" : "h-20"} `}
      >
        <HeaderContainer className="curved-header flex min-h-[70px] w-full flex-1 items-center justify-between bg-transparent px-5 transition-all duration-300">
          <Logo />
          <Navigation isMenuOpen={isMenuOpen} />
          <AuthSection />
        </HeaderContainer>
      </header>
    </>
  );
};

export default Header;
