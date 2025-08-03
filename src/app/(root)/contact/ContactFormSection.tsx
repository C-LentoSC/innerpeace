"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { MapPin, Phone, Mail } from "lucide-react";
import { CONTACT_DETAILS } from "@/constants/data";

const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    matter: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="my-container">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6">
            Make an Appointment
          </h2>
          <p className="text-sm lg:text-base max-w-3xl mx-auto leading-relaxed">
            We are Eagerly Waiting for You to Give a Relaxing and Elegant
            Service that You will Never Forget
          </p>
        </div>

        {/* Form and Contact Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Your Name"
                  className="w-full px-4 py-3 bg-card border border-border/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Your Email"
                  className="w-full px-4 py-3 bg-card border border-border/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Matter Field */}
              <div className="space-y-2">
                <label
                  htmlFor="matter"
                  className="block text-sm font-medium text-foreground"
                >
                  Matter
                </label>
                <textarea
                  id="matter"
                  name="matter"
                  value={formData.matter}
                  onChange={handleChange}
                  placeholder="Enter Your Matter"
                  rows={6}
                  className="w-full px-4 py-3 bg-card border border-border/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-transparent transition-all duration-200 resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Contact Us
                </Button>
              </div>
            </form>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col justify-center items-center">
            <div className="space-y-8 md:space-y-16">
              {/* Location */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-warm-gold to-soft-yellow rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-background" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-foreground">
                    Location
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {CONTACT_DETAILS.address}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-warm-gold to-soft-yellow rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-background" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-foreground">Phone</h3>
                  <p className="text-sm text-muted-foreground">
                    {CONTACT_DETAILS.phone}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-warm-gold to-soft-yellow rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-background" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-foreground">Email</h3>
                  <p className="text-sm text-muted-foreground">
                    {CONTACT_DETAILS.email}
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

export default ContactFormSection;
