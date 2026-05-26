import React, { useEffect, useRef, useState } from 'react';

// Class to represent background floating particles
class BackgroundParticle {
  constructor(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.size = Math.random() * 1.5 + 0.8;
  }

  update(width, height) {
    this.x += this.vx;
    this.y += this.vy;

    // Boundary wrap-around
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }
}

// Generates points on a sphere using Fibonacci sphere algorithm
const generateSpherePoints = (numPoints, radius) => {
  const points = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < numPoints; i++) {
    const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
    const r = Math.sqrt(1 - y * y); // radius at y
    const theta = 2 * Math.PI * i / goldenRatio;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    points.push({ x: x * radius, y: y * radius, z: z * radius });
  }
  return points;
};

// Generates points for a latitude ring (horizontal)
const generateLatitudeRing = (yValue, ringRadius, numPoints = 36) => {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const theta = (i / numPoints) * Math.PI * 2;
    points.push({
      x: ringRadius * Math.cos(theta),
      y: yValue,
      z: ringRadius * Math.sin(theta)
    });
  }
  return points;
};

// Generates points for a longitude ring (vertical, rotated around Y axis)
const generateLongitudeRing = (yRotationAngle, sphereRadius, numPoints = 36) => {
  const points = [];
  const cosY = Math.cos(yRotationAngle);
  const sinY = Math.sin(yRotationAngle);
  for (let i = 0; i < numPoints; i++) {
    const theta = (i / numPoints) * Math.PI * 2;
    // Circle in ZY plane (x = 0)
    const z = sphereRadius * Math.cos(theta);
    const y = sphereRadius * Math.sin(theta);
    // Rotate around Y axis
    const x = z * sinY;
    const zRot = z * cosY;
    points.push({ x, y, z: zRot });
  }
  return points;
};

