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
        
        // Constants
        this.HEX_RATIO = 1.1547; // sqrt(4/3)
        this.PI_RATIO = Math.PI / 3;
        this.SQRT_OF_TWO = Math.sqrt(2);
        
        // Rendering state
        this.isInitialized = false;
        this.renderStats = {
            frames: 0,
            lastRender: 0,
            frameTime: 0
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
        if (!this.isInitialized) return;
        
        const startTime = performance.now();
        
        try {
            // Clear all layers
            this.clearAll();
            
            // Draw each layer
            this.drawBackground();
            if (this.core.state.showGeometry) this.drawGeometry();
            if (this.core.state.showWaveform) this.drawWaveform();
            if (this.core.state.showHarmonicRepresentation) this.drawHarmonicRepresentation();
            if (this.core.state.showWaveformCalculation) this.drawWaveformCalculation();
            
            // Draw audio visualization if enabled
            if (this.core.state.audioEnabled && this.core.state.showSpectrum) {
                this.drawAudioSpectrum();
            }
            
            // Show metrics if enabled
            if (this.core.state.showMetrics) {
                this.drawMetrics();
            }
            
            // Update render stats
            this.renderStats.frames++;
            this.renderStats.frameTime = performance.now() - startTime;
            this.renderStats.lastRender = performance.now();
        } catch (error) {
            this.core.logDebug(`Render error: ${error.message}`);
        }
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
    
    drawGeometry() {
        try {
            const ctx = this.contexts.geometry;
            const { centerX, centerY, radius } = this.core;
            const { rotation, shapes, harmonicType, harmonicCount } = this.core.state;
            
            // Apply rotation transform
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            ctx.translate(-centerX, -centerY);
            
            // Calculate harmonics
            const harmonics = this.core.calculateHarmonics();
            
            // Draw shapes for each harmonic
            for (let i = 0; i < harmonics.length; i++) {
                const harmonic = harmonics[i];
                const n = harmonic.n || 1;
                const innerSize = radius * 0.4;
                
                // Skip if in singular mode and not the selected harmonic
                if (harmonicType === 'singular' && n !== harmonicCount) {
                    continue;
                }
                
                // Draw shapes at harmonic positions
                for (let j = 0; j < n; j++) {
                    // Skip inner geometry for special series
                    if ((harmonicType === 'upper' || harmonicType === 'lower' || harmonicType === 'under') && j !== 0) {
                        continue;
                    }
                    
                    const centerOffset = (-1 + (1 / n) + j * (2 / n)) * radius;
                    
                    // Draw at each axis point
                    for (let k = 0; k < this.core.cachedAngleSinCos.length; k++) {
                        const angle = this.core.cachedAngleSinCos[k].angle;
                        const x = centerX + centerOffset * Math.cos(angle);
                        const y = centerY + centerOffset * Math.sin(angle);
                        
                        this.drawShape(x, y, radius * 0.8, angle, innerSize, j);
                    }
                }
            }
            
            // Draw fundamental frequency elements
            if (harmonicType !== 'singular' || harmonicCount === 1) {
                for (let k = 0; k < this.core.cachedAngleSinCos.length; k++) {
                    const angle = this.core.cachedAngleSinCos[k].angle;
                    this.drawShape(centerX, centerY, radius, angle, radius * this.SQRT_OF_TWO, 0);
                    
                    if (harmonicType !== 'singular') {
                        this.drawTriangles(centerX, centerY, radius, angle);
                    }
                }
            }
            
            ctx.restore();
        } catch (error) {
            this.core.logDebug(`Geometry draw error: ${error.message}`);
        }
    }
    
    drawShape(x, y, radius, angle, innerSize, shapeIndex) {
        const ctx = this.contexts.geometry;
        const { shapes, harmonicPhase } = this.core.state;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        const isUpper = (shapeIndex % 2 === 0) ^ (harmonicPhase === 'phaseDown');
        
        // Draw hexagon
        if (shapes.hexagon.show) {
            ctx.beginPath();
            ctx.strokeStyle = shapes.hexagon.color;
            ctx.lineWidth = 2;
            
            if (harmonicPhase === 'phaseFull') {
                for (let i = 0; i < 6; i++) {
                    const angle = this.PI_RATIO * i;
                    const px = radius * this.HEX_RATIO * Math.cos(angle);
                    const py = radius * this.HEX_RATIO * Math.sin(angle);
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
            } else {
                const startAngle = isUpper ? Math.PI : 0;
                for (let i = 0; i <= 3; i++) {
                    const angle = startAngle + this.PI_RATIO * i;
                    const px = radius * this.HEX_RATIO * Math.cos(angle);
                    const py = radius * this.HEX_RATIO * Math.sin(angle);
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
            }
            ctx.stroke();
        }
        
        // Draw inner hexagon
        if (shapes.hexagonIn.show) {
            ctx.beginPath();
            ctx.strokeStyle = shapes.hexagonIn.color;
            ctx.lineWidth = 2;
            
            if (harmonicPhase === 'phaseFull') {
                for (let i = 0; i < 6; i++) {
                    const angle = this.PI_RATIO * i;
                    const px = innerSize * this.HEX_RATIO * Math.cos(angle);
                    const py = innerSize * this.HEX_RATIO * Math.sin(angle);
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
            } else {
                const startAngle = isUpper ? Math.PI : 0;
                for (let i = 0; i <= 3; i++) {
                    const angle = startAngle + this.PI_RATIO * i;
                    const px = innerSize * this.HEX_RATIO * Math.cos(angle);
                    const py = innerSize * this.HEX_RATIO * Math.sin(angle);
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
            }
            ctx.stroke();
        }
        
        // Draw square
        if (shapes.square.show) {
            ctx.beginPath();
            ctx.strokeStyle = shapes.square.color;
            ctx.lineWidth = 2;
            
            const size = radius * this.SQRT_OF_TWO;
            if (harmonicPhase === 'phaseFull') {
                ctx.rect(-size/2, -size/2, size, size);
            } else {
                if (isUpper) {
                    ctx.rect(-size/2, -size/2, size, size/2);
                } else {
                    ctx.rect(-size/2, 0, size, size/2);
                }
            }
            ctx.stroke();
        }
        
        // Draw inner square
        if (shapes.squareIn.show) {
            ctx.beginPath();
            ctx.strokeStyle = shapes.squareIn.color;
            ctx.lineWidth = 2;
            
            const size = innerSize * this.SQRT_OF_TWO;
            ctx.rotate(Math.PI / 4);
            if (harmonicPhase === 'phaseFull') {
                ctx.rect(-size/2, -size/2, size, size);
            } else {
                if (isUpper) {
                    ctx.rect(-size/2, -size/2, size, size/2);
                } else {
                    ctx.rect(-size/2, 0, size, size/2);
                }
            }
            ctx.rotate(-Math.PI / 4);
            ctx.stroke();
        }
        
        // Draw circle
        if (shapes.circle.show) {
            ctx.beginPath();
            ctx.strokeStyle = shapes.circle.color;
            ctx.lineWidth = 2;
            
            if (harmonicPhase === 'phaseFull') {
                ctx.arc(0, 0, radius, 0, Math.PI * 2);
            } else {
                ctx.arc(0, 0, radius, !isUpper ? 0 : Math.PI, !isUpper ? Math.PI : Math.PI * 2);
            }
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    drawTriangles(x, y, radius, angle) {
        if (!this.core.state.shapes.triangle.show) return;
        
        const ctx = this.contexts.geometry;
        const { triangleColor } = this.core.state.shapes;
        const { harmonicPhase } = this.core.state;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        ctx.strokeStyle = triangleColor;
        ctx.lineWidth = 2;
        
        // Draw first triangle
        ctx.beginPath();
        ctx.moveTo(-radius, 0);
        ctx.lineTo(radius * 0.5, -radius * 0.866); // sqrt(3)/2
        ctx.lineTo(radius * 0.5, radius * 0.866);
        ctx.closePath();
        ctx.stroke();
        
        // Draw second triangle if in full phase mode
        if (harmonicPhase === 'phaseFull') {
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.lineTo(-radius * 0.5, radius * 0.866);
            ctx.lineTo(-radius * 0.5, -radius * 0.866);
            ctx.closePath();
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    drawWaveform() {
        try {
            const ctx = this.contexts.waveform;
            const { centerX, centerY, radius } = this.core;
            const { rotation, wavelength, zoom, waveformColor, coordinateSystem } = this.core.state;
            
            // Get waveform data
            const waveform = this.core.getWaveform();
            if (!waveform || waveform.length === 0) return;
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);
            
            ctx.strokeStyle = waveformColor;
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            
            if (coordinateSystem === 'orthogonal') {
                // Draw straight waveform
                const width = wavelength * radius * 2;
                const height = radius * 0.5 * zoom;
                
                ctx.beginPath();
                for (let i = 0; i < waveform.length; i++) {
                    const t = i / waveform.length;
                    const x = (t - 0.5) * width;
                    const y = -waveform[i] * zoom;
                    
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            } else {
                // Draw radial waveform
                const drawRadialWave = (mirror = false) => {
                    ctx.beginPath();
                    
                    // Draw more efficiently by skipping points when zoomed out
                    const step = Math.max(1, Math.floor(waveform.length / (radius * 2)));
                    
                    for (let i = 0; i < waveform.length; i += step) {
                        const angle = (i / waveform.length) * Math.PI * 2;
                        const r = radius + (mirror ? 1 : -1) * waveform[i] * zoom;
                        
                        const x = Math.cos(angle) * r;
                        const y = Math.sin(angle) * r;
                        
                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    
                    // Close the path for radial display
                    ctx.closePath();
                    ctx.stroke();
                };
                
                // Draw based on phase mode
                if (this.core.state.harmonicPhase === 'phaseFull') {
                    drawRadialWave(); // Inner
                    drawRadialWave(true); // Outer
                } else if (this.core.state.harmonicPhase === 'phaseUp') {
                    drawRadialWave(); // Inner only
                } else { // phaseDown
                    drawRadialWave(true); // Outer only
                }
            }
            
            ctx.restore();
        } catch (error) {
            this.core.logDebug(`Waveform draw error: ${error.message}`);
        }
    }
    
    drawHarmonicRepresentation() {
        try {
            const ctx = this.contexts.overlay;
            const { centerX, centerY, radius } = this.core;
            const harmonics = this.core.getHarmonics();
            
            if (!harmonics || harmonics.length === 0) return;
            
            const maxRadius = radius * 0.8;
            const spacing = maxRadius / (harmonics.length + 1);
            
            ctx.save();
            ctx.translate(centerX, centerY);
            
            // Draw harmonic relationship lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 0.5;
            
            for (let i = 0; i < harmonics.length; i++) {
                for (let j = i + 1; j < harmonics.length; j++) {
                    if (j === i * 2 || i === j * 2 || j === i * 3 || i === j * 3) {
                        const r1 = (i + 1) * spacing;
                        const r2 = (j + 1) * spacing;
                        const angle1 = harmonics[i].ratio * 0.1;
                        const angle2 = harmonics[j].ratio * 0.1;
                        
                        ctx.beginPath();
                        ctx.moveTo(Math.cos(angle1) * r1, Math.sin(angle1) * r1);
                        ctx.lineTo(Math.cos(angle2) * r2, Math.sin(angle2) * r2);
                        ctx.stroke();
                    }
                }
            }
            
            // Draw harmonic points with labels
            for (let i = 0; i < harmonics.length; i++) {
                const r = (i + 1) * spacing;
                const harmonic = harmonics[i];
                const angle = harmonic.ratio * 0.1;
                
                const x = Math.cos(angle) * r;
                const y = Math.sin(angle) * r;
                
                // Draw point
                ctx.fillStyle = `hsl(${(i / harmonics.length) * 360}, 80%, 60%)`;
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw label
                ctx.fillStyle = 'white';
                ctx.font = '10px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(harmonic.ratio.toFixed(2), x, y - 15);
            }
            
            ctx.restore();
        } catch (error) {
            this.core.logDebug(`Harmonic representation error: ${error.message}`);
        }
    }
    
    drawWaveformCalculation() {
        try {
            const ctx = this.contexts.overlay;
            const { centerX, centerY, radius } = this.core;
            const harmonics = this.core.getHarmonics();
            const waveform = this.core.getWaveform();
            
            if (!harmonics || harmonics.length === 0 || !waveform || waveform.length === 0) return;
            
            const yScale = radius * 0.3;
            const xScale = radius * 1.5;
            
            ctx.save();
            ctx.translate(centerX, centerY - radius * 0.5);
            
            // Draw individual harmonic components
            const maxHarmonics = Math.min(harmonics.length, 5);
            
            for (let i = 0; i < maxHarmonics; i++) {
                const harmonic = harmonics[i];
                const n = harmonic.ratio;
                
                ctx.beginPath();
                ctx.strokeStyle = `hsl(${(i / maxHarmonics) * 360}, 80%, 60%)`;
                ctx.lineWidth = 1;
                
                for (let x = -xScale; x <= xScale; x += 5) {
                    const t = (x + xScale) / (xScale * 2);
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
                const t = (x + xScale) / (xScale * 2);
                const idx = Math.floor(t * waveform.length);
                const y = -waveform[idx] * yScale * 0.5;
                
                if (x === -xScale) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            
            ctx.stroke();
            ctx.restore();
        } catch (error) {
            this.core.logDebug(`Waveform calculation visualization error: ${error.message}`);
        }
    }
    
    // Draw audio spectrum visualization
    drawAudioSpectrum() {
        try {
            const audio = this.core.getModule('audio');
            if (!audio || !audio.getDetailedSpectrum) return;
            
            const spectrumData = audio.getDetailedSpectrum();
            if (!spectrumData || !spectrumData.bins || spectrumData.bins.length === 0) return;
            
            const ctx = this.contexts.overlay;
            const { width, height } = this.core;
            
            // Draw at the bottom of the screen
            const barWidth = Math.max(2, width / spectrumData.bins.length);
            const barMaxHeight = height * 0.2;
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, height - barMaxHeight - 10, width, barMaxHeight + 10);
            
            // Draw frequency bins
            for (let i = 0; i < spectrumData.bins.length; i++) {
                const amplitude = spectrumData.bins[i];
                const barHeight = amplitude * barMaxHeight;
                
                // Generate color based on frequency (hue varies by bin)
                const hue = (i / spectrumData.bins.length) * 360;
                ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
                
                ctx.fillRect(
                    i * barWidth,
                    height - barHeight - 5,
                    barWidth - 1,
                    barHeight
                );
            }
            
            // Highlight detected peaks
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            
            spectrumData.peaks.forEach(peak => {
                const x = peak.binIndex * barWidth + barWidth / 2;
                const y = height - peak.amplitude * barMaxHeight - 8;
                
                // Draw peak marker
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw frequency label
                ctx.fillText(`${Math.round(peak.frequency)} Hz`, x, y - 5);
            });
        } catch (error) {
            this.core.logDebug(`Audio spectrum visualization error: ${error.message}`);
        }
    }
    
    // Draw performance metrics
    drawMetrics() {
        try {
            const ctx = this.contexts.overlay;
            const { width, height } = this.core;
            
            // Get metrics from core
            const { fps, frameTime, renderTime, audioLatency, waveformCalcTime } = this.core.metrics;
            
            // Format metrics text
            const metricsText = [
                `FPS: ${fps.toFixed(1)}`,
                `Frame: ${frameTime.toFixed(1)} ms`,
                `Render: ${renderTime.toFixed(1)} ms`,
                `Waveform: ${waveformCalcTime.toFixed(1)} ms`,
                `Audio: ${audioLatency.toFixed(1)} ms`
            ];
            
            // Draw background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(10, 10, 200, 18 * metricsText.length + 10);
            
            // Draw metrics text
            ctx.font = '14px monospace';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            
            metricsText.forEach((text, i) => {
                ctx.fillText(text, 15, 15 + i * 18);
            });
        } catch (error) {
            this.core.logDebug(`Metrics visualization error: ${error.message}`);
        }
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