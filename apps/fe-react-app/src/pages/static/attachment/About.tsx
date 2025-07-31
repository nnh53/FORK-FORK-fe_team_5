import NavigateButton from "@/components/shared/NavigateButton";
import AdminTeamSection from "@/feature/views/sections/AdminTeamSection";

export default function About() {
  return (
    <div>
      <AdminTeamSection />
      <div className="text-center">
        <NavigateButton to="/" text="Trở về Trang chủ" />
      </div>
    </div>
  );

}
