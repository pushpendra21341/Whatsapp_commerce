"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";

export default function ProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [specs, setSpecs] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleUpload = async () => {
    if (!name || !description || images.length === 0) {
      toast.error("Please fill all required fields and add at least one image.");
      return;
    }

    setUploading(true);

    try {
      const base64Files = await Promise.all(images.map(toBase64));

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: base64Files }),
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || !uploadData.urls) {
        toast.error("Image upload failed");
        setUploading(false);
        return;
      }

      const productRes = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          specs,
          images: uploadData.urls,
        }),
      });

      if (!productRes.ok) {
        const err = await productRes.json();
        toast.error(err?.error || "Failed to create product");
        setUploading(false);
        return;
      }

      toast.success("Product added successfully!");

      // Reset form
      setName("");
      setDescription("");
      setSpecs("");
      setImages([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while uploading images");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 rounded-xl shadow-[var(--shadow)]">
      <h2 className="text-2xl sm:text-3xl font-heading text-[var(--gold)] mb-6 text-center sm:text-left">
        Add Product
      </h2>

      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] transition"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] transition"
      />

      <textarea
        placeholder="Specifications"
        value={specs}
        onChange={(e) => setSpecs(e.target.value)}
        rows={4}
        className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-3 rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] transition"
      />

      <div className="mb-6">
        <label className="block mb-2 text-[var(--text-muted)]">
          Product Images
        </label>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(Array.from(e.target.files || []))}
          className="w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-2 rounded-lg text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-[var(--gold)] file:text-black file:rounded-lg"
        />

        {images.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative w-24 h-24 rounded-lg overflow-hidden border border-[var(--card-border)]"
              >
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full border border-[var(--gold)] text-[var(--gold)] py-3 rounded-lg hover:bg-[var(--gold)] hover:text-black transition font-semibold disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Add Product"}
      </button>
    </div>
  );
}