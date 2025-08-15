"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Service data interfaces
interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  imageAlt: string;
  category: 'head-spa' | 'beauty';
}

interface ServiceCategory {
  id: 'head-spa' | 'beauty';
  label: string;
  services: Service[];
}

// Mock service data - replace with actual data
const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'head-spa',
    label: 'Head SPA',
    services: [
      {
        id: 'inner-peace-ritual-1',
        title: 'The Inner Peace Ritual',
        description: 'deep head spa therapy, hot oil scalp massage, and aromatherapy for ultimate tranquility.',
        price: '5,000',
        duration: '1 Hour 20 Minutes',
        image: '/assets/images/1.jpg',
        imageAlt: 'The Inner Peace Ritual',
        category: 'head-spa'
      },
      {
        id: 'inner-peace-ritual-2',
        title: 'The Inner Peace Ritual',
        description: 'deep head spa therapy, hot oil scalp massage, and aromatherapy for ultimate tranquility.',
        price: '5,000',
        duration: '1 Hour 20 Minutes',
        image: '/assets/images/2.jpg',
        imageAlt: 'The Inner Peace Ritual',
        category: 'head-spa'
      },
      {
        id: 'inner-peace-ritual-3',
        title: 'The Inner Peace Ritual',
        description: 'deep head spa therapy, hot oil scalp massage, and aromatherapy for ultimate tranquility.',
        price: '5,000',
        duration: '1 Hour 20 Minutes',
        image: '/assets/images/3.jpg',
        imageAlt: 'The Inner Peace Ritual',
        category: 'head-spa'
      }
    ]
  },
  {
    id: 'beauty',
    label: 'Beauty',
    services: [
      {
        id: 'nails-treatment',
        title: 'Nails',
        description: 'deep head spa therapy, hot oil scalp massage, and aromatherapy for ultimate tranquility.',
        price: '3,000',
        duration: '45 Minutes',
        image: '/assets/images/4.jpg',
        imageAlt: 'Nails Treatment',
        category: 'beauty'
      },
      {
        id: 'eye-lashes',
        title: 'Eye Lashes',
        description: 'deep head spa therapy, hot oil scalp massage, and aromatherapy for ultimate tranquility.',
        price: '2,500',
        duration: '30 Minutes',
        image: '/assets/images/5.png',
        imageAlt: 'Eye Lashes Treatment',
        category: 'beauty'
      }
    ]
  }
];

