"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Share2 } from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  specs?: string;
  images: string[];
}

interface Props {
  product?: Product;
  whatsappNumber: string;
}

export default function ProductDetailsClient({
  product,
  whatsappNumber,
}: Props) {
  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0] || ""
  );

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-16 text-center text-[var(--text-muted)] bg-[var(--bg)]">
        Product not found
      </div>
    );
  }

  const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const productUrl = `${BASE_URL}/products/${product.id}`;

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi, I am interested in the product "${product.name}". Check it here: ${productUrl}`
  )}`;

  const specsList = product.specs
    ? product.specs
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line)
    : [];

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: productUrl,
        });
      } else {
        await navigator.clipboard.writeText(productUrl);
        toast.success("Link copied to clipboard");
      }
    } catch (err) {
      console.error("Share failed:", err);
      toast.error("Unable to share");
    }
  };

  return (
    <motion.section
      className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 bg-[var(--bg)] text-[var(--text-primary)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Share Button */}
      <button
        onClick={handleShare}
        className="absolute top-6 right-6 border border-[var(--card-border)] bg-[var(--surface)] p-2 rounded-full hover:border-[var(--gold)] transition"
        aria-label="Share product"
      >
        <Share2 className="w-5 h-5 text-[var(--text-primary)]" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Left: Images */}
        <div>
          <div className="relative w-full aspect-[6/2] sm:aspect-[4/3] md:h-[500px] rounded-2xl overflow-hidden border border-[var(--card-border)]">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
            {product.images.map((img, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`flex-shrink-0 relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden cursor-pointer border transition ${
                  selectedImage === img
                    ? "border-[var(--gold)]"
                    : "border-[var(--card-border)]"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col justify-between mt-8 md:mt-0">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-6">
              {product.name}
            </h1>

            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-[var(--gold)] mb-2">
                Description
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed text-justify">
                {product.description}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-[var(--gold)] mb-2">
                Specifications
              </h2>
              {specsList.length > 0 ? (
                <ul className="list-disc list-inside text-[var(--text-secondary)] leading-relaxed space-y-1">
                  {specsList.map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-[var(--text-secondary)]">
                  No specifications available
                </p>
              )}
            </div>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-6 sm:mt-8
              border border-[var(--gold)]
              text-[var(--gold)]
              px-6 py-3
              text-center
              hover:bg-[var(--gold)]
              hover:text-black
              transition
              rounded-xl
              font-semibold
              w-full md:w-auto
            "
          >
            Connect on WhatsApp
          </a>
        </div>
      </div>
    </motion.section>
  );
}