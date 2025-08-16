import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, MessageCircle } from "lucide-react";
import { FOOTER_DATA } from "@/constants/data";

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
                  {FOOTER_DATA.tagline.line1}
                </h3>
                <h3 className="text-2xl md:text-3xl font-medium text-foreground leading-tight">
                  {FOOTER_DATA.tagline.line2}
                </h3>
              </div>
            </div>

            {/* Main Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-medium text-foreground">
                {FOOTER_DATA.sections.main.title}
              </h4>
              <ul className="space-y-3">
                {FOOTER_DATA.sections.main.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-warm-gold transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pages Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-medium text-foreground">
                {FOOTER_DATA.sections.pages.title}
              </h4>
              {(() => {
                // Use app's actual routes to avoid 404s
                const pageLinks = [
                  { label: 'Login', href: '/signin' },
                  { label: 'Bookings', href: '/account/bookings' },
                  { label: 'Create Account', href: '/signup' },
                  { label: 'Questions', href: '/contact' }, // No /questions route; point to Contact
                ];
                return (
                  <ul className="space-y-3">
                    {pageLinks.map((link, index) => (
                      <li key={index}>
                        <Link
                          href={link.href}
                          className="text-muted-foreground hover:text-warm-gold transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-medium text-foreground">
                {FOOTER_DATA.sections.socials.title}
              </h4>
              <ul className="space-y-4">
                {FOOTER_DATA.sections.socials.links.map((link, index) => {
                  // Get the appropriate icon for each social platform
                  const getIcon = (label: string) => {
                    switch (label.toLowerCase()) {
                      case 'facebook':
                        return <Facebook size={20} />;
                      case 'instagram':
                        return <Instagram size={20} />;
                      case 'whatsapp':
                        return <MessageCircle size={20} />;
                      default:
                        return null;
                    }
                  };

                  return (
                    <li key={index}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-muted-foreground hover:text-warm-gold transition-all duration-200 group"
                        >
                          <span className="p-2 rounded-full bg-warm-gold/10 group-hover:bg-warm-gold/20 transition-colors duration-200">
                            {getIcon(link.label)}
                          </span>
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.label}
                          </span>
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="flex items-center gap-3 text-muted-foreground hover:text-warm-gold transition-all duration-200 group"
                        >
                          <span className="p-2 rounded-full bg-warm-gold/10 group-hover:bg-warm-gold/20 transition-colors duration-200">
                            {getIcon(link.label)}
                          </span>
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.label}
                          </span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-16 pt-8 border-t border-warm-gold/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Designed and Developed by{" "}
                <span className="text-warm-gold font-medium">
                  {FOOTER_DATA.footer.companyCredit}
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
