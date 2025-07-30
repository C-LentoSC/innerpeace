import Link from "next/link";
import { Button } from "@/components/Button";
import { ArrowRight, Heart, Users, Sparkles } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-6xl font-bold text-warm-gold text-center">
            InnerPeace
          </h1>
          <Link href="/demo/buttons">
            <Button variant="outline" size="sm">
              View Components
            </Button>
          </Link>
        </div>

        <h2 className="text-3xl font-semibold text-sage-green mb-6">
          Find Your Inner Peace
        </h2>
        <p className="text-lg text-foreground mb-8 leading-relaxed">
          Welcome to InnerPeace, a sanctuary for your mind and soul. Our
          beautiful Playfair Display typography creates an elegant and calming
          experience as you journey towards tranquility and self-discovery.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-accent mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Meditation
            </h3>
            <p className="text-muted-foreground mb-4">
              Discover the power of mindfulness and meditation practices.
            </p>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Learn More
            </Button>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-secondary mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Wellness
            </h3>
            <p className="text-muted-foreground mb-4">
              Explore holistic approaches to mental and physical wellbeing.
            </p>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Learn More
            </Button>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold text-bright-orange mb-3 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Community
            </h3>
            <p className="text-muted-foreground mb-4">
              Connect with like-minded individuals on their peace journey.
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

        <div className="mt-12 text-center space-y-4">
          <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
            Begin Your Journey
          </Button>
          <div className="flex justify-center gap-4">
            <Link href="/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button variant="secondary">Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
