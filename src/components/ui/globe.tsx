'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import ThreeGlobe from 'three-globe';
import * as THREE from 'three';

/** The five real OneAquaHealth research cities. */
const CITIES = [
  { name: 'Coimbra', lat: 40.2033, lng: -8.4103 },
  { name: 'Toulouse', lat: 43.6045, lng: 1.444 },
  { name: 'Benevento', lat: 41.13, lng: 14.78 },
  { name: 'Ghent', lat: 51.0543, lng: 3.7174 },
  { name: 'Oslo', lat: 59.9139, lng: 10.7522 },
];

const WATER = '#12a4d9';
const ACTION = '#087fe5';
const AMBER = '#f2a93b';
const LAND = '#1f6aa8';

// Arcs: a ring through the cities plus a couple of cross-links.
const PAIRS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
  [0, 3],
  [1, 4],
];

const arcs = PAIRS.map(([a, b], i) => ({
  startLat: CITIES[a].lat,
  startLng: CITIES[a].lng,
  endLat: CITIES[b].lat,
  endLng: CITIES[b].lng,
  color: i % 2 === 0 ? ACTION : WATER,
}));

const points = CITIES.map((c) => ({ lat: c.lat, lng: c.lng }));

function GlobeObject() {
  const { scene } = useThree();
  const globeRef = useRef<ThreeGlobe | null>(null);

  useEffect(() => {
    const globe = new ThreeGlobe()
      .showGlobe(true)
      .showAtmosphere(true)
      .atmosphereColor(WATER)
      .atmosphereAltitude(0.18)
      .arcsData(arcs)
      .arcColor('color')
      .arcAltitude(0.22)
      .arcStroke(0.5)
      .arcDashLength(0.5)
      .arcDashGap(1.5)
      .arcDashInitialGap(() => Math.random() * 3)
      .arcDashAnimateTime(2600)
      .pointsData(points)
      .pointColor(() => AMBER)
      .pointAltitude(0.015)
      .pointRadius(0.42);

    // Deep-water globe material.
    const mat = globe.globeMaterial() as THREE.MeshPhongMaterial;
    mat.color = new THREE.Color('#0b1a2b');
    mat.emissive = new THREE.Color('#0a2238');
    mat.emissiveIntensity = 0.25;
    mat.shininess = 0.9;

    globe.position.set(0, 0, 0);
    scene.add(globe);
    globeRef.current = globe;

    // Load the real country polygons for the hex landmasses, then configure.
    let cancelled = false;
    fetch('/globe-countries.json')
      .then((r) => r.json())
      .then((geo: { features: object[] }) => {
        if (cancelled || !globeRef.current) return;
        globeRef.current
          .hexPolygonsData(geo.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.72)
          .hexPolygonUseDots(true)
          .hexPolygonColor(() => LAND);
      })
      .catch(() => {
        /* no landmasses — arcs + points still render */
      });

    return () => {
      cancelled = true;
      scene.remove(globe);
    };
  }, [scene]);

  return null;
}

/** Lazy, self-contained 3D globe hero. Transparent canvas so the page gradient
 * shows behind it. Auto-rotates; drag to spin, no zoom/pan. */
export default function Globe({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 320], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.6} color="#bfe6ff" />
        <directionalLight position={[-200, 160, 200]} intensity={1.1} color="#ffffff" />
        <directionalLight position={[200, -120, -120]} intensity={0.5} color={ACTION} />
        <GlobeObject />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.55}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI - Math.PI / 3.2}
        />
      </Canvas>
    </div>
  );
}
