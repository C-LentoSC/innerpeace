import Image from "next/image";
import { Button } from "@/components/Button";
import { ArrowRight } from "lucide-react";

const GallerySection = () => {
  return (
    <section className="">
      <div className="my-container py-20">
        <div className="flex flex-col">
          <div className="font-medium text-3xl md:text-4xl gradient-text1 text-center">
            Gallery
          </div>
          <div className="text-center mt-1 text-lg md:text-xl">
            See More of Our Work
          </div>

          {/* Image Layout */}
          <div className="mt-12">
            {/* Mobile Layout - Simple Stack */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              <div className="relative overflow-hidden rounded-xl h-64">
                <Image
                  src="/assets/images/1.jpg"
                  alt="Spa accessories with towel and candles"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="relative overflow-hidden rounded-xl h-64">
                <Image
                  src="/assets/images/2.jpg"
                  alt="Professional massage therapy"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="relative overflow-hidden rounded-xl h-64">
                <Image
                  src="/assets/images/3.jpg"
                  alt="Wellness treatment session"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="relative overflow-hidden rounded-xl h-64">
                <Image
                  src="/assets/images/4.jpg"
                  alt="Hot stone therapy treatment"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            </div>

            {/* Desktop Layout - Custom Grid */}
            <div className="hidden md:flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                {/* Left Image */}
                <div className="relative w-1/2 h-[500px] overflow-hidden rounded-xl">
                  <Image
                    src="/assets/images/1.jpg"
                    alt="Spa accessories with towel and candles"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
                {/* Right Images */}
                <div className="w-1/2 flex flex-col gap-4">
                  <div className="relative h-1/2 overflow-hidden rounded-xl">
                    <Image
                      src="/assets/images/2.jpg"
                      alt="Professional massage therapy"
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                  <div className="relative h-1/2 overflow-hidden rounded-xl">
                    <Image
                      src="/assets/images/3.jpg"
                      alt="Wellness treatment session"
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                </div>
              </div>
              {/* Bottom Image */}
              <div className="relative h-[250px] overflow-hidden rounded-xl">
                <Image
                  src="/assets/images/4.jpg"
                  alt="Hot stone therapy treatment"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            </div>

            {/* View More Button */}
            <div className="flex justify-center mt-12">
              <Button
                variant="default"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                View More Gallery
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
