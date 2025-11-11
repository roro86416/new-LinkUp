"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";

const FeatureSlider = () => {
  const slides = [
    {
      id: 1,
      title: "TOOLS & FEATURES",
      leftImage: "/client/public/slide1.jpg",
      rightImage: "/client/public/slide2.jpg",
      bgColor: "bg-pink-200",
    },
    {
      id: 2,
      title: "NEWS & TRENDS",
      leftImage: "/client/public/slide3.jpg",
      rightImage: "/client/public/slide4.jpg",
      bgColor: "bg-blue-200",
    },
    {
      id: 3,
      title: "Community",
      leftImage: "/client/public/slide5.jpg",
      rightImage: "/client/public/slide6.jpg",
      bgColor: "bg-purple-200",
    },
    {
      id: 4,
      title: "Holloween",
      leftImage: "/client/public/slide7.jpg",
      rightImage: "/client/public/slide8.jpg",
      bgColor: "bg-green-200",
    }
  ];

  return (
    <div className="w-full rounded-xl overflow-hidden">
      <Swiper
        modules={[Navigation]}
        navigation
        loop
        slidesPerView={1}
        className="mySwiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={`flex ${slide.bgColor} p-4 md:p-8 rounded-xl`}>
              {/* 左圖 */}
              <div className="flex-1 relative rounded-lg overflow-hidden">
                <Image
                  src={slide.leftImage}
                  alt={slide.title}
                  width={800}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* 右圖 + 文字疊層 */}
              <div className="flex-1 relative rounded-lg overflow-hidden">
                <Image
                  src={slide.rightImage}
                  alt={slide.title}
                  width={800}
                  height={600}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 flex justify-center items-center bg-black/30">
                  <h2 className="text-white text-6xl font-extrabold text-center">
                    {slide.title}
                  </h2>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeatureSlider;
