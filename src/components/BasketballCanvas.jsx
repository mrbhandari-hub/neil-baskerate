import { useRef, useEffect, useState, useCallback } from 'react';
import './BasketballCanvas.css';

function BasketballCanvas({ 
  selectedColor, 
  selectedTool, 
  isGlitterEnabled,
  canvasRef,
  clearTrigger,
  selectedSticker,
  activeDribble,
  personColor,
  hoopColor
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

  // Draw backyard background
  const drawBackyard = useCallback((ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
    skyGradient.addColorStop(0, '#87CEEB'); // Sky blue
    skyGradient.addColorStop(1, '#E0F6FF'); // Light blue
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height * 0.6);
    
    // Grass
    const grassGradient = ctx.createLinearGradient(0, height * 0.6, 0, height);
    grassGradient.addColorStop(0, '#7CB342'); // Green
    grassGradient.addColorStop(1, '#558B2F'); // Darker green
    ctx.fillStyle = grassGradient;
    ctx.fillRect(0, height * 0.6, width, height * 0.4);
    
    // Draw grass texture (simple lines)
    ctx.strokeStyle = '#689F38';
    ctx.lineWidth = 2;
    for (let i = 0; i < width; i += 15) {
      const offsetX = (i % 30) - 5; // Deterministic offset instead of random
      const offsetY = 5 + ((i % 20) / 4);
      ctx.beginPath();
      ctx.moveTo(i, height * 0.6);
      ctx.lineTo(i + offsetX, height * 0.6 + offsetY);
      ctx.stroke();
    }
    
    // Fence in background
    ctx.strokeStyle = '#8D6E63';
    ctx.fillStyle = '#8D6E63';
    ctx.lineWidth = 3;
    const fenceY = height * 0.3;
    const fenceHeight = height * 0.3;
    
    // Fence posts
    for (let i = 0; i < width; i += 40) {
      ctx.fillRect(i, fenceY, 4, fenceHeight);
    }
    
    // Fence horizontal boards
    for (let boardY = 0; boardY < 3; boardY++) {
      ctx.beginPath();
      ctx.moveTo(0, fenceY + (fenceHeight / 4) * (boardY + 1));
      ctx.lineTo(width, fenceY + (fenceHeight / 4) * (boardY + 1));
      ctx.stroke();
    }
    
    // Simple trees/shrubs in background
    ctx.fillStyle = '#2E7D32';
    for (let i = 0; i < 3; i++) {
      const treeX = (width / 4) * (i + 1);
      const treeY = height * 0.5;
      // Tree trunk
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(treeX - 5, treeY, 10, 30);
      // Tree top
      ctx.fillStyle = '#2E7D32';
      ctx.beginPath();
      ctx.arc(treeX, treeY, 25, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Basketball court/ground area (circular area)
    const centerX = width / 2;
    const centerY = height / 2;
    const courtRadius = Math.min(width, height) * 0.45;
    
    // Court shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.beginPath();
    ctx.arc(centerX, centerY + 5, courtRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Court surface (concrete/asphalt)
    const courtGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, courtRadius);
    courtGradient.addColorStop(0, '#E0E0E0');
    courtGradient.addColorStop(1, '#BDBDBD');
    ctx.fillStyle = courtGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, courtRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Court border
    ctx.strokeStyle = '#757575';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, courtRadius, 0, Math.PI * 2);
    ctx.stroke();
  }, [canvasRef]);

  // Draw basketball hoop
  const drawHoop = useCallback((ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Position hoop at the top center of the canvas
    const hoopX = width / 2;
    const hoopY = height * 0.15; // Near the top
    const rimRadius = 50;
    const rimThickness = 8;
    
    ctx.save();
    
    // Backboard
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    const backboardWidth = 120;
    const backboardHeight = 80;
    ctx.fillRect(hoopX - backboardWidth / 2, hoopY - backboardHeight, backboardWidth, backboardHeight);
    ctx.strokeRect(hoopX - backboardWidth / 2, hoopY - backboardHeight, backboardWidth, backboardHeight);
    
    // Backboard support pole
    ctx.fillStyle = '#CCCCCC';
    ctx.fillRect(hoopX - 8, 0, 16, hoopY - backboardHeight);
    
    // Rim (use selected hoop color)
    const selectedHoopColor = hoopColor || '#FF8800';
    ctx.strokeStyle = selectedHoopColor;
    ctx.fillStyle = selectedHoopColor;
    ctx.lineWidth = rimThickness;
    ctx.beginPath();
    ctx.arc(hoopX, hoopY, rimRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Net (white strings)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    const netStrings = 12;
    const netLength = 40;
    
    for (let i = 0; i < netStrings; i++) {
      const angle = (i / netStrings) * Math.PI * 2;
      const startX = hoopX + Math.cos(angle) * rimRadius;
      const startY = hoopY + Math.sin(angle) * rimRadius;
      const endX = startX + Math.cos(angle) * (netLength * 0.3);
      const endY = startY + netLength;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    
    // Rim highlight (lighter shade of selected color)
    // Create a lighter version of the color
    const highlightColor = selectedHoopColor === '#FFFFFF' ? '#CCCCCC' : selectedHoopColor;
    ctx.strokeStyle = highlightColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(hoopX, hoopY, rimRadius, 0, Math.PI);
    ctx.stroke();
    
    ctx.restore();
  }, [canvasRef, hoopColor]);

  // Draw person character
  const drawPerson = useCallback((ctx, pose = 'idle', ballX = 0, ballY = 0, angle = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.4;
    
    // Position person so their upper body is behind the basketball
    // Person's head should be at the same level or slightly above the ball center
    const personX = centerX;
    const personY = centerY + 20; // Position person so ball is in front of their upper body
    
    ctx.save();
    
    // Define arm and leg positions based on pose
    let leftArmAngle = -0.4;
    let rightArmAngle = 0.4;
    let leftLegAngle = 0.15;
    let rightLegAngle = -0.15;
    let bodyLean = 0;
    
    if (pose === 'dribbling') {
      // Dribbling pose - arms alternate up and down
      leftArmAngle = Math.sin(angle * 2) * 0.6 - 0.4;
      rightArmAngle = -Math.sin(angle * 2) * 0.6 + 0.4;
      // Legs slightly bent and moving
      leftLegAngle = Math.sin(angle * 2) * 0.25 + 0.15;
      rightLegAngle = -Math.sin(angle * 2) * 0.25 - 0.15;
    } else if (pose === 'shooting') {
      // Shooting pose - both arms up
      leftArmAngle = -1.4;
      rightArmAngle = -1.2;
      // Legs in shooting stance (slightly bent)
      leftLegAngle = 0.25;
      rightLegAngle = -0.25;
      bodyLean = -0.1; // Lean back slightly
    } else if (pose === 'crossover') {
      // Crossover pose - arms spread wide
      leftArmAngle = Math.sin(angle * 2) * 1.0 - 0.6;
      rightArmAngle = -Math.sin(angle * 2) * 1.0 + 0.6;
      leftLegAngle = Math.sin(angle * 2) * 0.35;
      rightLegAngle = -Math.sin(angle * 2) * 0.35;
      bodyLean = Math.sin(angle * 2) * 0.15; // Lean side to side
    }
    
    // Draw person with VERY thick, bright lines for maximum visibility
    // Use selected person color, or default to red
    const selectedPersonColor = personColor || '#FF0000';
    
    // For white color, use black stroke for visibility
    if (selectedPersonColor === '#FFFFFF' || selectedPersonColor === '#ffffff') {
      ctx.strokeStyle = '#000000';
      ctx.fillStyle = '#FFFFFF';
    } else {
      ctx.strokeStyle = selectedPersonColor;
      ctx.fillStyle = selectedPersonColor;
    }
    
    ctx.lineWidth = 10; // Extra thick lines for maximum visibility
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Apply body lean
    ctx.translate(personX, personY);
    ctx.rotate(bodyLean);
    ctx.translate(-personX, -personY);
    
    // Head (MUCH larger, very visible) - positioned above the ball - EXTRA LARGE
    ctx.beginPath();
    ctx.arc(personX, personY - 130, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Body (torso) - extends down, ball will be in front of upper body - MUCH TALLER
    ctx.beginPath();
    ctx.moveTo(personX, personY - 90);
    ctx.lineTo(personX, personY + 60);
    ctx.stroke();
    
    // Left arm - positioned so ball can be in front - MUCH LONGER
    ctx.beginPath();
    ctx.moveTo(personX, personY - 60);
    const leftArmEndX = personX + Math.cos(leftArmAngle) * 75;
    const leftArmEndY = personY - 60 + Math.sin(leftArmAngle) * 75;
    ctx.lineTo(leftArmEndX, leftArmEndY);
    ctx.stroke();
    
    // Right arm - positioned so ball can be in front - MUCH LONGER
    ctx.beginPath();
    ctx.moveTo(personX, personY - 60);
    const rightArmEndX = personX + Math.cos(rightArmAngle) * 75;
    const rightArmEndY = personY - 60 + Math.sin(rightArmAngle) * 75;
    ctx.lineTo(rightArmEndX, rightArmEndY);
    ctx.stroke();
    
    // Left leg - MUCH LONGER
    ctx.beginPath();
    ctx.moveTo(personX, personY + 60);
    const leftLegEndX = personX - 40 + Math.cos(leftLegAngle) * 70;
    const leftLegEndY = personY + 60 + Math.sin(leftLegAngle) * 70;
    ctx.lineTo(leftLegEndX, leftLegEndY);
    ctx.stroke();
    
    // Right leg - MUCH LONGER
    ctx.beginPath();
    ctx.moveTo(personX, personY + 60);
    const rightLegEndX = personX + 40 + Math.cos(rightLegAngle) * 70;
    const rightLegEndY = personY + 60 + Math.sin(rightLegAngle) * 70;
    ctx.lineTo(rightLegEndX, rightLegEndY);
    ctx.stroke();
    
    // Feet (much larger, very visible) - EXTRA BIG
    ctx.fillStyle = selectedPersonColor === '#FFFFFF' || selectedPersonColor === '#ffffff' ? '#FFFFFF' : selectedPersonColor;
    ctx.beginPath();
    ctx.arc(leftLegEndX, leftLegEndY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(rightLegEndX, rightLegEndY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Hands (larger circles at end of arms) - EXTRA BIG
    ctx.fillStyle = selectedPersonColor === '#FFFFFF' || selectedPersonColor === '#ffffff' ? '#FFFFFF' : selectedPersonColor;
    ctx.beginPath();
    ctx.arc(leftArmEndX, leftArmEndY, 16, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(rightArmEndX, rightArmEndY, 16, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }, [canvasRef, personColor]);

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

  // Clear drawing history when clearTrigger changes
  useEffect(() => {
    if (clearTrigger > 0) {
      drawingHistoryRef.current = [];
      stickersRef.current = [];
      // Redraw with clean state
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackyard(ctx);
        drawBasketball(ctx);
      }
    }
  }, [clearTrigger, drawBackyard, drawBasketball]);

  // Redraw everything
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw backyard background first
    drawBackyard(ctx);
    
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
  }, [drawBasketball, drawBackyard]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas ref is null');
      return;
    }
    
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Could not get 2d context');
        return;
      }
      drawBackyard(ctx);
      drawBasketball(ctx);
    } catch (error) {
      console.error('Error initializing canvas:', error);
    }
  }, [drawBasketball, drawBackyard]);

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

        // Clear and draw background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackyard(ctx);
        
        const angle = dribbleAngleRef.current;
      let offsetX = 0;
      let offsetY = 0;
      let rotation = 0;
      let personPose = 'dribbling';

      let scale = 1;
      
      switch (activeDribble) {
        case 'crossovers':
          // Side-to-side motion
          offsetX = Math.sin(angle * 2) * 15;
          rotation = Math.sin(angle * 2) * 0.1;
          // Scale down when moving (compressed effect)
          scale = 1 - Math.abs(Math.sin(angle * 2)) * 0.15;
          personPose = 'crossover';
          break;
        case 'under-legs':
          // Up and down with slight side motion
          offsetY = Math.sin(angle * 3) * 20;
          offsetX = Math.cos(angle * 3) * 10;
          rotation = angle * 0.2;
          // Scale down at bottom of bounce
          scale = 1 - Math.abs(Math.sin(angle * 3)) * 0.2;
          personPose = 'dribbling';
          break;
        case 'behind-back':
          // Back crossovers - forward then backward motion
          // Ball goes forward (positive X) then backward (negative X)
          offsetX = Math.sin(angle * 1.5) * 25;
          // Slight vertical movement for realism
          offsetY = Math.abs(Math.sin(angle * 3)) * 8;
          // Rotation follows the forward/backward motion
          rotation = Math.sin(angle * 1.5) * 0.3;
          // Scale down when moving
          scale = 1 - Math.abs(Math.sin(angle * 1.5)) * 0.15;
          personPose = 'crossover';
          break;
        case 'normal':
          // Simple up and down bounce
          offsetY = Math.abs(Math.sin(angle * 4)) * 25;
          // Scale down at bottom of bounce (compressed ball)
          scale = 1 - Math.abs(Math.sin(angle * 4)) * 0.25;
          personPose = 'dribbling';
          break;
      }
      
      // Draw person first (behind the ball)
      drawPerson(ctx, personPose, centerX + offsetX, centerY + offsetY, angle);

      // Draw basketball with animation (including drawings and stickers)
      ctx.save();
      ctx.translate(centerX + offsetX, centerY + offsetY);
      ctx.scale(scale, scale);
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
  }, [activeDribble, canvasRef, redraw, drawBackyard, drawPerson]);

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
        // Calculate arc path toward the hoop
        const hoopX = canvas.width / 2;
        const hoopY = canvas.height * 0.15;
        const currentY = startY - (startY - hoopY) * t;
        const currentX = centerX + (hoopX - centerX) * t + Math.sin(t * Math.PI) * 30;
        // Start smaller (compressed), then shrink more as it goes up
        const currentScale = 0.7 - t * 0.3; // Start at 70% size, shrink to 40%

        // Clear and draw backyard background
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackyard(ctx);
        
        // Draw basketball hoop at the top
        drawHoop(ctx);
        
        // Draw person in shooting pose (show longer)
        if (shootProgress < shootDuration * 0.5) {
          // Show person during first 50% of animation
          drawPerson(ctx, 'shooting', centerX, centerY, 0);
        }
        
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
  }, [canvasRef, redraw, drawBackyard, drawPerson, drawHoop]);

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

