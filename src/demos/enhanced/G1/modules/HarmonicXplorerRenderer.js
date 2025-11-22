/**
 * HarmonicXplorerRenderer.js
 * Renderer module that handles visualization and rendering
 */

class HarmonicXplorerRenderer extends HarmonicXplorerModule {
    constructor(config = {}) {
        super();
        
        this.config = Object.assign({
            layerOrder: ['background', 'grid', 'geometry', 'waveform', 'overlay']
        }, config);
        
        // Canvas layers
        this.layers = this.config.layerOrder;
        this.canvases = {};
        this.contexts = {};
        
        // Rendering state
        this.isInitialized = false;
        this.renderStats = {
            frames: 0,
            lastRender: 0
        };
    }
    
    async initialize() {
        try {
            // Create canvas layers
            const container = document.querySelector(`.${this.core.config.containerId}`);
            if (!container) {
                throw new Error(`Container with id '${this.core.config.containerId}' not found`);
            }
            
            // Clear existing canvases if any
            container.querySelectorAll('canvas').forEach(canvas => canvas.remove());
            
            // Create canvas layers in specified order
            this.layers.forEach((layer, index) => {
                const canvas = document.createElement('canvas');
                canvas.className = `layer ${layer}`;
                canvas.style.position = 'absolute';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.style.zIndex = index;
                canvas.style.pointerEvents = 'none';
                
                // Retina/high-DPI display support
                canvas.style.imageRendering = 'pixelated';
                
                container.appendChild(canvas);
                
                this.canvases[layer] = canvas;
                this.contexts[layer] = canvas.getContext('2d');
            });
            
            // Set up initial canvas sizes
            this.onResize(this.core.width, this.core.height);
            
            this.isInitialized = true;
            this.core.logDebug('Renderer initialized');
            return true;
        } catch (error) {
            this.core.logDebug(`Renderer initialization error: ${error.message}`);
            return false;
        }
    }
    
    onResize(width, height) {
        if (!this.isInitialized) return;
        
        try {
            // Get display pixel ratio for high-DPI displays
            const dpr = window.devicePixelRatio || 1;
            
            // Resize all canvases
            Object.values(this.canvases).forEach(canvas => {
                canvas.width = width * dpr;
                canvas.height = height * dpr;
                canvas.style.width = `${width}px`;
                canvas.style.height = `${height}px`;
                
                // Get the context and scale it for high-DPI displays
                const ctx = canvas.getContext('2d');
                ctx.scale(dpr, dpr);
            });
            
            this.core.logDebug(`Canvases resized to ${width}x${height} (DPR: ${dpr})`);
        } catch (error) {
            this.core.logDebug(`Canvas resize error: ${error.message}`);
        }
    }
    
    render() {
        if(!this.isInitialized)return;
        try{
            this.layers.forEach(layer=>{
                const c=this.canvases[layer],ctx=this.contexts[layer];
                ctx.clearRect(0,0,c.width/(window.devicePixelRatio||1),c.height/(window.devicePixelRatio||1));
            });
            this.drawBackground();
            if(this.core.state.showGeometry)this.drawGeometry();
            if(this.core.state.showWaveform)this.drawWaveform();
            if(this.core.state.showHarmonicRepresentation)this.drawHarmonicRepresentation();
            if(this.core.state.showWaveformCalculation)this.drawWaveformCalculation();
            this.drawOverlay();
            this.renderStats.frames++;this.renderStats.lastRender=performance.now();
        }catch(e){this.core.logDebug(`Render error: ${e.message}`);}
    }
    
