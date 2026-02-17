"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* Fetch current setting */
  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        if (!res.ok) throw new Error();

        const data = await res.json();
        const waSetting = data.find((s: any) => s.key === "whatsapp_number");
        if (waSetting) setWhatsapp(waSetting.value);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSetting();
  }, []);

  /* Update setting */
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "whatsapp_number", value: whatsapp }),
      });

      if (!res.ok) throw new Error();

      toast.success("WhatsApp number updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader size={60} />;

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 md:p-8 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-[var(--shadow)]">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-[var(--gold)] text-center sm:text-left">
        Admin Settings
      </h1>

      <div className="mb-4 flex flex-col gap-2">
        <label htmlFor="whatsapp" className="text-[var(--text-primary)] font-medium">
          WhatsApp Number
        </label>
        <input
          id="whatsapp"
          type="text"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] transition"
          placeholder="Enter WhatsApp number"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full sm:w-auto px-6 py-3 bg-[var(--gold)] text-black rounded-lg flex items-center justify-center gap-2 hover:bg-[var(--gold-dark)] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? <Loader size={20} /> : "Save"}
      </button>
    </div>
  );
}