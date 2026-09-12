import { BufferAttribute, BufferGeometry, Float32BufferAttribute } from "three";

const bell = (value: number, center: number, width: number) =>
  Math.exp(-(((value - center) / width) ** 2) * 2);
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const compact = (value: number) =>
  value < 0.025 ? 0 : (value - 0.025) / 0.975;
const gate = (value: number, low: number, high: number) => {
  const t = clamp((value - low) / (high - low));
  return t * t * (3 - 2 * t);
};

// Region masks are defined in the original scan coordinates. All changes are
// artistic deformations; they are not measured treatment effects or a face scan
// reconstructed from the supplied reference photographs.
export function prepareSculpture(source: BufferGeometry) {
  const geometry = source.clone();
  const positions = geometry.getAttribute("position");
  const before = new Float32Array(positions.count * 3);
  const deltas = Array.from(
    { length: 9 },
    () => new Float32Array(positions.count * 3),
  );
  const weightsA = new Float32Array(positions.count * 4);
  const weightsB = new Float32Array(positions.count * 4);
  const neckWeights = new Float32Array(positions.count);

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i),
      y = positions.getY(i);
    const z = positions.getZ(i);
    const side = Math.sign(x),
      ax = Math.abs(x);
    const front = clamp((z - 0.15) / 0.8);
    // Resting malar contour: a small convex peak beneath the outer eye, with
    // broad, smooth falloff toward the nose and temple. No smile ridge, shelf,
    // sideways inflation, or hollow carved into the lower cheek.
    const cheekBoundary =
      gate(ax, 0.3, 0.5) *
      (1 - gate(ax, 1.35, 1.58)) *
      gate(y, 0.1, 0.3) *
      (1 - gate(y, 1.35, 1.6)) *
      front;
    const cheeks =
      compact(bell(ax, 0.98, 0.64) * bell(y, 1.02, 0.72)) * cheekBoundary;
    const cheekPeak =
      compact(bell(ax, 0.96, 0.5) * bell(y, 1.17, 0.5)) * cheekBoundary;
    const eyes =
      compact(bell(ax, 0.7, 0.62) * bell(y, 1.79, 0.4) * front) *
      gate(y, 1.2, 1.45) *
      (1 - gate(y, 2.2, 2.4));
    const jaw =
      compact(
        bell(ax, 1.18, 0.54) * bell(y, -0.18, 0.63) * clamp((z + 0.7) / 1.1),
      ) *
      (1 - gate(y, 0.02, 0.2));
    // Follow the curved underside from the chin toward both jaw angles. The
    // reference contour has no separate central pad or broad, square jowls.
    const jawEdgeY = -0.46 + 0.27 * gate(ax, 0.25, 1.25);
    const belowJaw = jawEdgeY - y;
    const underChin =
      (1 - gate(ax, 1.05, 1.5)) *
      gate(belowJaw, 0, 0.3) *
      (1 - gate(belowJaw, 0.55, 1.2)) *
      gate(z, 0.4, 1.05);
    const forehead =
      (1 - gate(ax, 0.8, 1.5)) *
      gate(y, 1.97, 2.35) *
      (1 - gate(y, 3.25, 3.7)) *
      front;
    const nose =
      compact(
        bell(x, -0.09, 0.46) * bell(y, 1.19, 0.8) * clamp((z - 1.7) / 0.5),
      ) *
      gate(y, 0.65, 0.8) *
      (1 - gate(y, 1.8, 1.98));
    const lips =
      compact(bell(x, -0.07, 0.68) * bell(y, 0.4, 0.29) * front) *
      gate(y, 0.03, 0.15) *
      (1 - gate(y, 0.65, 0.77));
    const ears =
      compact(bell(ax, 1.71, 0.4) * bell(y, 1.28, 0.84) * bell(z, 0.0, 1.2)) *
      gate(ax, 1.24, 1.45) *
      gate(y, 0.2, 0.45);
    const back =
      (1 - gate(z, -1.1, -0.3)) *
      gate(y, -0.5, 0.35) *
      (1 - gate(y, 2.8, 3.6)) *
      (1 - gate(ax, 1.25, 1.85));
    const neck =
      gate(y, -2.8, -2.25) *
      (1 - gate(y, -1.15, -0.8)) *
      (1 - gate(ax, 0.85, 1.45)) *
      gate(z, -0.1, 0.55);
    const neckCrease =
      neck *
      (bell(y, -1.3 - ax * 0.08, 0.075) * 0.055 +
        bell(y, -1.7 - ax * 0.1, 0.075) * 0.065 +
        bell(y, -2.08 - ax * 0.1, 0.085) * 0.045);

    weightsA.set([cheeks, eyes, Math.max(jaw, underChin), forehead], i * 4);
    weightsB.set([nose, lips, ears, back], i * 4);
    neckWeights[i] = neck;

    // Subtle initial asymmetry and relaxed contours establish the before form.
    const bx = x;
    const by = y - cheeks * 0.02 - forehead * 0.035 - back * 0.065;
    const foreheadCrease = forehead * Math.sin(y * 25) * 0.006;
    const noseBump = bell(x, -0.09, 0.23) * bell(y, 1.5, 0.32) * nose * 0.12;
    const bz = z + foreheadCrease + noseBump - neckCrease;
    before.set([bx * 0.45, by * 0.45, bz * 0.45], i * 3);

    const cornerLift = clamp((ax - 0.36) / 0.65);
    const aperture = eyes * gate(y, 1.2, 1.42) * (1 - gate(y, 1.85, 2.15));
    const eyeLift = aperture * (0.042 - (y - 1.64) * 0.09 + cornerLift * 0.012);
    // Raised, arched lid relief, rather than an exaggerated squint or brow shelf.
    const eyeCenterX = x < -0.03 / 0.45 ? -0.342 / 0.45 : 0.257 / 0.45;
    const eyeDx = x - eyeCenterX;
    const lidSpan =
      (1 - gate(Math.abs(eyeDx), 0.32, 0.55)) *
      front *
      gate(y, 1.2, 1.45) *
      (1 - gate(y, 2.15, 2.4));
    const lidArc = 1.67 + 0.14 * Math.max(0, 1 - (eyeDx / 0.5) ** 2);
    const upperLidFold =
      lidSpan *
      (bell(y, lidArc + 0.1, 0.085) * 0.052 -
        bell(y, lidArc + 0.21, 0.045) * 0.016);
    const nostrils = compact(bell(y, 0.93, 0.24) * bell(ax, 0.3, 0.32)) * nose;
    const chinLift = underChin * 0.12;
    // Keep the tightened underside in front of the neck's natural envelope;
    // a free Gaussian retraction would create a hollow pocket below the chin.
    const neckEnvelope = 0.48 + (y + chinLift + 1.5) * 0.4 - ax * 0.16;
    const available =
      (z - neckEnvelope + Math.hypot(z - neckEnvelope, 0.035)) * 0.5;
    const chinRetraction =
      available * (1 - Math.exp((-underChin * 0.7) / available));
    const regionOffsets = [
      [0, cheeks * 0.018, cheeks * 0.14 + cheekPeak * 0.04],
      [0, eyeLift, upperLidFold],
      [side * jaw * 0.025, chinLift, jaw * 0.025 - chinRetraction],
      [0, forehead * 0.075, forehead * 0.035 - foreheadCrease],
      [-(x + 0.09) * nostrils * 0.22, 0, -noseBump],
      [(x + 0.07) * lips * 0.14, (y - 0.4) * lips * 0.5, lips * 0.125],
      [-side * ears * 0.18, ears * 0.13, -ears * 0.04],
      [side * back * 0.035, back * 0.18, -back * 0.05],
      [-x * neck * 0.015, 0, neckCrease * 0.82],
    ];
    regionOffsets.forEach((offset, region) =>
      deltas[region].set(
        offset.map((n) => n * 0.45),
        i * 3,
      ),
    );
  }

  geometry.setAttribute("position", new BufferAttribute(before, 3));
  geometry.setAttribute(
    "studyWeightsA",
    new Float32BufferAttribute(weightsA, 4),
  );
  geometry.setAttribute(
    "studyWeightsB",
    new Float32BufferAttribute(weightsB, 4),
  );
  geometry.setAttribute(
    "studyNeckWeight",
    new Float32BufferAttribute(neckWeights, 1),
  );
  geometry.computeVertexNormals();
  const baseNormals = geometry.getAttribute("normal");
  const morphNormals = deltas.map((delta) => {
    const target = geometry.clone();
    target.setAttribute(
      "position",
      new BufferAttribute(
        before.map((value, i) => value + delta[i]),
        3,
      ),
    );
    target.computeVertexNormals();
    const targetNormals = target.getAttribute("normal");
    const normalDelta = new Float32Array(before.length);
    for (let i = 0; i < normalDelta.length; i++)
      normalDelta[i] = targetNormals.array[i] - baseNormals.array[i];
    target.dispose();
    return new BufferAttribute(normalDelta, 3);
  });
  geometry.morphAttributes.position = deltas.map(
    (delta) => new BufferAttribute(delta, 3),
  );
  geometry.morphAttributes.normal = morphNormals;
  geometry.morphTargetsRelative = true;
  geometry.computeBoundingSphere();
  return geometry;
}
