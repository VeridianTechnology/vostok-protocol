import fs from "node:fs";
import { BufferGeometry, BufferAttribute } from "three";
import { smoothGeometry } from "../src/components/face-study/smoothGeometry";
import { openEyeSurface } from "../src/components/face-study/eyeSurface";
import { repairSurfaceSeams } from "./repair-surface-seams";

// Run after build-eye-relief.mjs with: npx tsx scripts/build-sculpture.ts
// Remeshing is baked once, never performed on a visitor's main thread.
const data = fs.readFileSync("assets/models/lee-perry-smith.glb");
const jsonLength = data.readUInt32LE(12);
const gltf = JSON.parse(data.subarray(20, 20 + jsonLength).toString());
const binaryStart = 28 + jsonLength;
const read = (index: number, dimensions: number) => {
  const accessor = gltf.accessors[index],
    view = gltf.bufferViews[accessor.bufferView];
  const Type =
    accessor.componentType === 5126
      ? Float32Array
      : accessor.componentType === 5125
        ? Uint32Array
        : Uint16Array;
  return new Type(
    data.buffer,
    data.byteOffset +
      binaryStart +
      (view.byteOffset || 0) +
      (accessor.byteOffset || 0),
    accessor.count * dimensions,
  ).slice();
};
const primitive = gltf.meshes[0].primitives[0];
const source = new BufferGeometry();
source.setAttribute(
  "position",
  new BufferAttribute(read(primitive.attributes.POSITION, 3), 3),
);
source.setIndex(new BufferAttribute(read(primitive.indices, 1), 1));
const relief = fs.readFileSync("assets/models/eye-relief.bin");
const field = new Float32Array(
  relief.buffer,
  relief.byteOffset,
  relief.byteLength / 4,
);
const smooth = smoothGeometry(source);
const geometry = repairSurfaceSeams(openEyeSurface(smooth, field));
geometry.computeBoundingBox();
const position = geometry.getAttribute("position"),
  index = geometry.getIndex()!;
if (![...position.array].every(Number.isFinite))
  throw new Error("Non-finite sculpture positions");
const positions = Buffer.from(position.array.buffer);
const indices = Buffer.from(index.array.buffer);
const outputJson = {
  asset: {
    version: "2.0",
    generator: "Vostok eye-surface baker",
    copyright: "Lee Perry-Smith, CC BY 3.0; see credits.txt",
  },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0 }],
  meshes: [{ primitives: [{ attributes: { POSITION: 0 }, indices: 1 }] }],
  buffers: [{ byteLength: positions.length + indices.length }],
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: positions.length, target: 34962 },
    {
      buffer: 0,
      byteOffset: positions.length,
      byteLength: indices.length,
      target: 34963,
    },
  ],
  accessors: [
    {
      bufferView: 0,
      componentType: 5126,
      count: position.count,
      type: "VEC3",
      min: geometry.boundingBox!.min.toArray(),
      max: geometry.boundingBox!.max.toArray(),
    },
    {
      bufferView: 1,
      componentType: index.array instanceof Uint32Array ? 5125 : 5123,
      count: index.count,
      type: "SCALAR",
    },
  ],
};
const json = Buffer.from(JSON.stringify(outputJson));
const jsonChunk = Buffer.alloc(Math.ceil(json.length / 4) * 4, 32);
json.copy(jsonChunk);
const binary = Buffer.concat([positions, indices]);
const binaryChunk = Buffer.alloc(Math.ceil(binary.length / 4) * 4);
binary.copy(binaryChunk);
const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(28 + jsonChunk.length + binaryChunk.length, 8);
const jsonHeader = Buffer.alloc(8);
jsonHeader.writeUInt32LE(jsonChunk.length, 0);
jsonHeader.writeUInt32LE(0x4e4f534a, 4);
const binHeader = Buffer.alloc(8);
binHeader.writeUInt32LE(binaryChunk.length, 0);
binHeader.writeUInt32LE(0x004e4942, 4);
fs.writeFileSync(
  "public/models/vostok-study.glb",
  Buffer.concat([header, jsonHeader, jsonChunk, binHeader, binaryChunk]),
);
console.log(
  `Baked ${position.count} vertices, ${index.count / 3} triangles (${header.readUInt32LE(8)} bytes).`,
);
source.dispose();
smooth.dispose();
geometry.dispose();
