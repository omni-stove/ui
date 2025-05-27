import { describe, expect, it } from "vitest";
import type { Material3Colors } from "../types";
import { argbToHex, calculateMaterial3Colors } from "./index";

describe("Theme Utilities", () => {
  describe("argbToHex", () => {
    it("should convert ARGB number to HEXA string with full alpha", () => {
      expect(argbToHex(0xffaabbcc)).toBe("#aabbccff");
    });

    it("should convert ARGB number to HEXA string with partial alpha", () => {
      expect(argbToHex(0x80000000)).toBe("#00000080");
    });

    it("should convert ARGB number to HEXA string with zero alpha", () => {
      expect(argbToHex(0x00112233)).toBe("#11223300");
    });

    it("should handle pure black with full alpha", () => {
      expect(argbToHex(0xff000000)).toBe("#000000ff");
    });

    it("should handle pure white with full alpha", () => {
      expect(argbToHex(0xffffffff)).toBe("#ffffffff");
    });
  });

  describe("calculateMaterial3Colors", () => {
    const sourceColor = "#6750A4"; // A common Material Design purple

    it("should calculate Material3 colors for a light theme", () => {
      const isDark = false;
      const colors = calculateMaterial3Colors(
        sourceColor,
        isDark,
      ) as Material3Colors;

      expect(colors.primaryFixed).toBeDefined();
      expect(colors.primaryFixed).toMatch(/^#[0-9a-f]{8}$/i);

      expect(colors.surfaceContainer).toBeDefined();
      expect(colors.surfaceContainer).toMatch(/^#[0-9a-f]{8}$/i);

      expect(colors.tertiaryFixedDim).toBeDefined();
      expect(colors.tertiaryFixedDim).toMatch(/^#[0-9a-f]{8}$/i);

      expect(colors.primaryFixed?.toLowerCase()).toBe("#e9ddffff");
      expect(colors.onPrimaryFixed?.toLowerCase()).toBe("#22005dff");
      expect(colors.surfaceContainerLowest?.toLowerCase()).toBe("#ffffffff");
    });

    it("should calculate Material3 colors for a dark theme", () => {
      const isDark = true;
      const colors = calculateMaterial3Colors(
        sourceColor,
        isDark,
      ) as Material3Colors;

      expect(colors.primaryFixed).toBeDefined();
      expect(colors.primaryFixed).toMatch(/^#[0-9a-f]{8}$/i);

      expect(colors.surfaceDim).toBeDefined();
      expect(colors.surfaceDim).toMatch(/^#[0-9a-f]{8}$/i);

      expect(colors.secondaryFixed).toBeDefined();
      expect(colors.secondaryFixed).toMatch(/^#[0-9a-f]{8}$/i);

      expect(colors.primaryFixed?.toLowerCase()).toBe("#e9ddffff");
      expect(colors.onPrimaryFixed?.toLowerCase()).toBe("#22005dff");
      expect(colors.surfaceContainerLowest?.toLowerCase()).toBe("#0f0e11ff");
    });

    it("should produce different surface colors for light and dark themes", () => {
      const lightColors = calculateMaterial3Colors(
        sourceColor,
        false,
      ) as Material3Colors;
      const darkColors = calculateMaterial3Colors(
        sourceColor,
        true,
      ) as Material3Colors;
      expect(lightColors.surfaceContainer).not.toBe(
        darkColors.surfaceContainer,
      );
    });
  });
});
