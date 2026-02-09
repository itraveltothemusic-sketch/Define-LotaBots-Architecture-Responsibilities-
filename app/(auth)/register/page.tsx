/**
 * Registration Page
 * 
 * New user account creation interface.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { registerUser } from "@/lib/auth/actions";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await registerUser(formData);
      
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <BuildingOfficeIcon className="h-10 w-10 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">Equity Builders</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join the platform and start building equity</p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Full Name"
                type="text"
                name="name"
                placeholder="John Doe"
                required
                autoComplete="name"
              />

              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                helperText="Min. 8 characters with uppercase, lowercase, and number"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="owner">Property Owner</option>
                  <option value="contractor">Contractor</option>
                  <option value="adjuster">Insurance Adjuster</option>
                  <option value="internal">Internal Team</option>
                </select>
              </div>

              <Input
                label="Phone"
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                autoComplete="tel"
              />

              <Input
                label="Company"
                type="text"
                name="company"
                placeholder="Company Name"
                autoComplete="organization"
              />

              <div className="text-xs text-gray-600">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-primary-600 hover:text-primary-700">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-8">
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  );
}
