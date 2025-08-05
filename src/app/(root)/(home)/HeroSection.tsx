"use client";

import { Button } from "@/components/Button";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef1 = useRef<HTMLDivElement>(null);
  const titleRef2 = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef1.current, titleRef2.current], {
        y: 100,
        opacity: 0
      });
      
      gsap.set(imageRef.current, {
        scale: 0.8,
        opacity: 0
      });
      
      gsap.set(descriptionRef.current, {
        y: 50,
        opacity: 0
      });
      
      gsap.set(buttonRef.current, {
        y: 30,
        opacity: 0
      });

      // Create timeline for animations
      const tl = gsap.timeline({ delay: 0.2 });
      
      // Animate first title
      tl.to(titleRef1.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      })
      // Animate image with slight delay
      .to(imageRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.6")
      // Animate second title
      .to(titleRef2.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      }, "-=0.4")
      // Animate description
      .to(descriptionRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.2")
      // Animate button
      .to(buttonRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.1");

    }, heroRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <section ref={heroRef} className=" pt-16 lg:pt-20">
      <div className=" my-container py-20">
        <div className="flex flex-col justify-center max-w-4xl mx-auto">
          <div className="flex">
            <div ref={titleRef1} className=" font-medium text-5xl md:text-6xl lg:text-7xl gradient-text1">
              Where Tranquility
            </div>
          </div>

          <div className=" flex flex-col sm:flex-row items-center mt-10 mb-5 space-x-8">
            <div ref={imageRef} className="w-64 h-24 overflow-hidden rounded-3xl flex items-center justify-center">
              <Image
                src="/assets/images/1.jpg"
                alt="Tranquility"
                width={500}
                height={500}
                className=" object-cover object-center"
              />
            </div>
            <div className=" flex">
              <div ref={titleRef2} className=" font-medium text-5xl md:text-6xl lg:text-7xl gradient-text1">
                Meets Elegance
              </div>
            </div>
          </div>

          <div ref={descriptionRef} className=" font-medium text-sm lg:text-base">
            Step into a sanctuary where tranquility meets elegance. At Inner
            Peace Spa, we combine ancient rituals with modern techniques to
            deliver a truly luxurious and transformative experience. Let us help
            you unwind, restore, and glow - because you deserve nothing less
          </div>

          <div ref={buttonRef} className=" flex items-center justify-center mt-16">
            <Button variant="default">Book Your Appointment Now</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
