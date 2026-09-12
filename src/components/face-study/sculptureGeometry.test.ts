import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { BufferGeometry, Mesh } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { prepareSculpture } from "./sculptureGeometry";

describe("independent facial transformations on the shipped sculpture", () => {
  let source: BufferGeometry;
  let study: BufferGeometry;
  beforeAll(async () => {
    const file = readFileSync("public/models/vostok-study.glb");
    const gltf = await new GLTFLoader().parseAsync(
      Uint8Array.from(file).buffer,
      "",
    );
    source = (gltf.scene.children[0] as Mesh).geometry;
    study = prepareSculpture(source);
  });
  afterAll(() => {
    source?.dispose();
    study?.dispose();
  });

  const verticesIn = (
    condition: (x: number, y: number, z: number) => boolean,
  ) => {
    const p = source.getAttribute("position");
    return Array.from({ length: p.count }, (_, i) => i).filter((i) =>
      condition(p.getX(i), p.getY(i), p.getZ(i)),
    );
  };
  const assertUnchanged = (region: number, indices: number[]) => {
    expect(indices.length).toBeGreaterThan(10);
    const delta = study.morphAttributes.position[region];
    for (const i of indices)
      expect(
        [delta.getX(i), delta.getY(i), delta.getZ(i)].map(Math.abs),
      ).toEqual([0, 0, 0]);
  };

  it("ships finite geometry with nine separate relative position and normal targets", () => {
    expect(study.morphTargetsRelative).toBe(true);
    expect(study.morphAttributes.position).toHaveLength(9);
    expect(study.morphAttributes.normal).toHaveLength(9);
    for (const attribute of [
      study.getAttribute("position"),
      study.getAttribute("normal"),
      ...study.morphAttributes.position,
      ...study.morphAttributes.normal,
    ]) {
      expect(Array.from(attribute.array).every(Number.isFinite)).toBe(true);
    }
    for (const target of study.morphAttributes.position)
      expect(
        Array.from(target.array).some((value) => Math.abs(value) > 0.0001),
      ).toBe(true);
  });

  it("has no open or non-manifold seams that can crack during cheek morphs", () => {
    const indices = source.getIndex()!;
    const edges = new Map<string, number>();
    for (let i = 0; i < indices.count; i += 3) {
      for (let j = 0; j < 3; j++) {
        const a = indices.getX(i + j);
        const b = indices.getX(i + ((j + 1) % 3));
        const key = `${Math.min(a, b)},${Math.max(a, b)}`;
        edges.set(key, (edges.get(key) ?? 0) + 1);
      }
    }
    expect([...edges.values()].every((count) => count === 2)).toBe(true);
  });

  it("cheeks project gently forward without widening or moving other features", () => {
    const delta = study.morphAttributes.position[0];
    let maxProjection = 0;
    for (let i = 0; i < delta.count; i++) {
      expect(Math.abs(delta.getX(i))).toBe(0);
      expect(delta.getY(i)).toBeGreaterThanOrEqual(0);
      expect(delta.getY(i)).toBeLessThan(0.009);
      expect(delta.getZ(i)).toBeGreaterThanOrEqual(0);
      maxProjection = Math.max(maxProjection, delta.getZ(i));
    }
    expect(maxProjection).toBeGreaterThan(0.04);
    expect(maxProjection).toBeLessThan(0.081);
    assertUnchanged(
      0,
      verticesIn(
        (x, y, z) =>
          Math.abs(x) <= 0.3 ||
          Math.abs(x) >= 1.58 ||
          y <= 0.1 ||
          y >= 1.6 ||
          z <= 0.15,
      ),
    );
  });

  it.each([
    ["Eyes", 1],
    ["Nose", 4],
    ["Lips", 5],
    ["Ears", 6],
  ] as const)(
    "%s leaves the jaw and under-chin vertices untouched",
    (_, region) => {
      assertUnchanged(
        region,
        verticesIn((_x, y) => y <= 0.02),
      );
    },
  );

  it("jaw refinement cannot move the cheeks, eyes, forehead, nose or lips", () => {
    assertUnchanged(
      2,
      verticesIn((_x, y) => y >= 0.2),
    );
  });

  it("eye refinement is confined to the eye band", () => {
    assertUnchanged(
      1,
      verticesIn((_x, y) => y <= 1.2 || y >= 2.4),
    );
  });

  it("nose refinement removes a small bump and narrows the nostrils without lifting the nose", () => {
    const delta = study.morphAttributes.position[4];
    for (let i = 0; i < delta.count; i++) {
      expect(delta.getY(i)).toBe(0);
      expect(delta.getZ(i)).toBeLessThanOrEqual(0);
      expect(delta.getZ(i)).toBeGreaterThan(-0.055);
    }
    assertUnchanged(
      4,
      verticesIn((x, y) => Math.abs(x) >= 0.7 || y <= 0.65 || y >= 1.98),
    );
  });

  it("lips and ears do not change each other", () => {
    assertUnchanged(
      5,
      verticesIn((x) => Math.abs(x) >= 1.24),
    );
    assertUnchanged(
      6,
      verticesIn((x) => Math.abs(x) <= 1.24),
    );
  });

  it("jaw change draws the under-chin contour up and back, with minimal widening", () => {
    const delta = study.morphAttributes.position[2];
    let maxLift = 0,
      maxRetraction = 0;
    for (let i = 0; i < delta.count; i++) {
      expect(Math.abs(delta.getX(i))).toBeLessThan(0.012);
      maxLift = Math.max(maxLift, delta.getY(i));
      maxRetraction = Math.max(maxRetraction, -delta.getZ(i));
    }
    expect(maxLift).toBeGreaterThan(0.02);
    expect(maxRetraction).toBeGreaterThan(0.08);
  });
  it("back-of-head morph leaves the entire front face untouched", () => {
    assertUnchanged(
      7,
      verticesIn((_x, _y, z) => z >= -0.3),
    );
  });
  it("neck morph leaves the face and jaw untouched and softens rather than erases the creases", () => {
    assertUnchanged(
      8,
      verticesIn((_x, y) => y >= -0.8),
    );
    const delta = study.morphAttributes.position[8];
    expect(
      Array.from(delta.array)
        .filter((_v, i) => i % 3 === 2)
        .every((z) => z >= 0),
    ).toBe(true);
    expect(
      Math.max(...Array.from(delta.array).filter((_v, i) => i % 3 === 2)),
    ).toBeGreaterThan(0.01);
  });
});
