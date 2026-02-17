"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  specs: string;
  images: string[];
}

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProduct(data);
      } catch {
        setProduct(null);
        toast.error("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleNewFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
  };

  const removeImage = (url: string) => {
    setProduct((prev) =>
      prev ? { ...prev, images: prev.images.filter((img) => img !== url) } : prev
    );
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    if (!product) return;

    if (
      !product.name ||
      !product.description ||
      (!product.images.length && !newFiles.length)
    ) {
      toast.error("Please fill all required fields and add at least one image.");
      return;
    }

    setSaving(true);

    try {
      const filesBase64 = await Promise.all(newFiles.map(toBase64));

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          description: product.description,
          specs: product.specs,
          existingImages: product.images,
          files: filesBase64,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err?.error || "Update failed");
        setSaving(false);
        return;
      }

      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setSaving(false);
      setNewFiles([]);
    }
  };

  if (loading) return <Loader size={60} />;

  if (!product)
    return (
      <div className="p-10 text-center text-[var(--text-secondary)]">
        Product not found
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 md:p-10 bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)]">
      <h1 className="text-2xl sm:text-3xl mb-6 text-[var(--gold)] font-semibold text-center sm:text-left">
        Edit Product
      </h1>

      <div className="space-y-6">
        <input
          type="text"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) =>
            setProduct((prev) => (prev ? { ...prev, name: e.target.value } : prev))
          }
          className="w-full p-3 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--gold)] transition"
        />

        <textarea
          placeholder="Description"
          value={product.description}
          onChange={(e) =>
            setProduct((prev) =>
              prev ? { ...prev, description: e.target.value } : prev
            )
          }
          className="w-full p-3 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--gold)] transition"
          rows={4}
        />

        <textarea
          placeholder="Specifications"
          value={product.specs || ""}
          onChange={(e) =>
            setProduct((prev) =>
              prev ? { ...prev, specs: e.target.value } : prev
            )
          }
          className="w-full p-3 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--gold)] transition"
          rows={4}
        />

        <div>
          <p className="mb-2 text-sm text-gray-400">Existing Images</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {product.images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt="Product"
                  className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(img)}
                  className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-400">
            Add New Images
          </label>
          <input
            type="file"
            multiple
            onChange={handleNewFiles}
            className="text-sm w-full"
          />
          {uploading && (
            <p className="text-sm text-gray-400 mt-2">
              Uploading images...
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
            {newFiles.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt="New"
                  className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeNewFile(index)}
                  className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={saving || uploading}
          className="w-full md:w-auto border border-[var(--gold)] text-[var(--gold)] px-6 py-3 rounded-lg hover:bg-[var(--gold)] hover:text-black transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? <Loader size={20} /> : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
