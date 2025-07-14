import Stack from "@/components/Reactbits/reactbit-components/Stack/Stack";
import { siteConfig } from "@/config/config";

const AdminTeamSection = () => {
  const { adminTeamSection } = siteConfig;
  return (
    <section id="admin-team" className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-8 text-3xl font-bold">{adminTeamSection.title}</h2>
        <p className="mb-12 text-lg">{adminTeamSection.description}</p>
        <div className="flex w-full items-center justify-center">
          <div className="relative" style={{ left: "-130px" }}>
            <Stack
              randomRotation={true}
              sensitivity={150}
              cardDimensions={{ width: 280, height: 350 }}
              sendToBackOnClick={true}
              cardsData={adminTeamSection.cards}
              animationConfig={{ stiffness: 260, damping: 20 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminTeamSection;
