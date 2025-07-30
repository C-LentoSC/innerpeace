import Link from "next/link";
import { Button } from "@/components/Button";
import { ArrowRight, Heart, Users, Sparkles } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl lg:text-7xl font-bold text-warm-gold mb-6">
            Where Tranquility
          </h1>
          <h2 className="text-4xl lg:text-6xl font-bold text-sage-green mb-8">
            Meets Elegance
          </h2>
          <p className="text-lg lg:text-xl text-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
            Step into a sanctuary where tranquility meets elegance. At Inner
            Peace Spa, we combine ancient rituals with modern techniques to
            deliver a truly luxurious and transformative experience. Let us help
            you unwind, restore, and glow - because you deserve nothing less
          </p>

          <Button
            size="lg"
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="mb-8"
          >
            Book Your Appointment Now
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg border border-border/20 hover:border-warm-gold/30 transition-all duration-300">
              <h3 className="text-2xl font-semibold text-accent mb-4 flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                Meditation
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Discover the power of mindfulness and meditation practices that
                restore your inner balance and peace.
              </p>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Learn More
              </Button>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border/20 hover:border-warm-gold/30 transition-all duration-300">
              <h3 className="text-2xl font-semibold text-secondary mb-4 flex items-center gap-3">
                <Heart className="w-6 h-6" />
                Wellness
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Explore holistic approaches to mental and physical wellbeing
                through our curated wellness programs.
              </p>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Learn More
              </Button>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border/20 hover:border-warm-gold/30 transition-all duration-300">
              <h3 className="text-2xl font-semibold text-bright-orange mb-4 flex items-center gap-3">
                <Users className="w-6 h-6" />
                Community
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Connect with like-minded individuals on their journey towards
                peace and self-discovery.
              </p>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl lg:text-4xl font-bold text-warm-gold mb-6">
            Begin Your Journey to Inner Peace
          </h3>
          <p className="text-lg text-foreground mb-8 leading-relaxed">
            Join thousands who have discovered tranquility and elegance in our
            sanctuary of wellness.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Begin Your Journey
            </Button>
            <Link href="/demo/buttons">
              <Button variant="outline" size="lg">
                View Components
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