    // Draw the background grid
    drawBackground() {
        try {
            const ctx = this.contexts.background;
            const { width, height, centerX, centerY, radius } = this.core;
            const { backgroundColor, axisColor, gridColor, axisCount, zoom } = this.core.state;
            
            // Fill background
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, width, height);
            
            // Draw grid (if coordinate system is orthogonal)
            if (this.core.state.coordinateSystem === 'orthogonal') {
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 1;
                
                // Vertical grid lines
                const gridSize = 50 * zoom;
                const numLinesX = Math.ceil(width / gridSize);
                const numLinesY = Math.ceil(height / gridSize);
                
                ctx.beginPath();
                for (let i = 0; i < numLinesX; i++) {
                    const x = Math.floor(i * gridSize + (centerX % gridSize));
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, height);
                }
                
                // Horizontal grid lines
                for (let i = 0; i < numLinesY; i++) {
                    const y = Math.floor(i * gridSize + (centerY % gridSize));
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                }
                ctx.stroke();
                
                // Draw axes
                ctx.strokeStyle = axisColor;
                ctx.lineWidth = 2;
                
                ctx.beginPath();
                // X axis
                ctx.moveTo(0, centerY);
                ctx.lineTo(width, centerY);
                
                // Y axis
                ctx.moveTo(centerX, 0);
                ctx.lineTo(centerX, height);
                ctx.stroke();
            } else {
                // Radial grid
                // Draw concentric circles
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 1;
                
                for (let r = radius * 0.2; r <= radius; r += radius * 0.2) {
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
                    ctx.stroke();
                }
                
                // Draw radial lines
                if (this.core.state.showAxis) {
                    ctx.strokeStyle = axisColor;
                    ctx.lineWidth = 1;
                    
                    for (const angleSinCos of this.core.cachedAngleSinCos) {
                        ctx.beginPath();
                        ctx.moveTo(centerX, centerY);
                        ctx.lineTo(
                            centerX + Math.cos(angleSinCos.angle) * radius,
                            centerY + Math.sin(angleSinCos.angle) * radius
                        );
                        ctx.stroke();
                    }
                }
            }
        } catch (error) {
            this.core.logDebug(`Background draw error: ${error.message}`);
        }
    }
    
    // Draw geometry (shapes)
    drawGeometry() {
        try {
            const ctx = this.contexts.geometry;
            const { centerX, centerY, radius } = this.core;
            const { rotation, shapes } = this.core.state;
            
            // Apply rotation transform
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.translate(-centerX, -centerY);
            
            // Draw shapes
            if (shapes.circle.show) {
                this.drawCircle(centerX, centerY, radius * 0.8, shapes.circle.color);
            }
            
            if (shapes.hexagon.show) {
                this.drawPolygon(centerX, centerY, radius * 0.8, 6, shapes.hexagon.color);
            }
            
            if (shapes.hexagonIn.show) {
                this.drawPolygon(centerX, centerY, radius * 0.3, 6, shapes.hexagonIn.color);
            }
            
            if (shapes.square.show) {
                this.drawPolygon(centerX, centerY, radius * 0.6, 4, shapes.square.color);
            }
            
            if (shapes.squareIn.show) {
                this.drawPolygon(centerX, centerY, radius * 0.2, 4, shapes.squareIn.color);
            }
            
            if (shapes.triangle.show) {
                this.drawPolygon(centerX, centerY, radius * 0.6, 3, shapes.triangle.color);
            }
            
            // Restore context
            ctx.restore();
        } catch (error) {
            this.core.logDebug(`Geometry draw error: ${error.message}`);
        }
    }
    
    // Draw waveform
    drawWaveform() {
        try {
            const ctx = this.contexts.waveform;
            const { centerX, centerY, radius } = this.core;
            const { rotation, wavelength, zoom, waveformColor } = this.core.state;
            
            // Get waveform data
            const waveform = this.core.getWaveform();
            if (!waveform || waveform.length === 0) return;
            
            ctx.save();
            ctx.translate(centerX, centerY);
            
            // Draw waveform
            ctx.strokeStyle = waveformColor;
            ctx.lineWidth = 2.5;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            
            const pointCount = 100; // Number of points to draw (for performance)
            const angleStep = Math.PI * 2 / pointCount;
            
            if (this.core.state.coordinateSystem === 'radial') {
                // Radial waveform
                ctx.beginPath();
                
                for (let i = 0; i <= pointCount; i++) {
                    const angle = i * angleStep + rotation;
                    const waveIndex = Math.floor((i / pointCount) * waveform.length) % waveform.length;
                    const waveValue = waveform[waveIndex] || 0;
                    
                    // Calculate point based on wavelength and zoom
                    const r = radius * 0.5 + waveValue * zoom;
                    const x = r * Math.cos(angle * wavelength);
                    const y = r * Math.sin(angle * wavelength);
                    
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                
                ctx.closePath();
                ctx.stroke();
            } else {
                // Orthogonal (Cartesian) waveform
                const xOffset = -radius; // Start from left
                const xRange = radius * 2; // Width of waveform
                const yScale = radius * 0.3; // Scale amplitude
                
                ctx.beginPath();
                
                for (let i = 0; i <= pointCount; i++) {
                    const t = i / pointCount;
                    const x = xOffset + t * xRange;
                    
                    const waveIndex = Math.floor(t * waveform.length) % waveform.length;
                    const y = -waveform[waveIndex] * yScale; // Negative because canvas Y goes down
                    
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                
                ctx.stroke();
            }
            
            ctx.restore();
        } catch (error) {
            this.core.logDebug(`Waveform draw error: ${error.message}`);
        }
    }
    
    // Draw overlay information
    drawOverlay() {
        // Draw any overlay information like cursor position, selection, etc.
        // Currently empty as we don't have overlay requirements
    }
    
    // Draw a circle
    drawCircle(x, y, radius, color, lineWidth = 2) {
        const ctx = this.contexts.geometry;
        
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Draw a polygon with n sides
    drawPolygon(x, y, radius, sides, color, lineWidth = 2, fill = false, startAngle = 0) {
        if (sides < 3) sides = 3;
        const ctx = this.contexts.geometry;
        
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;
        
        const angleStep = Math.PI * 2 / sides;
        for (let i = 0; i <= sides; i++) {
            const angle = startAngle + i * angleStep;
            const px = x + radius * Math.cos(angle);
            const py = y + radius * Math.sin(angle);
            
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        
        ctx.closePath();
        if (fill) ctx.fill();
        else ctx.stroke();
    }
    
    // Draw a regular star with n points
    drawStar(x, y, outerRadius, innerRadius, points, color, lineWidth = 2, fill = false) {
        if (points < 3) points = 3;
        const ctx = this.contexts.geometry;
        
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;
        
        const angleStep = Math.PI / points;
        for (let i = 0; i <= points * 2; i++) {
            const angle = Math.PI / 2 + i * angleStep;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const px = x + radius * Math.cos(angle);
            const py = y + radius * Math.sin(angle);
            
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        
        ctx.closePath();
        if (fill) ctx.fill();
        else ctx.stroke();
    }
    
    // Draw a waveform along a path
    drawWaveformAlongPath(centerX, centerY, angle, amplitude, wavelength, color) {
        const ctx = this.contexts.waveform;
        const radius = this.core.radius * 0.6;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        
        const halfWavelength = wavelength / 2;
        const numPoints = 50;
        const stepSize = (radius * 2) / numPoints;
        
        for (let i = 0; i <= numPoints; i++) {
            const x = -radius + (i * stepSize);
            const y = amplitude * Math.sin(x / halfWavelength);
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        
        ctx.stroke();
        ctx.restore();
    }
    
    // Draw triangles (triangular representation)
    drawTriangles(x, y, radius, angle, color = '#FFC107') {
        const ctx = this.contexts.geometry;
        const harmonics = this.core.getHarmonics();
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        for (let i = 0; i < harmonics.length; i++) {
            const harmonic = harmonics[i];
            const n = harmonic.ratio;
            const r = radius * (1 / Math.sqrt(n));
            const opacity = 1 / Math.sqrt(n);
            
            ctx.strokeStyle = color;
            ctx.globalAlpha = opacity * 0.7;
            
            this.drawPolygon(0, 0, r, 3, color, 2);
        }
        
        ctx.restore();
        ctx.globalAlpha = 1.0;
    }
    
    // Draw a specific shape based on the index
    drawShape(x, y, radius, angle, innerSize, shapeIndex) {
        // Shape index corresponds to different geometric forms:
        // 0: Circle, 1: Square, 2: Triangle, 3: Hexagon, 4: Star, 5: Nested shapes...
        switch (shapeIndex) {
            case 0: // Circle
                this.drawCircle(x, y, radius, this.core.state.shapes.circle.color);
                break;
            case 1: // Square
                this.drawPolygon(x, y, radius, 4, this.core.state.shapes.square.color);
                if (innerSize > 0) {
                    this.drawPolygon(x, y, radius * innerSize, 4, this.core.state.shapes.squareIn.color);
                }
                break;
            case 2: // Triangle
                this.drawPolygon(x, y, radius, 3, this.core.state.shapes.triangle.color);
                break;
            case 3: // Hexagon
                this.drawPolygon(x, y, radius, 6, this.core.state.shapes.hexagon.color);
                if (innerSize > 0) {
                    this.drawPolygon(x, y, radius * innerSize, 6, this.core.state.shapes.hexagonIn.color);
                }
                break;
            case 4: // Star
                this.drawStar(x, y, radius, radius * 0.4, 5, '#e91e63');
                break;
            case 5: // Triangle + Circle
                this.drawPolygon(x, y, radius, 3, '#ff9800');
                this.drawCircle(x, y, radius * 0.5, '#2196f3');
                break;
            default:
                this.drawCircle(x, y, radius, this.core.state.shapes.circle.color);
        }
    }
    
    // Draw a dynamic representation of the harmonic series
    drawHarmonicRepresentation() {
        const ctx = this.contexts.geometry;
        const { centerX, centerY, radius } = this.core;
        const { rotation } = this.core.state;
        const harmonics = this.core.getHarmonics();
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        const maxHarmonics = 12; // Limit to prevent visual clutter
        const visibleHarmonics = harmonics.slice(0, maxHarmonics);
        
        // Draw circles for each harmonic
        for (let i = 0; i < visibleHarmonics.length; i++) {
            const harmonic = visibleHarmonics[i];
            const n = harmonic.ratio;
            const r = radius * (1 / Math.sqrt(n)) * 0.75;
            const angle = rotation + harmonic.phase;
            
            // Position based on harmonic number
            const spacing = radius * 1.75 / maxHarmonics;
            const xOffset = -radius * 0.8 + (i * spacing);
            
            // Draw circle
            const hue = (i / visibleHarmonics.length) * 360;
            ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`;
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.arc(xOffset, 0, r, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw harmonic number
            ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(n.toFixed(1), xOffset, r + 15);
        }
        
        ctx.restore();
    }
    
    // Draw a visualization of the waveform calculation in process
    drawWaveformCalculation() {
        const ctx = this.contexts.overlay;
        const { centerX, centerY, radius } = this.core;
        const harmonics = this.core.getHarmonics();
        const waveform = this.core.getWaveform();
        
        if (!waveform || waveform.length === 0) return;
        
        const yScale = radius * 0.3;
        const xScale = radius * 1.5;
        
        ctx.save();
        ctx.translate(centerX, centerY - radius * 0.5);
        
        // Draw individual harmonic components
        const maxHarmonics = Math.min(harmonics.length, 5); // Show only first 5 harmonics
        
        for (let i = 0; i < maxHarmonics; i++) {
            const harmonic = harmonics[i];
            const n = harmonic.ratio;
            
            ctx.beginPath();
            ctx.strokeStyle = `hsl(${(i / maxHarmonics) * 360}, 80%, 60%)`;
            ctx.lineWidth = 1;
            
            for (let x = -xScale; x <= xScale; x += 5) {
                const t = (x + xScale) / (xScale * 2); // Normalized 0-1
                const phaseShift = harmonic.phase || 0;
                const y = -(Math.sin(t * Math.PI * 2 * n + phaseShift) * yScale) / n;
                
                if (x === -xScale) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            
            ctx.stroke();
        }
        
        // Draw combined waveform
        ctx.beginPath();
        ctx.strokeStyle = this.core.state.waveformColor;
        ctx.lineWidth = 3;
        
        for (let x = -xScale; x <= xScale; x += 2) {
            const t = (x + xScale) / (xScale * 2); // Normalized 0-1
            const idx = Math.floor(t * waveform.length);
            const y = -waveform[idx] * yScale * 0.5;
            
            if (x === -xScale) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        
        ctx.stroke();
        ctx.restore();
    }
    
    // Clear all canvases
    clearAll() {
        Object.keys(this.contexts).forEach(layer => {
            const canvas = this.canvases[layer];
            const ctx = this.contexts[layer];
            ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
        });
    }
}

// Export class for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HarmonicXplorerRenderer };
} else {
    window.HarmonicXplorerRenderer = HarmonicXplorerRenderer;
} 