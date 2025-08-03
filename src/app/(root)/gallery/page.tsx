import HeadMassageTourSection from "./HeadMassageTourSection";
import GalleryGridSection from "./GalleryGridSection";
import GalleryContactSection from "./GalleryContactSection";
import Image from "next/image";

const GalleryPage = () => {
  return (
    <div className="flex flex-col w-full relative overflow-hidden">
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
      <GalleryGridSection />
      <HeadMassageTourSection />
      <GalleryContactSection />
    </div>
  );
};

export default GalleryPage;
