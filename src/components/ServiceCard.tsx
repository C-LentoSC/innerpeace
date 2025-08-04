"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/Button";
import { CURRENCY } from "@/constants/data";

const serviceCardVariants = cva(
  // "flex gap-6 p-6 bg-card/40 backdrop-blur-sm rounded-xl border border-border/20 hover:border-warm-gold/30 transition-all duration-300 hover:shadow-lg",
  "flex gap-6 rounded-xl hover:border-warm-gold/30 transition-all duration-300",

  {
    variants: {
      alignment: {
        left: "flex-col md:flex-row",
        right: "flex-col md:flex-row-reverse",
      },
      size: {
        default: "min-h-[300px] md:min-h-[350px]",
        large: "min-h-[350px] md:min-h-[400px]",
        small: "min-h-[250px] md:min-h-[300px]",
      },
    },
    defaultVariants: {
      alignment: "left",
      size: "default",
    },
  }
);

export interface ServiceCardProps
  extends VariantProps<typeof serviceCardVariants> {
  title: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  imageAlt: string;
  bookingUrl?: string;
  contactUrl?: string;
  serviceId?: string;
  className?: string;
}

const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  (
    {
      alignment = "left",
      size = "default",
      title,
      description,
      price,
      duration,
      image,
      imageAlt,
      bookingUrl,
      contactUrl,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      serviceId,
      className,
      ...props
    },
    ref
  ) => {
    const handleBookNow = () => {
      if (bookingUrl) {
        window.open(bookingUrl, "_blank");
      } else {
        // Default booking action
        console.log(`Booking ${title}`);
        alert(`Booking ${title} - This would redirect to booking system`);
      }
    };

    const handleContactTeam = () => {
      if (contactUrl) {
        window.open(contactUrl, "_blank");
      } else {
        // Default contact action
        console.log(`Contacting team about ${title}`);
        alert(`Contacting team about ${title} - This would open contact form`);
      }
    };
    return (
      <div
        ref={ref}
        className={cn(serviceCardVariants({ alignment, size }), className)}
        {...props}
      >
        {/* Image Section */}
        <div className="relative flex-shrink-0 w-full md:w-64 h-48 md:h-auto md:aspect-[9/12] aspect-video rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={imageAlt}
            width={400}
            height={400}
            className="w-full h-full object-cover"
            priority
          />

          {/* Duration Badge */}
          <div className="absolute top-4 left-4 bg-background/50 backdrop-blur-xl px-3 py-1 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Duration</p>
            <p className="text-sm font-medium text-foreground">{duration}</p>
          </div>
        </div>

        {/* Content Section */}
        <div
          className={`flex-1 flex flex-col justify-between py-2 ${
            alignment === "right" ? "md:ml-32 lg:ml-44" : "md:mr-32 lg:mr-44"
          }`}
        >
          <div className="space-y-4">
            {/* Title */}
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
              {title}
            </h3>

            {/* Description */}
            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Price and Actions */}
          <div className="space-y-4 mt-6">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-medium text-foreground">
                {CURRENCY.symbol}{" "}
              </span>
              <span className="text-2xl lg:text-3xl font-bold text-warm-gold">
                {price}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleBookNow}
                variant="default"
                size="default"
                className="flex-1 sm:flex-none"
              >
                Book now
              </Button>

              <Button
                onClick={handleContactTeam}
                variant="link"
                size="default"
                className="text-warm-gold hover:text-soft-yellow text-sm"
              >
                Contact our team for more info
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ServiceCard.displayName = "ServiceCard";

export { ServiceCard, serviceCardVariants };
