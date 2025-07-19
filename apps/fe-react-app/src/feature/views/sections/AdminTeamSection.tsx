import Stack from "@/components/Reactbits/reactbit-components/Stack/Stack";
import { siteConfig } from "@/config/config";

const AdminTeamSection = () => {
  const { adminTeamSection } = siteConfig;
  return (
    <section id="admin-team" className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-8 text-3xl font-bold">{adminTeamSection.title}</h2>
        <p className="mb-12 text-lg">{adminTeamSection.description}</p>
        <div>
          <div>
            <Stack
              randomRotation={true}
              sensitivity={180}
              cardDimensions={{ width: 350, height: 450 }}
              sendToBackOnClick={false}
              cardsData={adminTeamSection.cards}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminTeamSection;
