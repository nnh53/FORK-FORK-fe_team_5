import { siteConfig } from "@/config/config";
import { SectionHeader } from "../section-header";
import { Feature as FeatureComponent } from "../ui/feature-slideshow";

export function FeatureSection() {
  const { title, description, items } = siteConfig.featureSection;

  return (
    <section id="features" className="relative flex w-full flex-col items-center justify-center gap-5">
      <SectionHeader>
        <h2 className="text-balance text-center text-3xl font-medium tracking-tighter md:text-4xl">{title}</h2>
        <p className="text-muted-foreground text-balance text-center font-medium">{description}</p>
      </SectionHeader>
      <div className="flex h-full w-full items-center justify-center lg:h-[450px]">
      <FeatureComponent collapseDelay={5000} linePosition="bottom" featureItems={items} lineColor="bg-secondary" />
      </div>
    </section>
  );
}
