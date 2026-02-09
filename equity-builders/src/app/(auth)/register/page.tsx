/**
 * Registration Page
 * 
 * New user registration with role selection.
 * Captures essential information for onboarding.
 */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, ArrowRight, Building2, HardHat, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import type { UserRole } from "@/types";

const roles: { value: UserRole; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: "OWNER",
    label: "Property Owner",
    description: "I own commercial property affected by storm damage",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    value: "CONTRACTOR",
    label: "Contractor",
    description: "I perform repairs on storm-damaged properties",
    icon: <HardHat className="w-5 h-5" />,
  },
  {
    value: "ADJUSTER",
    label: "Insurance Adjuster",
    description: "I assess and process insurance claims",
    icon: <Shield className="w-5 h-5" />,
  },
  {
    value: "INTERNAL",
    label: "Internal Team",
    description: "I work for Equity Builders",
    icon: <User className="w-5 h-5" />,
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "" as UserRole | "",
    organization: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role) {
      setError("Please select a role");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", ...formData }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white">Equity Builders</span>
            <p className="text-xs text-slate-500 uppercase tracking-widest">Create Account</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Get started</h2>
        <p className="text-slate-400 mb-8">
          Create your account to access the forensic property intelligence platform.
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: role.value })}
                  className={cn(
                    "flex flex-col items-start gap-2 p-3 rounded-lg border text-left transition-all",
                    formData.role === role.value
                      ? "bg-brand-600/10 border-brand-500/40 text-brand-300"
                      : "bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600"
                  )}
                >
                  <span className={cn(
                    formData.role === role.value ? "text-brand-400" : "text-slate-500"
                  )}>
                    {role.icon}
                  </span>
                  <span className="text-sm font-medium text-white">{role.label}</span>
                  <span className="text-xs leading-tight">{role.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Organization"
              placeholder="Company name"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            helperText="Minimum 8 characters"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
