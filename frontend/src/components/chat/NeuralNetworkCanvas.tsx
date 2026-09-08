import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  color: string;
}

interface DataPulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

export const NeuralNetworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Responsive node count based on screen size
    const nodeCount = Math.min(Math.floor((width * height) / 18000), 65);

    const colors = [
      'rgba(59, 130, 246, ',   // Subtle Primary Blue (#3b82f6)
      'rgba(139, 92, 246, ',   // Subtle Purple (#8b5cf6)
      'rgba(6, 182, 212, ',    // Subtle Cyan (#06b6d4)
      'rgba(99, 102, 241, ',   // Subtle Indigo (#6366f1)
    ];

    // Initialize Nodes
    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1.2,
      baseAlpha: Math.random() * 0.4 + 0.25,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    // Active Data Pulses
    let dataPulses: DataPulse[] = [];
    const maxPulses = 12;

    const spawnPulse = () => {
      if (dataPulses.length >= maxPulses) return;

      const fromIdx = Math.floor(Math.random() * nodes.length);
      // Find a nearby node
      const candidates: number[] = [];
      nodes.forEach((node, idx) => {
        if (idx === fromIdx) return;
        const dx = node.x - nodes[fromIdx].x;
        const dy = node.y - nodes[fromIdx].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          candidates.push(idx);
        }
      });

      if (candidates.length > 0) {
        const toIdx = candidates[Math.floor(Math.random() * candidates.length)];
        dataPulses.push({
          fromNode: fromIdx,
          toNode: toIdx,
          progress: 0,
          speed: Math.random() * 0.015 + 0.008,
          color: nodes[fromIdx].color,
        });
      }
    };

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    window.addEventListener('resize', handleResize);

    const maxConnectDistance = 140;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Update and Draw Connection Lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDistance) {
            const lineAlpha = (1 - dist / maxConnectDistance) * 0.18;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 2. Update and Draw Moving Data Pulses
      if (Math.random() < 0.05) spawnPulse();

      dataPulses = dataPulses.filter((pulse) => {
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) return false;

        const from = nodes[pulse.fromNode];
        const to = nodes[pulse.toNode];
        if (!from || !to) return false;

        const currX = from.x + (to.x - from.x) * pulse.progress;
        const currY = from.y + (to.y - from.y) * pulse.progress;

        const pulseAlpha = Math.sin(pulse.progress * Math.PI) * 0.8;

        // Glow effect for pulse
        ctx.save();
        ctx.beginPath();
        ctx.arc(currX, currY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `${pulse.color}${pulseAlpha})`;
        ctx.shadowColor = `${pulse.color}0.9)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        return true;
      });

      // 3. Update and Draw Nodes
      nodes.forEach((node) => {
        // Move Node
        node.x += node.vx;
        node.y += node.vy;

        // Bounce at borders
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Pulse alpha
        node.pulsePhase += node.pulseSpeed;
        const currentAlpha = node.baseAlpha + Math.sin(node.pulsePhase) * 0.15;

        // Draw Node Outer Halo
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}${Math.max(0, currentAlpha * 0.25)})`;
        ctx.fill();

        // Draw Core Node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}${currentAlpha})`;
        ctx.shadowColor = `${node.color}0.8)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full z-0 opacity-80 transition-opacity duration-500"
    />
  );
};
