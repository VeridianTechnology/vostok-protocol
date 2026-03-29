import { describe, expect, it } from "vitest";
import { getImageVariants, toDesktopImage, toMobileImage } from "@/lib/utils";

describe("image variant helpers", () => {
  it("resolves uppercase JPG sources", () => {
    expect(toMobileImage("/Comparison/1.JPG")).toBe("/Comparison/1_mobile.JPG");
    expect(toDesktopImage("/Comparison/1.JPG")).toBe("/Comparison/1_desktop.JPG");
    expect(getImageVariants("/Comparison/1.JPG")).toEqual({
      mobile: "/Comparison/1_mobile.JPG",
      desktop: "/Comparison/1_desktop.JPG",
      avif: {
        mobile: "/Comparison/1_mobile.avif",
        desktop: "/Comparison/1_desktop.avif",
      },
      webp: {
        mobile: "/Comparison/1_mobile.webp",
        desktop: "/Comparison/1_desktop.webp",
      },
    });
  });
});
