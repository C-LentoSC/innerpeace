import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { CONTACT_DETAILS } from "@/constants/data";

const ContactSection = () => {
  return (
    <section className="relative">
      <div className="my-container py-20">
        <div className="flex flex-col">
          {/* Content */}
          <div className="relative z-10">
            {/* Title */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium gradient-text1 mb-4">
                Get in Touch With Us
              </h2>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
              {/* Email Card */}
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-gradient-to-br from-warm-gold to-soft-yellow rounded-full flex items-center justify-center shadow-lg">
                  <Mail className="w-8 h-8 text-background" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-medium text-foreground">
                    Email
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our Friendly Team is Here to Help
                  </p>
                  <p className="text-warm-gold font-medium text-lg">
                    {CONTACT_DETAILS.email}
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-gradient-to-br from-warm-gold to-soft-yellow rounded-full flex items-center justify-center shadow-lg">
                  <Phone className="w-8 h-8 text-background" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-medium text-foreground">
                    Phone
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Open from 8AM - 10PM
                  </p>
                  <p className="text-warm-gold font-medium text-lg">
                    {CONTACT_DETAILS.phone}
                  </p>
                </div>
              </div>

              {/* Location Card */}
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-gradient-to-br from-warm-gold to-soft-yellow rounded-full flex items-center justify-center shadow-lg">
                  <MapPin className="w-8 h-8 text-background" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-medium text-foreground">
                    Location
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Come and Visit Us
                  </p>
                  <p className="text-warm-gold font-medium text-lg">
                    {CONTACT_DETAILS.address}
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

export default ContactSection;
