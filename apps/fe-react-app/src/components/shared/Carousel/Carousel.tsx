import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import React, { useEffect, useRef, useState } from "react";

const DEFAULT_IMAGES: string[] = [
  "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp",
  "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp",
  "https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp",
  "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp",
];

interface CarouselProps {
  images?: string[];
  height?: string;
  imgClassName?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ images = DEFAULT_IMAGES, height, imgClassName, autoplay = true, autoplayInterval = 3000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const numImages = images.length;
  const carouselRef = useRef<HTMLDivElement>(null);

  // Hàm để cuộn tới một slide cụ thể
  const navigateToSlide = (slideIndex: number, behavior: ScrollBehavior = "smooth") => {
    if (!carouselRef.current || numImages === 0) return;

    const targetSlideId = `slide${slideIndex + 1}`;
    // Tìm slide con dựa trên ID bên trong phần tử carouselRef
    const targetElement = carouselRef.current.querySelector<HTMLDivElement>(`#${targetSlideId}`);

    if (targetElement) {
      const targetOffsetLeft = targetElement.offsetLeft; // Vị trí left của slide con so với carousel cha

      // Chỉ cuộn nếu vị trí hiện tại khác vị trí đích
      if (carouselRef.current.scrollLeft !== targetOffsetLeft) {
        carouselRef.current.scrollTo({
          left: targetOffsetLeft,
          behavior: behavior, // 'smooth' để cuộn mượt, 'auto' để cuộn ngay lập tức
        });
      }
    }
  };

  useEffect(() => {
    navigateToSlide(currentSlide, "smooth");
  }, [currentSlide, numImages]);

  // Effect 2: Logic Autoplay
  useEffect(() => {
    if (!autoplay || numImages <= 1 || isHovering) {
      return;
    }
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % numImages);
      // Việc thay đổi currentSlide sẽ kích hoạt Effect 1 để cuộn
    }, autoplayInterval);
    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval, numImages, isHovering]);

  if (numImages === 0) {
    return null;
  }

  // Hàm xử lý click cho các phần tử điều hướng (mũi tên, dấu chấm)
  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, targetIndex: number) => {
    event.preventDefault(); // Ngăn hành vi mặc định của thẻ <a>
    if (targetIndex !== currentSlide) {
      setCurrentSlide(targetIndex); // Sẽ kích hoạt Effect 1 để cuộn
    } else {
      navigateToSlide(targetIndex, "smooth");
    }
  };

  return (
    <div
      className="relative" // Container chính
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div ref={carouselRef} className="carousel w-full scroll-smooth">
        {images.map((src, index) => {
          const slideId = `slide${index + 1}`;
          // Logic cho nút Previous/Next (0-indexed cho setCurrentSlide)
          const prevSlideIndex = index === 0 ? numImages - 1 : index - 1;
          const nextSlideIndex = index === numImages - 1 ? 0 : index + 1;

          const itemStyle: React.CSSProperties = {};
          if (height) itemStyle.height = height;
          let finalImgClassName = "w-full";
          if (imgClassName) finalImgClassName = imgClassName;
          else if (height) finalImgClassName = "w-full h-full object-cover";

          return (
            <div
              key={slideId}
              id={slideId} // ID vẫn hữu ích để querySelector tìm thấy slide
              className="carousel-item relative w-full"
              style={itemStyle}
            >
              <img src={src} className={finalImgClassName} alt={`Slide ${index + 1}`} />
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a
                  href={`#${slideId}`} // href có thể giữ lại cho ngữ nghĩa hoặc fallback
                  onClick={(e) => handleNavClick(e, prevSlideIndex)}
                  className="btn btn-circle opacity-50 hover:opacity-100"
                  aria-label="Previous slide"
                >
                  <ArrowBackIosNewRoundedIcon fontSize={"medium"}></ArrowBackIosNewRoundedIcon>
                </a>
                <a
                  href={`#${slideId}`} // Tương tự
                  onClick={(e) => handleNavClick(e, nextSlideIndex)}
                  className="btn btn-circle opacity-50 hover:opacity-100"
                  aria-label="Next slide"
                >
                  <ArrowForwardIosRoundedIcon fontSize={"medium"}></ArrowForwardIosRoundedIcon>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicators (Dấu chấm) */}
      {numImages > 1 && (
        <div className="flex justify-center w-full py-3 gap-2 absolute bottom-2 left-0 right-0 z-10">
          {images.map((_, index) => (
            <a
              key={`dot-${index}`}
              href={`#slide${index + 1}`} // href có thể giữ lại cho ngữ nghĩa
              onClick={(e) => handleNavClick(e, index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ease-in-out
                                        ${currentSlide === index ? "bg-red-500 scale-125" : "bg-gray-400 hover:bg-gray-500"}`}
            ></a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
