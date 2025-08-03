import Image from "next/image";
import Link from "next/link";
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
              <ul className="space-y-3">
                {FOOTER_DATA.sections.pages.links.map((link, index) => (
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

            {/* Social Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-medium text-foreground">
                {FOOTER_DATA.sections.socials.title}
              </h4>
              <ul className="space-y-3">
                {FOOTER_DATA.sections.socials.links.map((link, index) => (
                  <li key={index}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-warm-gold transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-warm-gold transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
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
