import ScrollVelocity from "../../../../../Reactbits/ScrollVelocity/ScrollVelocity";

interface ScrollBannerProps {
  scrollVelocityProps: {
    texts: string[];
    velocity: number;
    className: string;
    numCopies: number;
    parallaxClassName: string;
    scrollerClassName: string;
  };
  className?: string;
  wrapperClassName?: string;
}

const ScrollBanner = ({ scrollVelocityProps, className = "bg-red-600 p-2", wrapperClassName = "w-full overflow-hidden" }: ScrollBannerProps) => {
  return (
    <div className={className}>
      <div className={wrapperClassName}>
        <ScrollVelocity {...scrollVelocityProps} />
      </div>
    </div>
  );
};

export default ScrollBanner;
