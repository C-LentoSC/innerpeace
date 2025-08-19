"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BookingModal from "@/components/BookingModal";

// Types and Interfaces
interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  imageAlt: string;
  category: ServiceCategoryType;
}

interface ServiceCategory {
  id: ServiceCategoryType;
  label: string;
  services: Service[];
}

type ServiceCategoryType = string;

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
  stagger: 0.2,
  scrollTrigger: {
    start: "top 80%",
    end: "bottom 20%",
    cardStart: "top 90%",
  },
} as const;

const UI_CONSTANTS = {
  maxWidth: {
    container: "max-w-6xl",
    content: "max-w-lg lg:max-w-xl xl:max-w-2xl",
    tabs: "max-w-4xl",
  },
  spacing: {
    section: "py-12 sm:py-16 md:py-20",
    container: "gap-8 sm:gap-12 md:gap-15",
    card: "gap-6 lg:gap-12",
    content: "space-y-8",
    actions: "gap-6",
  },
} as const;

// Props for external data injection
interface PackagesSectionProps {
  data: ServiceCategory[];
}

// Utility functions
const getTabClasses = (isActive: boolean): string => {
  const baseClasses = "flex-1 px-8 sm:px-12 py-2 rounded text-base font-normal font-['Playfair_Display'] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900";
  
  return isActive
    ? `${baseClasses} bg-gradient-to-b from-amber-200 to-amber-400 text-black`
    : `${baseClasses} bg-gradient-to-r from-zinc-800/40 to-zinc-600/40 text-amber-200 hover:from-zinc-700/50 hover:to-zinc-500/50`;
};

// ServiceCard Component - Matching Figma Structure
interface ServiceCardProps {
  service: Service;
  onBook: (serviceId: string) => void;
  onContact: (serviceId: string) => void;
}

