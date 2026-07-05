"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Undulating champagne-gold particle wave (editorial hero terrain).
// Small round points via a radial-gradient sprite. Pauses offscreen,
// disabled on mobile and reduced-motion, fully disposed on unmount.

// Soft round sprite so points render as glows, not squares
const makeDotTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
};

const ParticleCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 768) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.2, 9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Grid wave on the XZ plane, undulated per-frame in Y
    const COLS = 140;
    const ROWS = 50;
    const COUNT = COLS * ROWS;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const phase = new Float32Array(COUNT);
    const palette = [
      new THREE.Color("#d8b98a"), // champagne
      new THREE.Color("#b7986a"), // dim gold
      new THREE.Color("#f0e6d6"), // warm white
      new THREE.Color("#8a7455"), // deep bronze
    ];
    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let cIdx = 0; cIdx < COLS; cIdx++, i++) {
        const x = (cIdx / (COLS - 1) - 0.5) * 34;
        const z = -(r / (ROWS - 1)) * 26 + 4;
        positions[i * 3] = x + (Math.random() - 0.5) * 0.18;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = z + (Math.random() - 0.5) * 0.18;
        phase[i] = Math.random() * Math.PI * 2;
        // Mostly dim, a few bright sparkles
        const c = palette[Math.floor(Math.random() * palette.length)]
          .clone()
          .multiplyScalar(Math.random() < 0.08 ? 1.0 : 0.35 + Math.random() * 0.3);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const dotTexture = makeDotTexture();
    const material = new THREE.PointsMaterial({
      size: 0.09,
      map: dotTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let targetX = 0;
    let targetY = 0;
    const onPointerMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 0.15;
      targetY = (e.clientY / window.innerHeight - 0.5) * 0.08;
    };
    window.addEventListener("pointermove", onPointerMove);

    let raf = 0;
    let running = true;
    const t0 = performance.now();
    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const tick = () => {
      if (!running) return;
      const t = (performance.now() - t0) / 1000;
      // Rolling swell: two crossed sine waves per point
      for (let p = 0; p < COUNT; p++) {
        const x = posAttr.getX(p);
        const z = posAttr.getZ(p);
        posAttr.setY(
          p,
          Math.sin(x * 0.35 + t * 0.6 + phase[p] * 0.15) * 0.55 +
            Math.cos(z * 0.45 - t * 0.4) * 0.4 -
            1.2
        );
      }
      posAttr.needsUpdate = true;
      points.rotation.y += (targetX - points.rotation.y) * 0.04;
      points.rotation.x += (targetY - points.rotation.x) * 0.04;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(mount);

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      dotTexture.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default ParticleCanvas;
