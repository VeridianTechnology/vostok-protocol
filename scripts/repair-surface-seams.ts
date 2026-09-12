import { BufferAttribute, BufferGeometry } from "three";

// Polygon clipping inserts points on some neighbouring edges. Split the other
// edge at the same points, so nonlinear morphs cannot open a T-junction crack.
export function repairSurfaceSeams(geometry: BufferGeometry) {
  const positions = Array.from(
    geometry.getAttribute("position").array,
  ) as number[];
  const indices = Array.from(geometry.getIndex()!.array) as number[];
  const key = (a: number, b: number) => `${Math.min(a, b)},${Math.max(a, b)}`;
  const edges = new Map<string, { a: number; b: number; count: number }>();
  for (let i = 0; i < indices.length; i += 3)
    for (let j = 0; j < 3; j++) {
      const a = indices[i + j],
        b = indices[i + ((j + 1) % 3)],
        k = key(a, b);
      const edge = edges.get(k);
      if (edge) edge.count++;
      else edges.set(k, { a, b, count: 1 });
    }
  const boundary = [...edges.values()].filter((edge) => edge.count === 1);
  const candidates = [...new Set(boundary.flatMap((edge) => [edge.a, edge.b]))];
  const splits = new Map<string, { vertex: number; t: number }[]>();
  for (const { a, b } of boundary) {
    const ab = [0, 1, 2].map(
      (axis) => positions[b * 3 + axis] - positions[a * 3 + axis],
    );
    const lengthSquared = ab.reduce((sum, value) => sum + value * value, 0);
    if (lengthSquared < 1e-12) continue;
    const points = [];
    for (const v of candidates) {
      if (v === a || v === b) continue;
      const av = [0, 1, 2].map(
        (axis) => positions[v * 3 + axis] - positions[a * 3 + axis],
      );
      const t =
        av.reduce((sum, value, axis) => sum + value * ab[axis], 0) /
        lengthSquared;
      if (t <= 0.00001 || t >= 0.99999) continue;
      if (
        Math.hypot(...av.map((value, axis) => value - t * ab[axis])) < 0.00003
      )
        points.push({ vertex: v, t });
    }
    if (points.length)
      splits.set(
        key(a, b),
        points.sort((p, q) => p.t - q.t),
      );
  }
  const output: number[] = [];
  for (let i = 0; i < indices.length; i += 3) {
    const triangle = indices.slice(i, i + 3);
    if (!triangle.some((a, j) => splits.has(key(a, triangle[(j + 1) % 3])))) {
      output.push(...triangle);
      continue;
    }
    const polygon: number[] = [];
    for (let j = 0; j < 3; j++) {
      const a = triangle[j],
        b = triangle[(j + 1) % 3];
      polygon.push(a);
      const split = splits.get(key(a, b));
      if (split) {
        const edge = edges.get(key(a, b))!;
        polygon.push(
          ...(edge.a === a ? split : [...split].reverse()).map((p) => p.vertex),
        );
      }
    }
    const center = positions.length / 3;
    positions.push(
      ...[0, 1, 2].map(
        (axis) =>
          triangle.reduce((sum, v) => sum + positions[v * 3 + axis], 0) / 3,
      ),
    );
    for (let j = 0; j < polygon.length; j++)
      output.push(center, polygon[j], polygon[(j + 1) % polygon.length]);
  }
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array(positions), 3),
  );
  geometry.setIndex(output);
  console.log(`Repaired ${splits.size} clipped seam edges.`);
  return geometry;
}
