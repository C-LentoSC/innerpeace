"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import UserNav from "@/components/UserNav";
import { useSession } from "next-auth/react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Gallery", href: "/gallery" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Packages", href: "/packages" },
    ...(session ? [{ label: "Dashboard", href: "/dashboard" }] : []),
  ];

  return (
    <header
      className={`w-full fixed top-0 z-50 transition-all ${
        isMenuOpen ? "bg-background/80 backdrop-blur-lg" : ""
      } ${isScrolled ? "bg-background/50 backdrop-blur-lg" : ""}`}
    >
      <div className="my-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-foreground hover:text-warm-gold transition-colors duration-200 font-medium text-lg relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-warm-gold transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* CTA Section - Desktop */}
          <div className="hidden lg:flex items-center">
            <UserNav />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-foreground hover:text-warm-gold transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100 py-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground hover:text-warm-gold transition-colors duration-200 font-medium text-lg py-2 px-4 hover:bg-card rounded-md"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border/20">
              <div className="px-4">
                <UserNav />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
