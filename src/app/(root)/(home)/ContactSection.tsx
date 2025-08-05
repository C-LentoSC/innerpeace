"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { CONTACT_DETAILS } from "@/constants/data";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(titleRef.current, {
        y: 60,
        opacity: 0
      });

      // Animate title
      gsap.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate contact cards with stagger
      cardRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.set(ref, {
            y: 80,
            opacity: 0
          });

          gsap.to(ref, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.2)",
            delay: index * 0.2,
            scrollTrigger: {
              trigger: ref,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          });
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      <div className="my-container py-20">
        <div className="flex flex-col">
          {/* Content */}
          <div className="relative z-10">
            {/* Title */}
            <div className="text-center mb-16">
              <h2 ref={titleRef} className="text-3xl md:text-4xl lg:text-5xl font-medium gradient-text1 mb-4">
                Get in Touch With Us
              </h2>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
              {/* Email Card */}
              <div ref={(el) => (cardRefs.current[0] = el)} className="flex flex-col items-center text-center space-y-6">
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-gradient-to-br from-warm-gold to-soft-yellow rounded-full flex items-center justify-center shadow-lg">
                  <Mail className="w-8 h-8 text-background" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-medium text-foreground">
                    Email
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our Friendly Team is Here to Help
                  </p>
                  <p className="text-warm-gold font-medium text-lg">
                    {CONTACT_DETAILS.email}
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div ref={(el) => (cardRefs.current[1] = el)} className="flex flex-col items-center text-center space-y-6">
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-gradient-to-br from-warm-gold to-soft-yellow rounded-full flex items-center justify-center shadow-lg">
                  <Phone className="w-8 h-8 text-background" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-medium text-foreground">
                    Phone
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Open from 8AM - 10PM
                  </p>
                  <p className="text-warm-gold font-medium text-lg">
                    {CONTACT_DETAILS.phone}
                  </p>
                </div>
              </div>

              {/* Location Card */}
              <div ref={(el) => (cardRefs.current[2] = el)} className="flex flex-col items-center text-center space-y-6">
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-gradient-to-br from-warm-gold to-soft-yellow rounded-full flex items-center justify-center shadow-lg">
                  <MapPin className="w-8 h-8 text-background" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-medium text-foreground">
                    Location
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Come and Visit Us
                  </p>
                  <p className="text-warm-gold font-medium text-lg">
                    {CONTACT_DETAILS.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
