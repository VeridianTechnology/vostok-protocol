import fs from "node:fs";

// Bake a small surface field from the project's original March 2026 head asset.
// Only eyelid depth is transferred; the current bust, cheeks, nose and ears stay.
const data = fs.readFileSync("assets/models/eyelid-reference.glb");
const jsonLength = data.readUInt32LE(12);
const gltf = JSON.parse(data.subarray(20, 20 + jsonLength));
const binaryStart = 28 + jsonLength;
const scale = 3.6 / (0.28387242555618286 - 0.00025266854208894074);
const cy = (0.28387242555618286 + 0.00025266854208894074) / 2;
const cz = (0.15404106676578522 - 0.07727920264005661) / 2;
const triangles = [];
for (const primitive of gltf.meshes[0].primitives) {
  const pa = gltf.accessors[primitive.attributes.POSITION];
  const pv = gltf.bufferViews[pa.bufferView];
  const positions = new Float32Array(
    data.buffer,
    data.byteOffset + binaryStart + pv.byteOffset + (pa.byteOffset || 0),
    pa.count * 3,
  );
  const ia = gltf.accessors[primitive.indices];
  const iv = gltf.bufferViews[ia.bufferView];
  const indices = new Uint16Array(
    data.buffer,
    data.byteOffset + binaryStart + iv.byteOffset + (ia.byteOffset || 0),
    ia.count,
  );
  for (let i = 0; i < indices.length; i += 3) {
    const points = [indices[i], indices[i + 1], indices[i + 2]].map((n) => [
      positions[n * 3] * scale,
      (positions[n * 3 + 1] - cy) * scale,
      (positions[n * 3 + 2] - cz) * scale,
    ]);
    if (Math.max(...points.map((p) => p[2])) < 0.55) continue;
    const minX = Math.min(...points.map((p) => p[0])),
      maxX = Math.max(...points.map((p) => p[0]));
    const minY = Math.min(...points.map((p) => p[1])),
      maxY = Math.max(...points.map((p) => p[1]));
    if (maxY < 0.3 || minY > 0.82 || minX > 0.72 || maxX < -0.72) continue;
    triangles.push({ points, minX, maxX, minY, maxY });
  }
}
const resolution = 81;
const halfWidth = 0.27,
  halfHeight = 0.25;
const result = new Float32Array(resolution * resolution * 2);
for (let side = 0; side < 2; side++) {
  const centerX = side === 0 ? -0.395 : 0.395;
  for (let row = 0; row < resolution; row++)
    for (let col = 0; col < resolution; col++) {
      const dx = ((col / (resolution - 1)) * 2 - 1) * halfWidth;
      const dy = ((row / (resolution - 1)) * 2 - 1) * halfHeight;
      const x = centerX + dx,
        y = 0.55 + dy;
      let z = -Infinity;
      for (const {
        points: [a, b, c],
        minX,
        maxX,
        minY,
        maxY,
      } of triangles) {
        if (x < minX || x > maxX || y < minY || y > maxY) continue;
        const det =
          (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1]);
        if (Math.abs(det) < 1e-12) continue;
        const u =
          ((b[1] - c[1]) * (x - c[0]) + (c[0] - b[0]) * (y - c[1])) / det;
        const v =
          ((c[1] - a[1]) * (x - c[0]) + (a[0] - c[0]) * (y - c[1])) / det;
        if (u < 0 || v < 0 || u + v > 1) continue;
        z = Math.max(z, u * a[2] + v * b[2] + (1 - u - v) * c[2]);
      }
      // A rounded marble eyeball fills any open portion of the donor socket.
      if (!Number.isFinite(z))
        z = 0.66 + Math.sqrt(Math.max(0, 0.32 ** 2 - dx ** 2 - dy ** 2));
      result[side * resolution * resolution + row * resolution + col] = z;
    }
}
// A small tent filter removes scan-edge stepping without closing the aperture.
for (let pass = 0; pass < 2; pass++) {
  const input = result.slice();
  for (let side = 0; side < 2; side++)
    for (let row = 1; row < resolution - 1; row++)
      for (let col = 1; col < resolution - 1; col++) {
        let depth = 0;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++)
            depth +=
              (input[
                side * resolution * resolution +
                  (row + dy) * resolution +
                  col +
                  dx
              ] *
                (dx === 0 ? 2 : 1) *
                (dy === 0 ? 2 : 1)) /
              16;
        result[side * resolution * resolution + row * resolution + col] = depth;
      }
}
fs.writeFileSync("assets/models/eye-relief.bin", Buffer.from(result.buffer));
console.log(
  `Baked ${result.length} eyelid samples (${result.byteLength} bytes)`,
);
