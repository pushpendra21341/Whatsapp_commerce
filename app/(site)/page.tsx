import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/ProductGrid";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  // Fetch only the latest 8 products for the homepage
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <main className="bg-[var(--bg)] text-[var(--text-primary)]">
      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[60vh] sm:h-[65vh] md:h-[55vh] flex items-center">
        {/* Background Image */}
        <Image
          src="/hero.png"
          alt="Premium Security Systems"
          fill
          priority
          className="object-cover object-[30%_5%]" // <-- change object position
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero Content */}
        <div className="relative z-10 px-6 sm:px-10 md:px-16 max-w-2xl text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-snug mb-6">
            Premium <br /> Security Essentials
          </h1>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-8">
            Explore high-quality surveillance and security solutions built for
            reliability and performance.
          </p>

          <Link
            href="/products"
            className="
              inline-block
              border border-[var(--gold)]
              px-6 sm:px-8 py-2 sm:py-3
              text-[var(--gold)]
              hover:bg-[var(--gold)]
              hover:text-black
              transition duration-300
              rounded-lg
            "
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* ================= PRODUCTS SECTION ================= */}
      <section
        id="products"
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16"
      >
        <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-serif text-center mb-12 text-[var(--gold)]">
          Top Products
        </h2>

        {products.length > 0 ? (
          <>
            <ProductGrid products={products} />

            {/* View All Products */}
            <div className="text-center mt-8">
              <Link
                href="/products"
                className="
                  inline-block
                  border border-[var(--gold)]
                  px-6 sm:px-8 py-2 sm:py-3
                  text-[var(--gold)]
                  hover:bg-[var(--gold)]
                  hover:text-black
                  transition duration-300
                  rounded-lg
                "
              >
                View All Products
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-[var(--text-muted)]">
            No products available right now.
          </p>
        )}
      </section>
    </main>
  );
}
