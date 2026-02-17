"use client";

import { useEffect, useState, useRef } from "react";
import ProductGrid from "@/components/ProductGrid";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  specs: string;
  images: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 12;
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async (page = 1, query = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/products?search=${encodeURIComponent(query)}&page=${page}&limit=${itemsPerPage}&sort=${sortOrder}`
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (query: string) => {
    if (!query) return setSuggestions([]);

    try {
      const res = await fetch(
        `/api/products?search=${encodeURIComponent(query)}&limit=5`
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      const names = data.products?.map((p: Product) => p.name) || [];
      setSuggestions(names);
    } catch (error) {
      console.error("Failed to fetch suggestions", error);
      toast.error("Failed to fetch suggestions");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sortOrder]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts(1, search);
      fetchSuggestions(search);
      setShowSuggestions(search.length > 0 && suggestions.length > 0);
    }, 300);
    return () => clearTimeout(handler);
  }, [search, sortOrder]);

  const handleSelectSuggestion = (name: string) => {
    setSearch(name);
    setShowSuggestions(false);
    fetchProducts(1, name);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Loader size={60} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-serif text-[var(--gold)] mb-8 text-center">
        Our Products
      </h1>

      {/* Search + Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center relative">
        {/* Search Input */}
        <div className="w-full md:w-1/2 relative">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="
              w-full
              border border-[var(--border)]
              rounded-lg
              px-4 py-2
              text-[var(--text-primary)]
              bg-[var(--bg)]
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--gold)]
              transition
            "
          />

          {/* Autocomplete */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-50 w-full bg-[var(--bg)] border border-[var(--border)] mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((s) => (
                <li
                  key={s}
                  onClick={() => handleSelectSuggestion(s)}
                  className="px-4 py-2 hover:bg-[var(--gold)] hover:text-black cursor-pointer transition"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sort Toggle */}
        <button
          onClick={() =>
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          }
          className="
            border border-[var(--gold)]
            px-4 py-2
            rounded-lg
            text-[var(--gold)]
            hover:bg-[var(--gold)]
            hover:text-black
            transition
          "
        >
          {sortOrder === "asc" ? "A → Z" : "Z → A"}
        </button>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <p className="text-center text-[var(--text-muted)]">
          No products found.
        </p>
      ) : (
        <ProductGrid products={products} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center mt-6 gap-2 items-center">
          <button
            onClick={() => fetchProducts(currentPage - 1, search)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-[var(--gold)] rounded-lg text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <span className="text-[var(--text-muted)]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => fetchProducts(currentPage + 1, search)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-[var(--gold)] rounded-lg text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}