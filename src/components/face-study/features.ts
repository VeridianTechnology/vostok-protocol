export type FeatureId =
  | "overall"
  | "cheeks"
  | "eyes"
  | "jaw"
  | "forehead"
  | "nose"
  | "lips"
  | "ears";

export const features: {
  id: FeatureId;
  number: string;
  label: string;
  heading: string;
  description: string;
  tags: string[];
  target: [number, number, number];
  distance: number;
  angle: number;
}[] = [
  {
    id: "overall",
    number: "01",
    label: "Overall Face",
    heading: "A study in harmony.",
    description:
      "Seven details. One connected form. Explore the fuller contours, lifted features, and clearer definition I see in my own comparisons.",
    tags: ["Balance", "Definition", "Proportion"],
    target: [0, 0.25, 0.1],
    distance: 7.5,
    angle: 0.15,
  },
  {
    id: "cheeks",
    number: "02",
    label: "Cheeks",
    heading: "Fullness, lifted.",
    description:
      "A fuller upper cheek with a higher, more angled contour. Move between the two forms to follow the upward sweep.",
    tags: ["Fuller contour", "Upward lift"],
    target: [0, 0.43, 0.72],
    distance: 4.3,
    angle: 0.28,
  },
  {
    id: "eyes",
    number: "03",
    label: "Eyes",
    heading: "A sharper expression.",
    description:
      "A natural, open gaze with a gently lifted outer corner and subtly refined pupils. Compare the eye area while the rest of the face stays in its original form.",
    tags: ["Lifted corners", "Refined gaze"],
    target: [0, 0.79, 0.82],
    distance: 3.5,
    angle: 0,
  },
  {
    id: "jaw",
    number: "04",
    label: "Jaw",
    heading: "A cleaner chin contour.",
    description:
      "The fullness beneath the chin draws up and back, revealing a cleaner lower contour. The cheeks and eyes retain their original shape.",
    tags: ["Under-chin lift", "Natural jawline"],
    target: [0, -0.24, 0.55],
    distance: 4.4,
    angle: 0.64,
  },
  {
    id: "forehead",
    number: "05",
    label: "Forehead",
    heading: "A softer, lifted arc.",
    description:
      "A rounder, smoother forehead with a subtle upward lift. The surface transitions from a heavier brow into a more open contour.",
    tags: ["Smoother surface", "Rounded form"],
    target: [0, 1.25, 0.7],
    distance: 3.7,
    angle: 0.2,
  },
  {
    id: "nose",
    number: "06",
    label: "Nose",
    heading: "Refinement in profile.",
    description:
      "A small bump on the bridge smooths away, and the nostrils become a little narrower. The surrounding face stays exactly as it was.",
    tags: ["Smoother bridge", "Finer nostrils"],
    target: [0, 0.58, 0.95],
    distance: 3.3,
    angle: 0.58,
  },
  {
    id: "lips",
    number: "07",
    label: "Lips",
    heading: "A fuller proportion.",
    description:
      "More fullness in both lips, with a subtly wider shape and a balanced upper-to-lower contour. Use the slider to see the detail.",
    tags: ["Fullness", "Balanced contour"],
    target: [0, 0.19, 0.98],
    distance: 2.8,
    angle: 0.06,
  },
  {
    id: "ears",
    number: "08",
    label: "Ears",
    heading: "Closer to the contour.",
    description:
      "A slightly higher position and a closer-fitting outer curve. Turn to the side to follow how the ears sit against the head.",
    tags: ["Higher position", "Closer fit"],
    target: [0.55, 0.6, 0.04],
    distance: 3.7,
    angle: 1.12,
  },
];
