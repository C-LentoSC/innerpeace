"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import { Search, Clock } from "lucide-react";
import { CURRENCY } from "@/constants/data";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BookingModal from "@/components/BookingModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const PackagesPage = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const packageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Use category slug for accuracy; only main categories (head-spa, beauty)
  const [activeCategory, setActiveCategory] = useState<string>('head-spa');
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  type UIPackage = { id: string; name: string; description: string; price: number; duration?: number; isActive?: boolean; status?: string; image?: string | null; categoryId?: string | null; category?: { id: string; name: string; slug: string; parent?: { id: string; name: string; slug: string } | null } | null };
  type UICategory = { id: string; name: string; slug: string; color?: string | null; packagesCount?: number };
  const [packagesData, setPackagesData] = useState<UIPackage[]>([]);
  const [categoriesData, setCategoriesData] = useState<UICategory[]>([]);
  // Subcategory list for the selected main category (fetched dynamically)
  const [subcategories, setSubcategories] = useState<UICategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(titleRef.current, {
        y: 80,
        opacity: 0,
      });

      gsap.set(descriptionRef.current, {
        y: 60,
        opacity: 0,
      });

      gsap.set(controlsRef.current, {
        y: 60,
        opacity: 0,
      });

      gsap.set(gridRef.current, {
        y: 80,
        opacity: 0,
      });

      gsap.set(paginationRef.current, {
        y: 40,
        opacity: 0,
      });

      // Create main timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate elements in sequence
      tl.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      })
        .to(
          descriptionRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          controlsRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.2"
        )
        .to(
          gridRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          paginationRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.2"
        );

      // Animate package cards with stagger
      packageRefs.current.forEach((ref, index) => {
        if (ref) {
          gsap.set(ref, {
            y: 100,
            opacity: 0,
          });

          gsap.to(ref, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.2)",
            delay: index * 0.1,
            scrollTrigger: {
              trigger: ref,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Load packages from API
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/packages", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load packages");
        const json = await res.json();
        console.log("/api/packages response:", json);
        const list = Array.isArray(json?.packages)
          ? json.packages
          : Array.isArray(json)
          ? json
          : [];
        const cats = Array.isArray(json?.categories) ? json.categories : [];
        console.log("parsed packages list length:", list.length, "categories:", cats.length);
        if (isMounted) {
          setPackagesData(list);
          setCategoriesData(cats);
        }
      } catch (e: unknown) {
        if (isMounted) {
          if (e instanceof Error) {
            setError(e.message);
          } else {
            setError("An unknown error occurred");
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Build tabs using category slugs; only show Head SPA and Beauty as requested
  const orderedCategories = React.useMemo(() => {
    const allowed = ['head-spa', 'beauty'];
    return categoriesData.filter(c => allowed.includes(c.slug));
  }, [categoriesData]);

  const categoryTabs: { label: string; slug: string }[] = React.useMemo(
    () => orderedCategories.map(c => ({ label: c.name, slug: c.slug })),
    [orderedCategories]
  );
  const packagesPerPage = 10;
  
  // Fetch subcategories when a main category tab is active
  useEffect(() => {
    const controller = new AbortController();
    async function loadSubs() {
      try {
        const res = await fetch(`/api/categories/${activeCategory}/subcategories`, { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to load subcategories');
        const subs: UICategory[] = await res.json();
        setSubcategories(subs);
        setSelectedSubcategory('all');
      } catch {
        if (!controller.signal.aborted) setSubcategories([]);
      }
    }
    loadSubs();
    return () => controller.abort();
  }, [activeCategory]);

  // Filter packages based on main category (by parent.slug) and optional subcategory, plus search
  const filteredPackages = packagesData.filter((pkg) => {
    const matchesCategory = pkg.category?.parent?.slug === activeCategory;
    const matchesSubcategory = selectedSubcategory === 'all'
      ? true
      : pkg.category?.slug === selectedSubcategory;
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSubcategory && matchesSearch;
  });
  
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage) || 1;
  
  

  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * packagesPerPage,
    currentPage * packagesPerPage
  );

  return (
    <div
      ref={sectionRef}
      className="flex flex-col w-full relative overflow-hidden"
    >
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
          <div ref={headerRef} className="text-center py-20">
            <h1
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6"
            >
              Our Packages
            </h1>
            <p
              ref={descriptionRef}
              className="text-sm lg:text-base max-w-3xl mx-auto leading-relaxed"
            >
              We give our customers a exclusive range of packages to please
              their need as to their liking now let&apos;s have a look on what
              you love the most.
            </p>
          </div>

          {/* Category Tabs and Search */}
          <div
            ref={controlsRef}
            className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6"
          >
            {/* Category Tabs */}
            <div className="flex space-x-2 w-full sm:w-auto justify-center sm:justify-start">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.slug}
                  onClick={() => {
                    setActiveCategory(tab.slug);
                    setSelectedSubcategory('all');
                    setCurrentPage(1); // Reset to first page when changing category
                  }}
                  className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 sm:flex-none ${
                    activeCategory === tab.slug
                      ? "bg-gradient-to-r from-warm-gold to-soft-yellow text-background"
                      : "bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Subcategory chips (dynamic) */}
            {activeCategory && (
              <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-start">
                <button
                  key="all"
                  onClick={() => { setSelectedSubcategory('all'); setCurrentPage(1); }}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    selectedSubcategory === 'all' ? 'bg-gradient-to-r from-warm-gold to-soft-yellow text-background' : 'bg-card text-foreground hover:bg-muted'
                  }`}
                >
                  All
                </button>
                {subcategories.map((sub) => (
                  <button
                    key={sub.slug}
                    onClick={() => { setSelectedSubcategory(sub.slug); setCurrentPage(1); }}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      selectedSubcategory === sub.slug ? 'bg-gradient-to-r from-warm-gold to-soft-yellow text-background' : 'bg-card text-foreground hover:bg-muted'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}

            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="pl-10 pr-4 py-2 bg-card border border-border/20 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-transparent transition-all duration-200 w-full sm:w-64"
              />
            </div>
          </div>

          {/* Packages Grid - header count removed per request */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-16"
          >
            {loading && (
              <div className="text-center py-10 text-muted-foreground">Loading packages...</div>
            )}
            {!loading && error && (
              <div className="text-center py-10 text-destructive">{error}</div>
            )}
            {!loading && !error && paginatedPackages.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">No packages found.</div>
            )}
            {!loading && !error && paginatedPackages.length > 0 &&
              paginatedPackages.map((pkg, index) => (
                <div
                  key={pkg.id}
                  ref={(el) => {
                    packageRefs.current[index] = el;
                  }}
                  className="bg-card/80 backdrop-blur-sm border border-border/20 rounded-2xl overflow-hidden hover:border-border/40 hover:bg-card/90 transition-all duration-300 group shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row h-auto items-stretch">
                    {/* Image */}
                    <div className="w-full sm:w-2/5 relative flex-shrink-0 min-h-[12rem]">
                      <Image
                        src={pkg.image || "/assets/images/1.jpg"}
                        alt={pkg.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 sm:p-6 pb-8 flex flex-col justify-between gap-2">
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
                          {CURRENCY.symbol} {Number(pkg.price).toLocaleString("en-IN")}
                        </span>
                        <Button
                          variant="default"
                          size="sm"
                          className="px-4 sm:px-6"
                          onClick={() => {
                            if (status === "authenticated") {
                              setSelectedPackageId(pkg.id);
                              setShowBooking(true);
                            } else {
                              const params = new URLSearchParams({ callbackUrl: window.location.href });
                              router.push(`/signin?${params.toString()}`);
                            }
                          }}
                        >
                          Book now
                        </Button>
                      </div>
                      {/* Duration row */}
                      {typeof pkg.duration === 'number' && (
                        <div className="mt-2 flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {pkg.duration} min
                        </div>
                      )}
                      {/* Badges row */}
                      <div className="flex items-center gap-2 mt-3">
                        {pkg.category?.name && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800/60 text-amber-200">
                            {pkg.category.name}
                          </span>
                        )}
                        {pkg.status && pkg.status.toLowerCase() !== 'active' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-200 text-black">
                            {pkg.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination */}
          <div
            ref={paginationRef}
            className="flex justify-center items-center space-x-2"
          >
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

          {/* Booking Modal */}
          {showBooking && selectedPackageId != null && (
            <BookingModal
              packageId={selectedPackageId}
              open={showBooking}
              onClose={() => setShowBooking(false)}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default PackagesPage;
