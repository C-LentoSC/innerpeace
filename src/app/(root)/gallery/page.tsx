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
];

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 sm:py-24">
      <div className="my-container">
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-4 min-h-[150vh] md:min-h-[80vh]">
          {/* Top Left */}
          <div className="md:col-span-2 md:row-span-1 rounded-lg overflow-hidden relative h-64 md:h-auto">
            <Image
              src={galleryImages[0].src}
              alt={galleryImages[0].alt}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Top Right */}
          <div className="md:col-start-3 md:row-start-1 md:row-span-2 rounded-lg overflow-hidden relative h-96 md:h-auto">
            <Image
              src={galleryImages[1].src}
              alt={galleryImages[1].alt}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Middle Left */}
          <div className="md:col-start-1 md:row-start-2 md:row-span-2 rounded-lg overflow-hidden relative h-96 md:h-auto">
            <Image
              src={galleryImages[2].src}
              alt={galleryImages[2].alt}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Center Text */}
          <div className="md:col-start-2 md:row-start-2 flex items-center justify-center text-center p-4">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text1">
              Take a Sneak Peak to Our Journey
            </h2>
          </div>

          {/* Bottom Center */}
          <div className="md:col-start-2 md:row-start-3 rounded-lg overflow-hidden relative h-64 md:h-auto">
            <Image
              src={galleryImages[3].src}
              alt={galleryImages[3].alt}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Bottom Right */}
          <div className="md:col-start-3 md:row-start-3 rounded-lg overflow-hidden relative h-64 md:h-auto">
            <Image
              src={galleryImages[4].src}
              alt={galleryImages[4].alt}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
