import AdminTeamSection from "@/feature/views/sections/AdminTeamSection";
import { Header } from "@/layouts/user/components/Header";

export default function About() {
  return (
    <div>
      <Header />
      <AdminTeamSection />
      <div className="text-center"></div>
    </div>
  );
}
