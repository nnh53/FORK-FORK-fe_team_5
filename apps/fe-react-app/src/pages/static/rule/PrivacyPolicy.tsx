import NavigateButton from "@/components/shared/NavigateButton";
import { siteConfig } from "@/config/config";

const PrivacyPolicy = () => {
  const { privacyPolicy } = siteConfig;
  const { title, updatedDate, sections } = privacyPolicy;

  return (
    <section className="flex h-full items-center p-8 md:p-16 dark:bg-gray-50 dark:text-gray-800">
      <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-3xl text-center md:text-left">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
            <p className="mt-2 text-sm text-gray-500">Cập nhật lần cuối: {updatedDate}</p>
          </div>

          {sections.map((section) => (
            <div className="mb-6" key={section.id}>
              <h2 className="mb-2 text-xl font-semibold">{section.title}</h2>
              {section.content && <p className="mb-4">{section.content}</p>}
              {section.description && <p className="mb-2">{section.description}</p>}
              {section.items && (
                <ul className="mb-4 list-disc space-y-2 pl-6">
                  {section.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="mt-8 text-center">
            <NavigateButton to="/" text="Trở về Trang chủ" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
