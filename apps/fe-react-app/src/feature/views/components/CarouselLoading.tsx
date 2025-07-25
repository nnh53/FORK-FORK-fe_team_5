import { forwardRef } from "react";

const CarouselLoading = forwardRef<HTMLElement>((_, ref) => (
  <section className="relative h-screen w-full overflow-hidden text-white" ref={ref} id="home">
    <div className="flex h-full items-center justify-center">
      <div className="text-lg">Loading movies...</div>
    </div>
  </section>
));

CarouselLoading.displayName = "CarouselLoading";

export default CarouselLoading;
