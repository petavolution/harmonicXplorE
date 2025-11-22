/**
 * HarmonicXplorerRenderer.js
 * Renderer module for the HarmonicXplorer NG application
 * Handles all visualization and canvas drawing operations
 */

class HarmonicXplorerRenderer extends HarmonicXplorerModule {
    constructor(options = {}) {
        super(options);
        
        // Canvas layers and contexts
        this.canvasLayers = {};
        this.contexts = {};
        
        // Animation properties
        this.renderLoopId = null;
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.fps = 0;
        this.frameTime = 0;
        
        // Container properties
        this.container = null;
        this.width = 0;
        this.height = 0;
        
        // Rendering state
        this.renderRequested = false;
        this.isRendering = false;
        
        // Bind methods
        this.renderLoop = this.renderLoop.bind(this);
        this.resize = this.resize.bind(this);
    }
    
    /**
     * Initialize the renderer
     * @param {HTMLElement} container - Container element for the visualization
     */
    async initialize(container) {
        try {
            this.log('Initializing renderer module');
            
            // Store container reference
            this.container = container;
            if (!this.container) {
                throw new Error('No container element provided for renderer');
            }
            
            // Setup canvas layers
            this.setupCanvasLayers();
            
            // Add resize listener
            window.addEventListener('resize', this.resize);
            
            // Initial resize to set dimensions
            this.resize();
            
            this.log('Renderer initialization complete');
            return true;
        } catch (error) {
            this.logError('Renderer initialization error:', error);
            throw new Error(`Renderer initialization failed: ${error.message}`);
        }
    }
    
    /**
     * Set up canvas layers for rendering
     */
    setupCanvasLayers() {
        try {
            // Clear container first
            this.container.innerHTML = '';
            
            // Create canvas layers
            const layers = [
                'background',
                'grid',
                'harmonics',
                'waveform',
                'spectrum',
                'overlay'
            ];
            
            layers.forEach(layer => {
                const canvas = document.createElement('canvas');
                canvas.className = `${layer}-layer harmonic-explorer-canvas`;
                this.container.appendChild(canvas);
                
                // Store references
                this.canvasLayers[layer] = canvas;
                this.contexts[layer] = canvas.getContext('2d');
            });
            
            this.log(`Created ${layers.length} canvas layers`);
        } catch (error) {
            this.logError('Error setting up canvas layers:', error);
            throw error;
        }
    }
    
    /**
     * Resize all canvas layers based on container size
     */
    resize() {
        // Get container dimensions
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        
        // Set size for all canvas layers
        Object.values(this.canvasLayers).forEach(canvas => {
            canvas.width = this.width;
            canvas.height = this.height;
        });
        
        this.log(`Resized canvases to ${this.width}x${this.height}`);
        
        // Trigger a full redraw
        this.requestRender();
    }
    
    /**
     * Handle state updates from core
     * @param {Object} state - Application state
     * @param {Object} changes - What has changed
     */
    onStateUpdate(state, changes) {
        // Mark that we need to render if display, harmonics, or waveform changed
        if (changes.displayChanged || changes.harmonicsChanged || changes.waveformChanged) {
            this.requestRender();
        }
    }
    
    /**
     * Request a render on the next animation frame
     */
    requestRender() {
        if (!this.isRendering) {
            this.renderRequested = true;
        }
    }
    
    /**
     * Start rendering loop
     */
    start() {
        if (this.renderLoopId) return;
        
        this.log('Starting renderer');
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.renderLoopId = requestAnimationFrame(this.renderLoop);
    }
    
    /**
     * Stop rendering loop
     */
    stop() {
        if (this.renderLoopId) {
            cancelAnimationFrame(this.renderLoopId);
            this.renderLoopId = null;
            this.log('Renderer stopped');
        }
    }
    
