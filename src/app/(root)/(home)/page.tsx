import HeroSection from "./HeroSection";
import Image from "next/image";

const HomePage = () => {
  return (
    <div className="bg-background text-foreground flex flex-col w-full">
      <HeroSection />
      <div className="flex absolute w-full">
        <Image
          src={"/assets/bg1.png"}
          alt="Background Image"
          className="w-full h-auto object-cover"
          width={1920}
          height={1080}
        />
      </div>
    </div>
  );
};

export default HomePage;
