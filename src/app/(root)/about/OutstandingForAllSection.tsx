import { Sparkles, Heart, Zap } from "lucide-react";

const OutstandingForAll = () => {
  return (
    <section className="relative">
      <div className="my-container py-20">
        <div className="flex flex-col">
          {/* Content */}
          <div className="relative z-10">
            {/* Title */}
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
                Out Standing For All
              </h2>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
              {/* Email Card */}
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-gradient-to-br from-warm-gold to-soft-yellow rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-background" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-medium text-foreground">
                    Quality
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">
                    We deliver exceptional treatments with meticulous attention
                    to detail, using only the finest products and techniques for
                    a truly luxurious experience.
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-gradient-to-br from-warm-gold to-soft-yellow rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-background" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-medium text-foreground">
                    Friendly
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">
                    Our warm, welcoming team ensures you feel comfortable and
                    cared for from the moment you arrive because your comfort
                    matters to us.
                  </p>
                </div>
              </div>

              {/* Location Card */}
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-gradient-to-br from-warm-gold to-soft-yellow rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-background" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-medium text-foreground">
                    Fast
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">
                    Enjoy premium services without compromising your time
                    efficient, seamless, and perfectly tailored to your
                    schedule.
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

export default OutstandingForAll;
