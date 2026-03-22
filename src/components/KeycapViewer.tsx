"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";

type Props = {
  imageUrl: string;
  offset: { x: number; y: number };
  scale: number;
};

function padImage(image: HTMLImageElement, padding = 32) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = image.width + padding * 2;
  canvas.height = image.height + padding * 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, padding, padding);

  return canvas;
}

function KeycapModel({ imageUrl, offset, scale }: Props) {
  const { scene } = useGLTF("/models/keycap8.glb");

  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    loader.load(imageUrl, (tex) => {
      const image = tex.image as HTMLImageElement;

      const paddedCanvas = padImage(image, 64);
      const paddedTexture = new THREE.CanvasTexture(paddedCanvas);

      paddedTexture.flipY = false;
      paddedTexture.wrapS = paddedTexture.wrapT = THREE.ClampToEdgeWrapping;
      paddedTexture.anisotropy = 16;
      paddedTexture.needsUpdate = true;

      setTexture(paddedTexture);
    });
  }, [imageUrl]);

  if (!texture) return null;

  texture.repeat.set(scale, scale);
  texture.offset.set(offset.x, offset.y);

  const clonedScene = scene.clone();

  clonedScene.traverse((child: any) => {
    if (!child.isMesh || !child.material) return;

    if (child.material.name === "stickermaterial") {
      child.material.map = texture;
      child.material.color.set(0xffffff);

      child.material.transparent = true;
      child.material.alphaTest = 0.1;
      child.material.depthWrite = false;

      child.material.needsUpdate = true;
    }
  });

  return <primitive object={clonedScene} scale={2} />;
}

export default function KeycapViewer({
  imageUrl,
  offset,
  scale,
}: Props) {
  const controlsRef = useRef<any>(null);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => setIsCtrlPressed(e.ctrlKey);
    const up = () => setIsCtrlPressed(false);

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // 🔥 Dynamically switch control mode
  useEffect(() => {
    if (!controlsRef.current) return;

    if (isCtrlPressed) {
      controlsRef.current.mouseButtons.LEFT = THREE.MOUSE.PAN;
    } else {
      controlsRef.current.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
    }
  }, [isCtrlPressed]);

  return (
    <div
      className="w-full h-[500px]"
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={(e) => {
        if (e.button === 2) e.preventDefault();
      }}
    >
      <Canvas camera={{ position: [-6, 6, 3], fov: 18 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} />

        <KeycapModel imageUrl={imageUrl} offset={offset} scale={scale} />

        <OrbitControls
          ref={controlsRef}
          enablePan={true} // always enabled, we control it manually
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: -1 as any // ✅ actually disable right click internally
          }}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/keycap8.glb");