import { FlowingMenuSection, FooterBottom, FooterLinks, FooterLogo, NewsletterSubscription } from "./components";
import { quickLinks, supportLinks } from "./constants/footerData";
import "./Footer.css";
import { useFooterAnimations } from "./hooks/useFooterAnimations";

const Footer = () => {
  const { footerRef, flowingMenuRef } = useFooterAnimations();

  const handleNewsletterSubscribe = (email: string) => {
    console.log("Newsletter subscription:", email);
  };

  return (
    <>
      <footer className="footer-test" ref={footerRef}>
        <section className="footer-container">
          <header className="footer-top">
            <FooterLogo />
            <FooterLinks title="Quick Links" links={quickLinks} />
            <FooterLinks title="Support" links={supportLinks} />
            <NewsletterSubscription onSubscribe={handleNewsletterSubscribe} />
          </header>
          <FooterBottom />
        </section>
      </footer>

      <FlowingMenuSection flowingMenuRef={flowingMenuRef} />
    </>
  );
};

export default Footer;
