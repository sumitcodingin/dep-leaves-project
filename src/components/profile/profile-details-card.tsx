"use client";

import { useEffect, useState } from "react";

import { SurfaceCard } from "@/components/ui/surface-card";

type ProfileResponse = {
  ok?: boolean;
  message?: string;
  data?: {
    name: string;
    email: string;
    roleKey: string;
    roleSlug: string;
    department: string;
    designation: string;
    employeeCode: string;
    phone: string;
  };
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-slate-200/80 px-4 py-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold text-slate-900">
      {value || "Not available"}
    </p>
  </div>
);

export const ProfileDetailsCard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileResponse["data"] | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/forms/autofill", {
          method: "GET",
          cache: "no-store",
        });
        const result = (await response.json()) as ProfileResponse;

        if (!response.ok || !result.ok || !result.data) {
          throw new Error(result.message ?? "Unable to load profile.");
        }

        setProfile(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  if (loading) {
    return (
      <SurfaceCard className="border-slate-200/80 p-5 text-sm text-slate-600">
        Loading profile details...
      </SurfaceCard>
    );
  }

  if (error) {
    return (
      <SurfaceCard className="border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
        {error}
      </SurfaceCard>
    );
  }

  if (!profile) return null;

  return (
    <SurfaceCard className="space-y-3 border-slate-200/80 p-5">
      <p className="text-lg font-semibold text-slate-900">Profile</p>
      <div className="grid gap-3 md:grid-cols-2">
        <Row label="Name" value={profile.name} />
        <Row label="Email" value={profile.email} />
        <Row label="Role" value={profile.roleKey} />
        <Row label="Role Slug" value={profile.roleSlug} />
        <Row label="Department" value={profile.department} />
        <Row label="Designation" value={profile.designation} />
        <Row label="Employee Code" value={profile.employeeCode} />
        <Row label="Phone" value={profile.phone} />
      </div>
    </SurfaceCard>
  );
};
