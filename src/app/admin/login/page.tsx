"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ADMIN_SESSION_KEY = "rentadorm-admin-session";
const DEMO_ADMIN_EMAIL = "admin@rentadormiloilo.com";
const DEMO_ADMIN_PASSWORD = "Admin123!";

const isDemoAdmin = (email: string, password: string) =>
  email.trim().toLowerCase() === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD;

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.location.pathname !== "/secret-admin") {
      router.replace("/secret-admin");
      return;
    }

    const supabase = createClient();
    void supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        setIsChecking(false);
        return;
      }

      window.localStorage.setItem(ADMIN_SESSION_KEY, "active");
      router.replace("/admin");
    });
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const nextEmail = email.trim();
    const nextPassword = password.trim();

    if (!nextEmail || !nextPassword) {
      setError("Please enter both your email and password.");
      return;
    }

    const supabase = createClient();

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: nextEmail,
      password: nextPassword,
    });

    if (signInError || !data.user) {
      if (isDemoAdmin(nextEmail, nextPassword)) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(ADMIN_SESSION_KEY, "active");
        }
        router.push("/admin");
        return;
      }

      setError(signInError?.message ?? "Unable to log in. Please check your credentials.");
      return;
    }

    const { data: adminProfile, error: adminError } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("email", nextEmail.toLowerCase())
      .maybeSingle();

    if (adminError || !adminProfile) {
      if (isDemoAdmin(nextEmail, nextPassword)) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(ADMIN_SESSION_KEY, "active");
        }
        router.push("/admin");
        return;
      }

      await supabase.auth.signOut();
      setError("This account is not authorized for the admin dashboard.");
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(ADMIN_SESSION_KEY, "active");
    }

    router.push("/admin");
  };

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-200">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-300">Checking admin access...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#1e293b,_#020617_48%)] px-4 py-10 text-slate-100">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-900/80 shadow-2xl shadow-slate-950/50 backdrop-blur-sm">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-slate-950 p-8 lg:p-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-amber-300">Admin portal</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">RentaDorm Iloilo</h1>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Secure management access for dorm owners. This admin area is separate from the public site and is meant for controlling listings, pricing, and contact details.
            </p>

            <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
              <p className="font-semibold text-amber-200">Demo admin credentials</p>
              <p className="mt-2">Email: {DEMO_ADMIN_EMAIL}</p>
              <p>Password: {DEMO_ADMIN_PASSWORD}</p>
            </div>

            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white"
              >
                Back to public website
              </Link>
            </div>
          </div>

          <div className="p-8 lg:p-10">
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Sign in</p>
              <h2 className="mt-2 text-2xl font-black text-white">Admin login</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-amber-400"
                  placeholder="admin@rentadormiloilo.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-amber-400"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-sm font-medium text-red-400">{error}</p>}

              <button
                type="submit"
                className="w-full rounded-full bg-amber-400 px-5 py-3 text-sm font-black text-slate-900 shadow-lg shadow-amber-500/20 transition hover:bg-amber-300"
              >
                Log in to admin dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
