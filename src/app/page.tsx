"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const services = [
  {
    name: "Mechanics",
    description: "Car & motorcycle repairs",
    icon: "🔧",
    color: "orange",
    tag: "Vehicle",
  },
  {
    name: "Electricians",
    description: "Electrical installation & repairs",
    icon: "⚡",
    color: "yellow",
    tag: "Electrical",
  },
  {
    name: "Plumbers",
    description: "Pipes, water & drainage",
    icon: "🚿",
    color: "blue",
    tag: "Plumbing",
  },
];

const steps = [
  {
    number: "01",
    title: "Search",
    description:
      "Tell us what service you need and where you need it.",
    icon: "🔍",
  },
  {
    number: "02",
    title: "Choose",
    description:
      "Browse fundi profiles, locations, services and ratings.",
    icon: "👨‍🔧",
  },
  {
    number: "03",
    title: "Contact",
    description:
      "Call or WhatsApp the fundi directly and get your job done.",
    icon: "📞",
  },
];

const benefits = [
  "Find professionals by service",
  "Discover fundis in your area",
  "View profiles and ratings",
  "Call or WhatsApp directly",
];

export default function HomePage() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const value = search.trim();

    if (!value) {
      router.push("/fundis");
      return;
    }

    router.push(`/fundis?service=${encodeURIComponent(value)}`);
  }

  function searchService(service: string) {
    router.push(`/fundis?service=${encodeURIComponent(service)}`);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="group flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/20 transition group-hover:scale-105">
              F
            </div>

            <span className="text-xl font-black tracking-tight text-slate-900">
              Fundi<span className="text-blue-600">Hub</span>
            </span>
          </button>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">

            <button
              onClick={() => router.push("/fundis")}
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              Find a Fundi
            </button>

            <a
              href="#services"
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              Services
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
              How It Works
            </a>
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-2 sm:gap-3">

            <button
              onClick={() => router.push("/fundi/login")}
              className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 sm:block"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/fundi/register")}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-600/30 sm:px-5"
            >
              Join as Fundi
            </button>
          </div>
        </nav>
      </header>


      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-slate-50">

        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
          <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-100/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-6 md:pb-28 md:pt-24 lg:px-8">

          <div className="mx-auto max-w-5xl text-center">

            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>

              Find skilled professionals near you
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl">

              Find a trusted{" "}

              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                fundi
              </span>

              <br className="hidden sm:block" />

              {" "}for your next job.
            </h1>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg md:text-xl md:leading-8">
              FundiHub connects you with skilled local professionals
              for repairs, installations and everyday services.
            </p>


            {/* Search box */}
            <form
              onSubmit={handleSearch}
              className="mx-auto mt-10 flex max-w-3xl flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10 sm:flex-row"
            >
              <div className="flex min-w-0 flex-1 items-center rounded-xl px-2">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
                  🔍
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="What service do you need?"
                  className="w-full bg-transparent px-4 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.98]"
              >
                Search Fundis
              </button>
            </form>


            {/* Popular searches */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">

              <span className="mr-1 text-sm font-medium text-slate-500">
                Popular:
              </span>

              {services.map((service) => (
                <button
                  key={service.name}
                  onClick={() => searchService(service.name)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:text-sm"
                >
                  {service.name}
                </button>
              ))}
            </div>

          </div>


          {/* Hero stats */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 md:grid-cols-4">

            <div className="border-b border-slate-100 px-5 py-6 text-center md:border-b-0 md:border-r">
              <p className="text-2xl font-black text-slate-950">3+</p>
              <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                Service categories
              </p>
            </div>

            <div className="border-b border-slate-100 px-5 py-6 text-center md:border-b-0 md:border-r">
              <p className="text-2xl font-black text-slate-950">24/7</p>
              <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                Access to listings
              </p>
            </div>

            <div className="px-5 py-6 text-center md:border-r">
              <p className="text-2xl font-black text-slate-950">Direct</p>
              <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                Contact fundis
              </p>
            </div>

            <div className="px-5 py-6 text-center">
              <p className="text-2xl font-black text-slate-950">Local</p>
              <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                Service providers
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          SERVICES
      ====================================================== */}

      <section
        id="services"
        className="bg-white px-5 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px w-8 bg-blue-600" />

                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                  Our Services
                </p>
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                What do you need help with?
              </h2>

              <p className="mt-3 max-w-xl text-slate-500">
                Choose a service and find skilled professionals who
                can help you get the job done.
              </p>
            </div>

            <button
              onClick={() => router.push("/fundis")}
              className="group w-fit font-bold text-blue-600 transition hover:text-blue-700"
            >
              View all fundis
              <span className="ml-2 inline-block transition group-hover:translate-x-1">
                →
              </span>
            </button>

          </div>


          {/* Service cards */}
          <div className="mt-10 grid gap-5 md:grid-cols-3">

            {services.map((service) => (
              <button
                key={service.name}
                onClick={() => searchService(service.name)}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10"
              >

                {/* Top decoration */}
                <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-50 transition group-hover:scale-150" />

                <div className="relative">

                  <div className="flex items-start justify-between">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl shadow-sm transition group-hover:scale-105">
                      {service.icon}
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                      {service.tag}
                    </span>

                  </div>

                  <h3 className="mt-7 text-xl font-black text-slate-950">
                    {service.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  <div className="mt-7 flex items-center font-bold text-blue-600">
                    Find a fundi

                    <span className="ml-2 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                </div>

              </button>
            ))}

          </div>

        </div>
      </section>


      {/* =====================================================
          WHY FUNDIHUB
      ====================================================== */}

      <section className="bg-slate-50 px-5 py-20 sm:px-6 md:py-28 lg:px-8">

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

          {/* Text */}
          <div>

            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-8 bg-blue-600" />

              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Why FundiHub
              </p>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
              Finding a fundi should be easy.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Instead of asking around or searching through random
              contacts, FundiHub gives you one place to discover
              local service professionals.
            </p>

            <div className="mt-8 space-y-4">

              {benefits.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-black text-green-600">
                    ✓
                  </div>

                  <span className="font-semibold text-slate-700">
                    {item}
                  </span>
                </div>
              ))}

            </div>

            <button
              onClick={() => router.push("/fundis")}
              className="mt-9 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800"
            >
              Find a Fundi
            </button>

          </div>


          {/* Dashboard visual */}
          <div className="relative">

            {/* Glow */}
            <div className="absolute inset-0 rounded-[2rem] bg-blue-600/10 blur-3xl" />

            <div className="relative rounded-[2rem] bg-slate-950 p-3 shadow-2xl sm:p-5">

              <div className="rounded-2xl bg-white p-5 sm:p-7">

                {/* Header */}
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Find a professional
                    </p>

                    <h3 className="mt-1 text-xl font-black text-slate-950">
                      Nearby fundis
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                    🛠️
                  </div>

                </div>


                {/* Mini search */}
                <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span>🔍</span>

                  <span className="text-sm font-medium text-slate-400">
                    Search services...
                  </span>
                </div>


                {/* Fundi categories */}
                <div className="mt-5 space-y-3">

                  <div className="group flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-orange-200 hover:bg-orange-50/50">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">
                      🔧
                    </div>

                    <div className="flex-1">
                      <p className="font-bold text-slate-950">
                        Mechanics
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Vehicle repairs
                      </p>
                    </div>

                    <span className="font-bold text-blue-600 transition group-hover:translate-x-1">
                      →
                    </span>

                  </div>


                  <div className="group flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-yellow-200 hover:bg-yellow-50/50">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-2xl">
                      ⚡
                    </div>

                    <div className="flex-1">
                      <p className="font-bold text-slate-950">
                        Electricians
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Electrical services
                      </p>
                    </div>

                    <span className="font-bold text-blue-600 transition group-hover:translate-x-1">
                      →
                    </span>

                  </div>


                  <div className="group flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50/50">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                      🚿
                    </div>

                    <div className="flex-1">
                      <p className="font-bold text-slate-950">
                        Plumbers
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Plumbing services
                      </p>
                    </div>

                    <span className="font-bold text-blue-600 transition group-hover:translate-x-1">
                      →
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section
        id="how-it-works"
        className="bg-white px-5 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <div className="mb-3 flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-blue-600" />

              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                How It Works
              </p>

              <span className="h-px w-8 bg-blue-600" />
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Find a fundi in three steps
            </h2>

            <p className="mt-4 text-slate-500">
              No complicated process. Search, choose and contact.
            </p>

          </div>


          <div className="mt-12 grid gap-5 md:grid-cols-3">

            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden w-5 translate-x-full border-t border-dashed border-slate-300 md:block" />
                )}

                <div className="flex items-center justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                    {step.icon}
                  </div>

                  <span className="text-sm font-black text-slate-200">
                    {step.number}
                  </span>

                </div>

                <h3 className="mt-7 text-xl font-black text-slate-950">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-500">
                  {step.description}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>


      {/* =====================================================
          FUNDI CTA
      ====================================================== */}

      <section className="px-5 py-16 sm:px-6 md:py-24 lg:px-8">

        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 px-7 py-12 shadow-2xl shadow-blue-900/20 sm:px-10 md:px-14 md:py-16">

          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">
                For Service Providers
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Are you a skilled fundi?
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-blue-100">
                Create your FundiHub profile and make it easier
                for customers to discover your services.
              </p>

            </div>

            <button
              onClick={() => router.push("/fundi/register")}
              className="shrink-0 rounded-xl bg-white px-7 py-3.5 text-sm font-black text-blue-600 shadow-xl transition hover:bg-blue-50 hover:shadow-2xl"
            >
              Join FundiHub
              <span className="ml-2">→</span>
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="bg-slate-950 px-5 py-14 text-white sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 md:grid-cols-4">

            {/* Brand */}
            <div className="md:col-span-2">

              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2"
              >

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-black">
                  F
                </div>

                <span className="text-xl font-black">
                  Fundi<span className="text-blue-500">Hub</span>
                </span>

              </button>

              <p className="mt-5 max-w-md leading-7 text-slate-400">
                Connecting customers with skilled local service
                professionals.
              </p>

            </div>


            {/* Explore */}
            <div>

              <h3 className="text-sm font-black">
                Explore
              </h3>

              <div className="mt-5 space-y-3 text-sm text-slate-400">

                <button
                  onClick={() => router.push("/fundis")}
                  className="block transition hover:text-white"
                >
                  Find a Fundi
                </button>

                <a
                  href="#services"
                  className="block transition hover:text-white"
                >
                  Services
                </a>

                <a
                  href="#how-it-works"
                  className="block transition hover:text-white"
                >
                  How It Works
                </a>

              </div>

            </div>


            {/* Fundis */}
            <div>

              <h3 className="text-sm font-black">
                For Fundis
              </h3>

              <div className="mt-5 space-y-3 text-sm text-slate-400">

                <button
                  onClick={() => router.push("/fundi/register")}
                  className="block transition hover:text-white"
                >
                  Join FundiHub
                </button>

                <button
                  onClick={() => router.push("/fundi/login")}
                  className="block transition hover:text-white"
                >
                  Fundi Login
                </button>

              </div>

            </div>

          </div>


          {/* Bottom */}
          <div className="mt-12 flex flex-col gap-3 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © {new Date().getFullYear()} FundiHub. All rights reserved.
            </p>

            <p>
              Built for local communities.
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}