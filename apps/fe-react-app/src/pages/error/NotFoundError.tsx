import FuzzyText from "@/components/Reactbits/reactbit-text-animations/FuzzyText/FuzzyText";
import NavigateButton from "@/components/shared/NavigateButton";
import { siteConfig } from "@/config/config";

export const NotFoundError = () => {
  const { errorPage } = siteConfig;
  return (
    <section className="flex h-full items-center p-16 dark:bg-gray-50 dark:text-gray-800">
      <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
        <div className="flex max-w-md flex-col items-center justify-center text-center">
          <div className="mb-8">
            <span className="sr-only">{errorPage.label}</span>
            <FuzzyText fontSize="9rem" fontWeight={1000} color="#D2935A" baseIntensity={0.2} hoverIntensity={0.6}>
              {errorPage.code}
            </FuzzyText>
          </div>
          <p className="text-2xl font-semibold md:text-3xl">{errorPage.title}</p>
          <NavigateButton to="/" text={errorPage.button} />
        </div>
      </div>
    </section>
  );
};
