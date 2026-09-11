import { BufferGeometry, Float32BufferAttribute } from "three";

// One Loop subdivision pass, welding the scan's UV seams first. The study uses
// procedural marble, so the original UVs aren't needed. This keeps silhouettes
// and close-ups smooth without loading a large scan or a subdivision dependency.
export function smoothGeometry(source: BufferGeometry) {
  const input = source.getAttribute("position");
  const vertices: number[][] = [];
  const welded = new Map<string, number>();
  const remap: number[] = [];
  for (let i = 0; i < input.count; i++) {
    const point = [input.getX(i), input.getY(i), input.getZ(i)];
    const key = point.map((value) => Math.round(value * 10000)).join(",");
    let index = welded.get(key);
    if (index === undefined) {
      index = vertices.length;
      vertices.push(point);
      welded.set(key, index);
    }
    remap.push(index);
  }
  const neighbors = vertices.map(() => new Set<number>());
  const edges = new Map<
    string,
    { a: number; b: number; opposite: number[]; index: number }
  >();
  const edgeKey = (a: number, b: number) => (a < b ? `${a},${b}` : `${b},${a}`);
  const triangles: number[][] = [];
  const indices = source.getIndex();
  const count = indices?.count ?? input.count;
  for (let i = 0; i < count; i += 3) {
    const triangle = [0, 1, 2].map(
      (offset) => remap[indices ? indices.getX(i + offset) : i + offset],
    );
    if (new Set(triangle).size < 3) continue;
    triangles.push(triangle);
    for (let j = 0; j < 3; j++) {
      const a = triangle[j],
        b = triangle[(j + 1) % 3],
        c = triangle[(j + 2) % 3];
      neighbors[a].add(b);
      neighbors[b].add(a);
      const key = edgeKey(a, b);
      const edge = edges.get(key);
      if (edge) edge.opposite.push(c);
      else edges.set(key, { a, b, opposite: [c], index: -1 });
    }
  }
  const boundaries = vertices.map(() => [] as number[]);
  edges.forEach(({ a, b, opposite }) => {
    if (opposite.length === 1) {
      boundaries[a].push(b);
      boundaries[b].push(a);
    }
  });
  const output = vertices.map((point, index) => {
    const boundary = boundaries[index];
    const adjacent = [...neighbors[index]];
    if (!adjacent.length) return point;
    if (boundary.length === 2)
      return point.map(
        (value, axis) =>
          value * 0.75 +
          (vertices[boundary[0]][axis] + vertices[boundary[1]][axis]) * 0.125,
      );
    const beta = adjacent.length === 3 ? 3 / 16 : 3 / (8 * adjacent.length);
    return point.map(
      (value, axis) =>
        value * (1 - adjacent.length * beta) +
        adjacent.reduce((sum, n) => sum + vertices[n][axis], 0) * beta,
    );
  });
  edges.forEach((edge) => {
    const { a, b, opposite } = edge;
    edge.index = output.length;
    output.push(
      vertices[a].map((value, axis) =>
        opposite.length === 2
          ? (value + vertices[b][axis]) * 0.375 +
            (vertices[opposite[0]][axis] + vertices[opposite[1]][axis]) * 0.125
          : (value + vertices[b][axis]) * 0.5,
      ),
    );
  });
  const subdivided: number[] = [];
  triangles.forEach(([a, b, c]) => {
    const ab = edges.get(edgeKey(a, b))!.index,
      bc = edges.get(edgeKey(b, c))!.index,
      ca = edges.get(edgeKey(c, a))!.index;
    subdivided.push(a, ab, ca, b, bc, ab, c, ca, bc, ab, bc, ca);
  });
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new Float32BufferAttribute(output.flat(), 3),
  );
  geometry.setIndex(subdivided);
  geometry.computeVertexNormals();
  return geometry;
}
