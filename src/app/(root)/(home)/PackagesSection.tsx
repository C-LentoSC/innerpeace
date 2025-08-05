"use client";

import { ServiceCard } from "@/components/ServiceCard";
import { DEMO_SERVICES } from "@/constants/data";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PackagesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(titleRef.current, {
        y: 60,
        opacity: 0
      });

      gsap.set(containerRef.current, {
        y: 80,
        opacity: 0
      });

      // Animate title
      gsap.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate container
      gsap.to(containerRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate service cards with stagger
      serviceRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.set(ref, {
            y: 100,
            opacity: 0
          });

          gsap.to(ref, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            delay: index * 0.2,
            scrollTrigger: {
              trigger: ref,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          });
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="">
      <div className=" my-container py-20 ">
        <div className=" flex flex-col">
          <div ref={titleRef} className=" font-medium text-3xl md:text-4xl gradient-text1 text-center mb-10">
            Our Excusive Services We Provide
          </div>

          <div ref={containerRef} className="rounded-md p-8 md:p-12 flex flex-col items-center justify-center space-y-16 relative overflow-hidden">
            <Image
              src="/assets/paper-texture.jpg"
              alt="Package 01"
              width={300}
              height={200}
              className=" absolute inset-0 w-full h-full object-cover rounded-md opacity-10 -z-10"
            />

            {DEMO_SERVICES.map((service, index) => (
              <div
                key={service.id}
                ref={(el) => (serviceRefs.current[index] = el)}
              >
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  price={service.price}
                  duration={service.duration}
                  image={service.image}
                  imageAlt={service.imageAlt}
                  serviceId={service.serviceId}
                  alignment={index % 2 === 0 ? "left" : "right"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
