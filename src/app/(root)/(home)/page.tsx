import HeroSection from "./HeroSection";
import Image from "next/image";
import SecanderySection from "./SecanderySection";
import PackagesSection from "./PackagesSection";
import VideoSection from "./VideoSection";
import GallerySection from "./GallerySection";

const HomePage = () => {
  return (
    <div className="flex flex-col w-full relative">
      {/* Background Image - Always at the bottom */}
      <div className="absolute w-full -z-10">
        <Image
          src={"/assets/bg1.png"}
          alt="Background Image"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          priority
        />
        <Image
          src={"/assets/bg2.png"}
          alt="Background Image"
          className="w-full h-full object-cover"
          width={1000}
          height={1080}
          priority
        />
        <Image
          src={"/assets/bg3.png"}
          alt="Background Image"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          priority
        />
      </div>

      {/* Content sections */}
      <HeroSection />

      <SecanderySection />

      <PackagesSection />

      <VideoSection />

      <GallerySection />

      <div className=" min-h-screen"></div>
      <div className=" min-h-screen"></div>
      <div className=" min-h-screen"></div>
      <div className=" min-h-screen"></div>
      <div className=" min-h-screen"></div>
    </div>
  );
};

export default HomePage;
