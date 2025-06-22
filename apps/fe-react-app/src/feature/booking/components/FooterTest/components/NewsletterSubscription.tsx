import React, { useState } from "react";

interface NewsletterSubscriptionProps {
  className?: string;
  onSubscribe?: (email: string) => void;
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({ className = "footer-column", onSubscribe }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubscribe?.(email);
      setEmail("");
    }
  };

  return (
    <section className={className}>
      <h4>Newsletter</h4>
      <p>Subscribe to our newsletter for the latest movie updates and exclusive offers.</p>
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email address for newsletter subscription"
        />
        <button type="submit">Subscribe</button>
      </form>
    </section>
  );
};

export default NewsletterSubscription;
