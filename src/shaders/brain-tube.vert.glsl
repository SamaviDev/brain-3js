uniform float time;
uniform vec3 mouse;

varying vec2 vUv;
varying float vProgress;

void main() {
  vUv = uv;
  vProgress = smoothstep(-1., 1., sin(vUv.x * 8. + time * 3.));

  vec3 p = position;
  float maxDist = 0.5;
  float dist = length(mouse - p);

  if (dist < maxDist) {
    vec3 dir = normalize(mouse - p) * (1. -dist / maxDist);
    p -= dir * 0.01;
  }
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}
