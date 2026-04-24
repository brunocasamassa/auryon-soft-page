/* ==========================================================================
   WebGL background — three.js
   Animated particle field with mouse parallax. Subtle, not distracting.
   ========================================================================== */

(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 80;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // -------------------------------------------------------------------------
  // Particle grid — forms a drifting 3D wireframe cloud
  // -------------------------------------------------------------------------
  const PARTICLE_COUNT = 1800;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const scales = new Float32Array(PARTICLE_COUNT);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);
  const origins = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    // distribute on a thick disc so the camera always has depth ahead
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 90 + 10;
    const x = Math.cos(angle) * radius;
    const y = (Math.random() - 0.5) * 70;
    const z = Math.sin(angle) * radius - 30;

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
    origins[i3] = x;
    origins[i3 + 1] = y;
    origins[i3 + 2] = z;

    velocities[i3] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

    scales[i] = Math.random() * 1.5 + 0.5;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

  // -------------------------------------------------------------------------
  // Shader — glowing dots with soft edge
  // -------------------------------------------------------------------------
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor: { value: new THREE.Color('#00ff9d') },
      uAccent: { value: new THREE.Color('#ff2d55') },
    },
    vertexShader: `
      attribute float scale;
      uniform float uTime;
      uniform vec2 uMouse;
      varying float vDist;
      varying float vY;

      void main() {
        vec3 p = position;
        // wave motion
        p.y += sin(uTime * 0.5 + p.x * 0.05) * 1.2;
        p.x += cos(uTime * 0.3 + p.z * 0.04) * 0.8;
        // mouse pull
        vec2 mousePull = uMouse * 6.0;
        p.xy += mousePull * (1.0 - smoothstep(0.0, 60.0, length(p.xz)));

        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = scale * 5.0 * (180.0 / -mvPosition.z);

        vDist = length(p.xz);
        vY = p.y;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform vec3 uAccent;
      uniform float uTime;
      varying float vDist;
      varying float vY;

      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;

        float alpha = smoothstep(0.5, 0.0, d);
        // mix accent vs primary by vertical position
        float t = (vY + 35.0) / 70.0;
        vec3 col = mix(uAccent * 0.35, uColor, smoothstep(0.2, 1.0, t));
        // occasional flicker
        float flicker = 0.85 + 0.15 * sin(uTime * 3.0 + vDist * 0.2);
        gl_FragColor = vec4(col * flicker, alpha * 0.55);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // -------------------------------------------------------------------------
  // A thin horizon line for composition
  // -------------------------------------------------------------------------
  const lineGeo = new THREE.BufferGeometry();
  const lineVerts = new Float32Array([-200, 0, -60, 200, 0, -60]);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(lineVerts, 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x00ff9d,
    transparent: true,
    opacity: 0.12,
  });
  const horizon = new THREE.Line(lineGeo, lineMat);
  scene.add(horizon);

  // -------------------------------------------------------------------------
  // Interaction
  // -------------------------------------------------------------------------
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });

  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // -------------------------------------------------------------------------
  // Animate
  // -------------------------------------------------------------------------
  const clock = new THREE.Clock();

  function tick() {
    const t = clock.getElapsedTime();
    // smooth mouse
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    material.uniforms.uTime.value = t;
    material.uniforms.uMouse.value.set(mouse.x, mouse.y);

    // slow rotation of the whole field + scroll-driven camera
    points.rotation.y = t * 0.04 + mouse.x * 0.15;
    points.rotation.x = mouse.y * 0.1;

    camera.position.y = -scrollY * 0.015;
    camera.position.z = 80 + Math.sin(t * 0.2) * 2;
    camera.lookAt(0, camera.position.y, 0);

    horizon.position.y = -scrollY * 0.015;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
})();
