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
