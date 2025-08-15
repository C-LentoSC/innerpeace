"use client";

import Image from "next/image";
import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Service card data type
interface ServiceCard {
  id: string;
  title: string;
  image: string;
  alt: string;
  description: string;
}

// Service cards data
const serviceCards: ServiceCard[] = [
  {
    id: "japanese-head-massage",
    title: "Japanese Head Massage for Ultra Relaxation",
    image: "/assets/images/2.jpg",
    alt: "Japanese Head Massage for Ultra Relaxation",
    description: "Experience the profound benefits of our special Japanese head massage, an ancient wellness practice designed to deeply relax the mind and body. This therapeutic treatment employs precise, rhythmic techniques focused on the scalp, neck, and shoulders to relieve tension, improve circulation, and stimulate energy flow. Enhanced with warm, nourishing oils and calming aromatherapy, the massage not only promotes healthier hair and scalp but also eases mental fatigue and stress, leaving you with a serene sense of balance and rejuvenation. Rooted in centuries-old Japanese traditions, this luxurious ritual offers a holistic escape that nurtures your physical well-being."
  },
  {
    id: "luxury-spa-facial",
    title: "Luxury Spa Facial for Timeless Beauty",
    image: "/assets/images/3.jpg",
    alt: "Luxury Spa Facial for Timeless Beauty",
    description: "Experience the profound benefits of our Signature Glow Facial, a luxurious ritual designed to rejuvenate the skin and calm the senses. This treatment combines precise, rhythmic techniques with nutrient-rich botanicals to cleanse, hydrate, and restore balance. Gentle exfoliation smooths skin texture, while a soothing facial massage boosts circulation, promotes lymphatic flow, and enhances natural radiance. Enhanced with warm masks and calming aromatherapy, it revitalizes tired skin, eases tension, and reduces stress. Rooted in holistic skincare principles, this indulgent experience nurtures both beauty and overall well-being, leaving you refreshed and glowing."
  }
];

// Individual service card component
const ServiceCard = ({ card, index }: { card: ServiceCard; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <article 
      ref={cardRef}
      className="group w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto pt-3 sm:pt-4 md:pt-6 lg:pt-7 bg-zinc-950/30 rounded-2xl sm:rounded-3xl md:rounded-[60px] lg:rounded-[99px] 
                 flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-7 
                 transition-all duration-500 ease-out 
                 hover:scale-[1.02] md:hover:scale-105 hover:bg-zinc-950/50 
                 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer
                 border border-amber-200/20"
      data-card-index={index}
    >
      {/* Card Title */}
      <header className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[454px] px-3 sm:px-4 md:px-6">
        <h3 className="text-center text-amber-200 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 
                       font-normal font-playfair-display leading-tight">
          {card.title}
        </h3>
      </header>

      {/* Image Container */}
      <div className="w-full max-w-[240px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[500px] xl:max-w-[566px] 
                      aspect-[566/854] relative rounded-2xl sm:rounded-3xl md:rounded-[60px] lg:rounded-[99px] overflow-hidden">
        <Image
          src={card.image}
          alt={card.alt}
          fill
          sizes="(max-width: 640px) 240px, (max-width: 768px) 320px, (max-width: 1024px) 400px, (max-width: 1280px) 500px, 566px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          priority
        />
        
        {/* Overlay Content - Positioned bottom-right */}
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 lg:bottom-6 xl:bottom-8 right-2 sm:right-3 md:right-4 lg:right-6 xl:right-8">
          <div className="w-[200px] xs:w-[220px] sm:w-[260px] md:w-[280px] lg:w-[320px] xl:w-[340px] 
                          px-3 xs:px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 py-3 xs:py-4 sm:py-4 md:py-5 lg:py-6 
                          bg-zinc-950/40 rounded-[20px] xs:rounded-[24px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[49.50px] 
                          shadow-[0px_10px_40px_0px_rgba(0,0,0,0.25)] backdrop-blur-[2.80px] 
                          flex flex-col justify-center items-center gap-2 xs:gap-3 sm:gap-4 md:gap-5
                          transition-all duration-500 ease-out 
                          hover:bg-zinc-950/60 hover:shadow-[0px_15px_50px_0px_rgba(0,0,0,0.35)] 
                          hover:shadow-amber-500/30">
            
            {/* Description */}
            <div className="text-center text-zinc-300 text-[10px] xs:text-xs sm:text-sm font-medium 
                            font-playfair-display leading-relaxed line-clamp-4 sm:line-clamp-none">
              {card.description}
            </div>
            
            {/* CTA Button */}
            <button 
              className="w-[160px] xs:w-[180px] sm:w-[200px] md:w-[220px] lg:w-[224px] h-6 xs:h-7 sm:h-8 
                         bg-gradient-to-b from-amber-200 to-amber-400 rounded-[20px] xs:rounded-[24px] sm:rounded-[28px] md:rounded-[32px] 
                         flex items-center justify-center 
                         text-zinc-950 text-xs xs:text-sm sm:text-base font-normal font-playfair-display
                         transition-all duration-300 ease-out
                         hover:from-amber-100 hover:to-amber-300 hover:scale-105
                         focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
              aria-label={`Contact for more information about ${card.title}`}
            >
              Contact for more info
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

const SecondarySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  // Animation setup function
  const setupAnimations = useCallback(() => {
    if (!sectionRef.current || !titleRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(titleRef.current, {
        y: 60,
        opacity: 0
      });

      // Find all cards by data attribute
      const cardElements = sectionRef.current?.querySelectorAll('[data-card-index]');
      cardElements?.forEach((cardElement) => {
        gsap.set(cardElement, {
          y: 80,
          opacity: 0
        });
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
      });

      // Animate cards with stagger
      cardElements?.forEach((cardElement, index) => {
        tl.to(cardElement, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.2)"
        }, `-=${0.6 - index * 0.2}`);
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const cleanup = setupAnimations();
    return cleanup;
  }, [setupAnimations]);

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-transparent"
      aria-labelledby="special-services-heading"
    >
      <div className="my-container py-12 sm:py-16 md:py-20">
        {/* Section Header */}
        <header 
          ref={titleRef} 
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 
            id="special-services-heading"
            className="font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
                       gradient-text1 leading-tight"
          >
            Our Special Services
          </h2>
        </header>

        {/* Services Grid */}
        <div className="flex flex-col lg:flex-row justify-center items-center 
                        gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-14 2xl:gap-16">
          {serviceCards.map((card, index) => (
            <ServiceCard
              key={card.id}
              card={card}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecondarySection;
