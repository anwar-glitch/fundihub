"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const SERVICES = [
  "Mechanics",
  "Electricians",
  "Plumbers",
];

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !service ||
      !location.trim() ||
      !phone.trim()
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      // Create authentication account
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

      if (authError) {
        throw new Error(authError.message);
      }

      const user = authData.user;

      if (!user) {
        throw new Error("Account could not be created.");
      }

      // Create provider profile
      const { error: providerError } = await supabase
        .from("providers")
        .insert({
          user_id: user.id,
          name: name.trim(),
          service,
          location: location.trim(),
          phone: phone.trim(),
          description: description.trim() || null,
          rating: 0,
        });

      if (providerError) {
        throw new Error(
          `Provider profile failed: ${providerError.message}`
        );
      }

      setSuccess(
        "Your FundiHub account was created successfully!"
      );

      // Go to dashboard
      setTimeout(() => {
        router.push("/fundi/dashboard");
      }, 1200);

    } catch (err: unknown) {
      console.error("REGISTRATION ERROR:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <button
            onClick={() => router.push("/")}
            className="text-2xl font-bold text-blue-600"
          >
            FundiHub
          </button>

          <button
            onClick={() => router.push("/fundi/login")}
            className="text-sm font-semibold text-gray-600 hover:text-blue-600"
          >
            Already have an account? Login
          </button>

        </div>
      </nav>

      {/* Main */}
      <section className="px-6 py-12">

        <div className="mx-auto max-w-2xl">

          {/* Header */}
          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl">
              🔧
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Join FundiHub
            </h1>

            <p className="mt-3 text-gray-600">
              Create your professional profile and let customers
              find your services.
            </p>

          </div>

          {/* Form */}
          <form
            onSubmit={handleRegister}
            className="mt-10 rounded-2xl border bg-white p-6 shadow-sm md:p-8"
          >

            {/* Account */}
            <h2 className="text-xl font-bold text-gray-900">
              Account Information
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email *
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password *
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>

            {/* Personal */}
            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Personal Information
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name *
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Juma Hassan"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone Number *
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+255 7XX XXX XXX"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>

            {/* Service */}
            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Service Information
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Service Category *
                </label>

                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select your service
                  </option>

                  {SERVICES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Location *
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Temeke, Dar es Salaam"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  About Your Service
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your experience and services..."
                  rows={5}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="font-semibold text-red-700">
                  ❌ Registration failed
                </p>

                <p className="mt-1 break-words text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="font-semibold text-green-700">
                  ✅ {success}
                </p>

                <p className="mt-1 text-sm text-green-600">
                  Opening your dashboard...
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating Account..."
                : "Create Fundi Profile"}
            </button>

          </form>

        </div>

      </section>

    </main>
  );
}