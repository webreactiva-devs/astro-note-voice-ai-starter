import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("utils", () => {
  describe("cn function", () => {
    it("combina clases CSS correctamente", () => {
      const result = cn("bg-red-500", "text-white", "p-4");
      expect(result).toBe("bg-red-500 text-white p-4");
    });

    it("maneja clases condicionales", () => {
      const isActive = true;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toBe("base-class active-class");
    });

    it("maneja clases condicionales falsas", () => {
      const isActive = false;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toBe("base-class");
    });

    it("resuelve conflictos de Tailwind correctamente", () => {
      const result = cn("p-2", "p-4"); // p-4 debería ganar
      expect(result).toBe("p-4");
    });

    it("maneja arrays de clases", () => {
      const result = cn(["bg-blue-500", "text-white"], "p-2");
      expect(result).toBe("bg-blue-500 text-white p-2");
    });

    it("maneja objetos de clases", () => {
      const result = cn({
        "bg-red-500": true,
        "bg-blue-500": false,
        "text-white": true,
      });
      expect(result).toBe("bg-red-500 text-white");
    });

    it("maneja valores undefined y null", () => {
      const result = cn("base-class", undefined, null, "other-class");
      expect(result).toBe("base-class other-class");
    });

    it("maneja strings vacíos", () => {
      const result = cn("base-class", "", "other-class");
      expect(result).toBe("base-class other-class");
    });
  });
});
