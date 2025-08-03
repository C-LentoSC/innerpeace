import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/Button";

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

const GalleryPage = () => {
  return (
    <div className="bg-background text-foreground py-24 sm:py-32">
      <div className="my-container">
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
