import ScrollVelocity from "../../../../../Reactbits/ScrollVelocity/ScrollVelocity";

interface ScrollBannerProps {
  /** Configuration for ScrollVelocity component */
  scrollVelocityProps: {
    texts: string[];
    velocity: number;
    className: string;
    numCopies: number;
    parallaxClassName: string;
    scrollerClassName: string;
  };
  /** Custom CSS class for the banner container */
  className?: string;
  /** Custom CSS class for the inner wrapper */
  wrapperClassName?: string;
}

/**
 * ScrollBanner component for displaying scrolling text banner
 * Used at the top of the header
 */
const ScrollBanner = ({
  scrollVelocityProps,
  className = "bg-red-600 p-2",
  wrapperClassName = "w-full overflow-hidden",
}: ScrollBannerProps) => {
  return (
    <div className={className}>
      <div className={wrapperClassName}>
        <ScrollVelocity {...scrollVelocityProps} />
      </div>
    </div>
  );
};

export default ScrollBanner;
