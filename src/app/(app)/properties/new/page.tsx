import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createProperty } from "./actions";

export default function NewPropertyPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
          Forensic Property Module
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Create property</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Properties are the root of the evidence timeline and claim strategy.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property record</CardTitle>
          <CardDescription>
            Create a defensible identity for the asset before adding inspections and evidence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {searchParams?.error ? (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
              Please check your inputs and try again.
            </div>
          ) : null}

          <form action={createProperty} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display name</Label>
              <Input
                id="displayName"
                name="displayName"
                placeholder="e.g., Baypoint Plaza — Building A"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address1">Address line 1</Label>
                <Input id="address1" name="address1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address2">Address line 2</Label>
                <Input id="address2" name="address2" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">State/Region</Label>
                <Input id="region" name="region" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal code</Label>
                <Input id="postalCode" name="postalCode" required />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <Link href="/properties" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
                Cancel
              </Link>
              <Button type="submit">Create property</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

