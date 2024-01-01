uniform float time;
uniform vec3 color;

varying vec2 vUv;
varying float vProgress;

void main() {
  float hideCorners = smoothstep(1., 0.9, vUv.x) * smoothstep(0., 0.1, vUv.x);
  gl_FragColor.rgba = vec4(mix(color, color * 0.25, vProgress), hideCorners);
}
