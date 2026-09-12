import type { FeatureId } from "./features";

const paths: Record<FeatureId, React.ReactNode> = {
  overall: (
    <>
      <path d="M9 4c-3 1-4 4-4 8 0 5 3 10 7 11 4-1 7-6 7-11 0-4-1-7-4-8M9 4c2-1 4-1 6 0M4 11l-1 1 1 4 2 1m14-6 1 1-1 4-2 1M8 11h2m4 0h2m-4 1-1 4h2m-4 3h6" />
    </>
  ),
  cheeks: (
    <>
      <path d="M5 4c-1 3-1 5-1 8 0 4 3 9 8 11 5-2 8-7 8-11 0-3 0-5-1-8M7 10h3m4 0h3M12 12l-1 3h2M9 19h6" />
      <path d="m5 14 3-2 2 3-3 2Zm14 0-3-2-2 3 3 2Z" />
    </>
  ),
  eyes: (
    <>
      <path d="M2 13c2-4 5-5 9-1-3 3-6 4-9 1Zm20 0c-2-4-5-5-9-1 3 3 6 4 9 1ZM2 8l6-1m14 1-6-1M12 13v5" />
      <circle cx="6.5" cy="12.2" r="1.2" />
      <circle cx="17.5" cy="12.2" r="1.2" />
    </>
  ),
  jaw: (
    <>
      <path d="M4 4v9c0 4 5 7 8 9 3-2 8-5 8-9V4M7 12v3l5 4 5-4v-3M10 14h4" />
      <path d="m3 16 2 3 4 3m12-6-2 3-4 3" />
    </>
  ),
  forehead: (
    <>
      <path d="M4 16V9c0-8 16-8 16 0v7M7 16h3m4 0h3M12 17v4M7 10c3-1 7-1 10 0M7 7c3-1 7-1 10 0" />
      <path d="m10 3 2-2 2 2" />
    </>
  ),
  nose: (
    <>
      <path d="M9 3c1 4-1 7-3 12-1 3 1 5 4 3m5-15c-1 4 1 7 3 12 1 3-1 5-4 3M10 18c1 2 3 2 4 0M8 16h2m4 0h2M12 6v7" />
    </>
  ),
  lips: (
    <>
      <path d="M2 13c3-1 6-6 10-3 4-3 7 2 10 3-5 8-15 8-20 0Z" />
      <path d="M2 13c5-1 6 2 10 1s5-2 10-1M7 18c3 2 7 2 10 0" />
    </>
  ),
  ears: (
    <>
      <path d="M8 21C5 20 7 17 4 13-2 5 10-2 13 5c2 5-4 7-3 11 1 4-1 6-2 5ZM7 14c-7-7 3-11 3-6 0 3-5 2-3 6M17 3v19m3-16 2 2-2 2m0 6 2 2-2 2" />
    </>
  ),
  back: (
    <>
      <path d="M6 17c-2-3-2-7-1-10 2-6 12-6 14 0 1 3 1 7-1 10l-2 3v4M8 24v-4l-2-3M5 12l-2-1v4l3 3m13-6 2-1v4l-3 3M12 8v10m-3-6 3-3 3 3" />
    </>
  ),
  neck: (
    <>
      <path d="M7 2c0 4 1 5 5 6 4-1 5-2 5-6M8 7v10L2 21m14-14v10l6 4M8 12c2 1 6 1 8 0M8 15c2 1 6 1 8 0M5 23l7-2 7 2" />
    </>
  ),
};

export default function FeatureIcon({ feature }: { feature: FeatureId }) {
  return (
    <svg
      viewBox="0 0 24 26"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.85"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[feature]}
    </svg>
  );
}
