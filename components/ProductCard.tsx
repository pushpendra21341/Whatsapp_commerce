"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Props {
  id: number;
  name: string;
  description: string;
  image: string;
}

export default function ProductCard({ id, name, description, image }: Props) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="
        bg-[var(--card-bg)]
        border border-[var(--card-border)]
        rounded-xl overflow-hidden
        hover:border-[var(--gold)]
        shadow-lg hover:shadow-xl
        transition
        m-4
        flex flex-col
      "
    >
      {/* Image Section */}
      <div className="relative w-full h-60 flex-shrink-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Product Name (clamped to 2 lines to maintain uniformity) */}
        <h2 className="text-xl font-semibold mb-2 text-[var(--text-primary)] line-clamp-2">
          {name}
        </h2>

        {/* Description (clamped to 3 lines) */}
        <p className="text-[var(--text-muted)] text-sm mb-4 line-clamp-3">
          {description}
        </p>

        {/* Button always at bottom */}
        <div className="mt-auto">
          <Link
            href={`/product/${id}`}
            className="
              inline-block
              border border-[var(--gold)]
              px-5 py-2 text-sm
              text-[var(--gold)]
              hover:bg-[var(--gold)]
              hover:text-black
              transition
            "
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
