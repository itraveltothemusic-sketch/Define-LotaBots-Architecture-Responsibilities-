import { NextResponse } from "next/server";
import { mockContractors } from "@/lib/db/mock-data";

/**
 * Contractors API Route
 *
 * Manages contractor profiles, verification, and assignments.
 * Every contractor must be verifiably qualified before scope assignment.
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const specialty = searchParams.get("specialty");

    let contractors = [...mockContractors];

    if (status) {
      contractors = contractors.filter((c) => c.status === status);
    }
    if (specialty) {
      contractors = contractors.filter((c) =>
        c.specialties.some((s) =>
          s.toLowerCase().includes(specialty.toLowerCase())
        )
      );
    }

    return NextResponse.json({ contractors, total: contractors.length });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch contractors" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newContractor = {
      id: `ctr_${Date.now()}`,
      ...body,
      status: "pending_approval",
      rating: null,
      completedProjects: 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ contractor: newContractor }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create contractor" },
      { status: 500 }
    );
  }
}
