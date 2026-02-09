"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";

/**
 * Registration / Request Access Page
 *
 * In production, this handles:
 * - Access requests that go through admin approval
 * - Self-service registration for approved domains
 * - Contractor onboarding flow
 *
 * Currently: collects information and simulates submission.
 */
export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-600">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900">
            Equity Builders
          </span>
        </div>

        {!submitted ? (
          <>
            <h1 className="text-2xl font-bold text-slate-900">
              Request Access
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Tell us about yourself and we&apos;ll get you set up.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Your company"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  I am a...
                </label>
                <select className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white">
                  <option value="owner">Property Owner</option>
                  <option value="contractor">Contractor</option>
                  <option value="adjuster">Insurance Adjuster</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Tell us about your needs
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  placeholder="What brings you to Equity Builders?"
                />
              </div>
              <button
                type="submit"
                className="group w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all"
              >
                Submit Request
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Already have access?{" "}
              <Link
                href="/login"
                className="text-emerald-600 font-semibold hover:text-emerald-700"
              >
                Sign In
              </Link>
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 mx-auto mb-4">
              <Shield className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Request Submitted
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
              Thank you for your interest. Our team will review your request and
              reach out within 24 hours.
            </p>
            <Link
              href="/"
              className="inline-block mt-6 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
