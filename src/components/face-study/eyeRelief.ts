const resolution = 81;
const fade = (value: number, inner: number, outer: number) => {
  const t = Math.max(
    0,
    Math.min(1, (Math.abs(value) - inner) / (outer - inner)),
  );
  return 1 - t * t * (3 - 2 * t);
};

export function eyeRelief(
  x: number,
  y: number,
  z: number,
  field: Float32Array,
) {
  if (y < 0.55 || y > 1.05) return z;
  const left = x < -0.03;
  const dx = x - (left ? -0.342 : 0.257),
    dy = y - 0.8;
  // The donor supplies eyelids, not a second eyebrow shelf. Feather it out
  // gradually above the upper lid, well before the forehead patch boundary.
  const verticalWeight =
    dy > 0 ? fade(dy, 0.015, 0.155) : fade(dy, 0.115, 0.225);
  const weight = fade(dx, 0.15, 0.255) * verticalWeight;
  if (weight <= 0) return z;
  // Scale the actual socket aperture uniformly around the eyeball centre,
  // rather than making only the After expression look like a squint.
  const sampleX = dx / 0.88;
  const sampleY = (y - 0.738) / 0.88 - 0.062;
  const u = Math.max(0, Math.min(79.999, (sampleX / 0.27 + 1) * 40));
  const v = Math.max(0, Math.min(79.999, (sampleY / 0.25 + 1) * 40));
  const col = Math.floor(u),
    row = Math.floor(v),
    tx = u - col,
    ty = v - row;
  const i = (left ? 0 : resolution * resolution) + row * resolution + col;
  const depth =
    (field[i] * (1 - tx) + field[i + 1] * tx) * (1 - ty) +
    (field[i + resolution] * (1 - tx) + field[i + resolution + 1] * tx) * ty;
  return z + (depth - (left ? 0.13 : 0.16) - z) * weight;
}
