"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/Button";
import Image from "next/image";

export default function BookAppointmentPage() {
  const [step, setStep] = useState(1);
  type Service = {
    id: number;
    name: string;
    duration: number;
    price: number;
    originalPrice: number;
    rating: number;
    image: string;
    description: string;
    therapists: string[];
  };

  type Therapist = {
    id: number;
    name: string;
    speciality: string;
    experience: string;
    rating: number;
    image: string;
  };

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTherapist, setSelectedTherapist] =
    useState<Therapist | null>(null);

  // Mock data
  const services = [
    {
      id: 1,
      name: "Deep Tissue Massage",
      duration: 60,
      price: 3500,
      originalPrice: 4000,
      rating: 4.8,
      image: "/assets/images/1.jpg",
      description: "Intensive massage targeting deep muscle tension",
      therapists: ["Sarah Williams", "Maya Singh", "Priya Reddy"],
    },
    {
      id: 2,
      name: "Aromatherapy Session",
      duration: 90,
      price: 4500,
      originalPrice: 5000,
      rating: 4.9,
      image: "/assets/images/2.jpg",
      description: "Relaxing aromatherapy with essential oils",
      therapists: ["Kavya Reddy", "Sarah Williams"],
    },
    {
      id: 3,
      name: "Facial Treatment",
      duration: 45,
      price: 2500,
      originalPrice: 3000,
      rating: 4.7,
      image: "/assets/images/3.jpg",
      description: "Rejuvenating facial for glowing skin",
      therapists: ["Maya Singh", "Priya Reddy"],
    },
    {
      id: 4,
      name: "Head & Shoulder Massage",
      duration: 30,
      price: 2000,
      originalPrice: 2500,
      rating: 4.6,
      image: "/assets/images/4.jpg",
      description: "Focused massage for head and shoulder relief",
      therapists: ["Sarah Williams", "Kavya Reddy"],
    },
  ];

  const therapists = [
    {
      id: 1,
      name: "Sarah Williams",
      speciality: "Deep Tissue & Aromatherapy",
      experience: "8 years",
      rating: 4.9,
      image: "/assets/images/user.jpg",
    },
    {
      id: 2,
      name: "Maya Singh",
      speciality: "Facial & Wellness Treatments",
      experience: "6 years",
      rating: 4.8,
      image: "/assets/images/user2.jpg",
    },
    {
      id: 3,
      name: "Priya Reddy",
      speciality: "Traditional Massage Therapy",
      experience: "10 years",
      rating: 4.9,
      image: "/assets/images/user3.jpg",
    },
    {
      id: 4,
      name: "Kavya Reddy",
      speciality: "Aromatherapy & Head Massage",
      experience: "5 years",
      rating: 4.7,
      image: "/assets/images/user4.jpg",
    },
  ];

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
    "07:00 PM",
    "07:30 PM",
  ];

  const handleBooking = () => {
    // TODO: Implement booking API call
    console.log({
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      therapist: selectedTherapist,
    });
    // Show success message or redirect
  };

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass-card rounded-xl p-6 border border-white-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold modern-gradient-text">
              Book Your Appointment
            </h1>
            <p className="mt-2 text-slate-400">
              Choose your perfect spa experience
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center space-x-2 text-sm text-slate-300">
              <span
                className={`px-3 py-1 rounded-full ${
                  step >= 1 ? "bg-warm-gold text-white" : "bg-gray-600"
                }`}
              >
                1. Service
              </span>
              <ChevronRight className="h-4 w-4" />
              <span
                className={`px-3 py-1 rounded-full ${
                  step >= 2 ? "bg-warm-gold text-white" : "bg-gray-600"
                }`}
              >
                2. Date & Time
              </span>
              <ChevronRight className="h-4 w-4" />
              <span
                className={`px-3 py-1 rounded-full ${
                  step >= 3 ? "bg-warm-gold text-white" : "bg-gray-600"
                }`}
              >
                3. Therapist
              </span>
              <ChevronRight className="h-4 w-4" />
              <span
                className={`px-3 py-1 rounded-full ${
                  step >= 4 ? "bg-warm-gold text-white" : "bg-gray-600"
                }`}
              >
                4. Confirm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Service Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6 border border-white-border">
            <h2 className="text-xl font-semibold modern-gradient-text mb-6">
              Choose Your Service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`glass-card rounded-xl p-6 border cursor-pointer transition-all glass-card-hover ${
                    selectedService?.id === service.id
                      ? "border-warm-gold bg-warm-gold/10"
                      : "border-white-border hover:border-white-border-hover"
                  }`}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="flex space-x-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-warm-gold/20">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {service.name}
                          </h3>
                          <p className="text-sm text-slate-400 mt-1">
                            {service.description}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-400">
                              {service.duration} minutes
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-warm-gold fill-current" />
                              <span className="text-sm text-slate-400">
                                {service.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-foreground">
                            ₹{service.price.toLocaleString()}
                          </div>
                          {service.originalPrice > service.price && (
                            <div className="text-sm text-slate-400 line-through">
                              ₹{service.originalPrice.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {selectedService?.id === service.id && (
                    <div className="absolute top-4 right-4 bg-warm-gold rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedService}
                className="flex items-center space-x-2"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Date & Time Selection */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6 border border-white-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold modern-gradient-text">
                Select Date & Time
              </h2>
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Date Selection */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Choose Date
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {generateDateOptions()
                    .slice(0, 12)
                    .map((date) => {
                      const dateObj = new Date(date);
                      const isSelected = selectedDate === date;
                      return (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            isSelected
                              ? "border-warm-gold bg-warm-gold/20 text-warm-gold"
                              : "border-white-border bg-glass-card hover:border-white-border-hover text-foreground"
                          }`}
                        >
                          <div className="text-sm font-medium">
                            {dateObj.toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </div>
                          <div className="text-lg font-bold">
                            {dateObj.getDate()}
                          </div>
                          <div className="text-xs text-slate-400">
                            {dateObj.toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Choose Time
                </h3>
                <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                  {timeSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    const isAvailable = Math.random() > 0.3; // Mock availability
                    return (
                      <button
                        key={time}
                        onClick={() => isAvailable && setSelectedTime(time)}
                        disabled={!isAvailable}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          isSelected
                            ? "border-warm-gold bg-warm-gold/20 text-warm-gold"
                            : isAvailable
                            ? "border-white-border bg-glass-card hover:border-white-border-hover text-foreground"
                            : "border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="flex items-center space-x-2"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Therapist Selection */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6 border border-white-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold modern-gradient-text">
                Choose Your Therapist
              </h2>
              <Button
                variant="ghost"
                onClick={() => setStep(2)}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {therapists
                .filter((therapist) =>
                  selectedService?.therapists.includes(therapist.name)
                )
                .map((therapist) => (
                  <div
                    key={therapist.id}
                    className={`glass-card rounded-xl p-6 border cursor-pointer transition-all glass-card-hover ${
                      selectedTherapist?.id === therapist.id
                        ? "border-warm-gold bg-warm-gold/10"
                        : "border-white-border hover:border-white-border-hover"
                    }`}
                    onClick={() => setSelectedTherapist(therapist)}
                  >
                    <div className="flex space-x-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-warm-gold/20">
                        <Image
                          src={therapist.image}
                          alt={therapist.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {therapist.name}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                          {therapist.speciality}
                        </p>
                        <div className="flex items-center mt-2 space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-warm-gold fill-current" />
                            <span className="text-sm text-slate-400">
                              {therapist.rating}
                            </span>
                          </div>
                          <div className="text-sm text-slate-400">
                            {therapist.experience}
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedTherapist?.id === therapist.id && (
                      <div className="absolute top-4 right-4 bg-warm-gold rounded-full p-1">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="ghost"
                onClick={() => setStep(2)}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!selectedTherapist}
                className="flex items-center space-x-2"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6 border border-white-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold modern-gradient-text">
                Confirm Your Booking
              </h2>
              <Button
                variant="ghost"
                onClick={() => setStep(3)}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Booking Summary */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-glass-card rounded-xl p-6 border border-white-border">
                  <h3 className="font-semibold text-foreground mb-4">
                    Booking Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Service:</span>
                      <span className="text-foreground">
                        {selectedService?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Date:</span>
                      <span className="text-foreground">
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Time:</span>
                      <span className="text-foreground">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration:</span>
                      <span className="text-foreground">
                        {selectedService?.duration} minutes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Therapist:</span>
                      <span className="text-foreground">
                        {selectedTherapist?.name}
                      </span>
                    </div>
                    <hr className="border-white-border" />
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-foreground">Total:</span>
                      <span className="text-warm-gold">
                        ₹{selectedService?.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="bg-glass-card rounded-xl p-6 border border-white-border">
                <h3 className="font-semibold text-foreground mb-4">
                  Payment Options
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      defaultChecked
                      className="border-white-border text-warm-gold focus:ring-warm-gold focus:ring-2"
                    />
                    <span className="text-slate-300">Pay at Spa</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      className="border-white-border text-warm-gold focus:ring-warm-gold focus:ring-2"
                    />
                    <span className="text-slate-300">Pay Online</span>
                  </label>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={handleBooking}
                    fullWidth
                    className="flex items-center justify-center space-x-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Confirm Booking</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
