"use client";

import { MessageCircleCode } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const ReviewsSections = () => {
  // Reviews data
  const reviews = [
    {
      id: 1,
      text: "The Japanese head massage here was nothing short of magical. From the moment I stepped in, I was enveloped in calm — soft music, warm lighting, and the scent of essential oils set the mood. The therapist's technique was so gentle yet deeply effective; I could feel the tension in my scalp and shoulders just dissolve. I left feeling lighter, more balanced, and truly at peace. It's more than a treatment — it's a journey.",
      author: "Julian David",
      location: "From Colombo, Srilanka",
      avatar: "/assets/images/1.jpg",
    },
    {
      id: 2,
      text: "An absolutely transformative experience! The aromatherapy session combined with the deep tissue massage was exactly what my body needed. The attention to detail and the serene environment made me feel like I was in a different world. The staff was incredibly professional and caring. I've never felt so relaxed and rejuvenated. This place truly understands the art of wellness.",
      author: "Sarah Chen",
      location: "From Singapore",
      avatar: "/assets/images/2.jpg",
    },
    {
      id: 3,
      text: "Inner Peace Spa exceeded all my expectations. The hot stone therapy was incredible - I could feel years of stress melting away with each carefully placed stone. The therapist was skilled and intuitive, knowing exactly where I needed the most attention. The ambiance is perfect - not too quiet, not too busy, just right. I'm already planning my next visit!",
      author: "Michael Rodriguez",
      location: "From Barcelona, Spain",
      avatar: "/assets/images/3.jpg",
    },
    {
      id: 4,
      text: "What a hidden gem! The couple's massage package was the perfect way to celebrate our anniversary. Both therapists were synchronized and professional, creating a romantic yet therapeutic atmosphere. The attention to detail, from the rose petals to the custom essential oil blends, made this experience unforgettable. Highly recommend for special occasions!",
      author: "Emma & James Wilson",
      location: "From London, UK",
      avatar: "/assets/images/4.jpg",
    },
  ];

  // Slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentIndex((prevIndex) =>
            prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
          );
          setIsAnimating(false);
        }, 500);
      }
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAnimating, reviews.length]);

  // Manual navigation
  const goToSlide = (index: number) => {
    if (!isAnimating && index !== currentIndex) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsAnimating(false);
      }, 300);
    }
  };

  const currentReview = reviews[currentIndex];

  return (
    <section className="">
      <div className="my-container py-20">
        <div className="flex flex-col">
          {/* Header Section - Keeping as requested */}
          <div className="flex flex-col items-center justify-center">
            <div className=" mb-4 text-3xl md:text-4xl text-center">
              What Our
            </div>
            <div className=" flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="font-medium text-4xl md:text-5xl lg:text-6xl gradient-text1 text-center">
                Clients
              </div>
              <div className="w-64 h-24 overflow-hidden rounded-3xl flex items-center justify-center">
                <Image
                  src="/assets/images/1.jpg"
                  alt="Tranquility"
                  width={500}
                  height={500}
                  className=" object-cover object-center"
                />
              </div>
              <div className="font-medium text-4xl md:text-5xl lg:text-6xl gradient-text1 text-center">
                Says
              </div>
            </div>
          </div>

          {/* Review Card Section */}
          <div className="mt-16">
            <div className="bg-gradient-to-br from-dark-forest via-background to-dark-forest border border-warm-gold/20 rounded-2xl p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-transparent to-background/40 pointer-events-none"></div>

              {/* Content with smooth transition */}
              <div
                className={`relative z-10 transition-all duration-500 ease-in-out ${
                  isAnimating
                    ? "opacity-0 transform translate-y-4"
                    : "opacity-100 transform translate-y-0"
                }`}
              >
                {/* Large Quote Icon */}
                <div className="flex justify-center">
                  <div className="text-6xl md:text-8xl text-warm-gold/30 font-serif leading-none">
                    <MessageCircleCode size={64} />
                  </div>
                </div>

                {/* Review Text */}
                <div className="text-center mb-12">
                  <p className="text-foreground text-lg md:text-xl leading-relaxed font-normal tracking-wide min-h-[200px] flex items-center justify-center">
                    &ldquo;{currentReview.text}&rdquo;
                  </p>
                </div>

                {/* Customer Profile */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-warm-gold/30">
                    <Image
                      src={currentReview.avatar}
                      alt={currentReview.author}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-foreground font-medium text-lg">
                      {currentReview.author}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {currentReview.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider Navigation Dots */}
              <div className="relative z-10 flex justify-center mt-8 gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-warm-gold w-8"
                        : "bg-warm-gold/30 hover:bg-warm-gold/50"
                    }`}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              <div className="relative z-10 mt-4">
                <div className="w-full h-0.5 bg-warm-gold/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-warm-gold to-soft-yellow rounded-full transition-all duration-[4000ms] ease-linear"
                    style={{
                      width: isAnimating ? "0%" : "100%",
                      transition: isAnimating
                        ? "width 0.3s ease-out"
                        : "width 4s linear",
                    }}
                  />
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 left-4 w-2 h-2 bg-warm-gold rounded-full opacity-30"></div>
              <div className="absolute top-6 right-8 w-1 h-1 bg-sage-green rounded-full opacity-40"></div>
              <div className="absolute bottom-8 left-6 w-1.5 h-1.5 bg-soft-yellow rounded-full opacity-25"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSections;
