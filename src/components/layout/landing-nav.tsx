"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Landing page navigation.
 *
 * Design decisions:
 * - Shield icon reinforces protection/trust brand
 * - Clean, minimal nav — authority comes from restraint
 * - Mobile-responsive with animated menu
 */
export function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-600">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 leading-tight tracking-tight">
                Equity Builders
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none">
                Forensic Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Platform
            </Link>
            <Link
              href="#stats"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Results
            </Link>
            <Link
              href="#cta"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Request Access
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-slate-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          mobileMenuOpen ? "max-h-64 border-b border-slate-100" : "max-h-0"
        )}
      >
        <div className="px-4 py-4 space-y-3 bg-white">
          <Link
            href="#features"
            className="block text-sm font-medium text-slate-600 py-2"
          >
            Platform
          </Link>
          <Link
            href="#stats"
            className="block text-sm font-medium text-slate-600 py-2"
          >
            Results
          </Link>
          <Link
            href="/login"
            className="block text-sm font-semibold text-white bg-emerald-600 text-center py-2.5 rounded-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
