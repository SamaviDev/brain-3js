uniform float time;

varying vec2 vUv;
varying float vProgress;

attribute float randoms;

void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  gl_PointSize = randoms * 2. * (1. / -mvPosition.z);
}
