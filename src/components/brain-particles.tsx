import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import vert from "../shaders/brain-particle.vert.glsl";
import frag from "../shaders/brain-particle.frag.glsl";

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const BrainParticles = ({ curves }: { curves: THREE.CatmullRomCurve3[] }) => {
  const { viewport } = useThree();
  const density = 10;
  const points = useRef([]);
  const brainGeo = useRef();
  const brainMat = useRef();

  const positions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 250; i++) {
      positions.push(random(-1, 1), random(-1, 1), random(-1, 1));
    }
    return new Float32Array(positions);
  }, []);

  const randoms = useMemo(() => {
    const randoms = [];
    for (let i = 0; i < 250; i++) {
      randoms.push(random(0.3, 1));
    }
    return new Float32Array(randoms);
  }, []);

  useEffect(() => {
    for (let i = 0; i < curves.length; i++) {
      for (let j = 0; j < density; j++) {
        points.current.push({
          currentOffset: Math.random(),
          speed: Math.random() * 0.001,
          curve: curves[i],
          curPosition: Math.random(),
        });
      }
    }
  });

  useFrame(({ mouse }) => {
    if (brainMat.current) {
      brainMat.current.uniforms.mouse.value = new THREE.Vector3(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2,
        0
      );
    }

    if (brainGeo.current) {
      const curpositions = brainGeo.current.attributes.position.array;

      for (let i = 0; i < points.current.length; i++) {
        points.current[i].curPosition += points.current[i].speed;
        points.current[i].curPosition %= 1;

        const curPoint = points.current[i].curve.getPointAt(
          points.current[i].curPosition
        );

        curpositions[i * 3] = curPoint.x;
        curpositions[i * 3 + 1] = curPoint.y;
        curpositions[i * 3 + 2] = curPoint.z;
      }

      brainGeo.current.attributes.position.needsUpdate = true;
    }
  });

  const BrainParticleMaterial = shaderMaterial(
    {
      time: 0,
      mouse: new THREE.Vector3(0, 0, 0),
      color: new THREE.Color(0.1, 0.3, 0.6),
    },
    vert,
    frag
  );

  extend({ BrainParticleMaterial });

  return (
    <points>
      <bufferGeometry attach={"geometry"} ref={brainGeo}>
        <bufferAttribute
          attach={"attributes-position"}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach={"attributes-randoms"}
          count={randoms.length}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      <brainParticleMaterial
        ref={brainMat}
        attach={"material"}
        depthTest={false}
        transparent={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default BrainParticles;
