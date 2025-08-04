"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import { Search } from "lucide-react";
import { CURRENCY } from "@/constants/data";

const PackagesPage = () => {
  const [activeCategory, setActiveCategory] = useState("Category 1");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const packages = [
    {
      id: 1,
      name: "The Inner Peace Ritual",
      description:
        "deep head spa therapy, hot oil scalp massage, and aromatherapy for ultimate tranquility.",
      price: "5,000",
      image: "/assets/images/1.jpg",
      category: "Category 1",
    },
    {
      id: 2,
      name: "Deep Oil bath",
      description:
        "deep head spa therapy, hot oil scalp massage, and aromatherapy for ultimate tranquility.",
      price: "8,900",
      image: "/assets/images/2.jpg",
      category: "Category 1",
    },
    {
      id: 3,
      name: "The Inner Peace Ritual",
      description:
        "deep head spa therapy, hot oil scalp massage, and aromatherapy for ultimate tranquility.",
      price: "5,000",
      image: "/assets/images/3.jpg",
      category: "Category 1",
    },
    {
      id: 4,
      name: "Deep Oil bath",
      description:
        "deep head spa therapy, hot oil scalp massage, and aromatherapy for ultimate tranquility.",
      price: "8,900",
      image: "/assets/images/4.jpg",
      category: "Category 1",
    },
    {
      id: 5,
      name: "The Inner Peace Ritual",
      description:
        "deep head spa therapy, hot oil scalp massage, and aromatherapy for ultimate tranquility.",
      price: "5,000",
      image: "/assets/images/5.png",
      category: "Category 1",
    },
    {
      id: 6,
      name: "Deep Oil bath",
      description:
        "deep head spa therapy, hot oil scalp massage, and aromatherapy for ultimate tranquility.",
      price: "8,900",
      image: "/assets/images/6.jpg",
      category: "Category 1",
    },
    {
      id: 7,
      name: "The Inner Peace Ritual",
      description:
        "deep head spa therapy, hot oil scalp massage, and aromatherapy for ultimate tranquility.",
      price: "5,000",
      image: "/assets/images/1.jpg",
      category: "Category 1",
    },
    {
      id: 8,
      name: "Deep Oil bath",
      description:
        "deep head spa therapy, hot oil scalp massage, and aromatherapy for ultimate tranquility.",
      price: "8,900",
      image: "/assets/images/2.jpg",
      category: "Category 1",
    },
    {
      id: 9,
      name: "The Inner Peace Ritual",
      description:
        "deep head spa therapy, hot oil scalp massage, and aromatherapy for ultimate tranquility.",
      price: "5,000",
      image: "/assets/images/3.jpg",
      category: "Category 1",
    },
    {
      id: 10,
      name: "Deep Oil bath",
      description:
        "deep head spa therapy, hot oil scalp massage, and aromatherapy for ultimate tranquility.",
      price: "8,900",
      image: "/assets/images/4.jpg",
      category: "Category 1",
    },
  ];

  const categories = ["Category 1", "Category 2"];
  const packagesPerPage = 10;
  const totalPages = Math.ceil(packages.length / packagesPerPage);

  const filteredPackages = packages.filter((pkg) => {
    const matchesCategory =
      activeCategory === "Category 1" ? true : pkg.category === activeCategory;
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * packagesPerPage,
    currentPage * packagesPerPage
  );

  return (
    <div className="flex flex-col w-full relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute w-full -z-10">
        <Image
          src={"/assets/bg1.png"}
          alt="Background Image"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          priority
        />
        <Image
          src={"/assets/bg2.png"}
          alt="Background Image"
          className="w-full h-full object-cover"
          width={1000}
          height={1080}
          priority
        />
        <Image
          src={"/assets/bg3.png"}
          alt="Background Image"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          priority
        />
      </div>

      {/* Content */}
      <section className="pt-16 lg:pt-20 pb-20">
        <div className="my-container">
          {/* Header */}
          <div className="text-center py-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6">
              Our Packages
            </h1>
            <p className="text-sm lg:text-base max-w-3xl mx-auto leading-relaxed">
              We give our customers a exclusive range of packages to please
              their need as to their liking now let&apos;s have a look on what
              you love the most.
            </p>
          </div>

          {/* Category Tabs and Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
            {/* Category Tabs */}
            <div className="flex space-x-2 w-full sm:w-auto justify-center sm:justify-start">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 sm:flex-none ${
                    activeCategory === category
                      ? "bg-gradient-to-r from-warm-gold to-soft-yellow text-background"
                      : "bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-card border border-border/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-transparent transition-all duration-200 w-full sm:w-64"
              />
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-16">
            {paginatedPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-card/80 backdrop-blur-sm border border-border/20 rounded-2xl overflow-hidden hover:border-border/40 hover:bg-card/90 transition-all duration-300 group shadow-lg"
              >
                <div className="flex flex-col sm:flex-row h-auto sm:h-48">
                  {/* Image */}
                  <div className="w-full sm:w-2/5 h-48 sm:h-full relative flex-shrink-0">
                    <Image
                      src={pkg.image}
                      alt={pkg.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-medium text-foreground mb-2 sm:mb-3 leading-tight">
                        {pkg.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg sm:text-xl font-medium text-warm-gold">
                        {CURRENCY.symbol} {pkg.price}
                      </span>
                      <Button
                        variant="default"
                        size="sm"
                        className="px-4 sm:px-6"
                      >
                        Book now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? "bg-gradient-to-r from-warm-gold to-soft-yellow text-background"
                    : "bg-card text-foreground hover:bg-muted"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackagesPage;
