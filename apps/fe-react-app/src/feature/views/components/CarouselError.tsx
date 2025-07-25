import { forwardRef } from "react";

const CarouselError = forwardRef<HTMLElement>((_, ref) => (
  <section className="relative h-screen w-full overflow-hidden text-white" ref={ref} id="home">
    <div className="flex h-full items-center justify-center">
      <div className="text-lg text-red-500">Failed to load movies</div>
    </div>
  </section>
));

CarouselError.displayName = "CarouselError";

export default CarouselError;
