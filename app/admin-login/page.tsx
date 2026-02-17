"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/admin/dashboard");
    }
  }, [status, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setSubmitting(false);

    if (res?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Login successful");
      router.push("/admin/dashboard");
    }
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Loader size={60} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 sm:px-6">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 sm:p-10 rounded-xl w-full max-w-md shadow-[var(--shadow)]">
        <h1 className="text-3xl sm:text-4xl font-heading text-center text-[var(--gold)] mb-8">
          Admin Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full
              bg-[var(--surface)]
              border border-[var(--border)]
              px-4 py-3 rounded-lg
              text-[var(--text-primary)]
              placeholder:text-[var(--text-muted)]
              focus:outline-none
              focus:ring-2 focus:ring-[var(--gold)]
              transition
            "
            required
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              bg-[var(--surface)]
              border border-[var(--border)]
              px-4 py-3 rounded-lg
              text-[var(--text-primary)]
              placeholder:text-[var(--text-muted)]
              focus:outline-none
              focus:ring-2 focus:ring-[var(--gold)]
              transition
            "
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="
              w-full
              border border-[var(--gold)]
              text-[var(--gold)]
              py-3 rounded-lg
              hover:bg-[var(--gold)]
              hover:text-black
              transition duration-300
              font-semibold
              flex items-center justify-center gap-2
            "
          >
            {submitting ? <Loader size={20} /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}