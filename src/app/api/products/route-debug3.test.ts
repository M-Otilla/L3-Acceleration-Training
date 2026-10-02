import { describe, it, expect } from "vitest";
import { validateProductInput } from "@/API/helpers";

describe("debug3", () => {
  it("validates with explicit slug and productCode in payload", () => {
    const payload = {
      name: "Pizza Margherita",
      category: "pizza",
      price: 15,
      slug: "pizza-margherita",
      productCode: "PIZZAMARGHERITA",
    };
    try {
      const result = validateProductInput(payload);
      console.log("With explicit slug:", JSON.stringify(result, null, 2));
      expect(true).toBe(true);
    } catch (e) {
      console.log("Error:", e instanceof Error ? e.message : e);
      expect(e).not.toBeDefined();
    }
  });

  it("validates without explicit slug", () => {
    const payload = { name: "Pizza Margherita", category: "pizza", price: 15 };
    try {
      const result = validateProductInput(payload);
      console.log("Without explicit slug:", JSON.stringify(result, null, 2));
      expect(true).toBe(true);
    } catch (e) {
      console.log("Error:", e instanceof Error ? e.message : e);
      expect(e).not.toBeDefined();
    }
  });
});
