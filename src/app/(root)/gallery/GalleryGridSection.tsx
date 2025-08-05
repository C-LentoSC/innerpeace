"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const galleryImages = [
  { src: "/assets/images/1.jpg", alt: "Spa accessories" },
  { src: "/assets/images/2.jpg", alt: "Massage therapy" },
  { src: "/assets/images/3.jpg", alt: "Wellness treatment" },
  { src: "/assets/images/4.jpg", alt: "Hot stone therapy" },
  { src: "/assets/images/1.png", alt: "Serene setup" },
  { src: "/assets/images/2.png", alt: "Relaxation" },
  { src: "/assets/images/3.png", alt: "Peaceful ambiance" },
  { src: "/assets/images/4.png", alt: "Zen garden" },
];

const GalleryGridSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Set initial states for center text
      gsap.set(centerTextRef.current, {
        scale: 0.8,
        opacity: 0
      });

      // Animate center text first
      gsap.to(centerTextRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate images with stagger effect
      imageRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.set(ref, {
            scale: 0.8,
            opacity: 0,
            rotationY: 15
          });

          gsap.to(ref, {
            scale: 1,
            opacity: 1,
            rotationY: 0,
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
    <section ref={sectionRef} className="py-20">
      <div className="my-container">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-auto md:h-[90vh] md:max-h-[1000px]">
          {/* Image 1: Top Left */}
          <div ref={(el) => (imageRefs.current[0] = el)} className="relative md:col-span-2 md:row-span-1 rounded-xl overflow-hidden h-64 md:h-auto group">
            <Image
              src={galleryImages[0].src}
              alt={galleryImages[0].alt}
              fill
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="font-medium text-lg">{galleryImages[0].alt}</h3>
            </div>
          </div>

          {/* Image 2: Top Right */}
          <div ref={(el) => (imageRefs.current[1] = el)} className="relative md:col-start-3 md:col-span-2 md:row-span-1 rounded-xl overflow-hidden h-64 md:h-auto group">
            <Image
              src={galleryImages[1].src}
              alt={galleryImages[1].alt}
              fill
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="font-medium text-lg">{galleryImages[1].alt}</h3>
            </div>
          </div>

          {/* Image 3: Middle Left (Tall) */}
          <div ref={(el) => (imageRefs.current[2] = el)} className="relative md:col-span-1 md:row-span-2 rounded-xl overflow-hidden h-96 md:h-auto group">
            <Image
              src={galleryImages[2].src}
              alt={galleryImages[2].alt}
              fill
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="font-medium text-lg">{galleryImages[2].alt}</h3>
            </div>
          </div>

          {/* Center Text */}
          <div ref={centerTextRef} className="md:col-start-2 md:col-span-2 md:row-start-2 flex flex-col items-center justify-center text-center p-8 rounded-xl bg-card/50 backdrop-blur-sm transition-colors duration-300">
            <h2 className="text-3xl md:text-4xl font-medium gradient-text1 leading-tight">
              Take a Sneak Peek
            </h2>
            <h3 className="text-2xl md:text-3xl font-medium text-foreground mt-2">
              to Our Journey
            </h3>
          </div>

          {/* Image 4: Middle Right (Tall) */}
          <div ref={(el) => (imageRefs.current[3] = el)} className="relative md:col-start-4 md:col-span-1 md:row-span-2 rounded-xl overflow-hidden h-96 md:h-auto group">
            <Image
              src={galleryImages[3].src}
              alt={galleryImages[3].alt}
              fill
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="font-medium text-lg">{galleryImages[3].alt}</h3>
            </div>
          </div>

          {/* Image 5: Bottom Left */}
          <div ref={(el) => (imageRefs.current[4] = el)} className="relative md:col-start-2 md:col-span-1 md:row-start-3 rounded-xl overflow-hidden h-64 md:h-auto group">
            <Image
              src={galleryImages[4].src}
              alt={galleryImages[4].alt}
              fill
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="font-medium text-lg">{galleryImages[4].alt}</h3>
            </div>
          </div>

          {/* Image 6: Bottom Right */}
          <div ref={(el) => (imageRefs.current[5] = el)} className="relative md:col-start-3 md:col-span-1 md:row-start-3 rounded-xl overflow-hidden h-64 md:h-auto group">
            <Image
              src={galleryImages[5].src}
              alt={galleryImages[5].alt}
              fill
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="font-medium text-lg">{galleryImages[5].alt}</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryGridSection;
