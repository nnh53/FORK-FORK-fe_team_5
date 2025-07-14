import NavigateButton from "@/components/shared/NavigateButton";
import { siteConfig } from "@/config/config";

export const InternalServerError = () => {
  const { internalServerErrorPage } = siteConfig;
  return (
    <section className="flex h-full items-center p-16 dark:bg-gray-50 dark:text-gray-800">
      <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
        <div className="flex max-w-md flex-col items-center justify-center text-center">
          <h2 className="mb-8 text-9xl font-extrabold dark:text-gray-400">
            <span className="sr-only">{internalServerErrorPage.label}</span>
            {internalServerErrorPage.code}
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">{internalServerErrorPage.title}</p>
          <NavigateButton to="/" text={internalServerErrorPage.button} />
        </div>
      </div>
    </section>
  );
};
