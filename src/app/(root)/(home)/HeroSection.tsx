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
    <section ref={heroRef} className="min-h-screen flex items-center justify-center pt-16 lg:pt-20 pb-8 relative overflow-hidden">
      {/* Enhanced background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large floating particles */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-amber-200/25 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-amber-300/30 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-1/3 left-1/5 w-2.5 h-2.5 bg-amber-200/20 rounded-full animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-amber-400/30 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
        
        {/* Medium particles */}
        <div className="absolute top-1/6 left-1/2 w-1.5 h-1.5 bg-amber-100/20 rounded-full animate-pulse" style={{animationDelay: '1.5s'}} />
        <div className="absolute top-2/3 right-1/6 w-1.5 h-1.5 bg-amber-300/25 rounded-full animate-pulse" style={{animationDelay: '3s'}} />
        <div className="absolute bottom-1/6 left-1/3 w-1.5 h-1.5 bg-amber-200/30 rounded-full animate-pulse" style={{animationDelay: '2.5s'}} />
        <div className="absolute top-1/2 right-1/5 w-1.5 h-1.5 bg-amber-400/20 rounded-full animate-pulse" style={{animationDelay: '4s'}} />
        
        {/* Small particles */}
        <div className="absolute top-1/5 left-3/4 w-1 h-1 bg-amber-200/15 rounded-full animate-pulse" style={{animationDelay: '0.8s'}} />
        <div className="absolute top-3/4 left-1/6 w-1 h-1 bg-amber-300/20 rounded-full animate-pulse" style={{animationDelay: '1.2s'}} />
        <div className="absolute bottom-1/5 right-2/3 w-1 h-1 bg-amber-100/25 rounded-full animate-pulse" style={{animationDelay: '3.5s'}} />
        <div className="absolute top-1/8 right-1/2 w-1 h-1 bg-amber-400/15 rounded-full animate-pulse" style={{animationDelay: '2.8s'}} />
        <div className="absolute bottom-1/8 left-2/3 w-1 h-1 bg-amber-200/20 rounded-full animate-pulse" style={{animationDelay: '4.2s'}} />
        
        {/* Micro particles */}
        <div className="absolute top-1/7 left-1/8 w-0.5 h-0.5 bg-amber-300/30 rounded-full animate-pulse" style={{animationDelay: '0.3s'}} />
        <div className="absolute top-5/6 right-1/8 w-0.5 h-0.5 bg-amber-200/25 rounded-full animate-pulse" style={{animationDelay: '1.8s'}} />
        <div className="absolute bottom-1/7 right-3/4 w-0.5 h-0.5 bg-amber-400/20 rounded-full animate-pulse" style={{animationDelay: '3.2s'}} />
        <div className="absolute top-2/5 left-1/12 w-0.5 h-0.5 bg-amber-100/30 rounded-full animate-pulse" style={{animationDelay: '2.2s'}} />
        <div className="absolute bottom-2/5 right-1/12 w-0.5 h-0.5 bg-amber-300/15 rounded-full animate-pulse" style={{animationDelay: '4.5s'}} />
        
        {/* Floating gradient orbs */}
        <div className="absolute top-1/3 left-1/6 w-8 h-8 bg-gradient-to-br from-amber-200/10 to-amber-400/5 rounded-full blur-sm animate-pulse" style={{animationDelay: '1.5s'}} />
        <div className="absolute bottom-1/3 right-1/8 w-6 h-6 bg-gradient-to-br from-amber-300/8 to-amber-100/12 rounded-full blur-sm animate-pulse" style={{animationDelay: '3.8s'}} />
        <div className="absolute top-1/2 left-3/4 w-4 h-4 bg-gradient-to-br from-amber-400/6 to-amber-200/10 rounded-full blur-sm animate-pulse" style={{animationDelay: '0.7s'}} />
        
        {/* Subtle light rays */}
        <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-amber-200/20 to-transparent opacity-50" />
        <div className="absolute top-0 right-1/3 w-px h-24 bg-gradient-to-b from-amber-300/15 to-transparent opacity-40" />
        <div className="absolute bottom-0 left-1/2 w-px h-28 bg-gradient-to-t from-amber-400/10 to-transparent opacity-30" />
      </div>

      <div className="my-container w-full relative z-10">
        <div className="flex flex-col justify-center items-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* First Title Line */}
          <div className="w-full text-center mb-8 sm:mb-10 lg:mb-12">
            <div ref={titleRef1} className="font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl gradient-text1 leading-tight tracking-tight font-playfair-display drop-shadow-sm">
              Where Tranquility
            </div>
          </div>

          {/* Image and Second Title */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-10 lg:gap-16 mb-10 sm:mb-12 lg:mb-16 w-full">
            <div ref={imageRef} className="relative group">
              <div className="w-52 sm:w-60 md:w-72 lg:w-80 h-20 sm:h-24 md:h-28 lg:h-32 overflow-hidden rounded-3xl sm:rounded-[2rem] lg:rounded-[2.5rem] flex items-center justify-center flex-shrink-0 shadow-2xl shadow-amber-500/20 ring-1 ring-amber-200/20 transition-all duration-500 group-hover:shadow-3xl group-hover:shadow-amber-500/30 group-hover:ring-amber-200/30 group-hover:scale-105">
                <Image
                  src="/assets/images/1.jpg"
                  alt="Tranquility"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-200/10 via-transparent to-amber-200/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
            <div className="text-center lg:text-left">
              <div ref={titleRef2} className="font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl gradient-text1 leading-tight tracking-tight font-playfair-display drop-shadow-sm">
                Meets Elegance
              </div>
            </div>
          </div>

          {/* Description */}
          <div ref={descriptionRef} className="font-normal text-base sm:text-lg lg:text-xl text-center max-w-4xl mx-auto leading-relaxed text-zinc-300/90 mb-14 sm:mb-18 lg:mb-24 px-4 font-playfair-display">
            <span className="block mb-2">Step into a sanctuary where tranquility meets elegance.</span>
            <span className="text-amber-200/80">At Inner Peace Spa, we combine ancient rituals with modern techniques to deliver a truly luxurious and transformative experience.</span>
            <span className="block mt-2 text-zinc-400/80 text-sm sm:text-base lg:text-lg italic">Let us help you unwind, restore, and glow - because you deserve nothing less</span>
          </div>

          {/* CTA Button */}
          <div ref={buttonRef} className="flex items-center justify-center w-full">
            <div className="relative group">
              {/* Button glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-200 to-amber-400 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300" />
              <Button 
                variant="default" 
                className="relative text-sm sm:text-base lg:text-lg px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 font-medium font-playfair-display bg-gradient-to-r from-amber-200 to-amber-400 hover:from-amber-100 hover:to-amber-300 text-zinc-900 rounded-full shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40 transform hover:scale-105 transition-all duration-300 border-0"
              >
                Book Your Appointment Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
