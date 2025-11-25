/**
 * GeometryRenderer.js
 * 
 * Handles all canvas drawing (shapes, waves, triangles).
 * Optimized for efficient rendering and animation.
 */

export default class GeometryRenderer {
  constructor(eventGear, appState, canvas) {
    this.eventGear = eventGear;
    this.appState = appState;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Track rendering state
    this.renderState = {
      lastWaveformData: null,
      needsRedraw: true
    };
    
    // Performance metrics
    this.metrics = {
      frameTime: 0,
      frameCount: 0
    };
    
    // Register event listeners
    this.registerEvents();
    
    // Initial resize
    this.handleResize();
  }
  
  /**
   * Registers event listeners
   */
  registerEvents() {
    // Listen for animation frames (emitted by Visualizer)
    this.eventGear.on('animation.frame', (data) => {
      this.render(data.timestamp, data.delta);
    });

    // Listen for parameter changes (emitted by AppState)
    this.eventGear.on('parameterChanged', () => {
      this.renderState.needsRedraw = true;
    });
    
    // Listen for waveform updates
    this.eventGear.on('waveform.calculated', (data) => {
      this.renderState.lastWaveformData = data.waveformData;
      this.renderState.needsRedraw = true;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }
  
  /**
   * Handles canvas resize
   */
  handleResize() {
    // Set canvas width and height
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    
    // Force redraw
    this.renderState.needsRedraw = true;
  }
  
  /**
   * Main render function
   * @param {number} timestamp - Current timestamp
   * @param {number} deltaTime - Time since last frame
   */
  render(timestamp, deltaTime) {
    // Always render when called from animation frame (for continuous rotation)
    // Skip only if explicitly paused (future feature)
    const startTime = performance.now();
    
    // Clear canvas
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Get parameters
    const params = this.appState.getAllParams();
    const angleSinCos = this.appState.getCachedData('angleSinCos') || { sin: 0, cos: 1 };
    
    // Render shapes
    this.renderShapes(params, angleSinCos);
    
    // Render waveform if available
    if (this.renderState.lastWaveformData && params.showWave) {
      this.renderWaveform(params);
    }
    
    // Update metrics
    this.metrics.frameTime = performance.now() - startTime;
    this.metrics.frameCount++;

    // Emit metrics
    if (this.metrics.frameCount % 60 === 0) {
      this.eventGear.emit('render.metrics', { ...this.metrics });
    }
  }
  
  /**
   * Renders all geometric shapes
   * @param {Object} params - Rendering parameters
   * @param {Object} angleSinCos - Cached sin/cos values for rotation
   */
  renderShapes(params, angleSinCos) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const zoom = params.zoomManual;
    const wavelength = params.wavelength * 50 * zoom; // Scale wavelength
    
    // Draw coordinate system
    if (params.showAxis) {
      this.drawCoordinateSystem(
        centerX, centerY, wavelength, 
        params.axis, params.coordinateSystem,
        params.AxisColor, angleSinCos
      );
    }
    
    // Draw circle if enabled
    if (params.showCircle) {
      this.drawCircle(centerX, centerY, wavelength, params.circleColor);
    }
    
    // Draw hexagon if enabled
    if (params.showHex) {
      this.drawHexagon(centerX, centerY, wavelength, params.hexColor, false, angleSinCos);
    }
    
    // Draw inner hexagon if enabled
    if (params.showHexIn) {
      this.drawHexagon(centerX, centerY, wavelength / 2, params.hexInColor, true, angleSinCos);
    }
    
    // Draw square if enabled
    if (params.showSquare) {
      this.drawSquare(centerX, centerY, wavelength, params.squareColor, false, angleSinCos);
    }
    
    // Draw inner square if enabled
    if (params.showSquareIn) {
      this.drawSquare(centerX, centerY, wavelength / Math.sqrt(2), params.squareInColor, true, angleSinCos);
    }
    
    // Draw triangle if enabled
    if (params.showTriangle) {
      this.drawTriangle(centerX, centerY, wavelength, params.triangleColor, angleSinCos);
    }
  }
  
  /**
   * Draws the coordinate system (axes)
   * @param {number} centerX - X center position
   * @param {number} centerY - Y center position
   * @param {number} radius - Maximum radius
   * @param {number} axisCount - Number of axes
   * @param {string} type - Coordinate system type
   * @param {string} color - Axis color
   * @param {Object} angleSinCos - Rotation values
   */
  drawCoordinateSystem(centerX, centerY, radius, axisCount, type, color, angleSinCos) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1;
    
    if (type === 'radial') {
      // Draw radial coordinate system
      const angleStep = (2 * Math.PI) / axisCount;
      
      for (let i = 0; i < axisCount; i++) {
        const angle = i * angleStep + Math.atan2(angleSinCos.sin, angleSinCos.cos);
        
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius
        );
        this.ctx.stroke();
      }
    } else {
      // Draw orthogonal coordinate system
      const halfAxisCount = Math.floor(axisCount / 2);
      const spacing = radius / halfAxisCount;
      
      // Draw horizontal lines
      for (let i = -halfAxisCount; i <= halfAxisCount; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - radius, centerY + i * spacing);
        this.ctx.lineTo(centerX + radius, centerY + i * spacing);
        this.ctx.stroke();
      }
      
