import { Button } from "@/components/Button";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className=" pt-16 lg:pt-20">
      <div className=" my-container py-20">
        <div className="flex flex-col justify-center max-w-2xl mx-auto mb-16">
          <div className="flex">
            <div className=" font-medium text-2xl md:text-3xl lg:text-4xl">
              Get to
            </div>
          </div>

          <div className=" flex flex-col sm:flex-row items-center mt-4 space-x-8">
            <div className="w-64 h-24 overflow-hidden rounded-3xl flex items-center justify-center">
              <Image
                src="/assets/images/6.jpg"
                alt="Tranquility"
                width={500}
                height={500}
                className=" object-cover object-center"
              />
            </div>
            <div className=" flex">
              <div className=" font-medium text-5xl md:text-6xl lg:text-7xl">
                Know Us
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center max-w-3xl mx-auto">
          <div className=" font-medium text-sm lg:text-base text-center">
            At Inner Peace, we create a serene sanctuary where luxury meets
            relaxation. With expert care, premium treatments, and a tranquil
            atmosphere, we help you unwind, rejuvenate, and rediscover your
            inner calm.
          </div>

          <div className=" flex items-center justify-center mt-16">
            <Button variant="default">Book Your Appointment Now</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
