import Image from "next/image";

const ReviewsSections = () => {
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

              {/* Content */}
              <div className="relative z-10">
                {/* Large Quote Icon */}
                <div className="flex justify-center">
                  <div className="text-6xl md:text-8xl text-warm-gold/30 font-serif leading-none">
                    "
                  </div>
                </div>

                {/* Review Text */}
                <div className="text-center mb-12">
                  <p className="text-foreground text-lg md:text-xl leading-relaxed font-normal tracking-wide">
                    "The Japanese head massage here was nothing short of
                    magical. From the moment I stepped in, I was enveloped in
                    calm — soft music, warm lighting, and the scent of essential
                    oils set the mood. The therapist's technique was so gentle
                    yet deeply effective; I could feel the tension in my scalp
                    and shoulders just dissolve. I left feeling lighter, more
                    balanced, and truly at peace. It's more than a treatment —
                    it's a journey."
                  </p>
                </div>

                {/* Customer Profile */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-warm-gold/30">
                    <Image
                      src="/assets/images/1.jpg"
                      alt="Julian David"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-foreground font-medium text-lg">
                      Julian David
                    </div>
                    <div className="text-muted-foreground text-sm">
                      From Colombo, Srilanka
                    </div>
                  </div>
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
