"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Types
interface Review {
  id: number;
  text: string;
  author: string;
  location: string;
  avatar: string;
}

// Constants
const ANIMATION_CONFIG = {
  duration: {
    fast: 0.6,
    medium: 0.8,
    slow: 1.0,
  },
  easing: {
    smooth: "power2.out",
    bounce: "back.out(1.2)",
  },
  slideInterval: 4000,
  transitionDelay: 500,
} as const;

// Reviews data
const REVIEWS_DATA: Review[] = [
  {
    id: 1,
    text: "The Japanese head massage here was nothing short of magical. From the moment I stepped in, I was enveloped in calm — soft music, warm lighting, and the scent of essential oils set the mood. The therapist's technique was so gentle yet deeply effective; I could feel the tension in my scalp and shoulders just dissolve. I left feeling lighter, more balanced, and truly at peace. It's more than a treatment — it's a journey.",
    author: "Julian David",
    location: "From Colombo, Srilanka",
    avatar: "/assets/images/user.jpg",
  },
  {
    id: 2,
    text: "An absolutely transformative experience! The aromatherapy session combined with the deep tissue massage was exactly what my body needed. The attention to detail and the serene environment made me feel like I was in a different world. The staff was incredibly professional and caring. I've never felt so relaxed and rejuvenated. This place truly understands the art of wellness.",
    author: "Sarah Chen",
    location: "From Singapore",
    avatar: "/assets/images/user2.jpg",
  },
  {
    id: 3,
    text: "Inner Peace Spa exceeded all my expectations. The hot stone therapy was incredible - I could feel years of stress melting away with each carefully placed stone. The therapist was skilled and intuitive, knowing exactly where I needed the most attention. The ambiance is perfect - not too quiet, not too busy, just right. I'm already planning my next visit!",
    author: "Michael Rodriguez",
    location: "From Barcelona, Spain",
    avatar: "/assets/images/user3.jpg",
  },
  {
    id: 4,
    text: "What a hidden gem! The couple's massage package was the perfect way to celebrate our anniversary. Both therapists were synchronized and professional, creating a romantic yet therapeutic atmosphere. The attention to detail, from the rose petals to the custom essential oil blends, made this experience unforgettable. Highly recommend for special occasions!",
    author: "Emma & James Wilson",
    location: "From London, UK",
    avatar: "/assets/images/user4.jpg",
  },
];