const ServiceCard = ({ 
  service, 
  onBook,
  onContact
}: ServiceCardProps) => {
  const handleBookClick = useCallback(() => {
    onBook(service.id);
  }, [service.id, onBook]);

  const handleContactClick = useCallback(() => {
    onContact(service.id);
  }, [service.id, onContact]);

  return (
    <article 
      className="w-full max-w-[883px] h-auto lg:h-[505px] relative mx-auto overflow-hidden"
    >
      {/* Mobile Layout */}
      <div className="flex flex-col lg:hidden gap-6 p-4">
        {/* Image */}
        <div className="w-full max-w-sm mx-auto aspect-[352/505] rounded-[10px] overflow-hidden relative">
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
            priority
          />
          {/* Duration Badge */}
          <div className="absolute top-4 left-4 bg-zinc-950/30 rounded-md shadow-[0px_10px_40px_0px_rgba(0,0,0,0.25)] backdrop-blur-sm px-4 py-3">
            <div className="text-zinc-300 text-sm font-normal font-['Playfair_Display']">Duration</div>
            <div className="text-zinc-300 text-xl font-normal font-['Playfair_Display']">{service.duration}</div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h3 className="text-zinc-300 text-2xl sm:text-3xl font-normal font-['Playfair_Display']">
            {service.title}
          </h3>
          <p className="text-zinc-300 text-base font-normal font-['Playfair_Display'] leading-relaxed">
            {service.description}
          </p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-zinc-300 text-base font-normal font-['Playfair_Display']">Rs</span>
            <span className="text-zinc-300 text-2xl font-normal font-['Playfair_Display']">{service.price}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleBookClick}
              className="w-40 h-9 bg-gradient-to-b from-amber-200 to-amber-400 rounded-sm flex justify-center items-center
                         transition-all duration-300 hover:from-amber-100 hover:to-amber-300 hover:scale-105
                         focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
              aria-label={`Book ${service.title}`}
            >
              <span className="text-black text-base font-normal font-['Playfair_Display']">Book now</span>
            </button>
            <button 
              onClick={handleContactClick}
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

      {/* Desktop Layout - Exact Figma positioning */}
      <div className="hidden lg:block">
        {/* Image - exact Figma positioning */}
        <div className="w-80 h-[505px] left-0 top-0 absolute rounded-[10px] overflow-hidden">
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            sizes="320px"
            className="object-cover"
            priority
          />
        </div>

        {/* Duration Badge - exact Figma positioning */}
        <div className="w-56 h-20 left-[235px] top-[26px] absolute bg-zinc-950/30 rounded-md shadow-[0px_10px_40px_0px_rgba(0,0,0,0.25)] backdrop-blur-sm">
          <div className="left-[15px] top-[15px] absolute text-zinc-300 text-sm font-normal font-['Playfair_Display']">
            Duration
          </div>
          <div className="left-[15px] top-[31px] absolute text-zinc-300 text-2xl font-normal font-['Playfair_Display']">
            {service.duration}
          </div>
        </div>

        {/* Title - exact Figma positioning */}
        <div className="left-[417px] top-[142px] absolute text-zinc-300 text-4xl font-normal font-['Playfair_Display']">
          {service.title}
        </div>

        {/* Description - exact Figma positioning */}
        <div className="left-[417px] top-[211px] absolute text-zinc-300 text-base font-normal font-['Playfair_Display'] max-w-[400px]">
          {service.description}
        </div>

        {/* Price - exact Figma positioning */}
        <div className="left-[417px] top-[401px] absolute text-zinc-300 text-base font-normal font-['Playfair_Display']">
          Rs
        </div>
        <div className="left-[439px] top-[390px] absolute text-zinc-300 text-2xl font-normal font-['Playfair_Display']">
          {service.price}
        </div>

        {/* Book Now Button - exact Figma positioning */}
        <button 
          onClick={handleBookClick}
          className="w-40 h-9 left-[417px] top-[446px] absolute bg-gradient-to-b from-amber-200 to-amber-400 rounded-sm flex justify-center items-center
                     transition-all duration-300 hover:from-amber-100 hover:to-amber-300 hover:scale-105
                     focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
          aria-label={`Book ${service.title}`}
        >
          <span className="text-black text-base font-normal font-['Playfair_Display']">Book now</span>
        </button>

        {/* Contact Link - exact Figma positioning */}
        <button 
          onClick={handleContactClick}
          className="left-[683px] top-[455px] absolute text-amber-200 text-sm font-bold font-['Playfair_Display']
                     transition-colors duration-300 hover:text-amber-100
                     focus:outline-none focus:underline"
          aria-label={`Contact team about ${service.title}`}
        >
          Contact our team for more info
        </button>
      </div>
    </article>
  );
};

