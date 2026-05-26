"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef, useState, useMemo } from "react";

type Props = {
  imageUrl: string;
  offset: { x: number; y: number };
  scale: number;

  keycapColor: string;
  switchColor: string;
  switchCasingColor: string;

  visibility?: {
    keycap: boolean;
    switch: boolean;
    casing: boolean;
    chain: boolean;
  };
};

// Pad image with transparent border
function padImage(image: HTMLImageElement, padding = 32) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = image.width + padding * 2;
  canvas.height = image.height + padding * 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, padding, padding);
  return canvas;
}

function KeycapModel({
  imageUrl,
  offset,
  scale,
  keycapColor,
  switchColor,
  switchCasingColor,
  visibility,
}: Props) {
  const { scene } = useGLTF("/models/keycap9.glb");

  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const modelRef = useRef<THREE.Group>(null);

  // Cache meshes/objects by type
  const meshesRef = useRef<{
    keycap: THREE.Mesh[];
    switchObject: THREE.Object3D[];
    casing: THREE.Mesh[];
    chain: THREE.Mesh[];
  }>({ keycap: [], switchObject: [], casing: [], chain: [] });

  // Load user texture
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

  // Apply texture offset/scale
  useEffect(() => {
    if (!texture) return;
    texture.repeat.set(scale, scale);
    texture.offset.set(offset.x, offset.y);
    texture.needsUpdate = true;
  }, [texture, scale, offset]);

  // Clone and process the GLTF scene
  const clonedScene = useMemo(() => {
    if (!scene) return null;
    const cloned = scene.clone(true) as THREE.Group;

    cloned.traverse((child: any) => {
      // Always check for Switch by name
      if (child.name === "Switch") meshesRef.current.switchObject.push(child);

      // Only modify materials for meshes
      if (!child.isMesh || !child.material) return;

      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((mat: any, i: number) => {
        const newMat = mat.clone();

        if (mat.name === "keycap") {
          newMat.color.set(keycapColor);
          newMat.map = null;
          meshesRef.current.keycap.push(child);
          // Apply current visibility immediately
          child.visible = visibility?.keycap ?? true;
        } else if (mat.name === "SwitchColor") {
          newMat.color.set(switchColor);
          child.visible = visibility?.switch ?? true; // apply current switch visibility
        } else if (mat.name === "SwitchCasing") {
          newMat.color.set(switchCasingColor);
          meshesRef.current.casing.push(child);
          child.visible = visibility?.casing ?? true;
        } else if (mat.name === "Keychain" || child.name.toLowerCase().includes("chain")) {
          meshesRef.current.chain.push(child);
          child.visible = visibility?.chain ?? true;
        }

        if (Array.isArray(child.material)) child.material[i] = newMat;
        else child.material = newMat;
      });
    });

    modelRef.current = cloned;
    return cloned;
  }, [scene, keycapColor, switchColor, switchCasingColor, texture]);

  // Update visibility
  useEffect(() => {
    if (!modelRef.current) return;
    const { keycap, switchObject, casing, chain } = meshesRef.current;

    keycap.forEach((m) => (m.visible = visibility?.keycap ?? true));
    switchObject.forEach((o) => (o.visible = visibility?.switch ?? true));
    casing.forEach((m) => (m.visible = visibility?.casing ?? true));
    chain.forEach((m) => (m.visible = visibility?.chain ?? true));
  }, [visibility]);

  if (!clonedScene) return null;
  return <primitive object={clonedScene} scale={2} />;
}

export default function KeycapViewer({
  imageUrl,
  offset,
  scale,
  keycapColor,
  switchColor,
  switchCasingColor,
}: Props) {
  const controlsRef = useRef<any>(null);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  // CTRL detection for pan vs rotate
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

  useEffect(() => {
    if (!controlsRef.current) return;
    controlsRef.current.mouseButtons.LEFT = isCtrlPressed ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE;
  }, [isCtrlPressed]);

  const [visibility, setVisibility] = useState({
    keycap: true,
    switch: true,
    casing: true,
    chain: true,
  });

  return (
    <div className="w-full h-[500px] relative" onContextMenu={(e) => e.preventDefault()}>
      {/* Visibility toggles */}
      <div className="absolute top-3 right-3 z-10 bg-black/60 text-white p-3 rounded-lg text-sm space-y-2">
        {[
          { key: "keycap", label: "Keycap" },
          { key: "switch", label: "Switch" },
          { key: "casing", label: "Case" },
          { key: "chain", label: "Keychain" },
        ].map((item) => (
          <label key={item.key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visibility[item.key as keyof typeof visibility]}
              onChange={() =>
                setVisibility((prev) => ({
                  ...prev,
                  [item.key]: !prev[item.key as keyof typeof prev],
                }))
              }
            />
            {item.label}
          </label>
        ))}
      </div>

      <Canvas camera={{ position: [-6, 6, 3], fov: 18 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[-6, 4, 6]} />
        <KeycapModel
          imageUrl={imageUrl}
          offset={offset}
          scale={scale}
          keycapColor={keycapColor}
          switchColor={switchColor}
          switchCasingColor={switchCasingColor}
          visibility={visibility}
        />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: -1 as any,
          }}
        />
      </Canvas>
    </div>
  );
}

// Preload GLTF
useGLTF.preload("/models/keycap9.glb");