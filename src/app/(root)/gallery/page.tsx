"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  User,
  Sparkles,
  Droplets,
  Heart,
} from "lucide-react";
import { Button } from "@/components/Button";
import { useState, useEffect } from "react";

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

const massageTourImages = [
  {
    src: "/assets/images/1.jpg",
    alt: "Relaxing Head Massage",
    title: "Traditional Head Massage",
    description:
      "Experience the calming power of a head massage designed to melt away stress and restore balance.",
    icon: <User className="w-6 h-6" />,
  },
  {
    src: "/assets/images/2.jpg",
    alt: "Therapeutic Scalp Treatment",
    title: "Therapeutic Scalp Treatment",
    description:
      "Specialized techniques to improve circulation and promote deep relaxation through pressure point therapy.",
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    src: "/assets/images/3.jpg",
    alt: "Aromatherapy Head Session",
    title: "Aromatherapy Head Session",
    description:
      "Indulge in aromatic oils combined with gentle massage strokes for ultimate sensory relaxation.",
    icon: <Droplets className="w-6 h-6" />,
  },
  {
    src: "/assets/images/4.jpg",
    alt: "Stress Relief Therapy",
    title: "Stress Relief Therapy",
    description:
      "Targeted massage techniques focusing on tension release and mental clarity enhancement.",
    icon: <Heart className="w-6 h-6" />,
  },
  {
    src: "/assets/images/1.png",
    alt: "Holistic Wellness Treatment",
    title: "Holistic Wellness Treatment",
    description:
      "Complete mind-body wellness approach combining traditional and modern massage techniques.",
    icon: <User className="w-6 h-6" />,
  },
];

const GalleryPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % massageTourImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % massageTourImages.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + massageTourImages.length) % massageTourImages.length
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="bg-background text-foreground py-24 sm:py-32">
      <div className="my-container">
        {/* Head Massage Tour Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium gradient-text1 mb-4">
              Head Massage Tour
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
              Experience the profound benefits of our special Japanese head
              massage
            </p>
          </div>

          {/* Slider Container */}
          <div className="relative max-w-6xl mx-auto">
            <div className="flex items-center gap-4 md:gap-6">
              {/* Left Side Images - Hidden on Mobile */}
              <div className="hidden lg:flex flex-col gap-4 w-32">
                {[-2, -1].map((offset) => {
                  const index =
                    (currentSlide + offset + massageTourImages.length) %
                    massageTourImages.length;
                  return (
                    <div
                      key={`left-${offset}`}
                      className="relative h-40 rounded-xl overflow-hidden cursor-pointer opacity-60 hover:opacity-80 transition-all duration-300"
                      onClick={() => goToSlide(index)}
                    >
                      <Image
                        src={massageTourImages[index].src}
                        alt={massageTourImages[index].alt}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-2 left-2 text-warm-gold">
                        {massageTourImages[index].icon}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Main Central Image */}
              <div className="flex-1 relative">
                <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden group">
                  <Image
                    src={massageTourImages[currentSlide].src}
                    alt={massageTourImages[currentSlide].alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 50vw"
                    priority
                  />

                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-12">
                    <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-warm-gold bg-warm-gold/20 p-2 rounded-full backdrop-blur-sm">
                          {massageTourImages[currentSlide].icon}
                        </div>
                        <span className="text-warm-gold font-medium text-sm uppercase tracking-wider">
                          Treatment{" "}
                          {(currentSlide + 1).toString().padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white mb-3">
                        {massageTourImages[currentSlide].title}
                      </h3>

                      <p className="text-white/90 text-sm md:text-base lg:text-lg leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {massageTourImages[currentSlide].description}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>

                {/* Dot Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {massageTourImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-warm-gold scale-125"
                          : "bg-foreground/30 hover:bg-foreground/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Side Images - Hidden on Mobile */}
              <div className="hidden lg:flex flex-col gap-4 w-32">
                {[1, 2].map((offset) => {
                  const index =
                    (currentSlide + offset) % massageTourImages.length;
                  return (
                    <div
                      key={`right-${offset}`}
                      className="relative h-40 rounded-xl overflow-hidden cursor-pointer opacity-60 hover:opacity-80 transition-all duration-300"
                      onClick={() => goToSlide(index)}
                    >
                      <Image
                        src={massageTourImages[index].src}
                        alt={massageTourImages[index].alt}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-2 left-2 text-warm-gold">
                        {massageTourImages[index].icon}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Thumbnail Strip */}
            <div className="lg:hidden mt-6 flex gap-3 overflow-x-auto pb-2">
              {massageTourImages.map((image, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                    index === currentSlide
                      ? "ring-2 ring-warm-gold opacity-100"
                      : "opacity-60 hover:opacity-80"
                  }`}
                  onClick={() => goToSlide(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-1 left-1 text-warm-gold text-xs">
                    {image.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Original Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-auto md:h-[90vh] md:max-h-[1000px]">
          {/* Image 1: Top Left */}
          <div className="relative md:col-span-2 md:row-span-1 rounded-xl overflow-hidden h-64 md:h-auto">
            <Image
              src={galleryImages[0].src}
              alt={galleryImages[0].alt}
              fill
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Image 2: Top Right */}
          <div className="relative md:col-start-3 md:col-span-2 md:row-span-1 rounded-xl overflow-hidden h-64 md:h-auto">
            <Image
              src={galleryImages[1].src}
              alt={galleryImages[1].alt}
              fill
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Image 3: Middle Left (Tall) */}
          <div className="relative md:col-span-1 md:row-span-2 rounded-xl overflow-hidden h-96 md:h-auto">
            <Image
              src={galleryImages[2].src}
              alt={galleryImages[2].alt}
              fill
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>

          {/* Center Text */}
          <div className="md:col-start-2 md:col-span-2 md:row-start-2 flex flex-col items-center justify-center text-center p-8 rounded-xl bg-card/50 backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-medium gradient-text1 leading-tight">
              Take a Sneak Peek
            </h2>
            <h3 className="text-2xl md:text-3xl font-medium text-foreground/80 mt-2">
              to Our Journey
            </h3>
          </div>

          {/* Image 4: Middle Right (Tall) */}
          <div className="relative md:col-start-4 md:col-span-1 md:row-span-2 rounded-xl overflow-hidden h-96 md:h-auto">
            <Image
              src={galleryImages[3].src}
              alt={galleryImages[3].alt}
              fill
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>

          {/* Image 5: Bottom Left */}
          <div className="relative md:col-start-2 md:col-span-1 md:row-start-3 rounded-xl overflow-hidden h-64 md:h-auto">
            <Image
              src={galleryImages[4].src}
              alt={galleryImages[4].alt}
              fill
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>

          {/* Image 6: Bottom Right */}
          <div className="relative md:col-start-3 md:col-span-1 md:row-start-3 rounded-xl overflow-hidden h-64 md:h-auto">
            <Image
              src={galleryImages[5].src}
              alt={galleryImages[5].alt}
              fill
              className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
