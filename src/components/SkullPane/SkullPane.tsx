import { m } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  AmbientLight,
  Box3,
  DirectionalLight,
  Group,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const SkullPane = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

    const scene = new Scene();
    const camera = new PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 0, 3.4);

    const ambient = new AmbientLight(0xffffff, 0.7);
    const keyLight = new DirectionalLight(0xffffff, 1);
    keyLight.position.set(2.5, 3.5, 4);
    const fillLight = new DirectionalLight(0xd9e2f3, 0.55);
    fillLight.position.set(-3, 1.5, -2);
    const rimLight = new DirectionalLight(0xffffff, 0.35);
    rimLight.position.set(0, 5, -4);
    scene.add(ambient, keyLight, fillLight, rimLight);

    const group = new Group();
    scene.add(group);

    const loader = new GLTFLoader();
    let disposed = false;
    let controls: OrbitControls | null = null;
    loader.load(
      "/head/malehead.glb",
      (gltf) => {
        if (disposed) {
          return;
        }
        const model = gltf.scene;
        const bounds = new Box3().setFromObject(model);
        const size = new Vector3();
        bounds.getSize(size);
        const center = new Vector3();
        bounds.getCenter(center);
        model.position.sub(center);
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 2.2 / maxSize;
        model.scale.setScalar(scale);
        const fovRadians = (camera.fov * Math.PI) / 180;
        const fitDistance = (size.y * scale) / (2 * Math.tan(fovRadians / 2));
        camera.position.set(0, 0, fitDistance * 1.15);
        camera.lookAt(0, 0, 0);
        group.add(model);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enablePan = true;
        controls.minDistance = fitDistance * 0.85;
        controls.maxDistance = fitDistance * 2.1;
        controls.target.set(0, 0, 0);
        controls.update();
      },
      undefined,
      () => {}
    );

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) {
        return;
      }
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener("resize", resize);

    let frameId = 0;
    const animate = () => {
      if (controls) {
        controls.update();
      }
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };
    frameId = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frameId);
      if (controls) {
        controls.dispose();
      }
      renderer.dispose();
    };
  }, []);

  return (
    <m.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="skull-pane border border-black/10 bg-white/80 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.5)]"
    >
      <div className="skull-pane-inner">
        <div className="skull-viewport">
          <canvas ref={canvasRef} className="skull-canvas" />
          <div className="skull-halo" />
        </div>
        <div className="skull-caption">
          <p className="text-[11px] uppercase tracking-[0.4em] text-black/60">
            Rotating Cranial Model
          </p>
          <p className="mt-3 text-sm text-black/70 leading-relaxed max-w-sm">
            Detailed sutures, zygomatic arches, and mandibular planes for a truer bone read.
          </p>
        </div>
      </div>
    </m.div>
  );
};

export default SkullPane;
