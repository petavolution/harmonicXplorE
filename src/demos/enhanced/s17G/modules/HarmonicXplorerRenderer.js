/**
 * HarmonicXplorerRenderer.js
 * Handles all visualization and rendering for the application
 */

class HarmonicXplorerRenderer extends HarmonicXplorerModule {
    constructor(config = {}) {
        super();
        this.config = Object.assign({
            containerId: 'visualization',
            layers: ['background', 'geometry', 'waveform', 'overlay']
        }, config);
        
        this.canvases = {};
        this.contexts = {};
        this.container = null;
        this.initialized = false;
        
        // Drawing constants
        this.colors = {
            background: '#121212',
            grid: '#2a2a2a',
            axis: '#3a3a3a',
            text: '#999999',
            highlight: '#ffffff'
        };
    }
    
    async initialize() {
        try {
            // Find the container element
            this.container = document.querySelector(`.${this.config.containerId}`);
            if (!this.container) {
                throw new Error(`Container with class '${this.config.containerId}' not found`);
            }
            
            // Remove any existing canvases
            Array.from(this.container.querySelectorAll('canvas')).forEach(canvas => {
                canvas.remove();
            });
            
            // Create canvas layers
            for (const layer of this.config.layers) {
                const canvas = document.createElement('canvas');
                canvas.className = `canvas-layer ${layer}-layer`;
                canvas.style.position = 'absolute';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                
                this.container.appendChild(canvas);
                this.canvases[layer] = canvas;
                this.contexts[layer] = canvas.getContext('2d');
            }
            
            this.initialized = true;
            return true;
        } catch (error) {
            console.error('Renderer initialization error:', error);
            return false;
        }
    }
    
    onResize(width, height) {
        if (!this.initialized) return;
        
        // Resize all canvases to match the container
        for (const layer in this.canvases) {
            const canvas = this.canvases[layer];
            const ctx = this.contexts[layer];
            
            // Set canvas dimensions to actual pixel dimensions for sharp rendering
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            
            // Scale the context to account for device pixel ratio
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
    }
    
    render() {
        if (!this.initialized || !this.core) return;
        
        try {
            // Clear all canvases
            for (const layer in this.contexts) {
                const ctx = this.contexts[layer];
                ctx.clearRect(0, 0, this.core.width, this.core.height);
            }
            
            // Draw background layer
            this.drawBackground();
            
            // Draw geometry if enabled
            if (this.core.state.showGeometry) {
                this.drawGeometry();
            }
            
            // Draw waveform if enabled
            if (this.core.state.showWaveform) {
                this.drawWaveform();
            }
            
            // Draw overlay elements
            this.drawOverlay();
        } catch (error) {
            console.error('Render error:', error);
        }
    }
    
    drawBackground() {
        const ctx = this.contexts.background;
        if (!ctx) return;
        
        // Fill background
        ctx.fillStyle = this.colors.background;
        ctx.fillRect(0, 0, this.core.width, this.core.height);
        
        // Draw grid
        ctx.strokeStyle = this.colors.grid;
        ctx.lineWidth = 0.5;
        
        const gridSize = Math.min(this.core.width, this.core.height) / 20;
        
        ctx.beginPath();
        // Vertical grid lines
        for (let x = this.core.centerX % gridSize; x < this.core.width; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.core.height);
        }
        // Horizontal grid lines
        for (let y = this.core.centerY % gridSize; y < this.core.height; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(this.core.width, y);
        }
        ctx.stroke();
        
        // Draw axes
        ctx.strokeStyle = this.colors.axis;
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        // X axis
        ctx.moveTo(0, this.core.centerY);
        ctx.lineTo(this.core.width, this.core.centerY);
        
        // Y axis
        ctx.moveTo(this.core.centerX, 0);
        ctx.lineTo(this.core.centerX, this.core.height);
        
        ctx.stroke();
    }
    
