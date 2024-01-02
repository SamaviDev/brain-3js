import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import scene from "./utils/scene.json";
import BrainTubes from "./components/brain-tubes";
import BrainParticles from "./components/brain-particles";

const brainCurves: THREE.CatmullRomCurve3[] = [];
scene.economics[0].paths.map((path) => {
  const points = [];
  for (let i = 0; i < path.length; i += 3) {
    points.push(new THREE.Vector3(path[i], path[i + 1], path[i + 2]));
  }
  brainCurves.push(new THREE.CatmullRomCurve3(points));
});

const App = () => {
  return (
    <Canvas camera={{ position: [0, 0, 0.2], near: 0.001, far: 5 }}>
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
