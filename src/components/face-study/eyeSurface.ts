import { BufferGeometry, Float32BufferAttribute } from "three";
import { eyeRelief } from "./eyeRelief";

type Point = [number, number, number];
type Triangle = [Point, Point, Point];

// The closed scan eyelids fold back on themselves. Merely moving their depth
// leaves overlapping triangles. Replace only those two small surface patches
// with a regular relief mesh, retaining every original boundary intersection.
export function openEyeSurface(source: BufferGeometry, field: Float32Array) {
  const position = source.getAttribute("position");
  const index = source.getIndex()!;
  let triangles: Triangle[] = [];
  for (let i = 0; i < index.count; i += 3) {
    triangles.push(
      [0, 1, 2].map((offset) => {
        const n = index.getX(i + offset);
        return [
          position.getX(n) * 0.45,
          position.getY(n) * 0.45,
          position.getZ(n) * 0.45,
        ];
      }) as Triangle,
    );
  }
  const original = triangles;
  const surfaceDepth = (x: number, y: number) => {
    let z = -Infinity;
    for (const [a, b, c] of original) {
      if (
        Math.max(a[2], b[2], c[2]) < 0.2 ||
        x < Math.min(a[0], b[0], c[0]) ||
        x > Math.max(a[0], b[0], c[0]) ||
        y < Math.min(a[1], b[1], c[1]) ||
        y > Math.max(a[1], b[1], c[1])
      )
        continue;
      const det = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1]);
      if (Math.abs(det) < 1e-12) continue;
      const u = ((b[1] - c[1]) * (x - c[0]) + (c[0] - b[0]) * (y - c[1])) / det;
      const v = ((c[1] - a[1]) * (x - c[0]) + (a[0] - c[0]) * (y - c[1])) / det;
      if (u >= -1e-5 && v >= -1e-5 && u + v <= 1.00001)
        z = Math.max(z, u * a[2] + v * b[2] + (1 - u - v) * c[2]);
    }
    return z;
  };
  for (const center of [-0.342, 0.257]) {
    const x0 = center - 0.265,
      x1 = center + 0.265,
      y0 = 0.565,
      y1 = 1.035;
    const boundary: Point[] = [];
    const remaining: Triangle[] = [];
    const append = (polygon: Point[]) => {
      for (let i = 1; i < polygon.length - 1; i++)
        remaining.push([polygon[0], polygon[i], polygon[i + 1]]);
    };
    for (const triangle of triangles) {
      if (
        Math.min(...triangle.map((p) => p[2])) < 0.2 ||
        Math.max(...triangle.map((p) => p[0])) < x0 ||
        Math.min(...triangle.map((p) => p[0])) > x1 ||
        Math.max(...triangle.map((p) => p[1])) < y0 ||
        Math.min(...triangle.map((p) => p[1])) > y1
      ) {
        remaining.push(triangle);
        continue;
      }
      let polygon: Point[] = triangle;
      for (const [axis, edge, sign] of [
        [0, x0, 1],
        [0, x1, -1],
        [1, y0, 1],
        [1, y1, -1],
      ]) {
        const inside: Point[] = [],
          outside: Point[] = [];
        for (let i = 0; i < polygon.length; i++) {
          const a = polygon[i],
            b = polygon[(i + 1) % polygon.length];
          const da = (a[axis] - edge) * sign,
            db = (b[axis] - edge) * sign;
          (da >= 0 ? inside : outside).push(a);
          if (da >= 0 !== db >= 0) {
            const t = da / (da - db);
            const p = a.map((v, j) => v + (b[j] - v) * t) as Point;
            inside.push(p);
            outside.push(p);
          }
        }
        append(outside);
        polygon = inside;
      }
      for (const p of polygon) {
        if (
          Math.min(
            Math.abs(p[0] - x0),
            Math.abs(p[0] - x1),
            Math.abs(p[1] - y0),
            Math.abs(p[1] - y1),
          ) < 1e-7
        )
          boundary.push(p);
      }
    }
    // Exact corners close the ring, including when a corner fell inside a face.
    for (const [x, y] of [
      [x0, y0],
      [x1, y0],
      [x1, y1],
      [x0, y1],
    ])
      boundary.push([x, y, surfaceDepth(x, y)]);
    const perimeter = (
      p: Point,
      minX = x0,
      maxX = x1,
      minY = y0,
      maxY = y1,
    ) => {
      if (Math.abs(p[1] - minY) < 1e-6) return (p[0] - minX) / (maxX - minX);
      if (Math.abs(p[0] - maxX) < 1e-6)
        return 1 + (p[1] - minY) / (maxY - minY);
      if (Math.abs(p[1] - maxY) < 1e-6)
        return 2 + (maxX - p[0]) / (maxX - minX);
      return 3 + (maxY - p[1]) / (maxY - minY);
    };
    const unique = new Map<string, Point>();
    boundary.forEach((p) =>
      unique.set(`${p[0].toFixed(7)},${p[1].toFixed(7)}`, p),
    );
    const outer = [...unique.values()].sort(
      (a, b) => perimeter(a) - perimeter(b),
    );
    const steps = 56,
      sx = (x1 - x0) / steps,
      sy = (y1 - y0) / steps;
    const grid: Point[][] = [];
    const inner: Point[] = [];
    for (let row = 1; row < steps; row++) {
      const points: Point[] = [];
      for (let col = 1; col < steps; col++) {
        const x = x0 + col * sx,
          y = y0 + row * sy;
        const point: Point = [x, y, eyeRelief(x, y, surfaceDepth(x, y), field)];
        points.push(point);
        if (row === 1 || row === steps - 1 || col === 1 || col === steps - 1)
          inner.push(point);
      }
      grid.push(points);
    }
    for (let row = 0; row < grid.length - 1; row++)
      for (let col = 0; col < grid[row].length - 1; col++) {
        remaining.push(
          [grid[row][col], grid[row][col + 1], grid[row + 1][col + 1]],
          [grid[row][col], grid[row + 1][col + 1], grid[row + 1][col]],
        );
      }
    const innerT = (p: Point) =>
      perimeter(p, x0 + sx, x1 - sx, y0 + sy, y1 - sy);
    inner.sort((a, b) => innerT(a) - innerT(b));
    let o = 0,
      n = 0;
    while (o < outer.length || n < inner.length) {
      const nextO = o + 1 < outer.length ? perimeter(outer[o + 1]) : 4;
      const nextN = n + 1 < inner.length ? innerT(inner[n + 1]) : 4;
      if (o < outer.length && (n === inner.length || nextO <= nextN)) {
        remaining.push([
          outer[o % outer.length],
          outer[(o + 1) % outer.length],
          inner[n % inner.length],
        ]);
        o++;
      } else {
        remaining.push([
          outer[o % outer.length],
          inner[(n + 1) % inner.length],
          inner[n % inner.length],
        ]);
        n++;
      }
    }
    triangles = remaining;
  }
  const vertices: number[] = [],
    indices: number[] = [];
  const welded = new Map<string, number>();
  for (const triangle of triangles)
    for (const point of triangle) {
      const key = point.map((n) => Math.round(n * 100000)).join(",");
      let i = welded.get(key);
      if (i === undefined) {
        i = vertices.length / 3;
        welded.set(key, i);
        vertices.push(...point.map((n) => n / 0.45));
      }
      indices.push(i);
    }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  return geometry;
}