// Main PackagesSection Component
const PackagesSection = ({ data }: PackagesSectionProps) => {
  // State
  const [activeCategory, setActiveCategory] = useState<ServiceCategoryType>(
    () => (data[0]?.id ?? '')
  );
  const [showBooking, setShowBooking] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const { status } = useSession();
  const router = useRouter();
  
  // Ensure activeCategory stays valid when data updates
  useEffect(() => {
    if (!data || data.length === 0) {
      setActiveCategory('');
      return;
    }
    const exists = data.some((c) => c.id === activeCategory);
    if (!exists) setActiveCategory(data[0].id);
  }, [data, activeCategory]);
  
  // Refs
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Computed values
  const currentServices = useMemo(() => {
    const services = data.find(cat => cat.id === activeCategory)?.services || [];
    return services.slice(0, 3);
  }, [activeCategory, data]);

  // Event handlers
  const handleCategoryChange = useCallback((categoryId: ServiceCategoryType) => {
    setActiveCategory(categoryId);
  }, []);

  const handleServiceBook = useCallback((serviceId: string) => {
    if (status === "authenticated") {
      setSelectedPackageId(serviceId);
      setShowBooking(true);
    } else {
      const params = new URLSearchParams({ callbackUrl: window.location.href });
      router.push(`/signin?${params.toString()}`);
    }
  }, [router, status]);

  const handleServiceContact = useCallback((serviceId: string) => {
    console.log(`Contacting about service: ${serviceId}`);
    // Implement contact logic here
  }, []);


  // Animation setup
  const setupAnimations = useCallback(() => {
    if (!sectionRef.current || !titleRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const { duration, easing, scrollTrigger } = ANIMATION_CONFIG;

      // Set initial states
      gsap.set([titleRef.current, tabsRef.current], {
        y: 60,
        opacity: 0
      });

      gsap.set(containerRef.current, {
        y: 80,
        opacity: 0
      });

      // Create main timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: scrollTrigger.start,
          end: scrollTrigger.end,
          toggleActions: "play none none reverse"
        }
      });

      // Animate elements
      tl.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: duration.medium,
        ease: easing.smooth
      })
      .to(tabsRef.current, {
        y: 0,
        opacity: 1,
        duration: duration.fast,
        ease: easing.smooth
      }, "-=0.4")
      .to(containerRef.current, {
        y: 0,
        opacity: 1,
        duration: duration.medium,
        ease: easing.smooth
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
            duration: duration.medium,
            ease: easing.smooth,
            delay: index * ANIMATION_CONFIG.stagger,
            scrollTrigger: {
              trigger: ref,
              start: scrollTrigger.cardStart,
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

  // Ref callback
  const setServiceRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    serviceRefs.current[index] = el;
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={`w-full ${UI_CONSTANTS.spacing.section}`}
      aria-labelledby="packages-heading"
    >
      <div className="my-container">
        <div className={`w-full ${UI_CONSTANTS.maxWidth.container} mx-auto flex flex-col items-center ${UI_CONSTANTS.spacing.container}`}>
          
          {/* Section Title */}
          <header ref={titleRef} className="text-center">
            <h2 
              id="packages-heading"
              className="text-amber-200 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal font-['Playfair_Display']"
            >
              Our Exclusive Services We Provide
            </h2>
          </header>

          {/* Empty state */}
          {(!data || data.length === 0) && (
            <div className="w-full text-center text-zinc-400 py-8">
              No packages available yet.
            </div>
          )}

          {/* Category Tabs */}
          {data && data.length > 0 && (
          <nav 
            ref={tabsRef} 
            className={`flex flex-col sm:flex-row gap-4 sm:gap-5 w-full ${UI_CONSTANTS.maxWidth.tabs}`}
            role="tablist"
            aria-label="Service categories"
          >
            {data.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={getTabClasses(activeCategory === category.id)}
                role="tab"
                aria-selected={activeCategory === category.id}
                aria-controls={`${category.id}-panel`}
              >
                {category.label}
              </button>
            ))}
          </nav>
          )}

          {/* Services Container */}
          {data && data.length > 0 && (
          <div 
            ref={containerRef}
            className="w-full relative rounded-xl overflow-hidden"
            role="tabpanel"
            id={`${activeCategory}-panel`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
              <Image
                src="/assets/paper-texture.jpg"
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-10"
                role="presentation"
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
                    onBook={handleServiceBook}
                    onContact={handleServiceContact}
                  />
                </div>
              ))}
            </div>

            {/* See More Button */}
            <footer className="flex justify-center pb-8 lg:pb-12">
              <Link
                href={`/packages?category=${encodeURIComponent(activeCategory)}`}
                className="px-8 py-2 bg-gradient-to-b from-amber-200 to-amber-400 rounded text-black text-base font-normal font-['Playfair_Display']
                           transition-all duration-300 hover:from-amber-100 hover:to-amber-300 hover:scale-105
                           focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
                aria-label="View more service packages"
              >
                See More Packages
              </Link>
            </footer>
          </div>
          )}
        </div>
      </div>
      {/* Booking Modal */}
      {showBooking && selectedPackageId && (
        <BookingModal
          packageId={selectedPackageId}
          open={showBooking}
          onClose={() => setShowBooking(false)}
        />
      )}
    </section>
  );
};

export default PackagesSection;