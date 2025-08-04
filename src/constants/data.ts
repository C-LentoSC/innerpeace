export const CONTACT_DETAILS = {
  phone: "+1 (555) 123-4567",
  email: "info@innerpeace.com",
  address: "123 Serenity St, Tranquil City, CA 90210",
};

export const FOOTER_DATA = {
  tagline: {
    line1: "Where Tranquility",
    line2: "Meets Elegance",
  },
  sections: {
    main: {
      title: "Main",
      links: [
        { label: "Home", href: "/" },
        { label: "Contact Us", href: "/contact" },
        { label: "Gallery", href: "/gallery" },
      ],
    },
    pages: {
      title: "Pages",
      links: [
        { label: "Login", href: "/login" },
        { label: "Bookings", href: "/bookings" },
        { label: "Create Account", href: "/create-account" },
        { label: "Questions", href: "/questions" },
      ],
    },
    socials: {
      title: "Socials",
      links: [
        { label: "Facebook", href: "https://facebook.com", external: true },
        { label: "WhatsApp", href: "https://wa.me/", external: true },
        { label: "Instagram", href: "https://instagram.com", external: true },
      ],
    },
  },
  footer: {
    companyCredit: "C - Lento Software Solutions",
  },
};

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

export const CURRENCY = {
  symbol: "$",
  code: "AUD",
  name: "Australian Dollar",
};
