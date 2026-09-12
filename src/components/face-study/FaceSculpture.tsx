import { useEffect, useRef, useState } from "react";
import {
  AmbientLight,
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Scene,
  Spherical,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { features, type FeatureId } from "./features";
import { prepareSculpture } from "./sculptureGeometry";
import { STUDY_TRANSITION_MS, studyEase } from "./animation";

type Props = {
  feature: FeatureId;
  amount: number;
  highlights: boolean;
  view: number;
  reset: number;
  onReady: (ready: boolean) => void;
};

export default function FaceSculpture(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef(props);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    propsRef.current = props;
  }, [props]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      setStatus("error");
      return;
    }
    setStatus("loading");
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new Scene();
    const camera = new PerspectiveCamera(32, 1, 0.05, 50);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.065;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.6;
    controls.rotateSpeed = 0.65;
    controls.minDistance = 1.8;
    controls.maxDistance = 10;
    controls.minPolarAngle = 0.4;
    controls.maxPolarAngle = 2.55;

    scene.add(new AmbientLight("#e6e4db", 1.1));
    const key = new DirectionalLight("#fff0d9", 2.2);
    key.position.set(-3, 5, 5);
    const fill = new DirectionalLight("#dfe6e5", 1.3);
    fill.position.set(4, 0.5, 4);
    const rim = new DirectionalLight("#fff9e9", 2.5);
    rim.position.set(1, 3, -3);
    scene.add(key, fill, rim);

    const sculpture = new Group();
    scene.add(sculpture);
    const uniforms = {
      uStudyRegion: { value: 0 },
      uStudyHighlight: { value: 0 },
      uStudyAmount: { value: 1 },
      uStudyGreen: { value: new Color("#739d81") },
      uStudyLipGreen: { value: new Color("#78977e") },
      uStudyBackGreen: { value: new Color("#5e7d63") },
    };
    const material = new MeshPhysicalMaterial({
      color: "#dfd9cb",
      roughness: 0.55,
      metalness: 0,
      clearcoat: 0.14,
      clearcoatRoughness: 0.5,
    });
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
        attribute vec4 studyWeightsA;
        attribute vec4 studyWeightsB;
        attribute float studyNeckWeight;
        varying vec4 vStudyWeightsA;
        varying vec4 vStudyWeightsB;
        varying float vStudyNeckWeight;
        varying vec3 vStonePosition;
        varying vec3 vEyePosition;
      `,
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
        vStudyWeightsA = studyWeightsA;
        vStudyWeightsB = studyWeightsB;
        vStudyNeckWeight = studyNeckWeight;
        vStonePosition = position;
      `,
        )
        .replace(
          "#include <morphtarget_vertex>",
          `#include <morphtarget_vertex>
        vEyePosition = transformed;
      `,
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
        uniform float uStudyRegion;
        uniform float uStudyHighlight;
        uniform float uStudyAmount;
        uniform vec3 uStudyGreen;
        uniform vec3 uStudyLipGreen;
        uniform vec3 uStudyBackGreen;
        varying vec4 vStudyWeightsA;
        varying vec4 vStudyWeightsB;
        varying float vStudyNeckWeight;
        varying vec3 vStonePosition;
        varying vec3 vEyePosition;
      `,
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
        float area = 0.0;
        if (uStudyRegion < 0.5) area = max(max(max(max(vStudyWeightsA.x, vStudyWeightsA.y), max(vStudyWeightsA.z, vStudyWeightsA.w)), max(max(vStudyWeightsB.x, vStudyWeightsB.y), max(vStudyWeightsB.z, vStudyWeightsB.w))), vStudyNeckWeight);
        else if (uStudyRegion < 1.5) area = vStudyWeightsA.x;
        else if (uStudyRegion < 2.5) area = vStudyWeightsA.y;
        else if (uStudyRegion < 3.5) area = vStudyWeightsA.z;
        else if (uStudyRegion < 4.5) area = vStudyWeightsA.w;
        else if (uStudyRegion < 5.5) area = vStudyWeightsB.x;
        else if (uStudyRegion < 6.5) area = vStudyWeightsB.y;
        else if (uStudyRegion < 7.5) area = vStudyWeightsB.z;
        else if (uStudyRegion < 8.5) area = vStudyWeightsB.w;
        else area = vStudyNeckWeight;
        float vein = sin(vStonePosition.x * 18.0 + vStonePosition.y * 9.0 + sin(vStonePosition.z * 11.0 + vStonePosition.y * 5.0) * 1.6);
        float grain = sin(vStonePosition.x * 183.0) * sin(vStonePosition.y * 171.0) * sin(vStonePosition.z * 157.0);
        diffuseColor.rgb *= 1.0 - pow(abs(vein), 24.0) * 0.04 + grain * 0.012;
        diffuseColor.rgb = mix(diffuseColor.rgb, uStudyGreen, smoothstep(0.12, 0.9, area) * uStudyHighlight * 0.65);
        if (uStudyRegion < 0.5 || (uStudyRegion > 5.5 && uStudyRegion < 6.5)) {
          diffuseColor.rgb = mix(diffuseColor.rgb, uStudyLipGreen, smoothstep(0.1, 0.7, vStudyWeightsB.y) * uStudyHighlight * 0.4);
        }
        if (uStudyRegion < 0.5 || (uStudyRegion > 7.5 && uStudyRegion < 8.5)) {
          diffuseColor.rgb = mix(diffuseColor.rgb, uStudyBackGreen, smoothstep(0.1, 0.8, vStudyWeightsB.w) * uStudyHighlight * 0.6);
        }
        // The eyelids are real surface relief. Only a faint carved iris and
        // pupil accent is added, in the same marble as the rest of the bust.
        if (vStonePosition.z > 0.65) {
          float eyeX = vStonePosition.x < -0.03 ? -0.342 : 0.257;
          vec2 eye = vEyePosition.xy - vec2(eyeX, 0.738 + uStudyAmount * 0.01);
          float radius = length(eye);
          float irisRim = exp(-pow((radius - 0.038) / 0.0045, 2.0));
          float pupilSize = mix(0.019, 0.0145, uStudyAmount);
          float pupil = 1.0 - smoothstep(pupilSize - 0.004, pupilSize, radius);
          diffuseColor.rgb *= 1.0 - irisRim * 0.2 - pupil * 0.42;
        }
      `,
        );
    };

    const meshes: Mesh[] = [];
    let disposed = false;
    let moving = true;
    let inView = true;
    let frame = 0;
    let currentAmount = propsRef.current.amount;
    const currentInfluences = Array.from(
      { length: features.length - 1 },
      (_, i) =>
        propsRef.current.feature === "overall" ||
        features[i + 1].id === propsRef.current.feature
          ? currentAmount
          : 0,
    );
    let currentFeature = "";
    let currentView = NaN;
    let currentReset = -1;
    let currentAspect = 0;
    const desiredTarget = new Vector3();
    const desiredPosition = new Vector3();
    const cameraFrom = new Spherical();
    const cameraTo = new Spherical();
    const targetFrom = new Vector3();
    let cameraStartedAt = 0;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const fitCamera = () => {
      const state = propsRef.current;
      const feature = features.find((item) => item.id === state.feature)!;
      const distance = feature.distance * (camera.aspect < 0.9 ? 1.15 : 1);
      const angle = feature.angle + (state.view * Math.PI) / 6;
      desiredTarget.set(...feature.target);
      desiredPosition.set(
        Math.sin(angle) * distance,
        feature.target[1] + distance * 0.035,
        feature.target[2] + Math.cos(angle) * distance,
      );
      targetFrom.copy(controls.target);
      cameraFrom.setFromVector3(camera.position.clone().sub(controls.target));
      cameraTo.setFromVector3(desiredPosition.clone().sub(desiredTarget));
      cameraTo.theta =
        cameraFrom.theta +
        Math.atan2(
          Math.sin(cameraTo.theta - cameraFrom.theta),
          Math.cos(cameraTo.theta - cameraFrom.theta),
        );
      cameraStartedAt = performance.now();
      moving = true;
      if (currentFeature === "" || reducedMotion) {
        camera.position.copy(desiredPosition);
        controls.target.copy(desiredTarget);
        moving = false;
      }
      currentFeature = state.feature;
      currentView = state.view;
      currentReset = state.reset;
      currentAspect = camera.aspect;
    };

    new GLTFLoader()
      .loadAsync("/models/vostok-study.glb")
      .then((gltf) => {
        gltf.scene.traverse((object) => {
          if (!(object instanceof Mesh)) return;
          if (!disposed) {
            const mesh = new Mesh(prepareSculpture(object.geometry), material);
            currentInfluences.forEach((value, i) => {
              mesh.morphTargetInfluences![i] = value;
            });
            meshes.push(mesh);
            sculpture.add(mesh);
          }
          object.geometry.dispose();
          const oldMaterials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          oldMaterials.forEach((item) => item.dispose());
        });
        if (!disposed) {
          setStatus("ready");
          propsRef.current.onReady(true);
        }
      })
      .catch(() => {
        if (!disposed) {
          setStatus("error");
          propsRef.current.onReady(false);
        }
      });

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();
    fitCamera();

    const onStart = () => {
      moving = false;
    };
    controls.addEventListener("start", onStart);
    const onKey = (event: KeyboardEvent) => {
      if (
        ![
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "+",
          "-",
          "Home",
        ].includes(event.key)
      )
        return;
      event.preventDefault();
      if (event.key === "Home") {
        fitCamera();
        return;
      }
      moving = false;
      const offset = camera.position.clone().sub(controls.target);
      if (event.key === "ArrowLeft" || event.key === "ArrowRight")
        offset.applyAxisAngle(
          new Vector3(0, 1, 0),
          event.key === "ArrowLeft" ? -0.15 : 0.15,
        );
      if (event.key === "ArrowUp" || event.key === "ArrowDown")
        offset.y += event.key === "ArrowUp" ? 0.15 : -0.15;
      if (event.key === "+" || event.key === "-")
        offset.multiplyScalar(event.key === "+" ? 0.92 : 1.08);
      offset.clampLength(controls.minDistance, controls.maxDistance);
      camera.position.copy(controls.target).add(offset);
      controls.update();
    };
    canvas.addEventListener("keydown", onKey);
    const onContextLost = (event: Event) => {
      event.preventDefault();
      setStatus("error");
      propsRef.current.onReady(false);
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    const render = (time: number) => {
      frame = requestAnimationFrame(render);
      if (!inView || document.hidden) {
        return;
      }
      const state = propsRef.current;
      if (
        currentFeature !== state.feature ||
        currentView !== state.view ||
        currentReset !== state.reset ||
        currentAspect !== camera.aspect
      )
        fitCamera();
      if (moving) {
        const progress = reducedMotion ? 1 : studyEase(time - cameraStartedAt);
        controls.target.lerpVectors(targetFrom, desiredTarget, progress);
        camera.position
          .setFromSphericalCoords(
            cameraFrom.radius +
              (cameraTo.radius - cameraFrom.radius) * progress,
            cameraFrom.phi + (cameraTo.phi - cameraFrom.phi) * progress,
            cameraFrom.theta + (cameraTo.theta - cameraFrom.theta) * progress,
          )
          .add(controls.target);
        if (time - cameraStartedAt >= STUDY_TRANSITION_MS) moving = false;
      }
      currentAmount = state.amount;
      const selectedRegion =
        features.findIndex((item) => item.id === state.feature) - 1;
      currentInfluences.forEach((_value, i) => {
        const target =
          state.feature === "overall" || i === selectedRegion
            ? state.amount
            : 0;
        currentInfluences[i] = target;
      });
      meshes.forEach((mesh) => {
        currentInfluences.forEach((value, i) => {
          mesh.morphTargetInfluences![i] = value;
        });
      });
      uniforms.uStudyRegion.value = features.findIndex(
        (item) => item.id === state.feature,
      );
      uniforms.uStudyAmount.value = currentInfluences[1];
      const targetHighlight = state.highlights ? currentAmount : 0;
      uniforms.uStudyHighlight.value = targetHighlight;
      controls.update();
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(render);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { rootMargin: "80px" },
    );
    visibilityObserver.observe(canvas);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("keydown", onKey);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      controls.removeEventListener("start", onStart);
      controls.dispose();
      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        if (mesh.material !== material) mesh.material.dispose();
      });
      material.dispose();
      renderer.dispose();
    };
  }, [retry]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`face-canvas ${status === "ready" ? "is-ready" : ""}`}
        tabIndex={0}
        role="img"
        aria-label="Rotatable marble face sculpture. Drag or use arrow keys to rotate, plus and minus to zoom, and Home to reset."
      />
      {status === "loading" && (
        <div className="sculpture-loading" role="status">
          Preparing the sculpture
          <span />
        </div>
      )}
      {status === "error" && (
        <div className="sculpture-error" role="alert">
          <p>The sculpture couldn’t load.</p>
          <span>Try again in a browser with WebGL enabled.</span>
          <button onClick={() => setRetry((value) => value + 1)}>
            Reload sculpture
          </button>
        </div>
      )}
    </>
  );
}