      // Draw vertical lines
      for (let i = -halfAxisCount; i <= halfAxisCount; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(centerX + i * spacing, centerY - radius);
        this.ctx.lineTo(centerX + i * spacing, centerY + radius);
        this.ctx.stroke();
      }
    }
  }
  
  /**
   * Draws a circle
   * @param {number} centerX - X center position
   * @param {number} centerY - Y center position
   * @param {number} radius - Circle radius
   * @param {string} color - Circle color
   */
  drawCircle(centerX, centerY, radius, color) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }
  
  /**
   * Draws a hexagon
   * @param {number} centerX - X center position
   * @param {number} centerY - Y center position
   * @param {number} radius - Hexagon radius
   * @param {string} color - Hexagon color
   * @param {boolean} isDashed - Whether to use dashed lines
   * @param {Object} angleSinCos - Rotation values
   */
  drawHexagon(centerX, centerY, radius, color, isDashed, angleSinCos) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    
    if (isDashed) {
      this.ctx.setLineDash([5, 5]);
    } else {
      this.ctx.setLineDash([]);
    }
    
    const sides = 6;
    const angleStep = (2 * Math.PI) / sides;
    const startAngle = Math.atan2(angleSinCos.sin, angleSinCos.cos);
    
    this.ctx.beginPath();
    
    // Draw hexagon points
    for (let i = 0; i <= sides; i++) {
      const angle = i * angleStep + startAngle;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }
  
  /**
   * Draws a square
   * @param {number} centerX - X center position
   * @param {number} centerY - Y center position
   * @param {number} size - Square size
   * @param {string} color - Square color
   * @param {boolean} isDashed - Whether to use dashed lines
   * @param {Object} angleSinCos - Rotation values
   */
  drawSquare(centerX, centerY, size, color, isDashed, angleSinCos) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    
    if (isDashed) {
      this.ctx.setLineDash([5, 5]);
    } else {
      this.ctx.setLineDash([]);
    }
    
    const halfSize = size / 2;
    const startAngle = Math.atan2(angleSinCos.sin, angleSinCos.cos);
    
    this.ctx.beginPath();
    
    // Draw rotated square
    for (let i = 0; i <= 4; i++) {
      const angle = startAngle + (i * Math.PI / 2);
      const x = centerX + halfSize * Math.cos(angle);
      const y = centerY + halfSize * Math.sin(angle);
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }
  
  /**
   * Draws a triangle
   * @param {number} centerX - X center position
   * @param {number} centerY - Y center position
   * @param {number} size - Triangle size
   * @param {string} color - Triangle color
   * @param {Object} angleSinCos - Rotation values
   */
  drawTriangle(centerX, centerY, size, color, angleSinCos) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([]);
    
    const startAngle = Math.atan2(angleSinCos.sin, angleSinCos.cos);
    const sides = 3;
    const angleStep = (2 * Math.PI) / sides;
    
    this.ctx.beginPath();
    
    // Draw triangle points
    for (let i = 0; i <= sides; i++) {
      const angle = i * angleStep + startAngle;
      const x = centerX + size * Math.cos(angle);
      const y = centerY + size * Math.sin(angle);
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.stroke();
  }
  
  /**
   * Renders the waveform
   * @param {Object} params - Rendering parameters
   */
  renderWaveform(params) {
    if (!this.renderState.lastWaveformData) return;
    
    const { waveform, resolution } = this.renderState.lastWaveformData;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = params.wavelength * 50 * params.zoomManual;
    
    this.ctx.strokeStyle = params.waveColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    
    // Draw waveform
    for (let i = 0; i < resolution; i++) {
      const angle = (i / resolution) * 2 * Math.PI;
      const amplitude = waveform[i] * radius;
      const x = centerX + Math.cos(angle) * (radius + amplitude);
      const y = centerY + Math.sin(angle) * (radius + amplitude);
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.closePath();
    this.ctx.stroke();
  }
  
  /**
   * Forces a redraw on the next frame
   */
  forceRedraw() {
    this.renderState.needsRedraw = true;
  }
} 