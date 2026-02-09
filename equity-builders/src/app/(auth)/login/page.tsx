"use client";

/**
 * Login page — role-based authentication entry point.
 * 
 * Design: Minimal, high-trust aesthetic with clear role indication.
 * In production, this connects to the auth provider (e.g., NextAuth).
 * For now, it routes directly to the dashboard for development.
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: authenticate via API
    // For development: route directly to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Left Panel — Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-navy-900/30 border-r border-navy-800/40 flex-col items-center justify-center p-12">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-forensic-600/8 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center max-w-md">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-600/30 mx-auto mb-8">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            Equity Builders
          </h1>
          <p className="text-navy-300 leading-relaxed">
            Forensic Property Intelligence Platform — transforming storm-damaged
            commercial properties into verified equity gains through precision
            and AI-guided execution.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-left">
            {[
              { value: "$40M+", label: "Properties Managed" },
              { value: "94.2%", label: "Claim Approval Rate" },
              { value: "142d", label: "Avg Claim Cycle" },
              { value: "13.5%", label: "Avg Equity Gain" },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-3 bg-navy-900/60 border border-navy-700/30 rounded-lg"
              >
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-navy-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Equity Builders</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-navy-400 mb-8">
            Sign in to access the Intelligence Center
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-navy-500 hover:text-navy-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-navy-400">
                <input
                  type="checkbox"
                  className="rounded border-navy-600 bg-navy-800 text-brand-500 focus:ring-brand-500/30"
                />
                Remember me
              </label>
              <Link
                href="#"
                className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full mt-2">
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-navy-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              Request Access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
