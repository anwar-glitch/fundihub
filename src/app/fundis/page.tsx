"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

const SERVICES = [
  "All Services",
  "Mechanics",
  "Electricians",
  "Plumbers",
];

export default function FundisPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 px-6 py-20 text-center text-gray-600">
          Loading fundis...
        </div>
      }
    >
      <FundisPageContent />
    </Suspense>
  );
}

function FundisPageContent() {
  const searchParams = useSearchParams();

  const initialService =
    searchParams.get("service") || "";

  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(initialService);
  const [selectedService, setSelectedService] =
    useState(initialService || "All Services");
  const [location, setLocation] = useState("");

  useEffect(() => {
    loadProviders();
  }, []);

  async function loadProviders() {
    setLoading(true);
    setError("");

    try {
      const { data, error: providerError } =
        await supabase
          .from("providers")
          .select("*")
          .order("rating", {
            ascending: false,
          });

      if (providerError) {
        throw providerError;
      }

      setProviders(data || []);
    } catch (err: unknown) {
      console.error("PROVIDERS ERROR:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to load fundis.");
      }
    } finally {
      setLoading(false);
    }
  }

  const filteredProviders = providers.filter(
    (provider) => {
      const searchValue = search
        .trim()
        .toLowerCase();

      const locationValue = location
        .trim()
        .toLowerCase();

      const matchesSearch =
        !searchValue ||
        provider.name
          .toLowerCase()
          .includes(searchValue) ||
        provider.service
          .toLowerCase()
          .includes(searchValue) ||
        provider.location
          .toLowerCase()
          .includes(searchValue);

      const matchesService =
        selectedService === "All Services" ||
        provider.service
          .toLowerCase()
          .includes(
            selectedService.toLowerCase()
          );

      const matchesLocation =
        !locationValue ||
        provider.location
          .toLowerCase()
          .includes(locationValue);

      return (
        matchesSearch &&
        matchesService &&
        matchesLocation
      );
    }
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-blue-600"
          >
            Fundi<span className="text-gray-900">
              Hub
            </span>
          </Link>

          <div className="flex items-center gap-3">

            <Link
              href="/"
              className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 sm:block"
            >
              Home
            </Link>

            <Link
              href="/fundi/login"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              I am a Fundi
            </Link>

          </div>

        </nav>
      </header>

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <section className="border-b border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-12">

          <div className="max-w-3xl">

            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Find a Professional
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Find the right fundi for your job.
            </h1>

            <p className="mt-4 text-lg leading-7 text-gray-600">
              Browse skilled professionals, compare their
              profiles and contact them directly.
            </p>

          </div>

          {/* SEARCH BOX */}

          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg md:flex-row"
          >

            <div className="flex flex-1 items-center rounded-xl bg-gray-50">

              <span className="px-4 text-xl">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by name or service..."
                className="w-full bg-transparent px-2 py-3.5 outline-none placeholder:text-gray-400"
              />

            </div>

            <div className="flex flex-1 items-center rounded-xl bg-gray-50">

              <span className="px-4 text-xl">
                📍
              </span>

              <input
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="Location..."
                className="w-full bg-transparent px-2 py-3.5 outline-none placeholder:text-gray-400"
              />

            </div>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-8 py-3.5 font-bold text-white transition hover:bg-blue-700"
            >
              Search
            </button>

          </form>

        </div>

      </section>

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">

          {/* ============================================= */}
          {/* FILTER SIDEBAR */}
          {/* ============================================= */}

          <aside>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <h2 className="font-bold text-gray-900">
                Services
              </h2>

              <div className="mt-4 space-y-1">

                {SERVICES.map((service) => {

                  const active =
                    selectedService === service;

                  return (
                    <button
                      key={service}
                      onClick={() =>
                        setSelectedService(
                          service
                        )
                      }
                      className={`w-full rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                        active
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {service}
                    </button>
                  );
                })}

              </div>

            </div>

          </aside>

          {/* ============================================= */}
          {/* RESULTS */}
          {/* ============================================= */}

          <div>

            {/* Results header */}

            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  {selectedService ===
                  "All Services"
                    ? "Available Fundis"
                    : selectedService}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {loading
                    ? "Finding professionals..."
                    : `${filteredProviders.length} professional${
                        filteredProviders.length ===
                        1
                          ? ""
                          : "s"
                      } found`}
                </p>

              </div>

            </div>

            {/* Loading */}

            {loading && (
              <div className="grid gap-6 sm:grid-cols-2">

                {[1, 2, 3, 4].map(
                  (item) => (
                    <div
                      key={item}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                    >

                      <div className="h-56 animate-pulse bg-gray-200" />

                      <div className="space-y-3 p-6">

                        <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />

                        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />

                        <div className="h-12 animate-pulse rounded bg-gray-100" />

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

            {/* Error */}

            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

                <p className="font-bold text-red-700">
                  Something went wrong
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>

                <button
                  onClick={loadProviders}
                  className="mt-4 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700"
                >
                  Try Again
                </button>

              </div>
            )}

            {/* Empty */}

            {!loading &&
              !error &&
              filteredProviders.length ===
                0 && (
                <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">

                  <div className="text-5xl">
                    🔍
                  </div>

                  <h2 className="mt-5 text-2xl font-bold text-gray-900">
                    No fundis found
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-gray-500">
                    Try another service, fundi name or
                    location.
                  </p>

                  <button
                    onClick={() => {
                      setSearch("");
                      setLocation("");
                      setSelectedService(
                        "All Services"
                      );
                    }}
                    className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>

                </div>
              )}

            {/* Cards */}

            {!loading &&
              !error &&
              filteredProviders.length >
                0 && (
                <div className="grid gap-6 sm:grid-cols-2">

                  {filteredProviders.map(
                    (provider) => (

                      <article
                        key={provider.id}
                        className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                      >

                        {/* IMAGE */}

                        <Link
                          href={`/fundi/${provider.id}`}
                        >
                          <div className="relative h-60 overflow-hidden bg-gray-100">

                            {provider.profile_image ? (
                              <Image
                                src={provider.profile_image}
                                alt={provider.name}
                                width={800}
                                height={600}
                                unoptimized
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 text-7xl">
                                👨‍🔧
                              </div>
                            )}

                            {/* Service badge */}

                            <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
                              {provider.service}
                            </div>

                            {/* Rating */}

                            <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-gray-900 shadow-sm">
                              ⭐{" "}
                              {Number(
                                provider.rating ||
                                  0
                              ).toFixed(1)}
                            </div>

                          </div>
                        </Link>

                        {/* CONTENT */}

                        <div className="p-6">

                          <div className="flex items-start justify-between gap-4">

                            <div>

                              <Link
                                href={`/fundi/${provider.id}`}
                              >
                                <h3 className="text-xl font-bold text-gray-900 transition group-hover:text-blue-600">
                                  {
                                    provider.name
                                  }
                                </h3>
                              </Link>

                              <p className="mt-1 text-sm font-medium text-gray-500">
                                📍{" "}
                                {
                                  provider.location
                                }
                              </p>

                            </div>

                          </div>

                          <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500">
                            {provider.description ||
                              "Professional service provider available on FundiHub."}
                          </p>

                          {/* Buttons */}

                          <div className="mt-6 grid grid-cols-[1fr_auto_auto] gap-2">

                            <Link
                              href={`/fundi/${provider.id}`}
                              className="rounded-lg bg-gray-100 px-4 py-3 text-center text-sm font-bold text-gray-800 transition hover:bg-gray-200"
                            >
                              View Profile
                            </Link>

                            <a
                              href={`tel:${provider.phone}`}
                              className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700"
                              aria-label={`Call ${provider.name}`}
                            >
                              📞
                            </a>

                            <a
                              href={`https://wa.me/${provider.phone.replace(
                                /\D/g,
                                ""
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center rounded-lg bg-green-500 px-4 py-3 text-white transition hover:bg-green-600"
                              aria-label={`WhatsApp ${provider.name}`}
                            >
                              💬
                            </a>

                          </div>

                        </div>

                      </article>

                    )
                  )}

                </div>
              )}

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer className="border-t border-gray-200 bg-gray-950 px-6 py-10 text-white">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-center">

          <Link
            href="/"
            className="text-xl font-extrabold text-blue-500"
          >
            Fundi<span className="text-white">
              Hub
            </span>
          </Link>

          <p className="text-sm text-gray-500">
            Connecting customers with skilled local
            professionals.
          </p>

          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()}
          </p>

        </div>

      </footer>

    </main>
  );
}