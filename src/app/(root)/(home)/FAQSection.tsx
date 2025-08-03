"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(2); // Third item open by default (What is Menique)

  const faqs = [
    {
      id: 1,
      question: "Do We Need To Take Long Hour Treatments",
      answer:
        "Our treatment durations are designed to provide optimal results while respecting your schedule. Most of our signature treatments range from 60 to 120 minutes, but we also offer express sessions for those with limited time. The duration depends on the specific treatment and your personal needs. We recommend discussing your preferences during consultation to create the perfect experience for you.",
    },
    {
      id: 2,
      question: "Different Between Hard and Soft Gel",
      answer:
        "Hard gel and soft gel treatments offer different benefits for your wellness journey. Hard gel treatments provide deeper, more intensive therapy that's ideal for chronic tension and muscle knots, offering long-lasting relief. Soft gel treatments are gentler, perfect for sensitive skin and relaxation-focused sessions. Our expert therapists will recommend the best option based on your skin type, comfort level, and therapeutic goals.",
    },
    {
      id: 3,
      question: "What is Menique",
      answer:
        "Indulge your hands in a rejuvenating spa manicure, where beauty meets care. This luxurious treatment begins with a soothing hand soak in warm, aromatic water to soften the skin, followed by gentle exfoliation to remove dullness and reveal a radiant glow. Nails are expertly shaped, cuticles are nourished and tidied, and hands are massaged with rich, hydrating creams to relieve tension and restore suppleness. Finished with your choice of premium polish or a natural buffed shine, this manicure leaves your hands looking flawless and feeling pampered.",
    },
    {
      id: 4,
      question: "How Long Do Results Last",
      answer:
        "The longevity of our treatment results varies depending on the service and your individual needs. Massage therapy benefits typically last 3-7 days, while our specialized Japanese head massage effects can be felt for up to two weeks. Facial treatments show immediate results with lasting benefits for 4-6 weeks. For optimal results, we recommend regular maintenance sessions based on your personalized treatment plan.",
    },
    {
      id: 5,
      question: "Are Your Products Natural and Safe",
      answer:
        "We pride ourselves on using only the finest natural and organic products sourced from trusted suppliers. Our essential oils, creams, and treatment products are free from harmful chemicals and synthetic additives. All products are dermatologically tested and safe for sensitive skin. We maintain the highest safety standards and can provide detailed ingredient lists for clients with specific allergies or sensitivities.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative">
      <div className="my-container py-20">
        <div className="flex flex-col">
          {/* Background with paper texture */}
          <div className="relative bg-gradient-to-br from-forest-green/20 via-warm-gold/10 to-sage-green/15 rounded-md p-8 md:p-12 overflow-hidden backdrop-blur-sm">
            {/* Paper texture background */}
            <div className="absolute inset-0 opacity-30">
              <Image
                src="/assets/paper-texture3.jpg"
                alt="Paper texture background"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Gradient overlay */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-transparent to-background/60 pointer-events-none"></div> */}

            {/* Content */}
            <div className="relative z-10">
              {/* Title */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-4">
                  Have Any Questions
                </h2>
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className="bg-background/50 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300  shadow-2xl"
                  >
                    {/* Question Header */}
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-5 lg:py-8 flex items-center justify-between text-left hover:bg-warm-gold/5 transition-all duration-200"
                      aria-expanded={openIndex === index}
                      aria-controls={`faq-answer-${faq.id}`}
                    >
                      <span className="text-foreground font-medium text-lg md:text-xl pr-4">
                        {faq.question}
                      </span>
                      <div className="flex-shrink-0 w-6 h-6 text-warm-gold transition-transform duration-200">
                        {openIndex === index ? (
                          <Minus className="w-full h-full" />
                        ) : (
                          <Plus className="w-full h-full" />
                        )}
                      </div>
                    </button>

                    {/* Answer Content */}
                    <div
                      id={`faq-answer-${faq.id}`}
                      className={`transition-all duration-300 ease-in-out ${
                        openIndex === index
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      } overflow-hidden`}
                    >
                      <div className="px-6 pb-6">
                        <div className="pt-2 border-t border-warm-gold/10">
                          <p className="text-muted-foreground leading-relaxed text-sm md:text-base mt-4">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative elements */}
            {/* <div className="absolute top-6 left-6 w-2 h-2 bg-warm-gold rounded-full opacity-30"></div>
            <div className="absolute top-8 right-12 w-1 h-1 bg-sage-green rounded-full opacity-40"></div>
            <div className="absolute bottom-10 left-8 w-1.5 h-1.5 bg-soft-yellow rounded-full opacity-25"></div>
            <div className="absolute bottom-6 right-6 w-1 h-1 bg-warm-gold rounded-full opacity-35"></div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
