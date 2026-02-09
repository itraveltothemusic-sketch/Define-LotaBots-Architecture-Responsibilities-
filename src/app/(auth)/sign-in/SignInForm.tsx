"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm({ disabled }: { disabled?: boolean }) {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const presetEmail = params.get("email") || "";

  const [email, setEmail] = React.useState(presetEmail);
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        if (disabled) return;
        setIsSubmitting(true);
        setError(null);

        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl,
        });

        setIsSubmitting(false);

        if (!res) {
          setError("Sign-in failed. Please try again.");
          return;
        }

        if (res.error) {
          setError("Invalid email or password.");
          return;
        }

        window.location.href = res.url || callbackUrl;
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={disabled}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={disabled}
          required
        />
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <Button className="w-full" size="lg" disabled={disabled || isSubmitting}>
        {disabled ? "Database not configured" : isSubmitting ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Dev seed users (after `npm run db:seed`):{" "}
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          owner@equitybuilders.local
        </span>{" "}
        and{" "}
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          internal@equitybuilders.local
        </span>
        .
      </p>
    </form>
  );
}

