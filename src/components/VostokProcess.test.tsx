import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import VostokProcess from "@/components/VostokProcess";

describe("VostokProcess", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: true,
        media: "(max-width: 767px)",
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
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

    const stageButtons = screen.getAllByRole("button", { name: "BEFORE / AFTER option" });
    const beforeButton = stageButtons[0];
    const afterButton = stageButtons[1];

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
});
