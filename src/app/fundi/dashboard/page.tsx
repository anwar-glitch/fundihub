"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Provider = {
  id: string;
  user_id: string;
  name: string;
  service: string;
  location: string;
  phone: string;
  description: string | null;
  rating: number;
  profile_image: string | null;
};

const SERVICES = [
  "Mechanics",
  "Electricians",
  "Plumbers",
];

export default function DashboardPage() {
  const router = useRouter();

  const [provider, setProvider] = useState<Provider | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        router.replace("/fundi/login");
        return;
      }

      const { data, error: providerError } = await supabase
        .from("providers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (providerError) {
        throw providerError;
      }

      if (!data) {
        throw new Error("Your FundiHub profile was not found.");
      }

      setProvider(data);

      setName(data.name);
      setService(data.service);
      setLocation(data.location);
      setPhone(data.phone);
      setDescription(data.description || "");
      setProfileImage(data.profile_image || "");
    } catch (err: unknown) {
      console.error("PROFILE ERROR:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to load your profile.");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProfile();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadProfile]);

  async function handlePhotoUpload(
    e: ChangeEvent<HTMLInputElement>
  ) {
    try {
      setError("");
      setSuccess("");

      const file = e.target.files?.[0];

      if (!file) {
        return;
      }

      if (!provider) {
        throw new Error("Profile not loaded.");
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file.");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image must be smaller than 5MB.");
      }

      setUploading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        router.replace("/fundi/login");
        return;
      }

      const fileExtension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const filePath = `${user.id}/profile.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("fundi-profiles")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("fundi-profiles")
        .getPublicUrl(filePath);

      const imageUrl = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("providers")
        .update({
          profile_image: imageUrl,
        })
        .eq("id", provider.id)
        .eq("user_id", user.id);

      if (updateError) {
        throw updateError;
      }

      setProfileImage(imageUrl);

      setProvider({
        ...provider,
        profile_image: imageUrl,
      });

      setSuccess("Profile photo updated successfully.");
    } catch (err: unknown) {
      console.error("PHOTO ERROR:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to upload your photo.");
      }
    } finally {
      setUploading(false);

      e.target.value = "";
    }
  }

  async function handleUpdate(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!provider) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        router.replace("/fundi/login");
        return;
      }

      const { data, error: updateError } = await supabase
        .from("providers")
        .update({
          name: name.trim(),
          service,
          location: location.trim(),
          phone: phone.trim(),
          description: description.trim() || null,
        })
        .eq("id", provider.id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      if (!data) {
        throw new Error("No profile was updated.");
      }

      const updatedProvider = {
        ...data,
        profile_image: profileImage || null,
      };

      setProvider(updatedProvider);

      setName(data.name);
      setService(data.service);
      setLocation(data.location);
      setPhone(data.phone);
      setDescription(data.description || "");

      setSuccess("Your profile has been updated successfully.");
    } catch (err: unknown) {
      console.error("UPDATE ERROR:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to update your profile.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    setError("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      return;
    }

    router.replace("/");
  }

  function viewPublicProfile() {
    if (!provider) {
      return;
    }

    router.push(`/fundi/${provider.id}`);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 font-medium text-slate-600">
            Loading your dashboard...
          </p>
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
            onClick={handleLogout}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-widest text-blue-600">
            Fundi Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Welcome, {provider?.name}
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your professional FundiHub profile.
          </p>
        </div>

        {/* PROFILE SUMMARY */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-600" />

          <div className="-mt-12 px-6 pb-7 md:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-5">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt={provider?.name || "Profile"}
                    width={112}
                    height={112}
                    unoptimized
                    className="h-28 w-28 rounded-3xl border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-white bg-blue-100 text-5xl shadow-lg">
                    👨‍🔧
                  </div>
                )}

                <div className="pb-1">
                  <h2 className="text-2xl font-black text-slate-900">
                    {provider?.name}
                  </h2>

                  <p className="mt-1 font-bold text-blue-600">
                    {provider?.service}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    📍 {provider?.location}
                  </p>
                </div>
              </div>

              <button
                onClick={viewPublicProfile}
                className="rounded-xl bg-slate-900 px-6 py-3 font-bold text-white transition hover:bg-blue-600"
              >
                View Public Profile →
              </button>
            </div>
          </div>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="font-bold text-red-700">
              ❌ {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5">
            <p className="font-bold text-green-700">
              ✅ {success}
            </p>
          </div>
        )}

        {/* PHOTO */}
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-black text-slate-900">
            Profile Photo
          </h2>

          <p className="mt-2 text-slate-500">
            Add a clear photo so customers can recognize you.
          </p>

          <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                width={128}
                height={128}
                unoptimized
                className="h-32 w-32 rounded-3xl object-cover shadow-md"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-slate-100 text-5xl">
                👤
              </div>
            )}

            <div>
              <label
                htmlFor="profile-photo"
                className="inline-flex cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
              >
                {uploading ? "Uploading..." : "Upload Photo"}
              </label>

              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploading}
                className="hidden"
              />

              <p className="mt-3 text-xs text-slate-400">
                JPG, PNG or WEBP • Maximum 5MB
              </p>
            </div>
          </div>
        </div>

        {/* EDIT PROFILE */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-black text-slate-900">
            Edit Your Profile
          </h2>

          <p className="mt-2 text-slate-500">
            This information will be visible to customers.
          </p>

          <form
            onSubmit={handleUpdate}
            className="mt-8 space-y-6"
          >
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Service
              </label>

              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              >
                {SERVICES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="e.g. Temeke, Dar es Salaam"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                About Your Service
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Tell customers about your experience and services..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-8 py-3.5 font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}