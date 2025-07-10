import FCinemaLogo from "@/assets/FCinema_Logo.webp";
import FlowingMenu from "@/components/Reactbits/reactbit-components/FlowingMenu/FlowingMenu";
import React from "react";
import "./FlowingMenuSection.css";

const items = [{ link: "/home", text: "F Cinema", image: FCinemaLogo }];

const FlowingMenuSection: React.FC = () => {
  return (
    <div className="flowing-menu-wrapper bg-black py-1">
      <div className="container mx-auto">
        <div style={{ height: "60px", position: "relative" }}>
          <FlowingMenu items={items} />
        </div>
      </div>
    </div>
  );
};

export default FlowingMenuSection;
