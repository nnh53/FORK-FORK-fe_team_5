import FlowingMenu from "@/components/Reactbits/reactbit-components/FlowingMenu/FlowingMenu";
import React from "react";

interface MenuItem {
  link: string;
  text: string;
  image: string;
}

interface FlowingMenuSectionProps {
  items?: MenuItem[];
  className?: string;
  style?: React.CSSProperties;
  flowingMenuRef?: React.RefObject<HTMLElement | null>;
}

const defaultMenuItems: MenuItem[] = [
  {
    link: "#",
    text: "F-Cinema",
    image: "https://picsum.photos/600/400?random=1",
  },
  {
    link: "#",
    text: "Group 5",
    image: "https://picsum.photos/600/400?random=2",
  },
];

const FlowingMenuSection: React.FC<FlowingMenuSectionProps> = ({
  items = defaultMenuItems,
  className = "flowing-menu-container",
  style = { height: "300px", position: "relative" },
  flowingMenuRef,
}) => {
  return (
    <section className={className} ref={flowingMenuRef} style={style}>
      <FlowingMenu items={items} />
    </section>
  );
};

export default FlowingMenuSection;
