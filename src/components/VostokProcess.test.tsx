import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import VostokProcess from "@/components/VostokProcess";

const mockMatchMedia = (matches: boolean) =>
  vi.fn().mockImplementation(() => ({
    matches,
    media: "(max-width: 767px)",
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

describe("VostokProcess", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia(true),
    });

    Object.defineProperty(HTMLMediaElement.prototype, "load", {
      configurable: true,
      value: vi.fn(),
    });

    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: vi.fn().mockResolvedValue(undefined),
    });
  });

  it("handles mobile taps on the before/after after icon through click events", () => {
    render(<VostokProcess />);

    const beforeButton = screen.getByRole("button", { name: "Before" });
    const afterButton = screen.getByRole("button", { name: "After" });

    fireEvent.click(afterButton, { detail: 1 });
    expect(
      screen.getByText(/Improvement across Mentalis, Orbicularis Oculi/i)
    ).toBeInTheDocument();

    fireEvent.click(beforeButton, { detail: 1 });
    expect(screen.getByText(/Flat zygomaticus\. Weak orbicularis oculi\./i)).toBeInTheDocument();

    fireEvent.click(afterButton, { detail: 1 });
    expect(
      screen.getByText(/Improvement across Mentalis, Orbicularis Oculi/i)
    ).toBeInTheDocument();
  });

  it("uses the responsive before/after after image variants on desktop and mobile", () => {
    const { unmount } = render(<VostokProcess />);

    const mobileAfterButton = screen.getByRole("button", { name: "After" });
    fireEvent.click(mobileAfterButton, { detail: 1 });

    const mobileImage = screen.getByAltText("BEFORE comparison");
    expect(mobileImage).toHaveAttribute("src", "/Comparison/1_mobile.JPG");

    unmount();

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia(false),
    });

    render(<VostokProcess />);

    const desktopAfterButton = screen.getByRole("button", { name: "After" });
    fireEvent.click(desktopAfterButton, { detail: 1 });

    const desktopImage = screen.getByAltText("BEFORE comparison");
    expect(desktopImage).toHaveAttribute("src", "/Comparison/1_desktop.JPG");
  });

  it("handles desktop clicks on the before/after icons", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia(false),
    });

    render(<VostokProcess />);

    const beforeButton = screen.getByRole("button", { name: "Before" });
    const afterButton = screen.getByRole("button", { name: "After" });

    fireEvent.click(afterButton);
    expect(
      screen.getByText(/Improvement across Mentalis, Orbicularis Oculi/i)
    ).toBeInTheDocument();

    fireEvent.click(beforeButton);
    expect(screen.getByText(/Flat zygomaticus\. Weak orbicularis oculi\./i)).toBeInTheDocument();
  });
});
