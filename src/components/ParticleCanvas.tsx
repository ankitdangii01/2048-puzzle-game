import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

export interface ParticleCanvasHandle {
  burstConfetti: () => void;
  burstBomb: (relativeX?: number, relativeY?: number) => void;
  burstWild: (relativeX?: number, relativeY?: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation?: number;
  vRot?: number;
  shape?: 'circle' | 'rect' | 'star';
}

export const ParticleCanvas = forwardRef<ParticleCanvasHandle, { className?: string }>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  };

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const activeParticles: Particle[] = [];

    for (let i = 0; i < particlesRef.current.length; i++) {
      const p = particlesRef.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // gentle gravity
      p.alpha -= p.decay;

      if (p.rotation !== undefined && p.vRot !== undefined) {
        p.rotation += p.vRot;
      }

      if (p.alpha > 0) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);

        if (p.shape === 'rect') {
          ctx.rotate(p.rotation || 0);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        activeParticles.push(p);
      }
    }

    particlesRef.current = activeParticles;

    if (activeParticles.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      animationFrameRef.current = null;
    }
  };

  const startAnimation = () => {
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  useImperativeHandle(ref, () => ({
    burstConfetti: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      resize();

      const colors = ['#6366f1', '#a855f7', '#ec4899', '#38bdf8', '#facc15', '#10b981'];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < 75; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 9 + 4;
        particlesRef.current.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.015 + 0.01,
          shape: Math.random() > 0.5 ? 'rect' : 'circle',
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.2
        });
      }
      startAnimation();
    },

    burstBomb: (relativeX = 0.5, relativeY = 0.5) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      resize();

      const targetX = canvas.width * relativeX;
      const targetY = canvas.height * relativeY;
      const fireColors = ['#f43f5e', '#fb923c', '#e11d48', '#fef08a', '#ffffff', '#71717a'];

      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 11 + 2;
        particlesRef.current.push({
          x: targetX,
          y: targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 9 + 3,
          color: fireColors[Math.floor(Math.random() * fireColors.length)],
          alpha: 1,
          decay: Math.random() * 0.03 + 0.02,
          shape: 'circle'
        });
      }
      startAnimation();
    },

    burstWild: (relativeX = 0.5, relativeY = 0.5) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      resize();

      const targetX = canvas.width * relativeX;
      const targetY = canvas.height * relativeY;
      const colors = ['#facc15', '#38bdf8', '#c084fc', '#4ade80'];

      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        particlesRef.current.push({
          x: targetX,
          y: targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: Math.random() * 6 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
          shape: 'circle'
        });
      }
      startAnimation();
    }
  }));

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-20 w-full h-full ${props.className || ''}`}
    />
  );
});

ParticleCanvas.displayName = 'ParticleCanvas';
