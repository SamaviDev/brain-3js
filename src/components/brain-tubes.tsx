import { useRef } from "react";
import * as THREE from "three";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import vert from "../shaders/brain-tube.vert.glsl";
import frag from "../shaders/brain-tube.frag.glsl";

const Tube = ({ curve }: { curve: THREE.CatmullRomCurve3 }) => {
  const { viewport } = useThree();
  const brainMat = useRef<THREE.ShaderMaterial>();

  useFrame(({ clock, mouse }) => {
    if (brainMat.current) {
      brainMat.current.uniforms.time.value = clock.getElapsedTime();
      brainMat.current.uniforms.mouse.value = new THREE.Vector3(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2,
        0
      );
    }
  });

  const BrainMaterial = shaderMaterial(
    {
      time: 0,
      mouse: new THREE.Vector3(0, 0, 0),
      color: new THREE.Color(0.1, 0.3, 0.6),
    },
    vert,
    frag
  );

  extend({ BrainMaterial });

  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.001, 2, false]} />
      <brainMaterial
        ref={brainMat}
        transparent={true}
        depthTest={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

const BrainTubes = ({ curves }: { curves: THREE.CatmullRomCurve3[] }) =>
  curves.map((curve, index) => <Tube key={index} curve={curve} />);

export default BrainTubes;
