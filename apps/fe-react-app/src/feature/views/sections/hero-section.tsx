import { siteConfig } from "@/config/config";
import { FileStack } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Custom buttons
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { PulsatingButton } from "@/components/magicui/pulsating-button";

export function HeroSection() {
  const { hero } = siteConfig;
  const navigate = useNavigate();

  return (
    <section id="hero" className="relative min-h-screen w-full">
      {/* Radial Gradient Background with Light Brown */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #D2B48C 100%)",
        }}
      />

      <div className="relative z-10 flex w-full flex-col items-center px-6">
        <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center gap-10 pt-32">
          <p className="border-border bg-accent flex h-8 items-center gap-2 rounded-full border px-3 text-sm">
            <FileStack className="h-4 w-4" />
            {hero.badge}
          </p>
          <div className="flex flex-col items-center justify-center gap-5">
            <h1 className="text-primary text-balance text-center text-3xl font-medium tracking-tighter md:text-4xl lg:text-5xl xl:text-6xl">
              {hero.title}
            </h1>
            <p className="text-muted-foreground text-balance text-center text-base font-medium leading-relaxed tracking-tight md:text-lg">
              {hero.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <PulsatingButton className="h-9 w-32 rounded-full text-sm font-normal tracking-wide" onClick={() => navigate(hero.cta.primary.href)}>
              {hero.cta.primary.text}
            </PulsatingButton>

            <InteractiveHoverButton
              className="h-10 w-32 rounded-full text-sm font-normal tracking-wide"
              onClick={() => navigate(hero.cta.secondary.href)}
            >
              {hero.cta.secondary.text}
            </InteractiveHoverButton>
          </div>
        </div>
      </div>
      {/* <HeroVideoSection /> */}
    </section>
  );
}
