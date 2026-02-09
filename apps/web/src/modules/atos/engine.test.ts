import { describe, expect, it } from "vitest";
import { deriveAtosGuidance } from "@/modules/atos/engine";

describe("ATOS deterministic guidance engine", () => {
  it("never invents a property when none is present", () => {
    const guidance = deriveAtosGuidance({
      mode: "live",
      property: null,
      evidence: [],
    });

    const noProperty = guidance.find((g) => g.id === "no-property");
    expect(noProperty).toBeTruthy();
    expect(noProperty?.severity).toBe("critical");
    expect(noProperty?.groundedFacts).toContain("Property: null");
  });

  it("flags stub mode explicitly (non-authoritative)", () => {
    const guidance = deriveAtosGuidance({
      mode: "stub",
      property: {
        id: "stub",
        displayName: "Stub Property",
        addressLine1: null,
        city: null,
        region: null,
        postalCode: null,
      },
      evidence: [],
    });

    const stub = guidance.find((g) => g.id === "mode-stub");
    expect(stub).toBeTruthy();
    expect(stub?.groundedFacts.join(" ")).toMatch(/stub/i);
  });
});

