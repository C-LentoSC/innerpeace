import { Button } from "@/components/Button";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className=" pt-16 lg:pt-20">
      <div className=" my-container py-20">
        <div className=" flex flex-col md:flex-row gap-4 text-5xl md:text-6xl lg:text-7xl items-center justify-center py-10">
          <div className="text-center">Contact</div>
          <div className="w-64 h-24 overflow-hidden rounded-3xl flex items-center justify-center">
            <Image
              src="/assets/images/7.jpg"
              alt="Tranquility"
              width={500}
              height={500}
              className=" object-cover object-center"
            />
          </div>
          <div className="text-center">Us</div>
        </div>

        <div className="flex flex-col justify-center max-w-3xl mx-auto">
          <div className=" font-medium text-sm lg:text-base text-center">
            Whether you’re ready to book your next appointment or have a
            question about our services, our team is here to help. Reach out and
            let us make your experience seamless and special. If you’d like, I
            can also provide a few more variations - formal, friendly, or
            minimal. Let me know!
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
