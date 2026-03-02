import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toMobileImage(src: string) {
  if (src.endsWith(".jpg") || src.endsWith(".jpeg")) {
    return src.replace(/(\.jpe?g)$/i, "_mobile$1");
  }
  return src;
}

export function toDesktopImage(src: string) {
  if (src.endsWith(".jpg") || src.endsWith(".jpeg")) {
    return src.replace(/(\.jpe?g)$/i, "_desktop$1");
  }
  return src;
}

export function getImageVariants(src: string) {
  if (!src.endsWith(".jpg") && !src.endsWith(".jpeg")) {
    return null;
  }
  const match = src.match(/(\.jpe?g)$/i);
  if (!match) {
    return null;
  }
  const ext = match[1];
  const base = src.slice(0, -ext.length);
  return {
    mobile: `${base}_mobile${ext}`,
    desktop: `${base}_desktop${ext}`,
    avif: {
      mobile: `${base}_mobile.avif`,
      desktop: `${base}_desktop.avif`,
    },
    webp: {
      mobile: `${base}_mobile.webp`,
      desktop: `${base}_desktop.webp`,
    },
  };
}
