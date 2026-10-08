"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        throw new Error(loginError.message);
      }

      if (!data.user) {
        throw new Error("Login failed. Please try again.");
      }

      router.push("/fundi/dashboard");

    } catch (err: unknown) {
      console.error("LOGIN ERROR:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to login. Please try again.");
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
            onClick={() => router.push("/fundi/register")}
            className="text-sm font-semibold text-gray-600 hover:text-blue-600"
          >
            Register
          </button>

        </div>
      </nav>

      {/* Login */}
      <section className="px-6 py-16">

        <div className="mx-auto max-w-md">

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl">
              🔧
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Welcome Back
            </h1>

            <p className="mt-3 text-gray-600">
              Login to manage your FundiHub profile.
            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="mt-8 rounded-2xl border bg-white p-6 shadow-sm md:p-8"
          >

            {/* Email */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email
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

            {/* Password */}
            <div className="mt-5">

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="font-semibold text-red-700">
                  ❌ Login failed
                </p>

                <p className="mt-1 break-words text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Register */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/fundi/register")}
                className="font-semibold text-blue-600 hover:underline"
              >
                Create one
              </button>
            </p>

          </form>

        </div>

      </section>

    </main>
  );
}