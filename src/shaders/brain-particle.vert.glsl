uniform float time;
uniform vec3 mouse;

varying vec2 vUv;
varying float vProgress;

attribute float randoms;

void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  vec3 p = position;
  float maxDist = 0.1;
  float dist = length(mouse - p);

  if (dist < maxDist) {
    vec3 dir = normalize(mouse - p) * (1. -dist / maxDist);
    p -= dir * 0.04;
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
  gl_PointSize = randoms * 2. * (0.5 / -mvPosition.z);
}
