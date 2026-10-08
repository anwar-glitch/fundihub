"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Provider = {
  id: string;
  name: string;
  service: string;
  location: string;
  phone: string;
  description: string | null;
  rating: number;
  profile_image: string | null;
};

export default function FundiProfilePage() {
  const params = useParams();
  const router = useRouter();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProvider = useCallback(async () => {
    try {
      const id = params.id;

      if (!id || typeof id !== "string") {
        throw new Error("Invalid fundi profile.");
      }

      const { data, error: providerError } = await supabase
        .from("providers")
        .select("*")
        .eq("id", id)
        .single();

      if (providerError) {
        throw providerError;
      }

      if (!data) {
        throw new Error("Fundi not found.");
      }

      setProvider(data);
    } catch (err: unknown) {
      console.error("FUNDI PROFILE ERROR:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to load fundi profile.");
      }
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProvider();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadProvider]);

  function callFundi() {
    if (!provider) return;

    window.location.href = `tel:${provider.phone}`;
  }

  function whatsappFundi() {
    if (!provider) return;

    const phone = provider.phone.replace(/\D/g, "");

    const message = encodeURIComponent(
      `Hello ${provider.name}, I found your service on FundiHub. I would like to ask about your ${provider.service.toLowerCase()} services.`
    );

    window.open(
      `https://wa.me/${phone}?text=${message}`,
      "_blank"
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-slate-500">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  if (error || !provider) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">😕</div>

          <h1 className="mt-5 text-2xl font-black text-slate-900">
            Fundi not found
          </h1>

          <p className="mt-2 text-slate-500">
            {error || "This profile may no longer be available."}
          </p>

          <button
            onClick={() => router.push("/fundis")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Browse Fundis
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-black tracking-tight text-blue-600"
          >
            Fundi<span className="text-slate-900">Hub</span>
          </button>

          <button
            onClick={() => router.back()}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            ← Back
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-linear-to-br from-blue-700 via-blue-600 to-indigo-700">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
          <div className="flex flex-col items-center text-center">
            {provider.profile_image ? (
              <Image
                src={provider.profile_image}
                alt={provider.name}
                width={176}
                height={176}
                unoptimized
                className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-2xl md:h-44 md:w-44"
              />
            ) : (
              <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-white bg-white/20 text-6xl shadow-2xl md:h-44 md:w-44">
                👨‍🔧
              </div>
            )}

            <div className="mt-6">
              <div className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                {provider.service}
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
                {provider.name}
              </h1>

              <p className="mt-3 text-lg text-blue-100">
                📍 {provider.location}
              </p>

              <div className="mt-5 flex items-center justify-center gap-2">
                <span className="text-2xl">⭐</span>

                <span className="text-xl font-black text-white">
                  {Number(provider.rating || 0).toFixed(1)}
                </span>

                <span className="text-blue-100">
                  rating
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-5xl px-5 py-10 md:px-8">
        <div className="grid gap-8 md:grid-cols-[1fr_320px]">
          {/* ABOUT */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-9">
            <h2 className="text-2xl font-black text-slate-900">
              About This Fundi
            </h2>

            <p className="mt-5 whitespace-pre-line leading-8 text-slate-600">
              {provider.description ||
                "This fundi has not added a service description yet."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-400">
                  SERVICE
                </p>

                <p className="mt-2 font-black text-slate-900">
                  🔧 {provider.service}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-400">
                  LOCATION
                </p>

                <p className="mt-2 font-black text-slate-900">
                  📍 {provider.location}
                </p>
              </div>
            </div>
          </div>

          {/* CONTACT CARD */}
          <div className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:sticky md:top-24">
            <h2 className="text-xl font-black text-slate-900">
              Contact {provider.name}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Contact this fundi directly for prices, availability
              and service details.
            </p>

            <button
              onClick={callFundi}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-4 font-black text-white transition hover:bg-blue-700"
            >
              📞 Call Fundi
            </button>

            <button
              onClick={whatsappFundi}
              className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl bg-green-500 px-5 py-4 font-black text-white transition hover:bg-green-600"
            >
              💬 WhatsApp
            </button>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Phone
              </p>

              <p className="mt-1 font-bold text-slate-800">
                {provider.phone}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-12">
        <div className="mx-auto max-w-5xl rounded-3xl bg-slate-900 px-7 py-10 text-center md:px-12">
          <h2 className="text-2xl font-black text-white md:text-3xl">
            Need another service?
          </h2>

          <p className="mt-3 text-slate-400">
            Browse more skilled professionals on FundiHub.
          </p>

          <button
            onClick={() => router.push("/fundis")}
            className="mt-6 rounded-xl bg-white px-7 py-3 font-black text-slate-900 transition hover:bg-blue-50"
          >
            Browse More Fundis
          </button>
        </div>
      </section>
    </main>
  );
}