// Individual service card component
const ServiceCard = ({ 
  service, 
  alignment, 
  cardRef 
}: { 
  service: Service; 
  alignment: 'left' | 'right';
  cardRef: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div 
      ref={cardRef}
      className={`w-full max-w-6xl mx-auto flex ${
        alignment === 'left' 
          ? 'flex-col lg:flex-row' 
          : 'flex-col lg:flex-row-reverse'
      } gap-6 lg:gap-12 items-start`}
    >
      {/* Image Container */}
      <div className="relative w-full max-w-sm lg:w-80 xl:w-96 aspect-[352/505] rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 400px, 384px"
          className="object-cover"
          priority
        />
        
        {/* Duration Badge */}
        <div className="absolute top-6 left-6 bg-black/28 backdrop-blur-sm rounded-lg px-6 py-4 shadow-xl">
          <p className="text-zinc-300 text-sm font-normal font-['Playfair_Display'] mb-1">
            Duration
          </p>
          <p className="text-zinc-300 text-xl font-normal font-['Playfair_Display']">
            {service.duration}
          </p>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 space-y-8 text-left max-w-lg lg:max-w-xl xl:max-w-2xl lg:pt-16">
        {/* Title */}
        <h3 className="text-zinc-300 text-3xl lg:text-4xl xl:text-5xl font-normal font-['Playfair_Display'] leading-tight">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-zinc-300 text-base lg:text-lg font-normal font-['Playfair_Display'] leading-relaxed max-w-lg">
          {service.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-zinc-300 text-base font-normal font-['Playfair_Display']">
            Rs
          </span>
          <span className="text-zinc-300 text-3xl lg:text-4xl font-normal font-['Playfair_Display']">
            {service.price}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <button 
            className="px-12 py-2.5 bg-gradient-to-b from-amber-200 to-amber-400 rounded text-black text-base font-normal font-['Playfair_Display'] 
                       transition-all duration-300 hover:from-amber-100 hover:to-amber-300 hover:scale-105
                       focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900
                       shadow-lg"
            aria-label={`Book ${service.title}`}
          >
            Book now
          </button>
          
          <button 
            className="text-amber-200 text-sm font-bold font-['Playfair_Display'] 
                       transition-colors duration-300 hover:text-amber-100
                       focus:outline-none focus:underline"
            aria-label={`Contact team about ${service.title}`}
          >
            Contact our team for more info
          </button>
        </div>
      </div>
    </div>
  );
};

const PackagesSection = () => {
  const [activeCategory, setActiveCategory] = useState<'head-spa' | 'beauty'>('head-spa');
  
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Get current services based on active category
  const currentServices = SERVICE_CATEGORIES.find(cat => cat.id === activeCategory)?.services || [];

  // Animation setup function
  const setupAnimations = useCallback(() => {
    if (!sectionRef.current || !titleRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, tabsRef.current], {
        y: 60,
        opacity: 0
      });

      gsap.set(containerRef.current, {
        y: 80,
        opacity: 0
      });

      // Create timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate title and tabs
      tl.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      })
      .to(tabsRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")
      .to(containerRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.2");

      // Animate service cards
      serviceRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.set(ref, {
            y: 100,
            opacity: 0
          });

          gsap.to(ref, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            delay: index * 0.2,
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

  useEffect(() => {
    const cleanup = setupAnimations();
    return cleanup;
  }, [setupAnimations, activeCategory]);

  // Set refs for service cards
  const setServiceRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    serviceRefs.current[index] = el;
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="w-full py-12 sm:py-16 md:py-20"
      aria-labelledby="packages-heading"
    >
      <div className="my-container">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8 sm:gap-12 md:gap-15">
          
          {/* Section Title */}
          <header ref={titleRef} className="text-center">
            <h2 
              id="packages-heading"
              className="text-amber-200 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal font-['Playfair_Display']"
            >
              Our Exclusive Services We Provide
            </h2>
          </header>

          {/* Category Tabs */}
          <div ref={tabsRef} className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full max-w-4xl">
            {SERVICE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-1 px-8 sm:px-12 py-2 rounded text-base font-normal font-['Playfair_Display'] 
                           transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900
                           ${activeCategory === category.id
                             ? 'bg-gradient-to-b from-amber-200 to-amber-400 text-black'
                             : 'bg-gradient-to-r from-zinc-800/40 to-zinc-600/40 text-amber-200 hover:from-zinc-700/50 hover:to-zinc-500/50'
                           }`}
                aria-pressed={activeCategory === category.id}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Services Container */}
          <div 
            ref={containerRef}
            className="w-full relative rounded-xl overflow-hidden"
          >
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
              <Image
                src="/assets/paper-texture.jpg"
                alt="Background texture"
                fill
                sizes="100vw"
                className="object-cover opacity-10"
              />
            </div>

            {/* Services Grid */}
            <div className="relative p-6 sm:p-8 md:p-12 lg:p-20 space-y-16 lg:space-y-24">
              {currentServices.map((service, index) => (
                <div
                  key={`${activeCategory}-${service.id}`}
                  ref={setServiceRef(index)}
                >
                  <ServiceCard
                    service={service}
                    alignment={index % 2 === 0 ? 'left' : 'right'}
                    cardRef={{ current: null }}
                  />
                </div>
              ))}
            </div>

            {/* See More Button */}
            <div className="flex justify-center pb-8 lg:pb-12">
              <button 
                className="px-8 py-2 bg-gradient-to-b from-amber-200 to-amber-400 rounded text-black text-base font-normal font-['Playfair_Display']
                           transition-all duration-300 hover:from-amber-100 hover:to-amber-300 hover:scale-105
                           focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
                See More Packages
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
