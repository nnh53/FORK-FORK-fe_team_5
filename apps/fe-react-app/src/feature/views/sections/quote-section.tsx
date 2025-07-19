import { siteConfig } from "@/config/config";

export function QuoteSection() {
  const { quoteSection } = siteConfig;

  return (
    <section id="quote" className="bg-accent z-20 flex w-full flex-col items-center justify-center gap-8 p-14">
      <blockquote className="max-w-3xl px-4 text-left">
        <p className="text-primary mb-6 text-xl font-medium leading-relaxed tracking-tighter md:text-2xl">{quoteSection.quote}</p>

        <div className="flex gap-4">
          <div className="bg-primary border-border size-10 rounded-full border">
            <img src={quoteSection.author.image} alt={quoteSection.author.name} className="size-full rounded-full object-contain" />
          </div>
          <div className="text-left">
            <cite className="text-primary text-lg font-medium not-italic">{quoteSection.author.name}</cite>
            <p className="text-primary text-sm">{quoteSection.author.role}</p>
          </div>
        </div>
      </blockquote>
    </section>
  );
}
