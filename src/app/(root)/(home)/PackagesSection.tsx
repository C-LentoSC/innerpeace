import { ServiceCard } from "@/components/ServiceCard";
import { DEMO_SERVICES } from "@/constants/data";
import Image from "next/image";

const PackagesSection = () => {
  return (
    <section className="">
      <div className=" my-container py-20 ">
        <div className=" flex flex-col">
          <div className=" font-medium text-3xl md:text-4xl gradient-text1 text-center mb-10">
            Our Excusive Services We Provide
          </div>

          <div className="rounded-md p-8 md:p-12 flex flex-col items-center justify-center space-y-16 relative overflow-hidden">
            <Image
              src="/assets/paper-texture.jpg"
              alt="Package 01"
              width={300}
              height={200}
              className=" absolute inset-0 w-full h-full object-cover rounded-md opacity-10 -z-10"
            />

            {DEMO_SERVICES.map((service, index) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                price={service.price}
                duration={service.duration}
                image={service.image}
                imageAlt={service.imageAlt}
                serviceId={service.serviceId}
                alignment={index % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
