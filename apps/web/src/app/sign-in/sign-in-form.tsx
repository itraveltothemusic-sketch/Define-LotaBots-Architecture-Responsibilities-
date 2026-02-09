"use client";

import * as React from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function SignInForm({ disabled }: { disabled?: boolean }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;

    setPending(true);
    setError(null);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/dashboard",
      });

      if (!res || res.error) {
        setError("Invalid credentials or access is not configured.");
        return;
      }

      // If signIn succeeded, NextAuth returns a URL.
      window.location.assign(res.url ?? "/dashboard");
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Email
        </label>
        <input
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={pending || disabled}
          placeholder="name@company.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Password
        </label>
        <input
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-zinc-700 dark:focus:ring-zinc-800"
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={pending || disabled}
          placeholder="••••••••••••"
          minLength={8}
          required
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      <Button className="w-full" type="submit" disabled={pending || disabled}>
        {disabled ? "Authentication not configured" : pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

