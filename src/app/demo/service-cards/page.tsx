import { ServiceCard } from "@/components/ServiceCard";
import Link from "next/link";
import { Button } from "@/components/Button";
import { ArrowLeft } from "lucide-react";

export const DEMO_SERVICES = [
  {
    id: 1,
    title: "The Inner Peace Ritual",
    description:
      "Deep head spa therapy, hot oil scalp massage, and aromatherapy for ultimate tranquility. Experience the profound benefits of our special treatment.",
    price: "5,000",
    duration: "1 Hour 20 Minutes",
    image: "/assets/images/1.jpg",
    imageAlt: "The Inner Peace Ritual",
    serviceId: "demo-inner-peace",
  },
  {
    id: 2,
    title: "Serenity Body Treatment",
    description:
      "Full body relaxation therapy combining ancient techniques with modern wellness practices for complete rejuvenation and healing.",
    price: "7,500",
    duration: "2 Hours 30 Minutes",
    image: "/assets/images/2.jpg",
    imageAlt: "Serenity Body Treatment",
    serviceId: "demo-serenity",
  },
  {
    id: 3,
    title: "Mindful Meditation Session",
    description:
      "Guided meditation experience with sound therapy and aromatherapy to restore mental balance, clarity, and inner peace.",
    price: "3,500",
    duration: "1 Hour",
    image: "/assets/images/1.jpg",
    imageAlt: "Mindful Meditation Session",
    serviceId: "demo-meditation",
  },
];

const ServiceCardDemoPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="mb-6"
            >
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-warm-gold mb-4">
            ServiceCard Component Demo
          </h1>
          <p className="text-lg text-foreground mb-8">
            Fully reusable service cards with left and right alignment variants
          </p>
        </div>

        {/* Service Cards with alternating alignment */}
        <div className="space-y-12 mb-16">
          <h2 className="text-2xl font-bold text-sage-green text-center mb-8">
            Alternating Alignment (Production Usage)
          </h2>

          {DEMO_SERVICES.map((service, index) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              price={service.price}
              duration={service.duration}
              image={service.image}
              imageAlt={service.imageAlt}
              serviceId={service.serviceId}
              alignment={index % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>

        {/* Size Variants */}
        <div className="space-y-12 mb-16">
          <h2 className="text-2xl font-bold text-sage-green text-center mb-8">
            Size Variants
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-warm-gold mb-4">
                Small Size
              </h3>
              <ServiceCard
                title="Compact Service Card"
                description="This is a smaller variant of the service card, perfect for compact layouts."
                price="2,500"
                duration="45 Minutes"
                image="/assets/images/1.jpg"
                imageAlt="Small service card demo"
                alignment="left"
                size="small"
                serviceId="demo-small"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-warm-gold mb-4">
                Large Size
              </h3>
              <ServiceCard
                title="Premium Luxury Treatment"
                description="This is a larger variant of the service card, ideal for highlighting premium services with more detailed descriptions and enhanced visual presence."
                price="12,000"
                duration="3 Hours 45 Minutes"
                image="/assets/images/2.jpg"
                imageAlt="Large service card demo"
                alignment="right"
                size="large"
                serviceId="demo-large"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-card/20 p-8 rounded-xl border border-border/20">
          <h2 className="text-2xl font-bold text-sage-green mb-6 text-center">
            ServiceCard Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-warm-gold mb-2">Variants</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Left alignment (image left, content right)</li>
                <li>• Right alignment (image right, content left)</li>
                <li>• Small, default, and large sizes</li>
                <li>• Fully responsive design</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-warm-gold mb-2">Features</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Duration badge overlay</li>
                <li>• Gradient text support</li>
                <li>• Interactive buttons with callbacks</li>
                <li>• Hover effects and transitions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-warm-gold mb-2">
                Theme Integration
              </h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Uses project color palette</li>
                <li>• Consistent with Button component</li>
                <li>• Playfair Display typography</li>
                <li>• Glass morphism backdrop effects</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-warm-gold mb-2">
                Accessibility
              </h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Proper alt text for images</li>
                <li>• Keyboard navigation support</li>
                <li>• Screen reader friendly</li>
                <li>• High contrast ratios</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCardDemoPage;
