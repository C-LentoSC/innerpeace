"use client";

import { Button } from "@/components/Button";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titlePart1Ref = useRef<HTMLDivElement>(null);
  const titlePart2Ref = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titlePart1Ref.current, titlePart2Ref.current], {
        y: 100,
        opacity: 0
      });

      gsap.set(imageRef.current, {
        scale: 0.8,
        opacity: 0
      });

      gsap.set(descriptionRef.current, {
        y: 60,
        opacity: 0
      });

      gsap.set(buttonRef.current, {
        y: 40,
        opacity: 0
      });

      // Create timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate elements
      tl.to(titlePart1Ref.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      })
      .to(imageRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.6")
      .to(titlePart2Ref.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out"
      }, "-=0.4")
      .to(descriptionRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.2")
      .to(buttonRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.1");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className=" pt-16 lg:pt-20">
      <div className=" my-container py-20">
        <div className="flex flex-col justify-center max-w-2xl mx-auto mb-16">
          <div className="flex">
            <div ref={titlePart1Ref} className=" font-medium text-2xl md:text-3xl lg:text-4xl">
              Get to
            </div>
          </div>

          <div className=" flex flex-col sm:flex-row items-center mt-4 space-x-8">
            <div ref={imageRef} className="w-64 h-24 overflow-hidden rounded-3xl flex items-center justify-center">
              <Image
                src="/assets/images/6.jpg"
                alt="Tranquility"
                width={500}
                height={500}
                className=" object-cover object-center"
              />
            </div>
            <div className=" flex">
              <div ref={titlePart2Ref} className=" font-medium text-5xl md:text-6xl lg:text-7xl">
                Know Us
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center max-w-3xl mx-auto">
          <div ref={descriptionRef} className=" font-medium text-sm lg:text-base text-center">
            At Inner Peace, we create a serene sanctuary where luxury meets
            relaxation. With expert care, premium treatments, and a tranquil
            atmosphere, we help you unwind, rejuvenate, and rediscover your
            inner calm.
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
