"use client";

/**
 * Registration / Request Access page.
 * 
 * In production, this submits a request for role-based access.
 * Admins then approve and assign the appropriate role.
 * For development, it routes directly to the dashboard.
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    role: "owner",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-600/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">Equity Builders</span>
            <p className="text-[10px] text-navy-400 uppercase tracking-widest">
              Forensic Intelligence
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Request Access</h2>
        <p className="text-navy-400 mb-8">
          Submit your information for platform access. An administrator
          will review and approve your request.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            label="Full Name"
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            id="email"
            label="Work Email"
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            id="organization"
            label="Organization"
            placeholder="Company or organization name"
            value={formData.organization}
            onChange={(e) =>
              setFormData({ ...formData, organization: e.target.value })
            }
            required
          />

          <Select
            id="role"
            label="Requested Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              { value: "owner", label: "Property Owner" },
              { value: "contractor", label: "Contractor" },
              { value: "adjuster", label: "Insurance Adjuster" },
              { value: "internal", label: "Internal Team" },
            ]}
          />

          <Input
            id="password"
            label="Create Password"
            type="password"
            placeholder="Minimum 8 characters"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <Button type="submit" size="lg" className="w-full mt-2">
            Submit Request
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-center text-sm text-navy-400 mt-6">
          Already have access?{" "}
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
