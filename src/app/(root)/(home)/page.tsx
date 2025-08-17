import HeroSection from "./HeroSection";
import Image from "next/image";
import SecanderySection from "./SecanderySection";
import PackagesSection from "./PackagesSection";
import VideoSection from "./VideoSection";
import GallerySection from "./GallerySection";
import ReviewsSections from "./ReviewsSections";
import FAQSection from "./FAQSection";
import ContactSection from "./ContactSection";

async function HomePage() {
  // Fetch packages server-side and map to PackagesSection props shape
  type UIPackage = { id: string; name: string; description: string; price: number; duration?: number; image?: string | null; category?: { slug: string; name?: string; parent?: { slug: string; name?: string } | null } | null };
  type UICategory = { id: string; name: string; slug: string };
  type HomeService = { id: string; title: string; description: string; price: string; duration: string; image: string; imageAlt: string; category: string };
  let data: Array<{ id: string; label: string; services: HomeService[] }> = [];

  try {
    const res = await fetch('/api/packages', { cache: 'no-store' });
    const json = await res.json();
    const list: UIPackage[] = Array.isArray(json?.packages) ? json.packages : [];
    const categories: UICategory[] = Array.isArray(json?.categories) ? json.categories : [];

    // Choose main tabs: prefer 'head-spa' and 'beauty' if present
    const preferred = ['head-spa', 'beauty'];
    const preferredCats = preferred
      .map((slug) => categories.find((c) => c.slug === slug))
      .filter((c): c is UICategory => Boolean(c));
    const extras = categories.filter(
      (c) => !preferredCats.some((p) => p.slug === c.slug)
    );
    const main = [...preferredCats, ...extras].slice(0, 2);
    data = main.map((c) => ({ id: c.slug, label: c.name, services: [] }));

    const mapToService = (p: UIPackage, cat: string): HomeService => ({
      id: p.id,
      title: p.name,
      description: p.description,
      price: String(p.price.toLocaleString('en-IN')),
      duration: typeof p.duration === 'number' ? `${p.duration} Minutes` : '60 Minutes',
      image: p.image || '/assets/images/1.jpg',
      imageAlt: p.name,
      category: cat,
    });
    for (const p of list) {
      const catSlug = p.category?.parent?.slug || p.category?.slug;
      if (!catSlug) continue;
      const idx = data.findIndex(d => d.id === catSlug);
      if (idx !== -1) data[idx].services.push(mapToService(p, catSlug));
    }

    // Fallback: if no categories or no services were populated, derive categories from packages
    const allServicesCount = data.reduce((sum, c) => sum + c.services.length, 0);
    if (data.length === 0 || allServicesCount === 0) {
      const buckets = new Map<string, { id: string; label: string; services: HomeService[] }>();
      for (const p of list) {
        const slug = p.category?.parent?.slug || p.category?.slug;
        if (!slug) continue;
        const label = p.category?.parent?.name || p.category?.name || slug;
        if (!buckets.has(slug)) buckets.set(slug, { id: slug, label, services: [] });
        buckets.get(slug)!.services.push(mapToService(p, slug));
      }
      const ordered = [
        ...preferred
          .map((slug) => buckets.get(slug))
          .filter((b): b is { id: string; label: string; services: HomeService[] } => Boolean(b)),
        ...Array.from(buckets.values()).filter(
          (b) => !preferred.includes(b.id)
        ),
      ];
      data = ordered.slice(0, 2);
    }
  } catch {
    // keep empty data on failure
  }

  return (
    <div className="flex flex-col w-full relative overflow-hidden">
      {/* Background Image - Always at the bottom */}
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

      {/* Content sections */}
      <HeroSection />

      <SecanderySection />

      <PackagesSection data={data} />

      <VideoSection />

      <GallerySection />

      <ReviewsSections />

      <FAQSection />

      <ContactSection />
    </div>
  );
}

export default HomePage;
