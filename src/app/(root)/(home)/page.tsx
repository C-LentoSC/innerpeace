import HeroSection from "./HeroSection";
import Image from "next/image";

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
      </div>

      {/* Content sections */}
      <HeroSection />

      <div className=" min-h-screen"></div>
      <div className=" min-h-screen"></div>
      <div className=" min-h-screen"></div>
      <div className=" min-h-screen"></div>
      <div className=" min-h-screen"></div>
    </div>
  );
};

export default HomePage;
