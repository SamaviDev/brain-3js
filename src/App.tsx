import * as THREE from "three";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { OrbitControls, shaderMaterial } from "@react-three/drei";
import scene from "./utils/scene.json";
import BrainTubes from "./components/brain-tubes";
import vert from "./shaders/brain-particle.vert.glsl";
import frag from "./shaders/brain-particle.frag.glsl";
import { useEffect, useMemo, useRef } from "react";

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const brainCurves: THREE.CatmullRomCurve3[] = [];
scene.economics[0].paths.map((path) => {
  const points = [];
  for (let i = 0; i < path.length; i += 3) {
    points.push(new THREE.Vector3(path[i], path[i + 1], path[i + 2]));
  }
  brainCurves.push(new THREE.CatmullRomCurve3(points));
});

const BrainParticles = ({ curves }: { curves: THREE.CatmullRomCurve3[] }) => {
  const density = 10;
  const numberOfPoints = density * curves.length;
  const points = useRef([]);
  const brainGeo = useRef();

  const positions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 100; i++) {
      positions.push(random(-1, 1), random(-1, 1), random(-1, 1));
    }
    return new Float32Array(positions);
  }, []);

  const randoms = useMemo(() => {
    const randoms = [];
    for (let i = 0; i < 100; i++) {
      randoms.push(random(0.3, 1));
    }
    return new Float32Array(randoms);
  }, []);

  useEffect(() => {
    for (let i = 0; i < curves.length; i++) {
      for (let j = 0; j < density; j++) {
        points.current.push({
          currentOffset: Math.random(),
          speed: Math.random() * 0.01,
          curve: curves[i],
          curPosition: Math.random(),
        });
      }
    }
  });

  useFrame(({ clock }) => {
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
  });

  const BrainParticleMaterial = shaderMaterial(
    { time: 0, color: new THREE.Color(0.1, 0.3, 0.6) },
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
        attach={"material"}
        depthTest={false}
        transparent={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const App = () => {
  return (
    <Canvas camera={{ position: [0, 0, 0.3], near: 0.001, far: 5 }}>
      <color attach={"background"} args={["black"]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <BrainTubes curves={brainCurves} />
      <BrainParticles curves={brainCurves} />
      <OrbitControls />
    </Canvas>
  );
};

export default App;
