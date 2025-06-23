import FuzzyText from "@/components/Reactbits/reactbit-text-animations/FuzzyText/FuzzyText";
import NavigateButton from "@/components/shared/NavigateButton";


const NotFoundError = () => {
  return (
    <section className="flex h-full items-center p-16 dark:bg-gray-50 dark:text-gray-800">
      <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
        <div className="flex max-w-md flex-col items-center justify-center text-center">
          <div className="mb-8">
            <span className="sr-only">Error</span>
            <FuzzyText fontSize="9rem" fontWeight={800} color="#D2935A" baseIntensity={0.2} hoverIntensity={0.6}>
              404
            </FuzzyText>
          </div>
          <p className="text-2xl font-semibold md:text-3xl">Sorry, we couldn't find this page.</p>
          <p className="mb-8 mt-4 dark:text-gray-600">But don't worry, you can find plenty of other things on our homepage.</p>
          <NavigateButton to="/" text="Back to Home" />
        </div>
      </div>
    </section>
  );
};

export default NotFoundError;
