import { Button } from "@/components/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-warm-gold mb-6">About Us</h1>
        <p className="text-lg text-foreground mb-8 leading-relaxed">
          Learn about our mission to bring tranquility and elegance to your
          wellness journey.
        </p>
        <div className="text-muted-foreground mb-8">
          <p>About us content coming soon...</p>
        </div>
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
  );
};

export default AboutPage;
