import { useHeader } from "../../../../hooks";
import { AuthSection, HeaderContainer, Logo, Navigation, ScrollBanner } from "./";
import "./HeaderTest.css";

const HeaderTest = () => {
  // Use combined header hook
  const { isMenuOpen, scrolled, scrollVelocityProps } = useHeader({
    logoSelector: ".logo",
    navLinkSelector: ".nav-link",
    scrollVelocityConfig: {
      defaultVelocity: 100,
      texts: ["F CINEMA"],
      className: "text-2xl font-bold text-white",
      numCopies: 20,
      parallaxClassName: "parallax w-full overflow-hidden whitespace-nowrap",
      scrollerClassName: "scroller flex",
    },
  });
  return (
    <header className={`header-test ${scrolled ? "scrolled" : ""}`}>
      <ScrollBanner scrollVelocityProps={scrollVelocityProps} />
      <HeaderContainer>
        <Logo />
        <Navigation isMenuOpen={isMenuOpen} />
        <AuthSection />
      </HeaderContainer>
    </header>
  );
};

export default HeaderTest;