    /**
     * Main render loop
     * @param {number} timestamp - Current timestamp
     */
    renderLoop(timestamp) {
        // Calculate FPS
        const elapsed = timestamp - this.lastFrameTime;
        this.frameCount++;
        
        if (elapsed >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / elapsed);
            this.frameCount = 0;
            this.lastFrameTime = timestamp;
        }
        
        // Check if auto-rotate is enabled
        const state = this.core.getState();
        if (state.autoRotate) {
            const speed = state.speed / 1000;
            const rotationZ = (state.rotationZ + speed) % 360;
            
            // Update rotation state
            this.core.updateState({ rotationZ });
            
            // Force render
            this.renderRequested = true;
        }
        
        // Render if requested or if continuous rendering is needed
        if (this.renderRequested) {
            const startTime = performance.now();
            this.render();
            this.frameTime = performance.now() - startTime;
            this.renderRequested = false;
        }
        
        // Continue loop
        this.renderLoopId = requestAnimationFrame(this.renderLoop);
    }
    
    /**
     * Main render method, handles drawing all layers
     */
    render() {
        this.isRendering = true;
        
        try {
            // Get current state and data
            const state = this.core.getState();
            const harmonics = this.core.getHarmonics();
            const waveform = this.core.getWaveform();
            
            // Clear all canvases
            Object.keys(this.contexts).forEach(layer => {
                const ctx = this.contexts[layer];
                ctx.clearRect(0, 0, this.width, this.height);
            });
            
            // Draw background
            this.drawBackground(state);
            
            // Draw grid if enabled
            if (state.grid) {
                this.drawGrid(state);
            }
            
            // Draw harmonics if enabled
            if (state.harmonics) {
                this.drawHarmonics(harmonics, state);
            }
            
            // Draw waveform if enabled
            if (state.waveform) {
                this.drawWaveform(waveform, state);
            }
            
            // Draw spectrum if enabled
            if (state.spectrum && state.audio) {
                this.drawSpectrum(state);
            }
            
            // Draw overlay information if enabled
            if (state.info || state.fps) {
                this.drawOverlay(state);
            }
            
            this.log('Rendered frame');
        } catch (error) {
            this.logError('Render error:', error);
        } finally {
            this.isRendering = false;
        }
    }
    
    /**
     * Draw background layer
     * @param {Object} state - Application state
     */
    drawBackground(state) {
        const ctx = this.contexts.background;
        if (!ctx) return;
        
        // Fill background
        ctx.fillStyle = state.backgroundColor;
        ctx.fillRect(0, 0, this.width, this.height);
    }
    
    /**
     * Draw grid layer
     * @param {Object} state - Application state
     */
    drawGrid(state) {
        const ctx = this.contexts.grid;
        if (!ctx) return;
        
        // Set up grid drawing
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;
        
        ctx.strokeStyle = this.adjustColor(state.foregroundColor, 0.3);
        ctx.lineWidth = 0.5;
        
        // Draw based on coordinate system
        switch (state.coordinateSystem) {
            case 'polar':
                // Circular grid
                const axisCount = state.axisCount;
                
                // Draw concentric circles
                for (let i = 1; i <= 5; i++) {
                    const r = radius * (i / 5);
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
                    ctx.stroke();
                }
                
                // Draw radial lines
                for (let i = 0; i < axisCount; i++) {
                    const angle = (i / axisCount) * Math.PI * 2;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;
                    
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
                break;
                
            case 'cartesian':
                // Draw horizontal and vertical grid
                const gridSize = 20;
                const numLines = Math.max(this.width, this.height) / gridSize;
                
                // Horizontal lines
                for (let i = 0; i <= numLines; i++) {
                    const y = i * gridSize;
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(this.width, y);
                    ctx.stroke();
                }
                
                // Vertical lines
                for (let i = 0; i <= numLines; i++) {
                    const x = i * gridSize;
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, this.height);
                    ctx.stroke();
                }
                
                // Draw axes
                ctx.strokeStyle = this.adjustColor(state.foregroundColor, 0.6);
                ctx.lineWidth = 1;
                
                // X-axis
                ctx.beginPath();
                ctx.moveTo(0, centerY);
                ctx.lineTo(this.width, centerY);
                ctx.stroke();
                
                // Y-axis
                ctx.beginPath();
                ctx.moveTo(centerX, 0);
                ctx.lineTo(centerX, this.height);
                ctx.stroke();
                break;
                
            case 'logarithmic':
                // Similar to polar but with logarithmic scaling
                const logAxisCount = state.axisCount;
                
                // Logarithmic concentric circles
                for (let i = 1; i <= 5; i++) {
                    const r = radius * Math.log(i + 1) / Math.log(6); // log scale
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
                    ctx.stroke();
                }
                
                // Radial lines
                for (let i = 0; i < logAxisCount; i++) {
                    const angle = (i / logAxisCount) * Math.PI * 2;
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;
                    
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
                break;
        }
    }
    
    /**
     * Draw harmonics layer
     * @param {Array} harmonics - Harmonic data
     * @param {Object} state - Application state
     */
    drawHarmonics(harmonics, state) {
        const ctx = this.contexts.harmonics;
        if (!ctx) return;
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8 * state.zoom;
        
        // Apply rotations if needed
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // Convert degrees to radians
        const rotX = state.rotationX * Math.PI / 180;
        const rotY = state.rotationY * Math.PI / 180;
        const rotZ = state.rotationZ * Math.PI / 180;
        
        // Apply Z rotation
        ctx.rotate(rotZ);
        
        // X and Y rotations would need 3D projection - simplified here
        const scaleX = Math.cos(rotX);
        const scaleY = Math.cos(rotY);
        ctx.scale(scaleX, scaleY);
        
        // Draw each harmonic
        harmonics.forEach((harmonic, index) => {
            const { n, amplitude } = harmonic;
            
            // Calculate color based on index or visualization mode
            let color = state.foregroundColor;
            
            if (state.visualizationMode === 'rainbow') {
                const hue = (index / harmonics.length) * 360;
                color = `hsl(${hue}, 80%, 60%)`;
            } else if (state.visualizationMode === 'neon') {
                const hue = (n % 3) * 120; // Cycle through 3 main colors
                color = `hsl(${hue}, 100%, 60%)`;
            }
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            
            // Draw different representations based on coordinate system
            switch (state.coordinateSystem) {
                case 'polar':
                    // Draw circle representing harmonic
                    const harmonicRadius = radius * amplitude;
                    ctx.beginPath();
                    ctx.arc(0, 0, harmonicRadius, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
                    
                case 'cartesian':
                    // Draw sine wave
                    ctx.beginPath();
                    
                    for (let i = 0; i <= 360; i += 5) {
                        const angle = (i / 360) * Math.PI * 2;
                        const x = (i / 360) * radius * 2 - radius;
                        const y = amplitude * Math.sin(n * angle) * radius;
                        
                        if (i === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }
                    }
                    
                    ctx.stroke();
                    break;
                    
                case 'logarithmic':
                    // Draw logarithmically scaled harmonic
                    const logScale = Math.log(n + 1) / Math.log(harmonics.length + 1);
                    const logRadius = radius * amplitude * logScale;
                    
                    ctx.beginPath();
                    ctx.arc(0, 0, logRadius, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
            }
        });
        
        ctx.restore();
    }
    
    /**
     * Draw waveform layer
     * @param {Array} waveform - Waveform data points
     * @param {Object} state - Application state
     */
    drawWaveform(waveform, state) {
        const ctx = this.contexts.waveform;
        if (!ctx) return;
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8 * state.zoom;
        
        // Apply rotations if needed
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // Convert degrees to radians
        const rotX = state.rotationX * Math.PI / 180;
        const rotY = state.rotationY * Math.PI / 180;
        const rotZ = state.rotationZ * Math.PI / 180;
        
        // Apply Z rotation
        ctx.rotate(rotZ);
        
        // X and Y rotations would need 3D projection - simplified here
        const scaleX = Math.cos(rotX);
        const scaleY = Math.cos(rotY);
        ctx.scale(scaleX, scaleY);
        
        // Set up waveform style
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.adjustColor(state.foregroundColor, 1.2);
        
        // Draw waveform path
        ctx.beginPath();
        
        waveform.forEach((point, index) => {
            const { x, y } = point;
            
            // Scale points based on coordinate system
            let scaledX, scaledY;
            
            switch (state.coordinateSystem) {
                case 'polar':
                    scaledX = x * radius;
                    scaledY = y * radius;
                    break;
                    
                case 'cartesian':
                    scaledX = (x - 0.5) * radius * 2;
                    scaledY = y * radius;
                    break;
                    
                case 'logarithmic':
                    scaledX = x * radius;
                    scaledY = y * radius;
                    break;
                    
                default:
                    scaledX = x * radius;
                    scaledY = y * radius;
            }
            
            if (index === 0) {
                ctx.moveTo(scaledX, scaledY);
            } else {
                ctx.lineTo(scaledX, scaledY);
            }
        });
        
        // Close the path for polar and logarithmic
        if (state.coordinateSystem !== 'cartesian') {
            ctx.closePath();
        }
        
        ctx.stroke();
        
        // Fill with semi-transparent color
        if (state.coordinateSystem !== 'cartesian') {
            ctx.fillStyle = this.adjustColor(state.foregroundColor, 0.3);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    /**
     * Draw audio spectrum if available
     * @param {Object} state - Application state
     */
    drawSpectrum(state) {
        const ctx = this.contexts.spectrum;
        if (!ctx) return;
        
        // Get spectrum data from audio module
        if (!this.core.modules.audio) return;
        
        const audioModule = this.core.modules.audio;
        if (typeof audioModule.getSpectrum !== 'function') return;
        
        const spectrum = audioModule.getSpectrum();
        if (!spectrum || !spectrum.length) return;
        
        // Draw spectrum analyzer
        const barWidth = this.width / spectrum.length;
        const spectrumHeight = this.height / 4;
        const y = this.height - spectrumHeight;
        
        ctx.fillStyle = this.adjustColor(state.backgroundColor, 0.5);
        ctx.fillRect(0, y, this.width, spectrumHeight);
        
        // Draw bars
        for (let i = 0; i < spectrum.length; i++) {
            const value = spectrum[i] / 255; // Normalize to 0-1
            const barHeight = value * spectrumHeight;
            
            // Calculate color based on frequency
            const hue = (i / spectrum.length) * 240; // Blue to red
            ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
            
            ctx.fillRect(i * barWidth, y + spectrumHeight - barHeight, barWidth, barHeight);
        }
    }
    
    /**
     * Draw overlay information
     * @param {Object} state - Application state
     */
    drawOverlay(state) {
        const ctx = this.contexts.overlay;
        if (!ctx) return;
        
        ctx.font = '14px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'top';
        
        let yOffset = 10;
        
        // Draw FPS if enabled
        if (state.fps) {
            ctx.fillText(`FPS: ${this.fps} (${this.frameTime.toFixed(2)} ms)`, 10, yOffset);
            yOffset += 20;
        }
        
        // Draw info if enabled
        if (state.info) {
            const info = [
                `Coordinate: ${state.coordinateSystem}`,
                `Harmonics: ${state.harmonicCount} (${state.harmonicType})`,
                `Phase: ${state.harmonicPhase}`,
                `Rotation: X=${state.rotationX}° Y=${state.rotationY}° Z=${state.rotationZ}°`,
                `Zoom: ${state.zoom.toFixed(2)}`,
                `Audio: ${state.audio ? 'ON' : 'OFF'}`
            ];
            
            info.forEach(text => {
                ctx.fillText(text, 10, yOffset);
                yOffset += 20;
            });
        }
    }
    
    /**
     * Take a screenshot of the current visualization
     * @return {string} Data URL of the screenshot
     */
    takeScreenshot() {
        // Create a combined canvas of all layers
        const screenshotCanvas = document.createElement('canvas');
        screenshotCanvas.width = this.width;
        screenshotCanvas.height = this.height;
        const ctx = screenshotCanvas.getContext('2d');
        
        // Draw all visible layers in order
        const layers = ['background', 'grid', 'harmonics', 'waveform', 'spectrum', 'overlay'];
        const state = this.core.getState();
        
        layers.forEach(layer => {
            // Skip layers that are disabled
            if (layer === 'grid' && !state.grid) return;
            if (layer === 'harmonics' && !state.harmonics) return;
            if (layer === 'waveform' && !state.waveform) return;
            if (layer === 'spectrum' && (!state.spectrum || !state.audio)) return;
            if (layer === 'overlay' && !state.info && !state.fps) return;
            
            const canvas = this.canvasLayers[layer];
            if (canvas) {
                ctx.drawImage(canvas, 0, 0);
            }
        });
        
        // Return data URL
        return screenshotCanvas.toDataURL('image/png');
    }
    
    /**
     * Export visualization as SVG
     * @return {string} SVG content as string
     */
    exportSVG() {
        const state = this.core.getState();
        const harmonics = this.core.getHarmonics();
        const waveform = this.core.getWaveform();
        
        // Create SVG content
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">`;
        
        // Background
        svg += `<rect x="0" y="0" width="${this.width}" height="${this.height}" fill="${state.backgroundColor}" />`;
        
        // Center point
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8 * state.zoom;
        
        // Grid
        if (state.grid) {
            svg += `<g stroke="${this.adjustColor(state.foregroundColor, 0.3)}" stroke-width="0.5">`;
            
            // Draw grid based on coordinate system
            // (SVG implementation of grid would go here)
            
            svg += '</g>';
        }
        
        // Harmonics
        if (state.harmonics) {
            svg += `<g transform="translate(${centerX} ${centerY}) rotate(${state.rotationZ})">`;
            
            harmonics.forEach((harmonic, index) => {
                // SVG implementation of harmonics drawing
            });
            
            svg += '</g>';
        }
        
        // Waveform
        if (state.waveform) {
            svg += `<g transform="translate(${centerX} ${centerY}) rotate(${state.rotationZ})">`;
            
            // Create path string
            let path = 'M';
            
            waveform.forEach((point, index) => {
                const { x, y } = point;
                const scaledX = x * radius;
                const scaledY = y * radius;
                
                if (index === 0) {
                    path += `${scaledX},${scaledY}`;
                } else {
                    path += ` L${scaledX},${scaledY}`;
                }
            });
            
            // Close path for polar
            if (state.coordinateSystem !== 'cartesian') {
                path += ' Z';
            }
            
            svg += `<path d="${path}" fill="${this.adjustColor(state.foregroundColor, 0.3)}" stroke="${this.adjustColor(state.foregroundColor, 1.2)}" stroke-width="2" />`;
            
            svg += '</g>';
        }
        
        // Close SVG
        svg += '</svg>';
        
        return svg;
    }
    
    /**
     * Adjust a color's opacity or brightness
     * @param {string} color - CSS color string
     * @param {number} factor - Opacity or brightness factor
     * @return {string} Adjusted color
     */
    adjustColor(color, factor) {
        // Handle hex colors
        if (color.startsWith('#')) {
            // Convert to rgba
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            
            if (factor < 1) {
                // Adjust opacity
                return `rgba(${r}, ${g}, ${b}, ${factor})`;
            } else {
                // Adjust brightness
                const adjustBrightness = (value) => Math.min(255, Math.floor(value * factor));
                return `rgb(${adjustBrightness(r)}, ${adjustBrightness(g)}, ${adjustBrightness(b)})`;
            }
        }
        
        // Handle other color formats
        return color;
    }
} 