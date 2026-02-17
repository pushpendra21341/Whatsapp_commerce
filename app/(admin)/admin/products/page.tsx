"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  specs: string;
  images: string[];
}

interface ProductsResponse {
  products: Product[];
  totalPages: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [sortField, setSortField] = useState<"id" | "name">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/products?admin=true&page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(
          search
        )}`
      );

      if (!res.ok) throw new Error();

      const data: ProductsResponse = await res.json();

      setProducts(data.products);
      setFilteredProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search]);

  useEffect(() => {
    let filtered = [...products];

    filtered.sort((a, b) => {
      const aValue = sortField === "id" ? a.id : a.name.toLowerCase();
      const bValue = sortField === "id" ? b.id : b.name.toLowerCase();

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredProducts(filtered);
  }, [sortField, sortOrder, products]);

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const matches = products
      .filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 5);

    setSuggestions(matches);
  }, [search, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Delete failed");
        return;
      }

      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Delete failed");
    }
  };

  if (loading) return <Loader size={60} />;

  const currentProducts = filteredProducts;

  return (
    <div className="max-w-7xl mx-auto bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-[var(--shadow)] p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--gold)]">
          Manage Products
        </h1>
        <span className="text-sm text-[var(--text-muted)]">
          Total: {filteredProducts.length}
        </span>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
        <div className="relative w-full md:w-1/2" ref={searchRef}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--text-primary)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg mt-1 shadow-lg max-h-60 overflow-auto">
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setSearch(product.name);
                    setCurrentPage(1);
                    setShowSuggestions(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-[var(--gold)] hover:text-black text-[var(--text-primary)] transition"
                >
                  {product.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as "id" | "name")}
            className="border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text-primary)] bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
          >
            <option value="id">Sort by ID</option>
            <option value="name">Sort by Name</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="border border-[var(--gold)] px-4 py-2 rounded-lg text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition"
          >
            {sortOrder === "asc" ? "Asc" : "Desc"}
          </button>
        </div>
      </div>

      {currentProducts.length === 0 ? (
        <p className="text-[var(--text-muted)] text-center py-6">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 flex flex-col justify-between"
            >
              <div>
                <h2 className="font-semibold text-[var(--text-primary)] text-lg mb-1 line-clamp-2">
                  {product.name}
                </h2>
                <p className="text-[var(--text-muted)] text-sm line-clamp-3 mb-2">
                  {product.description}
                </p>
                <p className="text-[var(--text-muted)] text-xs mb-2">
                  ID: {product.id}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <button
                  onClick={() =>
                    router.push(`/admin/products/${product.id}`)
                  }
                  className="w-full sm:w-auto border border-[var(--gold)] text-[var(--gold)] px-3 py-1 rounded-lg hover:bg-[var(--gold)] hover:text-black transition text-center"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="w-full sm:w-auto border border-red-600 text-red-500 px-3 py-1 rounded-lg hover:bg-red-600 hover:text-white transition text-center"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-6">
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            disabled={currentPage === 1}
            className="px-4 py-2 border border-[var(--gold)] rounded-lg text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>

          <span className="text-[var(--text-muted)] mt-1 sm:mt-0">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages)
              )
            }
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