"use client";

import { Button } from "@/components/Button";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SecanderySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentBoxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(titleRef.current, {
        y: 60,
        opacity: 0
      });

      gsap.set(imageRef.current, {
        scale: 1.1,
        opacity: 0
      });

      gsap.set(contentBoxRef.current, {
        y: 80,
        opacity: 0
      });

      gsap.set(textRef.current, {
        y: 30,
        opacity: 0
      });

      gsap.set(buttonRef.current, {
        y: 20,
        opacity: 0
      });

      // Create timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate title first
      tl.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      })
      // Animate image with parallax effect
      .to(imageRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      }, "-=0.4")
      // Animate content box
      .to(contentBoxRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.2)"
      }, "-=0.6")
      // Animate text content
      .to(textRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")
      // Animate button last
      .to(buttonRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.2");

      // Add subtle parallax effect to image on scroll
      gsap.to(imageRef.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: imageContainerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

    }, sectionRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <section ref={sectionRef} className="">
      <div className=" my-container py-20 ">
        <div className=" flex flex-col justify-center">
          <div ref={titleRef} className=" font-medium text-3xl md:text-4xl gradient-text1 text-center ">
            Japanese Head Message for Ultra Rexlation
          </div>

          <div ref={imageContainerRef} className=" flex items-center justify-center aspect-[9/16] sm:aspect-square md:aspect-video relative rounded-md overflow-hidden mt-10">
            <Image
              ref={imageRef}
              src={"/assets/images/2.jpg"}
              alt="Japanese Head Message for Ultra Relaxation"
              width={500}
              height={300}
              className=" w-full h-full object-cover object-center"
            />

            <div className=" absolute bottom-0 p-5">
              <div ref={contentBoxRef} className=" bg-background/25 backdrop-blur-sm rounded-sm flex flex-col items-center justify-center space-y-4 px-5 py-8 drop-shadow-background/25">
                <span ref={textRef} className=" text-sm text-center">
                  Experience the profound benefits of our special Japanese head
                  massage, an ancient wellness practice designed to deeply relax
                  the mind and body This therapeutic treatment employs precise,
                  rhythmic techniques focused on the scalp, neck, and shoulders
                  to relieve tension, improve circulation, and stimulate energy
                  flow. Enhanced with warm, nourishing oils and calming
                  aromatherapy, the massage not only promotes healthier hair and
                  scalp but also eases mental fatigue and stress, leaving you
                  with a serene sense of balance and rejuvenation. Rooted in
                  centuries-old Japanese traditions, this luxurious ritual
                  offers a holistic escape that nurtures your physical
                  well-being.
                </span>

                <div ref={buttonRef}>
                  <Button variant={"default"}>Contact for more info</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecanderySection;