export default function AiTechBackground() {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 3D rotation angles
  const angleX = useRef(0);
  const angleY = useRef(0);

  // Mouse tracking (normalised coordinates: -0.5 to 0.5)
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const targetMouseX = useRef(0);
  const targetMouseY = useRef(0);

  const sphereRadius = 155;
  const fov = 380; // perspective distance

  // Sphere geometry refs
  const spherePoints = useRef(generateSpherePoints(85, sphereRadius));
  const latRings = useRef([
    generateLatitudeRing(0, sphereRadius),
    generateLatitudeRing(-90, Math.sqrt(sphereRadius ** 2 - 90 ** 2)),
    generateLatitudeRing(90, Math.sqrt(sphereRadius ** 2 - 90 ** 2)),
  ]);
  const lonRings = useRef([
    generateLongitudeRing(0, sphereRadius),
    generateLongitudeRing(Math.PI / 3, sphereRadius),
    generateLongitudeRing((2 * Math.PI) / 3, sphereRadius),
  ]);

  // Background particles
  const bgParticles = useRef([]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const parent = canvasRef.current.parentElement;
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      setDimensions({ width, height });

      // Initialize background particles
      const count = Math.min(40, Math.floor(width / 30));
      bgParticles.current = [];
      for (let i = 0; i < count; i++) {
        bgParticles.current.push(new BackgroundParticle(width, height));
      }
    };

    window.addEventListener('resize', handleResize);
    // Trigger initially
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track mouse coordinates on window
  useEffect(() => {
    const handleMouseMove = (e) => {
      targetMouseX.current = (e.clientX / window.innerWidth) - 0.5;
      targetMouseY.current = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3D Point Rotation
  const rotatePoint = (point, rx, ry) => {
    // Y-axis rotation
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);
    let x1 = point.x * cosY + point.z * sinY;
    let z1 = -point.x * sinY + point.z * cosY;

    // X-axis rotation
    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);
    let y2 = point.y * cosX - z1 * sinX;
    let z2 = point.y * sinX + z1 * cosX;

    return { x: x1, y: y2, z: z2 };
  };

  // Render Loop
  useEffect(() => {
    let animationFrameId;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const { width, height } = canvas;

      // Clear with soft trails (helps smooth animations)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.fillRect(0, 0, width, height);

      // Centers for drawing
      const centerX = width / 2;
      const centerY = height / 2; // Center perfectly vertically in its parent box

      // Projection mapping helper
      const project = (point) => {
        const scale = fov / (fov + point.z);
        return {
          x: centerX + point.x * scale,
          y: centerY + point.y * scale,
          z: point.z,
          scale
        };
      };

      // 1. Draw central holographic soft blue aura
      const radialGlow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, sphereRadius * 1.6);
      radialGlow.addColorStop(0, 'rgba(0, 140, 255, 0.25)');
      radialGlow.addColorStop(0.5, 'rgba(0, 80, 255, 0.08)');
      radialGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw 2D Background Particles & Connections
      ctx.fillStyle = 'rgba(0, 160, 255, 0.45)';
      bgParticles.current.forEach(p => {
        p.update(width, height);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Background particle lines
      for (let i = 0; i < bgParticles.current.length; i++) {
        for (let j = i + 1; j < bgParticles.current.length; j++) {
          const p1 = bgParticles.current[i];
          const p2 = bgParticles.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const opacity = (1 - dist / 110) * 0.18;
            ctx.strokeStyle = `rgba(0, 160, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 3. Interpolate Mouse Parallax for fluid look
      mouseX.current += (targetMouseX.current - mouseX.current) * 0.05;
      mouseY.current += (targetMouseY.current - mouseY.current) * 0.05;

      // Update automatic rotation
      angleX.current += 0.001;
      angleY.current += 0.002;

      // Combine auto-rotation with mouse movements
      const rotX = angleX.current + mouseY.current * 0.35;
      const rotY = angleY.current + mouseX.current * 0.35;

      // 4. Project and rotate Latitude / Longitude lines
      const drawRing = (ringPoints) => {
        const projectedPoints = ringPoints.map(p => project(rotatePoint(p, rotX, rotY)));
        for (let i = 0; i < projectedPoints.length; i++) {
          const p1 = projectedPoints[i];
          const p2 = projectedPoints[(i + 1) % projectedPoints.length];

          // Set opacity based on average Z value (depth representation)
          const avgZ = (p1.z + p2.z) / 2;
          const normZ = (avgZ + sphereRadius) / (2 * sphereRadius); // 0 (front) to 1 (back)
          const opacity = (0.35 - normZ * 0.25) * 1.2; // stronger in front

          ctx.strokeStyle = `rgba(0, 170, 255, ${opacity})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      };

      latRings.current.forEach(drawRing);
      lonRings.current.forEach(drawRing);

      // 5. Project and rotate Sphere Point Nodes
      const projectedGlobePoints = spherePoints.current.map(p => {
        const rotated = rotatePoint(p, rotX, rotY);
        return { ...project(rotated), original: p };
      });

      // Render Globe connections (neural network mesh)
      for (let i = 0; i < projectedGlobePoints.length; i++) {
        for (let j = i + 1; j < projectedGlobePoints.length; j++) {
          const p1 = projectedGlobePoints[i];
          const p2 = projectedGlobePoints[j];

          // Compute 3D distance of original points to maintain stable neural lines
          const dx = p1.original.x - p2.original.x;
          const dy = p1.original.y - p2.original.y;
          const dz = p1.original.z - p2.original.z;
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist3D < 70) {
            const avgZ = (p1.z + p2.z) / 2;
            const normZ = (avgZ + sphereRadius) / (2 * sphereRadius);
            const opacity = (1 - dist3D / 70) * (0.38 - normZ * 0.28);

            ctx.strokeStyle = `rgba(0, 190, 255, ${opacity})`;
            ctx.lineWidth = 0.65;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw globe nodes
      projectedGlobePoints.forEach(p => {
        const normZ = (p.z + sphereRadius) / (2 * sphereRadius); // 0 (front) to 1 (back)
        const opacity = 0.85 - normZ * 0.55; // bright in front, faded behind
        const size = 3.0 - normZ * 2.0; // larger in front, tiny in back

        ctx.fillStyle = `rgba(0, 200, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();

        // White core highlight on front-facing nodes
        if (p.z < 20) {
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.95})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 0.55, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 6. Draw Waving Cyber Mesh at the bottom
      const gridRows = 12;
      const gridCols = 24;
      const gridSpacing = 42;
      const waveSpeed = angleY.current * 7;
      
      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          // 3D coordinates relative to bottom plane
          const x3d = (c - gridCols / 2) * gridSpacing;
          const z3d = r * gridSpacing - 50;
          
          // Wave calculations using double sin/cos triggers for organic motion
          const wave1 = Math.sin(c * 0.22 + waveSpeed) * 16;
          const wave2 = Math.cos(r * 0.25 + waveSpeed * 0.7) * 11;
          const y3d = 175 + wave1 + wave2; // sitting below the globe
          
          // Project
          const scale = fov / (fov + z3d);
          const screenX = centerX + x3d * scale;
          const screenY = (centerY + 10) + y3d * scale;
          
          // Draw dot
          const normZ = (z3d + 50) / (gridRows * gridSpacing); // 0 (front) to 1 (back)
          const opacity = (1 - normZ) * 0.25; // fade into background
          
          if (opacity > 0) {
            ctx.fillStyle = `rgba(0, 140, 255, ${opacity})`;
            ctx.beginPath();
            ctx.arc(screenX, screenY, 1.25, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw grid lines to the right
            if (c < gridCols - 1) {
              const nextX3d = ((c + 1) - gridCols / 2) * gridSpacing;
              const nextWave1 = Math.sin((c + 1) * 0.22 + waveSpeed) * 16;
              const nextY3d = 175 + nextWave1 + wave2;
              
              const nextScale = fov / (fov + z3d);
              const nextScreenX = centerX + nextX3d * nextScale;
              const nextScreenY = (centerY + 10) + nextY3d * nextScale;
              
              ctx.strokeStyle = `rgba(0, 100, 255, ${opacity * 0.55})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(screenX, screenY);
              ctx.lineTo(nextScreenX, nextScreenY);
              ctx.stroke();
            }
            
            // Draw grid lines to the bottom
            if (r < gridRows - 1) {
              const nextZ3d = (r + 1) * gridSpacing - 50;
              const nextWave2 = Math.cos((r + 1) * 0.25 + waveSpeed * 0.7) * 11;
              const nextY3d = 175 + wave1 + nextWave2;
              
              const nextScale = fov / (fov + nextZ3d);
              const nextScreenX = centerX + x3d * nextScale;
              const nextScreenY = (centerY + 10) + nextY3d * nextScale;
              
              ctx.strokeStyle = `rgba(0, 100, 255, ${opacity * 0.55})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(screenX, screenY);
              ctx.lineTo(nextScreenX, nextScreenY);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-85 mix-blend-screen transition-opacity duration-700"
      style={{ filter: 'blur(0.3px)' }}
    />
  );
}
