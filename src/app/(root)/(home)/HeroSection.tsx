import { Button } from "@/components/Button";
import Image from "next/image";

const HeroSection = () => {
  return (
    <div>
      <div className=" my-container py-20">
        <div className="flex flex-col justify-center max-w-4xl mx-auto">
          <div className="flex">
            <div className=" font-medium text-5xl md:text-6xl lg:text-7xl gradient-text1">
              Where Tranquility
            </div>
          </div>

          <div className=" flex flex-col sm:flex-row items-center mt-10 mb-5 space-x-8">
            <div className="w-64 h-24 overflow-hidden rounded-3xl flex items-center justify-center">
              <Image
                src="/assets/images/1.jpg"
                alt="Tranquility"
                width={500}
                height={500}
                className=" object-cover object-center"
              />
            </div>
            <div className=" flex">
              <div className=" font-medium text-5xl md:text-6xl lg:text-7xl gradient-text1">
                Meets Elegance
              </div>
            </div>
          </div>

          <div className=" font-medium text-sm lg:text-base">
            Step into a sanctuary where tranquility meets elegance. At Inner
            Peace Spa, we combine ancient rituals with modern techniques to
            deliver a truly luxurious and transformative experience. Let us help
            you unwind, restore, and glow - because you deserve nothing less
          </div>

          <div className=" flex items-center justify-center mt-16">
            <Button variant="default">Book Your Appointment Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