    drawGeometry() {
        const ctx = this.contexts.geometry;
        if (!ctx) return;
        
        const { centerX, centerY, radius } = this.core;
        const { axisCount, rotation, shapes, zoom } = this.core.state;
        
        // Draw radial axes
        ctx.strokeStyle = this.colors.axis;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        
        for (let i = 0; i < axisCount; i++) {
            const angle = (i / axisCount) * Math.PI * 2 + rotation;
            const x = centerX + Math.cos(angle) * radius * zoom;
            const y = centerY + Math.sin(angle) * radius * zoom;
            
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Draw shapes based on state
        const harmonics = this.core.calculateHarmonics();
        
        // Circle
        if (shapes.circle && shapes.circle.show) {
            ctx.strokeStyle = shapes.circle.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * zoom, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Hexagon
        if (shapes.hexagon && shapes.hexagon.show) {
            ctx.strokeStyle = shapes.hexagon.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 + rotation;
                const x = centerX + Math.cos(angle) * radius * zoom;
                const y = centerY + Math.sin(angle) * radius * zoom;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.closePath();
            ctx.stroke();
        }
        
        // Triangle
        if (shapes.triangle && shapes.triangle.show) {
            ctx.strokeStyle = shapes.triangle.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let i = 0; i < 3; i++) {
                const angle = (i / 3) * Math.PI * 2 + rotation;
                const x = centerX + Math.cos(angle) * radius * zoom;
                const y = centerY + Math.sin(angle) * radius * zoom;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.closePath();
            ctx.stroke();
        }
        
        // Draw harmonic points
        for (const harmonic of harmonics) {
            const scaledRadius = radius * zoom * (harmonic.ratio / harmonics[harmonics.length - 1].ratio);
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            
            for (let i = 0; i < axisCount; i++) {
                const angle = (i / axisCount) * Math.PI * 2 + rotation + harmonic.phase;
                const x = centerX + Math.cos(angle) * scaledRadius;
                const y = centerY + Math.sin(angle) * scaledRadius;
                
                ctx.moveTo(x, y);
                ctx.arc(x, y, 3, 0, Math.PI * 2);
            }
            
            ctx.fill();
        }
    }
    
    drawWaveform() {
        const ctx = this.contexts.waveform;
        if (!ctx) return;
        
        const { centerX, centerY, width, height, radius } = this.core;
        const { wavelength, rotation, zoom } = this.core.state;
        
        // Generate waveform data
        const harmonics = this.core.calculateHarmonics();
        const sampleCount = Math.floor(width);
        const samples = new Array(sampleCount).fill(0);
        
        // Calculate waveform values
        for (let i = 0; i < sampleCount; i++) {
            const x = (i / sampleCount) * wavelength * Math.PI * 2;
            
            // Sum all harmonics
            for (const harmonic of harmonics) {
                samples[i] += Math.sin(x * harmonic.ratio + harmonic.phase) / harmonic.ratio;
            }
            
            // Normalize
            samples[i] /= harmonics.length;
        }
        
        // Draw waveform
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const waveHeight = radius * 0.5 * zoom;
        
        for (let i = 0; i < sampleCount; i++) {
            const x = i;
            const y = centerY - samples[i] * waveHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Draw radial waveform
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        
        const angleStep = (Math.PI * 2) / sampleCount;
        
        for (let i = 0; i < sampleCount; i++) {
            const angle = i * angleStep + rotation;
            const r = radius * zoom * (1 + samples[i] * 0.3);
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.closePath();
        ctx.stroke();
    }
    
    drawOverlay() {
        const ctx = this.contexts.overlay;
        if (!ctx) return;
        
        // Draw status indicator
        const statusSize = 10;
        const statusPadding = 10;
        
        ctx.fillStyle = this.core.state.isRunning ? '#4CAF50' : '#F44336';
        ctx.beginPath();
        ctx.arc(
            statusPadding + statusSize / 2,
            statusPadding + statusSize / 2,
            statusSize / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw harmonic info
        ctx.fillStyle = this.colors.text;
        ctx.font = '12px monospace';
        
        const type = this.core.state.harmonicType.charAt(0).toUpperCase() + this.core.state.harmonicType.slice(1);
        const phase = this.core.state.harmonicPhase.charAt(0).toUpperCase() + this.core.state.harmonicPhase.slice(1);
        
        ctx.fillText(
            `Type: ${type} | Phase: ${phase} | Count: ${this.core.state.harmonicCount} | Axes: ${this.core.state.axisCount}`,
            statusPadding,
            this.core.height - statusPadding
        );
    }
}

// Export class for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HarmonicXplorerRenderer };
} else {
    window.HarmonicXplorerRenderer = HarmonicXplorerRenderer;
} 