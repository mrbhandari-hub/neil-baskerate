import { useRef, useEffect, useState, useCallback } from 'react';
import './BasketballCanvas.css';

function BasketballCanvas({ 
  selectedColor, 
  selectedTool, 
  isGlitterEnabled,
  canvasRef,
  clearTrigger,
  selectedSticker,
  activeDribble
}) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const glitterParticlesRef = useRef([]);
  const drawingHistoryRef = useRef([]);
  const animationFrameRef = useRef(null);
  const dribbleAnimationRef = useRef(null);
  const shootAnimationRef = useRef(null);
  const stickersRef = useRef([]);
  const dribbleAngleRef = useRef(0);
  const ballPositionRef = useRef({ x: 0, y: 0 });

  // Clear drawing history when clearTrigger changes
  useEffect(() => {
    if (clearTrigger > 0) {
      drawingHistoryRef.current = [];
      stickersRef.current = [];
    }
  }, [clearTrigger]);

  // Draw basketball base
  const drawBasketball = useCallback((ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.4;
    
    // Draw basketball circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FF8C00';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw characteristic basketball lines
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX, centerY + radius);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.stroke();

    // Curved lines (simplified)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, Math.PI * 2);
    ctx.stroke();
  }, [canvasRef]);

  // Redraw everything
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw basketball base
    drawBasketball(ctx);
    
    // Redraw all drawing history
    drawingHistoryRef.current.forEach((drawing) => {
      drawPoint(ctx, drawing.x, drawing.y, drawing.color, drawing.tool, drawing.lastPoint);
    });
    
    // Draw stickers
    stickersRef.current.forEach((sticker) => {
      ctx.save();
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sticker.emoji, sticker.x, sticker.y);
      ctx.restore();
    });
  }, [drawBasketball]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    drawBasketball(ctx);
  }, [drawBasketball]);

  // Check if point is inside basketball circle
  function isPointInBasketball(x, y) {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.4;
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    return distance <= radius;
  }

  function getCanvasCoordinates(e) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Handle both touch and mouse events
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      // For touchEnd and touchCancel events
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function drawBasketballInArea(ctx, x, y, radius) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const ballRadius = Math.min(canvas.width, canvas.height) * 0.4;
    
    // Create a clipping path for the eraser area AND the basketball boundary
    ctx.save();
    ctx.beginPath();
    // First clip to eraser area
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.clip();
    
    // Second clip to basketball boundary to prevent drawing outside
    ctx.beginPath();
    ctx.arc(centerX, centerY, ballRadius, 0, Math.PI * 2);
    ctx.clip();
    
    // First fill with orange to cover any white/transparent areas
    ctx.fillStyle = '#FF8C00';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw basketball circle outline
    ctx.beginPath();
    ctx.arc(centerX, centerY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FF8C00';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw characteristic basketball lines
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - ballRadius);
    ctx.lineTo(centerX, centerY + ballRadius);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(centerX - ballRadius, centerY);
    ctx.lineTo(centerX + ballRadius, centerY);
    ctx.stroke();

    // Curved lines (simplified)
    ctx.beginPath();
    ctx.arc(centerX, centerY, ballRadius, 0, Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, ballRadius, Math.PI, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  }

  function drawPoint(ctx, x, y, color, tool, prevPoint = null) {
    // Handle sticker tool
    if (tool === 'sticker' && selectedSticker) {
      if (isPointInBasketball(x, y)) {
        stickersRef.current.push({
          emoji: selectedSticker.emoji,
          x: x,
          y: y
        });
        redraw();
      }
      return;
    }
    
    if (!isPointInBasketball(x, y)) return;

    // Handle eraser tool separately
    if (tool === 'eraser') {
      const eraserRadius = 10;
      
      // First, erase the drawing layer using destination-out
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      
      if (prevPoint && isPointInBasketball(prevPoint.x, prevPoint.y)) {
        ctx.beginPath();
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(x, y);
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, eraserRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
      
      // Then, restore the basketball base in the erased area using source-over
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      
      if (prevPoint && isPointInBasketball(prevPoint.x, prevPoint.y)) {
        // Draw basketball for the line segment
        const distance = Math.sqrt(
          Math.pow(x - prevPoint.x, 2) + Math.pow(y - prevPoint.y, 2)
        );
        const steps = Math.max(5, Math.floor(distance / 5));
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const px = prevPoint.x + (x - prevPoint.x) * t;
          const py = prevPoint.y + (y - prevPoint.y) * t;
          // Only restore basketball if point is within basketball boundary
          if (isPointInBasketball(px, py)) {
            drawBasketballInArea(ctx, px, py, eraserRadius);
          }
        }
      } else {
        drawBasketballInArea(ctx, x, y, eraserRadius);
      }
      
      ctx.restore();
      return;
    }

    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    switch (tool) {
      case 'dots':
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'squiggly':
        if (prevPoint) {
          ctx.beginPath();
          ctx.moveTo(prevPoint.x, prevPoint.y);
          const midX = (prevPoint.x + x) / 2;
          const midY = (prevPoint.y + y) / 2;
          const offset = 10;
          ctx.quadraticCurveTo(midX + offset, midY - offset, x, y);
          ctx.lineWidth = 3;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'straight':
        if (prevPoint) {
          ctx.beginPath();
          ctx.moveTo(prevPoint.x, prevPoint.y);
          ctx.lineTo(x, y);
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'thick':
        if (prevPoint) {
          ctx.beginPath();
          ctx.moveTo(prevPoint.x, prevPoint.y);
          ctx.lineTo(x, y);
          ctx.lineWidth = 15;
          ctx.lineCap = 'round';
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, 7.5, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'mountain':
        if (prevPoint) {
          const dx = x - prevPoint.x;
          const dy = y - prevPoint.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const steps = Math.max(3, Math.floor(distance / 10));
          
          ctx.beginPath();
          ctx.moveTo(prevPoint.x, prevPoint.y);
          
          for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const px = prevPoint.x + dx * t;
            const py = prevPoint.y + dy * t;
            const zigzag = (i % 2 === 0 ? 1 : -1) * 15;
            const perpX = -dy / distance * zigzag;
            const perpY = dx / distance * zigzag;
            ctx.lineTo(px + perpX, py + perpY);
          }
          ctx.lineTo(x, y);
          ctx.lineWidth = 4;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      default:
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
  }

  function handleStart(e) {
    e.preventDefault();
    e.stopPropagation();
    const point = getCanvasCoordinates(e);
    if (!point || !isPointInBasketball(point.x, point.y)) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Handle sticker tool - place on click, don't start drawing
    if (selectedTool === 'sticker') {
      drawPoint(ctx, point.x, point.y, selectedColor, selectedTool, null);
      return;
    }
    
    setIsDrawing(true);
    setLastPoint(point);
    
    // Save to history (except for eraser, which is a destructive operation)
    if (selectedTool !== 'eraser') {
      drawingHistoryRef.current.push({
        x: point.x,
        y: point.y,
        color: selectedColor,
        tool: selectedTool,
        lastPoint: null
      });
    }
    
    drawPoint(ctx, point.x, point.y, selectedColor, selectedTool, null);
  }

  function handleMove(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isDrawing) return;

    const point = getCanvasCoordinates(e);
    if (!point) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Save to history (except for eraser, which is a destructive operation)
    if (selectedTool !== 'eraser') {
      drawingHistoryRef.current.push({
        x: point.x,
        y: point.y,
        color: selectedColor,
        tool: selectedTool,
        lastPoint: lastPoint
      });
    }
    
    drawPoint(ctx, point.x, point.y, selectedColor, selectedTool, lastPoint);
    
    // Add glitter particles if enabled (but not when erasing)
    if (isGlitterEnabled && selectedTool !== 'eraser' && Math.random() > 0.7) {
      glitterParticlesRef.current.push({
        x: point.x,
        y: point.y,
        life: 30,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2
      });
    }

    setLastPoint(point);
  }

  function handleEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDrawing(false);
    setLastPoint(null);
  }

  function handleCancel(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDrawing(false);
    setLastPoint(null);
  }

  // Handle dribbling animations
  useEffect(() => {
    if (!activeDribble) {
      if (dribbleAnimationRef.current) {
        cancelAnimationFrame(dribbleAnimationRef.current);
        dribbleAnimationRef.current = null;
      }
      dribbleAngleRef.current = 0;
      ballPositionRef.current = { x: 0, y: 0 };
      redraw();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.4;

    function animateDribble() {
      if (!activeDribble) return;

      redraw();
      
      const angle = dribbleAngleRef.current;
      let offsetX = 0;
      let offsetY = 0;
      let rotation = 0;

      switch (activeDribble) {
        case 'crossovers':
          // Side-to-side motion
          offsetX = Math.sin(angle * 2) * 15;
          rotation = Math.sin(angle * 2) * 0.1;
          break;
        case 'under-legs':
          // Up and down with slight side motion
          offsetY = Math.sin(angle * 3) * 20;
          offsetX = Math.cos(angle * 3) * 10;
          rotation = angle * 0.2;
          break;
        case 'behind-back':
          // Back crossovers - forward then backward motion
          // Ball goes forward (positive X) then backward (negative X)
          offsetX = Math.sin(angle * 1.5) * 25;
          // Slight vertical movement for realism
          offsetY = Math.abs(Math.sin(angle * 3)) * 8;
          // Rotation follows the forward/backward motion
          rotation = Math.sin(angle * 1.5) * 0.3;
          break;
        case 'normal':
          // Simple up and down bounce
          offsetY = Math.abs(Math.sin(angle * 4)) * 25;
          break;
      }

      // Draw basketball with animation (including drawings and stickers)
      ctx.save();
      ctx.translate(centerX + offsetX, centerY + offsetY);
      ctx.rotate(rotation);
      ctx.translate(-centerX, -centerY);
      
      // Draw full basketball with all decorations
      drawBasketball(ctx);
      
      // Redraw all drawings on the animated basketball
      drawingHistoryRef.current.forEach((drawing) => {
        drawPoint(ctx, drawing.x, drawing.y, drawing.color, drawing.tool, drawing.lastPoint);
      });
      
      // Draw stickers on the animated basketball
      stickersRef.current.forEach((sticker) => {
        ctx.save();
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sticker.emoji, sticker.x, sticker.y);
        ctx.restore();
      });
      
      // Draw basketball lines with motion effect
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      
      // Animated lines
      const lineOffset = Math.sin(angle * 2) * 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - radius + lineOffset);
      ctx.lineTo(centerX, centerY + radius - lineOffset);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(centerX - radius - lineOffset, centerY);
      ctx.lineTo(centerX + radius + lineOffset, centerY);
      ctx.stroke();
      
      // Curved lines
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, Math.PI, Math.PI * 2);
      ctx.stroke();
      
      ctx.restore();

      dribbleAngleRef.current += 0.1;
      dribbleAnimationRef.current = requestAnimationFrame(animateDribble);
    }

    dribbleAnimationRef.current = requestAnimationFrame(animateDribble);

    return () => {
      if (dribbleAnimationRef.current) {
        cancelAnimationFrame(dribbleAnimationRef.current);
      }
    };
  }, [activeDribble, canvasRef, redraw]);

  // Handle shooting animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleShoot = () => {
      const ctx = canvas.getContext('2d');
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.4;
      
      let shootProgress = 0;
      const shootDuration = 60; // frames
      const startY = centerY;
      const endY = -100; // Shoot off screen
      const arcHeight = 150;

      function animateShoot() {
        if (shootProgress >= shootDuration) {
          redraw();
          return;
        }

        const t = shootProgress / shootDuration;
        const currentY = startY - (startY - endY) * t;
        const currentX = centerX + Math.sin(t * Math.PI) * 50;
        const currentScale = 1 - t * 0.5; // Shrink as it goes up

        // Clear and redraw background (without the basketball)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw shooting basketball with all decorations
        ctx.save();
        ctx.translate(currentX, currentY);
        ctx.scale(currentScale, currentScale);
        ctx.translate(-centerX, -centerY);
        
        // Draw basketball base
        drawBasketball(ctx);
        
        // Draw all drawings on the shooting basketball
        drawingHistoryRef.current.forEach((drawing) => {
          drawPoint(ctx, drawing.x, drawing.y, drawing.color, drawing.tool, drawing.lastPoint);
        });
        
        // Draw stickers on the shooting basketball
        stickersRef.current.forEach((sticker) => {
          ctx.save();
          ctx.font = '40px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(sticker.emoji, sticker.x, sticker.y);
          ctx.restore();
        });
        
        // Draw basketball lines
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radius);
        ctx.lineTo(centerX, centerY + radius);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX - radius, centerY);
        ctx.lineTo(centerX + radius, centerY);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
        
        // Draw shooting trail (comet effect)
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 140, 0, 0.3)';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(currentX, currentY + radius * currentScale);
        ctx.lineTo(currentX, currentY + radius * currentScale + 30);
        ctx.stroke();
        ctx.restore();

        // Draw comet trail
        for (let i = 0; i < 5; i++) {
          const trailY = currentY + 20 + i * 10;
          const trailX = currentX + Math.sin(t * Math.PI + i) * 5;
          ctx.save();
          ctx.globalAlpha = 0.5 - i * 0.1;
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(trailX, trailY, 5 - i, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        shootProgress++;
        shootAnimationRef.current = requestAnimationFrame(animateShoot);
      }

      shootAnimationRef.current = requestAnimationFrame(animateShoot);
    };

    canvas.addEventListener('shootBasketball', handleShoot);

    return () => {
      canvas.removeEventListener('shootBasketball', handleShoot);
      if (shootAnimationRef.current) {
        cancelAnimationFrame(shootAnimationRef.current);
      }
    };
  }, [canvasRef, redraw]);

  // Animate glitter particles
  useEffect(() => {
    if (!isGlitterEnabled) {
      glitterParticlesRef.current = [];
      redraw();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function animateGlitter() {
      if (!isGlitterEnabled) {
        return;
      }

      // Redraw everything first
      redraw();

      // Add new glitter particles randomly when enabled
      if (Math.random() > 0.95) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.4;
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * radius;
        const x = centerX + Math.cos(angle) * dist;
        const y = centerY + Math.sin(angle) * dist;
        
        glitterParticlesRef.current.push({
          x: x,
          y: y,
          life: 30,
          size: Math.random() * 4 + 2,
          speed: Math.random() * 2 + 1,
          angle: Math.random() * Math.PI * 2
        });
      }

      // Update and draw particles
      const particles = glitterParticlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.life--;
        particle.y -= particle.speed * Math.sin(particle.angle);
        particle.x += particle.speed * Math.cos(particle.angle);
        particle.angle += 0.1;

        if (particle.life <= 0 || !isPointInBasketball(particle.x, particle.y)) {
          particles.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = particle.life / 30;
          ctx.fillStyle = '#FFD700';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#FFD700';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameRef.current = requestAnimationFrame(animateGlitter);
    }

    animationFrameRef.current = requestAnimationFrame(animateGlitter);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isGlitterEnabled, canvasRef, redraw]);

  return (
    <div className="basketball-canvas-container">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onTouchCancel={handleCancel}
        className="basketball-canvas"
      />
    </div>
  );
}

export default BasketballCanvas;