const ReviewsSections = () => {
  // Refs
  const sectionRef = useRef<HTMLElement>(null);
  const titlePart1Ref = useRef<HTMLDivElement>(null);
  const titlePart2Ref = useRef<HTMLDivElement>(null);
  const titlePart3Ref = useRef<HTMLDivElement>(null);
  const headerImageRef = useRef<HTMLDivElement>(null);
  const reviewCardRef = useRef<HTMLDivElement>(null);

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Current review data
  const currentReview = REVIEWS_DATA[currentIndex];

  // GSAP scroll animations
  const setupAnimations = useCallback(() => {
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const { duration, easing } = ANIMATION_CONFIG;

      // Set initial states
      gsap.set(titlePart1Ref.current, {
        y: 60,
        opacity: 0
      });

      gsap.set([titlePart2Ref.current, headerImageRef.current, titlePart3Ref.current], {
        y: 80,
        opacity: 0
      });

      gsap.set(reviewCardRef.current, {
        y: 100,
        scale: 0.9,
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

      // Animate header elements
      tl.to(titlePart1Ref.current, {
        y: 0,
        opacity: 1,
        duration: duration.medium,
        ease: easing.smooth
      })
      .to(titlePart2Ref.current, {
        y: 0,
        opacity: 1,
        duration: duration.medium,
        ease: easing.smooth
      }, "-=0.4")
      .to(headerImageRef.current, {
        y: 0,
        opacity: 1,
        duration: duration.fast,
        ease: easing.bounce
      }, "-=0.6")
      .to(titlePart3Ref.current, {
        y: 0,
        opacity: 1,
        duration: duration.medium,
        ease: easing.smooth
      }, "-=0.4")
      .to(reviewCardRef.current, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: duration.slow,
        ease: easing.bounce
      }, "-=0.2");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const cleanup = setupAnimations();
    return cleanup;
  }, [setupAnimations]);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentIndex((prevIndex) =>
            prevIndex === REVIEWS_DATA.length - 1 ? 0 : prevIndex + 1
          );
          setIsAnimating(false);
        }, ANIMATION_CONFIG.transitionDelay);
      }
    }, ANIMATION_CONFIG.slideInterval);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Manual navigation
  const goToSlide = useCallback((index: number) => {
    if (!isAnimating && index !== currentIndex) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsAnimating(false);
      }, 300);
    }
  }, [isAnimating, currentIndex]);

  return (
    <section ref={sectionRef} className="w-full py-12 sm:py-16 md:py-20">
      <div className="my-container">
        <div className="flex flex-col items-center max-w-6xl mx-auto">
          
          {/* Header Section - Keep as requested */}
          <header className="flex flex-col items-center justify-center mb-12 sm:mb-16 md:mb-20">
            <div ref={titlePart1Ref} className="mb-4 text-2xl sm:text-3xl md:text-4xl text-center text-zinc-300 font-normal font-['Playfair_Display']">
              What Our
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <div ref={titlePart2Ref} className="font-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-amber-200 text-center font-['Playfair_Display']">
                Clients
              </div>
              <div ref={headerImageRef} className="w-32 sm:w-40 md:w-48 lg:w-64 h-16 sm:h-20 md:h-24 overflow-hidden rounded-2xl sm:rounded-3xl flex items-center justify-center flex-shrink-0">
                <Image
                  src="/assets/images/1.jpg"
                  alt="Client testimonial"
                  width={256}
                  height={96}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div ref={titlePart3Ref} className="font-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-amber-200 text-center font-['Playfair_Display']">
                Says
              </div>
            </div>
          </header>

          {/* Review Card Section - Matching the UI image */}
          <div className="w-full max-w-5xl">
            <div 
              ref={reviewCardRef} 
              className="relative bg-zinc-900/60 backdrop-blur-sm border border-amber-200/20 rounded-2xl p-8 sm:p-10 md:p-12 lg:p-16 overflow-hidden"
            >
              {/* Large Quote Icon */}
              <div className="flex justify-center mb-8 sm:mb-10 md:mb-12">
                <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-amber-200/30 font-serif leading-none select-none">
                  &ldquo;
                </div>
              </div>

              {/* Review Content */}
              <div
                className={`transition-all duration-500 ease-in-out ${
                  isAnimating
                    ? "opacity-0 transform translate-y-4"
                    : "opacity-100 transform translate-y-0"
                }`}
              >
                {/* Review Text */}
                <div className="text-center mb-10 sm:mb-12 md:mb-16">
                  <p className="text-zinc-300 text-base sm:text-lg md:text-xl lg:text-2xl font-normal font-['Playfair_Display'] leading-relaxed tracking-wide max-w-4xl mx-auto">
                    {currentReview.text}
                  </p>
                </div>

                {/* Customer Profile */}
                <div className="flex items-center justify-center gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-amber-200/40 flex-shrink-0">
                    <Image
                      src={currentReview.avatar}
                      alt={`${currentReview.author} profile picture`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-zinc-300 font-normal text-lg sm:text-xl md:text-2xl font-['Playfair_Display'] mb-1">
                      {currentReview.author}
                    </div>
                    <div className="text-zinc-400 text-sm sm:text-base font-normal font-['Playfair_Display']">
                      {currentReview.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider Navigation Dots */}
              <div className="flex justify-center mt-8 sm:mt-10 md:mt-12 gap-2 sm:gap-3">
                {REVIEWS_DATA.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                      index === currentIndex
                        ? "bg-amber-200 w-6 sm:w-8"
                        : "bg-amber-200/30 w-2 hover:bg-amber-200/50"
                    }`}
                    aria-label={`Go to review ${index + 1} by ${REVIEWS_DATA[index].author}`}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-4 sm:mt-6">
                <div className="w-full h-0.5 bg-amber-200/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-200 to-amber-400 rounded-full transition-all ease-linear"
                    style={{
                      width: isAnimating ? "0%" : "100%",
                      transitionDuration: isAnimating ? "0.3s" : "4s",
                      transitionTimingFunction: isAnimating ? "ease-out" : "linear",
                    }}
                  />
                </div>
              </div>

              {/* Decorative Background Elements */}
              <div className="absolute top-6 left-6 w-2 h-2 bg-amber-200/30 rounded-full"></div>
              <div className="absolute top-8 right-8 w-1 h-1 bg-amber-200/40 rounded-full"></div>
              <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-amber-200/25 rounded-full"></div>
              <div className="absolute bottom-6 right-6 w-1 h-1 bg-amber-200/35 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSections;
