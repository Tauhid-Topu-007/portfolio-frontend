// src/components/NeuralBackground.jsx
import React, { useEffect, useRef } from 'react';

const NeuralBackground = ({ 
  density = 'medium',
  primaryColor = '#8B5CF6',
  secondaryColor = '#3B82F6',
  accentColor = '#EC4899',
  connectionOpacity = 0.35,
  nodeSize = 2.5,
  pulseSpeed = 1.2
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const timeRef = useRef(0);
  const nodesRef = useRef([]);
  const connectionsRef = useRef([]);
  const particlesRef = useRef([]);

  const densityMap = {
    low: { nodes: 70, connectionDist: 300, particles: 40 },
    medium: { nodes: 100, connectionDist: 260, particles: 60 },
    high: { nodes: 140, connectionDist: 230, particles: 80 }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const config = densityMap[density];
    const numNodes = config.nodes;
    const connectionDistance = config.connectionDist;
    const numParticles = config.particles;
    
    // Parse colors
    const parseColor = (color) => {
      if (color.startsWith('#')) {
        return {
          r: parseInt(color.slice(1, 3), 16),
          g: parseInt(color.slice(3, 5), 16),
          b: parseInt(color.slice(5, 7), 16)
        };
      }
      return { r: 139, g: 92, b: 246 };
    };
    
    const primaryRGB = parseColor(primaryColor);
    const secondaryRGB = parseColor(secondaryColor);
    const accentRGB = parseColor(accentColor);
    
    // Get node color based on state
    const getNodeColor = (node, time, hasMouse, mouseX, mouseY) => {
      if (hasMouse && mouseX && mouseY) {
        const mouseDist = Math.hypot(mouseX - node.x, mouseY - node.y);
        if (mouseDist < 80) return `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.5)`;
        if (mouseDist < 150) return `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.45)`;
      }
      
      const pulse = Math.sin(time * 2.5 + node.phase) * 0.3;
      const energy = (node.energy || 0.5) * 0.4;
      const rainbow = Math.sin(time * 0.8 + node.x * 0.005) * 0.2;
      
      if (node.isCenterNode) {
        return `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, ${0.7 + pulse * 0.2})`;
      }
      
      const blendR = primaryRGB.r + (secondaryRGB.r - primaryRGB.r) * rainbow;
      const blendG = primaryRGB.g + (secondaryRGB.g - primaryRGB.g) * rainbow;
      const blendB = primaryRGB.b + (secondaryRGB.b - primaryRGB.b) * rainbow;
      
      return `rgba(${blendR}, ${blendG}, ${blendB}, ${0.4 + pulse * 0.2 + energy * 0.2})`;
    };
    
    // Initialize nodes
    const initNodes = () => {
      const nodes = [];
      const centerX = width / 2;
      const centerY = height / 2;
      
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      
      for (let i = 0; i < numNodes; i++) {
        const t = i / numNodes;
        const radius = Math.pow(t, 0.8) * Math.hypot(width, height) * 0.55;
        const angle = i * goldenAngle * 2;
        
        let x, y;
        
        if (i < numNodes * 0.85) {
          x = centerX + Math.cos(angle) * radius;
          y = centerY + Math.sin(angle) * radius;
        } else {
          x = Math.random() * width;
          y = Math.random() * height;
        }
        
        x = Math.min(Math.max(x, 30), width - 30);
        y = Math.min(Math.max(y, 30), height - 30);
        
        nodes.push({
          x, y,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          originalX: x,
          originalY: y,
          radius: nodeSize + Math.random() * 1.5,
          phase: Math.random() * Math.PI * 2,
          energy: Math.random(),
          isCenterNode: radius < 120,
          pulseSpeed: 0.5 + Math.random() * 1.5,
        });
      }
      
      // Calculate connections
      const connections = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < connectionDistance) {
            const strength = Math.pow(1 - dist / connectionDistance, 1.4);
            connections.push({
              from: i, to: j,
              distance: dist,
              strength,
              thickness: 0.5 + strength * 1.5,
            });
          }
        }
      }
      
      nodesRef.current = nodes;
      connectionsRef.current = connections;
    };
    
    // Initialize particles
    const initParticles = () => {
      const particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: 1 + Math.random() * 2,
          alpha: 0.3 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = particles;
    };
    
    // Update nodes with physics
    const updateNodes = (mouseX, mouseY, hasMouse, time) => {
      const nodes = [...nodesRef.current];
      
      const waveFieldX = Math.sin(time * 0.15) * 5;
      const waveFieldY = Math.cos(time * 0.13) * 5;
      const vortexX = Math.sin(time * 0.08) * 3;
      const vortexY = Math.cos(time * 0.07) * 3;
      
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Spring force
        const springStrength = 0.01 + (node.energy || 0.5) * 0.008;
        const dxOrig = node.originalX - node.x;
        const dyOrig = node.originalY - node.y;
        node.vx += dxOrig * springStrength;
        node.vy += dyOrig * springStrength;
        
        // Wave motion
        const freq1 = 0.004;
        const freq2 = 0.006;
        const wave1 = Math.sin(time * 0.7 + node.y * freq1) * 1.2;
        const wave2 = Math.cos(time * 0.6 + node.x * freq2) * 1.2;
        const wave3 = Math.sin(time * 1.3 + node.phase) * 0.8;
        const wave4 = Math.cos(time * 0.9 + node.y * 0.003) * 0.6;
        
        node.vx += (wave1 + wave3 + waveFieldX * 0.1) * 0.12;
        node.vy += (wave2 + wave4 + waveFieldY * 0.1) * 0.12;
        
        // Vortex effect
        const dxCenter = width/2 - node.x;
        const dyCenter = height/2 - node.y;
        const distToCenter = Math.hypot(dxCenter, dyCenter);
        const vortexStrength = 0.008 * (1 - distToCenter / Math.hypot(width, height));
        node.vx += -dyCenter * vortexStrength * vortexX;
        node.vy += dxCenter * vortexStrength * vortexY;
        
        // Mouse interaction
        if (hasMouse && mouseX && mouseY) {
          const dx = node.x - mouseX;
          const dy = node.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = 90;
          const maxDist = 280;
          
          if (dist < minDist) {
            const angle = Math.atan2(dy, dx);
            const force = ((minDist - dist) / minDist) * 1.8 * (0.6 + (node.energy || 0.5) * 0.4);
            node.vx += Math.cos(angle) * force;
            node.vy += Math.sin(angle) * force;
          } else if (dist < maxDist) {
            const angle = Math.atan2(dy, dx);
            const t = (dist - minDist) / (maxDist - minDist);
            const force = (1 - t) * 0.3;
            node.vx += Math.cos(angle) * -force;
            node.vy += Math.sin(angle) * -force;
          }
          
          if (dist < 120) {
            const angle = Math.atan2(dy, dx);
            const force = (1 - dist / 120) * 0.15;
            node.vx += Math.cos(angle) * force;
            node.vy += Math.sin(angle) * force;
          }
        }
        
        // Damping
        node.vx *= 0.97;
        node.vy *= 0.97;
        
        // Update position
        const maxVel = 2.5;
        node.vx = Math.min(Math.max(node.vx, -maxVel), maxVel);
        node.vy = Math.min(Math.max(node.vy, -maxVel), maxVel);
        node.x += node.vx;
        node.y += node.vy;
        
        // Boundary
        const margin = 25;
        if (node.x < margin) {
          node.x = margin + (margin - node.x) * 0.2;
          node.vx *= -0.4;
        }
        if (node.x > width - margin) {
          node.x = width - margin - (node.x - (width - margin)) * 0.2;
          node.vx *= -0.4;
        }
        if (node.y < margin) {
          node.y = margin + (margin - node.y) * 0.2;
          node.vy *= -0.4;
        }
        if (node.y > height - margin) {
          node.y = height - margin - (node.y - (height - margin)) * 0.2;
          node.vy *= -0.4;
        }
      }
      
      // Update connections
      const updatedConnections = connectionsRef.current.map(conn => {
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];
        const dx = fromNode.x - toNode.x;
        const dy = fromNode.y - toNode.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const strength = Math.max(0, Math.pow(1 - dist / connectionDistance, 1.4));
        return {
          ...conn,
          distance: dist,
          strength,
          thickness: 0.4 + strength * 1.2,
        };
      });
      
      nodesRef.current = nodes;
      connectionsRef.current = updatedConnections;
    };
    
    // Update particles
    const updateParticles = (hasMouse, mouseX, mouseY, time) => {
      const particles = [...particlesRef.current];
      
      for (const p of particles) {
        p.vx += (Math.sin(time * 0.5 + p.y * 0.002) * 0.02);
        p.vy += (Math.cos(time * 0.4 + p.x * 0.002) * 0.02);
        
        if (hasMouse && mouseX && mouseY) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.hypot(dx, dy);
          if (dist < 100) {
            const angle = Math.atan2(dy, dx);
            const force = (100 - dist) / 100 * 0.3;
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
          }
        }
        
        p.vx *= 0.99;
        p.vy *= 0.99;
        
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
        
        p.alpha = 0.2 + Math.sin(time * 2 + p.phase) * 0.15;
      }
      
      particlesRef.current = particles;
    };
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initNodes();
      initParticles();
    };
    
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      clearTimeout(window.mouseTimeout);
      window.mouseTimeout = setTimeout(() => {
        mouseRef.current.active = false;
      }, 150);
    };
    
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    handleResize();
    
    const animate = () => {
      if (!ctx) return;
      
      timeRef.current += 0.016 * pulseSpeed;
      const time = timeRef.current;
      
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const hasMouse = mouseRef.current.active && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
      
      updateNodes(mouseX, mouseY, hasMouse, time);
      updateParticles(hasMouse, mouseX, mouseY, time);
      
      const nodes = nodesRef.current;
      const connections = connectionsRef.current;
      const particles = particlesRef.current;
      
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        gradient.addColorStop(0, 'rgba(10, 10, 20, 0.95)');
        gradient.addColorStop(0.5, 'rgba(15, 15, 30, 0.97)');
        gradient.addColorStop(1, 'rgba(20, 15, 35, 0.98)');
      } else {
        gradient.addColorStop(0, 'rgba(245, 245, 255, 0.95)');
        gradient.addColorStop(0.5, 'rgba(240, 240, 255, 0.97)');
        gradient.addColorStop(1, 'rgba(235, 235, 255, 0.98)');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Draw connections
      for (const conn of connections) {
        if (conn.strength > 0.05) {
          const fromNode = nodes[conn.from];
          const toNode = nodes[conn.to];
          
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          
          let opacity = conn.strength * connectionOpacity;
          if (!hasMouse) {
            opacity *= (0.4 + Math.sin(time * 1.5 + conn.from * 0.02) * 0.3);
          }
          
          const grad = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
          grad.addColorStop(0, `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, ${opacity})`);
          grad.addColorStop(1, `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, ${opacity * 0.7})`);
          
          ctx.strokeStyle = grad;
          ctx.lineWidth = conn.thickness * (hasMouse ? 0.8 : 1);
          ctx.stroke();
        }
      }
      
      // Draw neural pulses
      if (!hasMouse && connections.length > 0) {
        const pulseCount = 12;
        for (let p = 0; p < pulseCount; p++) {
          const pulseTime = (time * 0.9 + p * 0.25) % 1;
          const connIndex = Math.floor(pulseTime * connections.length);
          if (connections[connIndex]) {
            const conn = connections[connIndex];
            const fromNode = nodes[conn.from];
            const toNode = nodes[conn.to];
            const t = (pulseTime * connections.length) % 1;
            
            const x = fromNode.x + (toNode.x - fromNode.x) * t;
            const y = fromNode.y + (toNode.y - fromNode.y) * t;
            
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.4)`;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.7)`;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, 0.95)`;
            ctx.fill();
          }
        }
      }
      
      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, ${p.alpha * 0.6})`;
        ctx.fill();
      }
      
      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        
        let glowSize = node.isCenterNode ? 15 : 10;
        if (hasMouse && mouseX && mouseY) {
          const mouseDist = Math.hypot(mouseX - node.x, mouseY - node.y);
          if (mouseDist < 80) glowSize = 20;
        }
        ctx.shadowBlur = glowSize;
        ctx.shadowColor = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.5)`;
        
        const fillColor = getNodeColor(node, time, hasMouse, mouseX, mouseY);
        ctx.fillStyle = fillColor;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(node.x - 0.8, node.y - 0.8, node.radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${hasMouse ? 0.2 : 0.35})`;
        ctx.fill();
        
        if ((node.energy || 0) > 0.7 && !hasMouse) {
          const ringPulse = Math.sin(time * 5 + node.phase) * 0.3 + 0.5;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 3 + ringPulse, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.4)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      
      ctx.shadowBlur = 0;
      
      // Mouse hover effects
      if (hasMouse && mouseX && mouseY) {
        for (let i = 0; i < 3; i++) {
          const delay = i * 0.3;
          const rippleRadius = 30 + Math.sin(time * 12 + delay) * 8 + i * 25;
          ctx.beginPath();
          ctx.arc(mouseX, mouseY, rippleRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, ${0.3 - i * 0.08})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 45, 0, Math.PI * 2);
        const glowGradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 60);
        glowGradient.addColorStop(0, `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0.15)`);
        glowGradient.addColorStop(1, `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, 0)`);
        ctx.fillStyle = glowGradient;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 70, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, 0.03)`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 18, 0, Math.PI * 2);
        const pulse = Math.sin(time * 15) * 0.1 + 0.2;
        ctx.fillStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, ${pulse})`;
        ctx.fill();
        
        for (const node of nodes) {
          const distToMouse = Math.hypot(node.x - mouseX, node.y - mouseY);
          if (distToMouse < 100 && distToMouse > 20) {
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = `rgba(${accentRGB.r}, ${accentRGB.g}, ${accentRGB.b}, ${0.15 * (1 - distToMouse / 100)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [density, primaryColor, secondaryColor, accentColor, connectionOpacity, nodeSize, pulseSpeed]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default NeuralBackground;