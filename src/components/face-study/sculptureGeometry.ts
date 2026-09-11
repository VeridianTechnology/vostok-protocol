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
    { length: 7 },
    () => new Float32Array(positions.count * 3),
  );
  const weightsA = new Float32Array(positions.count * 4);
  const weightsB = new Float32Array(positions.count * 3);

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i),
      y = positions.getY(i);
    const z = positions.getZ(i);
    const side = Math.sign(x),
      ax = Math.abs(x);
    const front = clamp((z - 0.15) / 0.8);
    const cheeks =
      compact(bell(ax, 0.95, 0.64) * bell(y, 0.88, 0.71) * front) *
      gate(y, 0.05, 0.35) *
      (1 - gate(y, 1.25, 1.55));
    const eyes =
      compact(bell(ax, 0.7, 0.62) * bell(y, 1.79, 0.4) * front) *
      gate(y, 1.2, 1.45) *
      (1 - gate(y, 2.2, 2.4));
    const jaw =
      compact(
        bell(ax, 1.18, 0.54) * bell(y, -0.18, 0.63) * clamp((z + 0.7) / 1.1),
      ) *
      (1 - gate(y, 0.02, 0.2));
    const underChin =
      compact(bell(x, 0, 1.05) * bell(y, -0.95, 0.64) * gate(z, 0.6, 1.05)) *
      (1 - gate(y, -0.55, -0.35));
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

    weightsA.set([cheeks, eyes, Math.max(jaw, underChin), forehead], i * 4);
    weightsB.set([nose, lips, ears], i * 3);

    // Subtle initial asymmetry and relaxed contours establish the before form.
    const bx = x;
    const by = y - cheeks * 0.08 - forehead * 0.035;
    const foreheadCrease = forehead * Math.sin(y * 25) * 0.006;
    const noseBump = bell(x, -0.09, 0.23) * bell(y, 1.5, 0.32) * nose * 0.12;
    const bz = z + foreheadCrease + noseBump;
    before.set([bx * 0.45, by * 0.45, bz * 0.45], i * 3);

    const cornerLift = clamp((ax - 0.36) / 0.65);
    const nostrils = compact(bell(y, 0.93, 0.24) * bell(ax, 0.3, 0.32)) * nose;
    const chinLift = underChin * 0.12;
    // Keep the tightened underside in front of the neck's natural envelope;
    // a free Gaussian retraction would create a hollow pocket below the chin.
    const neckEnvelope = 0.65 + (y + chinLift + 1.5) * 0.5;
    const available = (z - neckEnvelope + Math.hypot(z - neckEnvelope, 0.035)) * 0.5;
    const chinRetraction = available * (1 - Math.exp(-underChin * 0.6 / available));
    const regionOffsets = [
      [side * cheeks * 0.08, cheeks * 0.23, cheeks * 0.14],
      [0, eyes * (0.055 * cornerLift - (y - 1.78) * 0.035), 0],
      [side * jaw * 0.025, chinLift, jaw * 0.025 - chinRetraction],
      [0, forehead * 0.075, forehead * 0.035 - foreheadCrease],
      [-(x + 0.09) * nostrils * 0.22, 0, -noseBump],
      [(x + 0.07) * lips * 0.14, (y - 0.4) * lips * 0.5, lips * 0.125],
      [-side * ears * 0.18, ears * 0.13, -ears * 0.04],
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
    new Float32BufferAttribute(weightsB, 3),
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
