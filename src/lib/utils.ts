import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getJpegParts(src: string) {
  const match = src.match(/(\.jpe?g)$/i);
  if (!match) {
    return null;
  }

  return {
    base: src.slice(0, -match[1].length),
    ext: match[1],
  };
}

export function toMobileImage(src: string) {
  const jpegParts = getJpegParts(src);
  if (!jpegParts) {
    return src;
  }

  return `${jpegParts.base}_mobile${jpegParts.ext}`;
}

export function toDesktopImage(src: string) {
  const jpegParts = getJpegParts(src);
  if (!jpegParts) {
    return src;
  }

  return `${jpegParts.base}_desktop${jpegParts.ext}`;
}

export function getImageVariants(src: string) {
  const jpegParts = getJpegParts(src);
  if (!jpegParts) {
    return null;
  }

  const { base, ext } = jpegParts;
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
