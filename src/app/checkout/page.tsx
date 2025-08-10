"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/Button";
import { 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  CreditCard, 
  Building2, 
  Star,
  Clock,
  Calendar,
  Shield,
  CheckCircle,
  Users
} from "lucide-react";

type Package = {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  durationInMinutes?: number;
};

type Therapist = {
  id: string;
  name: string;
  email: string;
  image?: string;
  rating: number;
  completedBookings: number;
  specialties: string[];
};

function CheckoutContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [pkg, setPackage] = useState<Package | null>(null);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [therapistsLoading, setTherapistsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedTherapist, setSelectedTherapist] = useState<string>("");
  const [preferredGender, setPreferredGender] = useState<"any" | "male" | "female">("any");
  const [specialRequests, setSpecialRequests] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank_transfer">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const packageId = searchParams.get("packageId");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  useEffect(() => {
    if (session?.user) {
      setUserName(session.user.name || "");
      setUserEmail(session.user.email || "");
      // if we have profile mobile number via a custom token or future fetch, hydrate later
    }
  }, [session]);

  useEffect(() => {
    async function load() {
      if (!packageId) {
        setError("Missing package");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`/api/packages/${packageId}`);
        if (!res.ok) throw new Error("Package not found");
        const data = await res.json();
        setPackage(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load package";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [packageId]);

  // Fetch available therapists
  useEffect(() => {
    async function fetchTherapists() {
      if (!date || !time) return;
      
      try {
        setTherapistsLoading(true);
        const res = await fetch(`/api/therapists?available=true&date=${date}&time=${time}`);
        if (res.ok) {
          const data = await res.json();
          setTherapists(data);
        }
      } catch (e) {
        console.error("Failed to fetch therapists:", e);
      } finally {
        setTherapistsLoading(false);
      }
    }
    fetchTherapists();
  }, [date, time]);

  const submitBooking = async () => {
    if (!packageId || !date || !time || !userName || !userEmail || !pkg) return;
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          date,
          time,
          userName,
          userEmail,
          userPhone,
          notes: `${notes}${specialRequests ? `\n\nSpecial Requests: ${specialRequests}` : ''}${preferredGender !== 'any' ? `\nPreferred Gender: ${preferredGender}` : ''}`,
          paymentMethod,
          therapistId: selectedTherapist || undefined,
        }),
      });
      if (!res.ok) {
        const errJson = (await res.json().catch(() => ({} as Record<string, unknown>))) as Record<string, unknown>;
        const message = typeof errJson.error === "string" ? errJson.error : "Failed to create booking";
        throw new Error(message);
      }
      const json = await res.json();
      const next = json?.next as string | undefined;
      const bookingId = json?.booking?.id || json?.id;
      if (next) {
        router.push(next);
      } else {
        router.push(`/booking-confirmation/${bookingId}`);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to submit booking";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary mx-auto" />
          <p className="text-muted-foreground">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold">Booking Error</h2>
          <p className="text-destructive">{error}</p>
          <Button onClick={() => router.back()} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  if (!pkg) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="my-container py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold gradient-text1 mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground">Just a few more details to secure your wellness experience</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="xl:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Contact Information</h3>
                  <p className="text-sm text-muted-foreground">Your booking details</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </label>
                    <input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Therapist Selection */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Choose Your Therapist</h3>
                  <p className="text-sm text-muted-foreground">Select from our available experts</p>
                </div>
              </div>

              {therapistsLoading ? (
                <div className="text-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Finding available therapists...</p>
                </div>
              ) : therapists.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {therapists.map((therapist) => (
                      <label
                        key={therapist.id}
                        className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                          selectedTherapist === therapist.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border/50 bg-background/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="therapist"
                          value={therapist.id}
                          checked={selectedTherapist === therapist.id}
                          onChange={(e) => setSelectedTherapist(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3 w-full">
                          <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{therapist.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{therapist.rating.toFixed(1)}</span>
                              <span>•</span>
                              <span>{therapist.completedBookings} sessions</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {therapist.specialties.join(", ")}
                            </p>
                          </div>
                          {selectedTherapist === therapist.id && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                  <label className="flex items-center p-4 rounded-xl border-2 border-border/50 bg-background/30 cursor-pointer transition-all hover:shadow-md">
                    <input
                      type="radio"
                      name="therapist"
                      value=""
                      checked={selectedTherapist === ""}
                      onChange={() => setSelectedTherapist("")}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 w-full">
                      <div className="h-12 w-12 bg-muted/20 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">No Preference</h4>
                        <p className="text-sm text-muted-foreground">Let us assign the best available therapist</p>
                      </div>
                      {selectedTherapist === "" && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </label>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No therapists available for this time slot</p>
                  <p className="text-sm">We&#39;ll assign the best available therapist</p>
                </div>
              )}
            </div>

            {/* Preferences */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Preferences & Notes</h3>
                  <p className="text-sm text-muted-foreground">Help us personalize your experience</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Preferred Therapist Gender</label>
                  <div className="flex gap-3">
                    {[
                      { value: "any", label: "No Preference" },
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={option.value}
                          checked={preferredGender === option.value}
                          onChange={(e) => setPreferredGender(e.target.value as "any" | "male" | "female")}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Additional Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                    rows={3}
                    placeholder="Any specific requirements or health conditions we should know about?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Special Requests</label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                    rows={2}
                    placeholder="Room temperature, music preferences, aromatherapy oils, etc."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Payment Method</h3>
                  <p className="text-sm text-muted-foreground">Choose your preferred payment option</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "card" ? 'border-primary bg-primary/5' : 'border-border/50 bg-background/30'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3 w-full">
                    <CreditCard className="h-6 w-6 text-primary" />
                    <div className="flex-1">
                      <h4 className="font-medium">Credit/Debit Card</h4>
                      <p className="text-sm text-muted-foreground">Secure payment via card</p>
                    </div>
                    {paymentMethod === "card" && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                </label>

                <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "bank_transfer" ? 'border-primary bg-primary/5' : 'border-border/50 bg-background/30'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={() => setPaymentMethod("bank_transfer")}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3 w-full">
                    <Building2 className="h-6 w-6 text-primary" />
                    <div className="flex-1">
                      <h4 className="font-medium">Bank Transfer</h4>
                      <p className="text-sm text-muted-foreground">Direct bank transfer</p>
                    </div>
                    {paymentMethod === "bank_transfer" && <CheckCircle className="h-5 w-5 text-primary" />}
                  </div>
                </label>

                {paymentMethod === "bank_transfer" && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-medium mb-1">Bank Transfer Instructions</p>
                        <p>You will receive detailed bank account information after placing your order. Your booking will be confirmed once payment is received.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Booking Summary</h3>
                    <p className="text-sm text-muted-foreground">Review your selection</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl">
                    <h4 className="font-semibold text-lg mb-2">{pkg.name}</h4>
                    {pkg.description && (
                      <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Date</span>
                      </div>
                      <span className="font-medium">{date || "—"}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Time</span>
                      </div>
                      <span className="font-medium">{time || "—"}</span>
                    </div>

                    {pkg.durationInMinutes && (
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Duration</span>
                        </div>
                        <span className="font-medium">{pkg.durationInMinutes} mins</span>
                      </div>
                    )}

                    {selectedTherapist && (
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>Therapist</span>
                        </div>
                        <span className="font-medium">
                          {therapists.find(t => t.id === selectedTherapist)?.name || "Selected"}
                        </span>
                      </div>
                    )}
                  </div>

                  <hr className="border-border/50" />
                  
                  <div className="flex items-center justify-between py-2">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{Number(pkg.price).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <Button 
                    className="w-full py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all" 
                    disabled={isSubmitting || !date || !time || !userName || !userEmail} 
                    onClick={submitBooking}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>Confirm Booking</span>
                      </div>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      By confirming, you agree to our terms and conditions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="my-container py-16">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
