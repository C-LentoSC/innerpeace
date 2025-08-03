import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-background via-dark-forest to-background border-t border-warm-gold/20">
      {/* Paper texture background */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/assets/paper-texture.jpg"
          alt="Paper texture background"
          fill
          className="object-cover"
          priority={false}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-green/10 via-transparent to-warm-gold/5 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="my-container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Logo & Tagline Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center">
                <Link href="/" className="">
                  <Image
                    src="/assets/white-logo.svg"
                    alt="InnerPeace Logo"
                    width={150}
                    height={150}
                    className="w-full h-full object-contain object-center"
                  />
                </Link>
              </div>

              {/* Tagline */}
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-medium text-foreground leading-tight">
                  Where Tranquility
                </h3>
                <h3 className="text-2xl md:text-3xl font-medium text-foreground leading-tight">
                  Meets Elegance
                </h3>
              </div>
            </div>

            {/* Main Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-medium text-foreground">Main</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-warm-gold transition-colors duration-200"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-warm-gold transition-colors duration-200"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="text-muted-foreground hover:text-warm-gold transition-colors duration-200"
                  >
                    Gallery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Pages Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-medium text-foreground">Pages</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-warm-gold transition-colors duration-200"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bookings"
                    className="text-muted-foreground hover:text-warm-gold transition-colors duration-200"
                  >
                    Bookings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/create-account"
                    className="text-muted-foreground hover:text-warm-gold transition-colors duration-200"
                  >
                    Create Account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/questions"
                    className="text-muted-foreground hover:text-warm-gold transition-colors duration-200"
                  >
                    Questions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-medium text-foreground">Socials</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-warm-gold transition-colors duration-200"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-warm-gold transition-colors duration-200"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-warm-gold transition-colors duration-200"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-16 pt-8 border-t border-warm-gold/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Designed and Developed by{" "}
                <span className="text-warm-gold font-medium">
                  C - Lento Software Solutions
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
