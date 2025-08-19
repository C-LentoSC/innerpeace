"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const GallerySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const mobileGridRef = useRef<HTMLDivElement>(null);
  const desktopGridRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, subtitleRef.current], {
        y: 60,
        opacity: 0
      });

      gsap.set([mobileGridRef.current, desktopGridRef.current], {
        y: 80,
        opacity: 0
      });

      gsap.set(buttonRef.current, {
        y: 40,
        opacity: 0
      });

      // Create main timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate header elements
      tl.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      })
      .to(subtitleRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")
      // Animate grids
      .to([mobileGridRef.current, desktopGridRef.current], {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      }, "-=0.2")
      // Animate button
      .to(buttonRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.2)"
      }, "-=0.4");

      // Animate individual images with stagger for desktop
      imageRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.set(ref, {
            scale: 0.8,
            opacity: 0
          });

          gsap.to(ref, {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.2)",
            delay: index * 0.1,
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
      <div className="my-container py-20">
        <div className="flex flex-col">
          <div ref={titleRef} className="font-medium text-3xl md:text-4xl gradient-text1 text-center">
            Gallery
          </div>
          <div ref={subtitleRef} className="text-center mt-1 text-lg md:text-xl">
            See More of Our Work
          </div>

          {/* Image Layout */}
          <div className="mt-12">
            {/* Mobile Layout - Simple Stack */}
            <div ref={mobileGridRef} className="grid grid-cols-1 gap-4 md:hidden">
              <div className="relative overflow-hidden rounded-xl h-64">
                <Image
                  src="/assets/images/1.jpg"
                  alt="Spa accessories with towel and candles"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="relative overflow-hidden rounded-xl h-64">
                <Image
                  src="/assets/images/2.jpg"
                  alt="Professional massage therapy"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="relative overflow-hidden rounded-xl h-64">
                <Image
                  src="/assets/images/3.jpg"
                  alt="Wellness treatment session"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="relative overflow-hidden rounded-xl h-64">
                <Image
                  src="/assets/images/4.jpg"
                  alt="Hot stone therapy treatment"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            </div>

            {/* Desktop Layout - Custom Grid */}
            <div ref={desktopGridRef} className="hidden md:flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                {/* Left Image */}
                <div className="relative w-1/2 h-[500px] overflow-hidden rounded-xl">
                  <Image
                    src="/assets/images/1.jpg"
                    alt="Spa accessories with towel and candles"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
                {/* Right Images */}
                <div className="w-1/2 flex flex-col gap-4">
                  <div className="relative h-1/2 overflow-hidden rounded-xl">
                    <Image
                      src="/assets/images/2.jpg"
                      alt="Professional massage therapy"
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                  <div className="relative h-1/2 overflow-hidden rounded-xl">
                    <Image
                      src="/assets/images/3.jpg"
                      alt="Wellness treatment session"
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                </div>
              </div>
              {/* Bottom Image */}
              <div className="relative h-[320px] overflow-hidden rounded-xl">
                <Image
                  src="/assets/images/4.jpg"
                  alt="Hot stone therapy treatment"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            </div>

            {/* View More Button */}
            <div ref={buttonRef} className="flex justify-center mt-12">
              <Link href="/gallery">
                <Button
                  variant="default"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  View More Gallery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
