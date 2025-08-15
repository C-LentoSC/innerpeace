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
      className="group w-full max-w-lg mx-auto pt-4 sm:pt-6 md:pt-7 bg-zinc-950/30 rounded-3xl sm:rounded-[60px] md:rounded-[99px] 
                 flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-7 
                 transition-all duration-500 ease-out 
                 hover:scale-[1.02] md:hover:scale-105 hover:bg-zinc-950/50 
                 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer
                 border border-amber-200/20"
      data-card-index={index}
    >
      {/* Card Title */}
      <header className="w-full max-w-[320px] sm:max-w-[380px] md:max-w-[454px] px-4 sm:px-6">
        <h3 className="text-center text-amber-200 text-xl sm:text-2xl md:text-3xl lg:text-4xl 
                       font-normal font-['Playfair_Display'] leading-tight">
          {card.title}
        </h3>
      </header>

      {/* Image Container */}
      <div className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[566px] 
                      aspect-[566/854] relative rounded-3xl sm:rounded-[60px] md:rounded-[99px] overflow-hidden">
        <Image
          src={card.image}
          alt={card.alt}
          fill
          sizes="(max-width: 640px) 280px, (max-width: 768px) 400px, (max-width: 1024px) 500px, 566px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          priority
        />
        
        {/* Overlay Content - Positioned bottom-right */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 right-4 sm:right-6 md:right-8 lg:right-10">
          <div className="w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px] 
                          px-5 sm:px-6 md:px-7 lg:px-8 py-4 sm:py-5 md:py-6 
                          bg-zinc-950/40 rounded-[32px] sm:rounded-[40px] md:rounded-[49.50px] 
                          shadow-[0px_10px_40px_0px_rgba(0,0,0,0.25)] backdrop-blur-[2.80px] 
                          flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5
                          transition-all duration-500 ease-out 
                          hover:bg-zinc-950/60 hover:shadow-[0px_15px_50px_0px_rgba(0,0,0,0.35)] 
                          hover:shadow-amber-500/30">
            
            {/* Description */}
            <div className="text-center text-zinc-300 text-xs sm:text-sm font-medium 
                            font-['Playfair_Display'] leading-relaxed line-clamp-none">
              {card.description}
            </div>
            
            {/* CTA Button */}
            <button 
              className="w-[200px] sm:w-[220px] md:w-[224px] h-7 sm:h-8 
                         bg-gradient-to-b from-amber-200 to-amber-400 rounded-[24px] sm:rounded-[28px] md:rounded-[32px] 
                         flex items-center justify-center 
                         text-zinc-950 text-sm sm:text-base font-normal font-['Playfair_Display']
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
                        gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16">
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
