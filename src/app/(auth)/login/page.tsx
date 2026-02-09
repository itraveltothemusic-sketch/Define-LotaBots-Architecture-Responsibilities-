"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight, Eye, EyeOff } from "lucide-react";

/**
 * Login Page
 *
 * Authentication is the gateway to trust.
 * Clean, secure-feeling design. No friction, all confidence.
 *
 * For demo/development: any credentials will authenticate.
 * Role selection allows testing different permission levels.
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("internal");
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { value: "internal", label: "Internal Team", description: "Full platform access" },
    { value: "owner", label: "Property Owner", description: "Property & equity view" },
    { value: "contractor", label: "Contractor", description: "Scope & execution view" },
    { value: "adjuster", label: "Adjuster", description: "Claims & inspection view" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Store role in localStorage for demo purposes
    // In production: this is handled by a proper auth provider (NextAuth, Clerk, etc.)
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "eb_session",
        JSON.stringify({
          user: {
            id: "usr_001",
            email: email || "demo@equitybuilders.com",
            name: "Marcus Reid",
            role: selectedRole,
          },
          authenticated: true,
        })
      );
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 forensic-grid opacity-30" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-600">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Equity Builders
            </span>
          </Link>

          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-white leading-tight">
              Forensic precision meets{" "}
              <span className="text-emerald-400">strategic intelligence</span>
            </h2>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Every inspection documented. Every claim tracked. Every dollar of
              equity verified and defensible.
            </p>

            {/* Trust indicators */}
            <div className="mt-10 flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">4</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">
                  Active Properties
                </div>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">$1.36M</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">
                  Equity Gained
                </div>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">94.6%</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">
                  Recovery Rate
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600">
            Protected by enterprise-grade encryption
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-600">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              Equity Builders
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to access your property intelligence dashboard.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-300 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 pr-10 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-300 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Role selector — for demo/development */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Sign in as
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`px-3 py-2.5 rounded-lg border text-left transition-all ${
                      selectedRole === role.value
                        ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div
                      className={`text-xs font-semibold ${
                        selectedRole === role.value
                          ? "text-emerald-700"
                          : "text-slate-700"
                      }`}
                    >
                      {role.label}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {role.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-emerald-600 font-semibold hover:text-emerald-700"
            >
              Request Access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
