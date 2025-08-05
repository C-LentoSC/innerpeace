"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const GalleryContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titlePart1Ref = useRef<HTMLDivElement>(null);
  const titlePart2Ref = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titlePart1Ref.current, titlePart2Ref.current], {
        y: 80,
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
        duration: 0.8,
        ease: "power2.out"
      })
      .to(imageRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.2)"
      }, "-=0.4")
      .to(titlePart2Ref.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.6")
      .to(descriptionRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.2");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20">
      <div className="my-container">
        <div className="flex flex-col">
          <div ref={titleRef} className=" flex flex-col md:flex-row gap-4 text-3xl md:text-4xl lg:text-5xl items-center justify-center py-10">
            <div ref={titlePart1Ref} className="text-center">Stay Connected</div>
            <div ref={imageRef} className="w-64 h-24 overflow-hidden rounded-3xl flex items-center justify-center">
              <Image
                src="/assets/images/5.png"
                alt="Tranquility"
                width={500}
                height={500}
                className=" object-cover object-center"
              />
            </div>
            <div ref={titlePart2Ref} className="text-center">With Us</div>
          </div>
          <div ref={descriptionRef} className="text-center md:text-lg">
            We Will Be Sharing Our Journey with Even More
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryContactSection;
