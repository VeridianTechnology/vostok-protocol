export type FeatureId =
  | "overall"
  | "cheeks"
  | "eyes"
  | "jaw"
  | "forehead"
  | "nose"
  | "lips"
  | "ears"
  | "back"
  | "neck";

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
      "Nine details. One connected form. Explore the fuller contours, lifted features, and clearer definition I see in my own comparisons.",
    tags: ["Balance", "Definition", "Proportion"],
    target: [0, 0.25, 0.1],
    distance: 7.5,
    angle: 0.15,
  },
  {
    id: "cheeks",
    number: "02",
    label: "Cheeks",
    heading: "Definition, brought forward.",
    description:
      "A subtle convex point beneath the outer eye flows smoothly toward the nose and temple. The resting cheek projects gently forward, without widening the face or creating a raised smile ridge.",
    tags: ["Gentle forward contour", "Smooth transition"],
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
      "A more defined upper-eyelid fold and a gentle upward lift beneath the brow, with only slight narrowing. The rest of the face stays in its original form.",
    tags: ["Upper-lid fold", "Gentle lift"],
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
  {
    id: "back",
    number: "09",
    label: "Back of Head",
    heading: "A firmer, lifted contour.",
    description:
      "Turn the sculpture around. A lower, relaxed contour lifts into a firmer shape at the back of the head, with a subtle sense of muscular definition.",
    tags: ["Upward lift", "Firmer contour"],
    target: [0, 0.6, -0.3],
    distance: 5,
    angle: Math.PI - 0.12,
  },
  {
    id: "neck",
    number: "10",
    label: "Neck",
    heading: "A smoother continuation.",
    description:
      "Gentle neck creases soften in the refined form. Some natural surface detail remains, while the face and jaw keep their original shape.",
    tags: ["Softer creases", "Smoother surface"],
    target: [0, -0.83, 0.15],
    distance: 4.1,
    angle: 0.35,
  },
];
