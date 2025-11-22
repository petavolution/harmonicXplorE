/**
 * HarmonicXplorerCore.js
 * Core module that provides the main class and state management functionality
 */

class HarmonicXplorerCore {
    constructor(config = {}) {
        this.config = Object.assign({
            containerId: 'visualization',
            initialState: {}
        }, config);

        this.modules = new Map();
        this.animationFrameId = null;
        this.renderRequested = false;
        
        // Basic properties
        this.width = 0;
        this.height = 0;
        this.centerX = 0;
        this.centerY = 0;
        this.radius = 0;
        
        // Default state
        this.state = Object.assign({
            isRunning: false,
            showGeometry: true,
            showWaveform: true,
            showAxis: true,
            audioEnabled: false,
            axisCount: 6,
            harmonicCount: 8,
            wavelength: 6,
            rotation: 0,
            speed: 0,
            zoom: 1,
            coordinateSystem: 'radial', // 'radial' or 'orthogonal'
            harmonicType: 'natural',
            harmonicPhase: 'full',
            
            // Audio synthesis parameters
            baseFrequency: 220,
            audioVolume: 0.5,
            audioAttack: 0.3,
            audioDecay: 0.05,
            oscillatorType: 'sine',
            
            // Shapes configuration
            shapes: {
                circle: { show: true, color: '#4CAF50' },
                hexagon: { show: true, color: '#2196F3' },
                hexagonIn: { show: true, color: '#1E88E5' },
                square: { show: true, color: '#9C27B0' },
                squareIn: { show: true, color: '#8E24AA' },
                triangle: { show: false, color: '#FFC107' }
            },
            
            // Colors
            backgroundColor: '#121212',
            axisColor: '#3a3a3a',
            gridColor: '#2a2a2a',
            waveformColor: '#FFFFFF',
            
            // Export options
            exportFormat: 'png'
        }, this.config.initialState);
        
        // Cached values for optimization
        this.cachedHarmonics = [];
        this.cachedWaveform = [];
        this.cachedAngleSinCos = [];
        
        // Flags to track if we need to recalculate
        this.needsHarmonicRecalculation = true;
        this.needsWaveformRecalculation = true;
        
        // Metrics & Debug info
        this.metrics = {
            fps: 0,
            frameTime: 0,
            renderTime: 0,
            audioLatency: 0,
            waveformCalcTime: 0
        };
        
        this.debug = {
            messages: [],
            maxMessages: 10
        };
    }
    
    // Register a module with the application
    registerModule(name, module) {
        if (this.modules.has(name)) {
            this.logDebug(`Warning: Module '${name}' already registered, replacing`);
        }
        
        this.modules.set(name, module);
        module.setCore(this);
        return this;
    }
    
    // Get a registered module
    getModule(name) {
        if (!this.modules.has(name)) {
            this.logDebug(`Warning: Module '${name}' not found`);
            return null;
        }
        return this.modules.get(name);
    }
    
    // Initialize the application and all modules
    async initialize() {
        try {
            this.logDebug('Initializing application...');
            
            // Precalculate angle sin/cos values
            this.calculateAngleSinCos(this.state.axisCount);
            
            // Initialize all registered modules
            for (const [name, module] of this.modules.entries()) {
                this.logDebug(`Initializing module: ${name}`);
                await module.initialize();
            }
            
            // Set up window resize event handler
            window.addEventListener('resize', () => this.handleResize());
            this.handleResize();
            
            // Initial render
            this.requestRender();
            this.logDebug('Application initialized successfully');
            return true;
        } catch (error) {
            this.logDebug(`Initialization error: ${error.message}`);
            console.error('Initialization error:', error);
            return false;
        }
    }
    
    // Start the application
    start() {
        try {
            if (!this.state.isRunning) {
                this.state.isRunning = true;
                this.startAnimationLoop();
                
                // Notify all modules that the application is running
                for (const module of this.modules.values()) {
                    if (typeof module.onStart === 'function') {
                        module.onStart();
                    }
                }
                
                this.updateUI();
                this.logDebug('Application started');
            }
        } catch (error) {
            this.logDebug(`Start error: ${error.message}`);
        }
    }
    
    // Stop the application
    stop() {
        try {
            if (this.state.isRunning) {
                this.state.isRunning = false;
                this.stopAnimationLoop();
                
                // Notify all modules that the application is stopped
                for (const module of this.modules.values()) {
                    if (typeof module.onStop === 'function') {
                        module.onStop();
                    }
                }
                
                this.updateUI();
                this.logDebug('Application stopped');
            }
        } catch (error) {
            this.logDebug(`Stop error: ${error.message}`);
        }
    }
    
    // Toggle the running state
    toggleAnimation() {
        if (this.state.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }
    
    // Start the animation loop
    startAnimationLoop() {
        if (!this.animationFrameId) {
            this.lastFrameTime = performance.now();
            this.animationFrameId = requestAnimationFrame(() => this.render());
        }
    }
    
    // Stop the animation loop
    stopAnimationLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    // Request a render on the next animation frame if not already requested
    requestRender() {
        if (!this.renderRequested) {
            this.renderRequested = true;
            requestAnimationFrame(() => {
                this.render();
                this.renderRequested = false;
            });
        }
    }
    
    // Main render loop
    render() {
        const startTime = performance.now();
        
        try {
            // Calculate delta time
            const now = performance.now();
            const deltaTime = now - this.lastFrameTime;
            this.lastFrameTime = now;
            
            // Skip frame if deltaTime is too high (tab was inactive)
            if (deltaTime > 100) {
                this.logDebug(`Skipping frame: deltaTime ${deltaTime.toFixed(2)}ms is too high`);
                if (this.state.isRunning) {
                    this.animationFrameId = requestAnimationFrame(() => this.render());
                }
                return;
            }
            
            // Update rotation based on speed if animation is running
            if (this.state.isRunning) {
                this.state.rotation += this.state.speed * deltaTime * 0.001;
                
                // Keep rotation in range [0, 2π]
                if (this.state.rotation > Math.PI * 2) {
                    this.state.rotation -= Math.PI * 2;
                } else if (this.state.rotation < 0) {
                    this.state.rotation += Math.PI * 2;
                }
            }
            
            // Calculate harmonics and waveform if needed
            if (this.needsHarmonicRecalculation) {
                this.calculateHarmonics();
            }
            
            if (this.needsWaveformRecalculation) {
                this.calculateWaveform();
            }
            
            // Notify all modules to render
            for (const module of this.modules.values()) {
                if (typeof module.render === 'function') {
                    module.render();
                }
            }
            
            // Update metrics
            this.metrics.renderTime = performance.now() - startTime;
            this.metrics.frameTime = deltaTime;
            this.metrics.fps = 1000 / deltaTime;
            
            this.updateMetrics();
            
            // Schedule next frame if animation is running
            if (this.state.isRunning) {
                this.animationFrameId = requestAnimationFrame(() => this.render());
            }
        } catch (error) {
            this.logDebug(`Render error: ${error.message}`);
            console.error('Render error:', error);
            
            // Ensure animation continues even if there was an error
            if (this.state.isRunning) {
                this.animationFrameId = requestAnimationFrame(() => this.render());
            }
        }
    }
    
    // Handle window resize
    handleResize() {
        try {
            const container = document.querySelector(`.${this.config.containerId}`);
            if (!container) return;
            
            this.width = container.clientWidth;
            this.height = container.clientHeight;
            this.centerX = this.width / 2;
            this.centerY = this.height / 2;
            this.radius = Math.min(this.width, this.height) * 0.4;
            
            // Notify all modules of the resize
            for (const module of this.modules.values()) {
                if (typeof module.onResize === 'function') {
                    module.onResize(this.width, this.height);
                }
            }
            
            this.requestRender();
        } catch (error) {
            this.logDebug(`Resize error: ${error.message}`);
        }
    }
    
    // Update the application state
    updateState(changes = {}) {
        try {
            const needsRecalculation = this.checkIfNeedsRecalculation(changes);
            
            // Apply changes to state
            Object.entries(changes).forEach(([key, value]) => {
                if (key === 'shapes' && typeof value === 'object' && value !== null) {
                    // Special handling for shapes object
                    Object.entries(value).forEach(([shapeKey, shapeValue]) => {
                        if (typeof shapeValue === 'object' && shapeValue !== null) {
                            this.state.shapes[shapeKey] = { 
                                ...this.state.shapes[shapeKey], 
                                ...shapeValue 
                            };
                        }
                    });
                } else if (typeof value === 'object' && value !== null && typeof this.state[key] === 'object') {
                    this.state[key] = { ...this.state[key], ...value };
                } else {
                    this.state[key] = value;
                }
            });
            
            // Set flags if we need to recalculate
            if (needsRecalculation.harmonics) {
                this.needsHarmonicRecalculation = true;
            }
            
            if (needsRecalculation.waveform) {
                this.needsWaveformRecalculation = true;
            }
            
            if (needsRecalculation.angleSinCos) {
                this.calculateAngleSinCos(this.state.axisCount);
            }
            
            // Notify all modules of state change
            for (const module of this.modules.values()) {
                if (typeof module.onStateUpdate === 'function') {
                    module.onStateUpdate(this.state);
                }
            }
            
            this.updateUI();
            this.requestRender();
        } catch (error) {
            this.logDebug(`State update error: ${error.message}`);
        }
    }
    
    // Check if we need to recalculate harmonics or waveform based on state changes
    checkIfNeedsRecalculation(changes) {
        const result = {
            harmonics: false,
            waveform: false,
            angleSinCos: false
        };
        
        // Keys that affect harmonic calculations
        const harmonicKeys = ['harmonicCount', 'harmonicType', 'harmonicPhase'];
        
        // Keys that affect waveform calculations
        const waveformKeys = ['harmonicCount', 'harmonicType', 'harmonicPhase', 'wavelength'];
        
        // Keys that affect angle sin/cos calculations
        const angleSinCosKeys = ['axisCount'];
        
        Object.keys(changes).forEach(key => {
            if (harmonicKeys.includes(key)) {
                result.harmonics = true;
            }
            
            if (waveformKeys.includes(key)) {
                result.waveform = true;
            }
            
            if (angleSinCosKeys.includes(key)) {
                result.angleSinCos = true;
            }
        });
        
        return result;
    }
    
    // Update UI elements to reflect current state
    updateUI() {
        try {
            // Update UI elements based on state
            const startBtn = document.getElementById('startBtn');
            const animationStatus = document.getElementById('animationStatus');
            
            if (startBtn) startBtn.textContent = this.state.isRunning ? 'Stop' : 'Start';
            if (animationStatus) animationStatus.textContent = this.state.isRunning ? 'Running' : 'Stopped';
            
            // Update numeric inputs and sliders
            Object.entries(this.state).forEach(([key, value]) => {
                if (typeof value !== 'object') {
                    const input = document.getElementById(key);
                    const slider = document.getElementById(key + 'Slider');
                    if (input && input.type !== 'checkbox') input.value = value;
                    if (slider) slider.value = value * ((key === 'rotation' || key === 'speed') ? 100 : 1);
                    if (input && input.type === 'checkbox') input.checked = value;
                }
            });
            
            // Update shape controls
            if (this.state.shapes) {
                Object.entries(this.state.shapes).forEach(([shape, config]) => {
                    const checkbox = document.getElementById('show' + shape.charAt(0).toUpperCase() + shape.slice(1));
                    const colorPicker = document.getElementById(shape + 'Color');
                    if (checkbox) checkbox.checked = config.show;
                    if (colorPicker) colorPicker.value = config.color;
                });
            }
            
            // Update select elements
            const harmonicType = document.getElementById('harmonicType');
            const harmonicPhase = document.getElementById('harmonicPhase');
            const coordinateSystem = document.getElementById('coordinateSystem');
            const exportFormat = document.getElementById('exportFormat');
            
            if (harmonicType) harmonicType.value = this.state.harmonicType;
            if (harmonicPhase) harmonicPhase.value = this.state.harmonicPhase;
            if (coordinateSystem) coordinateSystem.value = this.state.coordinateSystem;
            if (exportFormat) exportFormat.value = this.state.exportFormat;
            
            // Update toggle buttons
            const geometryBtn = document.getElementById('geometryBtn');
            const waveformBtn = document.getElementById('waveformBtn');
            const audioBtn = document.getElementById('audioBtn');
            
            if (geometryBtn) geometryBtn.classList.toggle('active', this.state.showGeometry);
            if (waveformBtn) waveformBtn.classList.toggle('active', this.state.showWaveform);
            if (audioBtn) audioBtn.classList.toggle('active', this.state.audioEnabled);
        } catch (error) {
            this.logDebug(`UI update error: ${error.message}`);
        }
    }
    
    // Update and display metrics
    updateMetrics() {
        try {
            const metricsPanel = document.getElementById('metricsPanel');
            if (metricsPanel) {
                metricsPanel.textContent = `FPS: ${this.metrics.fps.toFixed(1)} | Frame: ${this.metrics.frameTime.toFixed(1)}ms | Render: ${this.metrics.renderTime.toFixed(1)}ms | Audio: ${this.metrics.audioLatency.toFixed(1)}ms | Waveform: ${this.metrics.waveformCalcTime.toFixed(1)}ms`;
            }
        } catch (error) {
            console.error('Metrics update error:', error);
        }
    }
    
    // Log a debug message
    logDebug(message) {
        console.log(`[HarmonicXplorer] ${message}`);
        
        this.debug.messages.unshift(message);
        if (this.debug.messages.length > this.debug.maxMessages) {
            this.debug.messages.pop();
        }
        
        const debugPanel = document.getElementById('debugPanel');
        if (debugPanel) {
            debugPanel.textContent = this.debug.messages.join('\n');
        }
    }
    
    // Precalculate sin/cos values for angles to improve performance
    calculateAngleSinCos(count) {
        const axisCount = Math.max(3, Math.min(24, count));
        this.cachedAngleSinCos = [];
        
        for (let i = 0; i < axisCount; i++) {
            const angle = (i / axisCount) * Math.PI * 2;
            this.cachedAngleSinCos.push({
                angle,
                sin: Math.sin(angle),
                cos: Math.cos(angle)
            });
        }
    }
    
    // Calculate harmonics based on current state
    calculateHarmonics() {
        const startTime = performance.now();
        const harmonics = [];
        const count = Math.max(1, Math.min(32, this.state.harmonicCount));
        
        try {
            switch (this.state.harmonicType) {
                case 'natural':
                    for (let i = 1; i <= count; i++) {
                        harmonics.push({ ratio: i, phase: 0 });
                    }
                    break;
                case 'octave':
                    for (let i = 0; i < count; i++) {
                        harmonics.push({ ratio: Math.pow(2, i), phase: 0 });
                    }
                    break;
                case 'odd':
                    for (let i = 0; i < count; i++) {
                        harmonics.push({ ratio: 2 * i + 1, phase: 0 });
                    }
                    break;
                case 'even':
                    for (let i = 1; i <= count; i++) {
                        harmonics.push({ ratio: 2 * i, phase: 0 });
                    }
                    break;
                case 'prime': {
                    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
                    harmonics.push(...primes.slice(0, count).map(p => ({ ratio: p, phase: 0 })));
                    break;
                }
                case 'fibonacci': {
                    let a = 1, b = 1;
                    for (let i = 0; i < count; i++) {
                        harmonics.push({ ratio: a, phase: 0 });
                        [a, b] = [b, a + b];
                    }
                    break;
                }
                case 'upper':
                    for (let i = 0; i < count; i++) {
                        harmonics.push({ ratio: Math.pow(1.5, i), phase: 0 });
                    }
                    break;
                case 'lower':
                    for (let i = 0; i < count; i++) {
                        harmonics.push({ ratio: 1 / Math.pow(1.5, i), phase: 0 });
                    }
                    break;
                case 'under':
                    for (let i = 1; i <= count; i++) {
                        harmonics.push({ ratio: 1 / i, phase: 0 });
                    }
                    break;
                case 'singular':
                    harmonics.push({ ratio: 1, phase: 0 });
                    break;
            }
            
            // Apply phase transformation
            switch (this.state.harmonicPhase) {
                case 'up':
                    harmonics.forEach((h, i) => h.phase = (i / count) * Math.PI * 2);
                    break;
                case 'down':
                    harmonics.forEach((h, i) => h.phase = ((count - i) / count) * Math.PI * 2);
                    break;
            }
        } catch (error) {
            this.logDebug(`Harmonic calculation error: ${error.message}`);
            return [{ ratio: 1, phase: 0 }]; // Return at least one harmonic as fallback
        }
        
        this.cachedHarmonics = harmonics;
        this.needsHarmonicRecalculation = false;
        
        return harmonics;
    }
    
    // Get the cached harmonics or calculate them if needed
    getHarmonics() {
        if (this.needsHarmonicRecalculation) {
            return this.calculateHarmonics();
        }
        return this.cachedHarmonics;
    }
    
    // Calculate waveform based on current harmonics
    calculateWaveform() {
        const startTime = performance.now();
        
        try {
            const harmonics = this.getHarmonics();
            const numPoints = 1000; // Number of points to calculate
            const waveform = new Array(numPoints).fill(0);
            
            // Calculate waveform values
            for (const harmonic of harmonics) {
                const n = harmonic.ratio;
                const amplitude = 1 / n; // Amplitude decreases with harmonic number
                
                for (let t = 0; t < numPoints; t++) {
                    const x = (t / numPoints) * 2 * Math.PI;
                    waveform[t] += amplitude * Math.sin(n * x + harmonic.phase);
                }
            }
            
            // Normalize waveform
            const maxValue = Math.max(...waveform.map(Math.abs));
            const normalizedWaveform = waveform.map(y => y / (maxValue || 1) * this.radius * 0.2);
            
            this.cachedWaveform = normalizedWaveform;
            this.needsWaveformRecalculation = false;
            this.metrics.waveformCalcTime = performance.now() - startTime;
            
            return normalizedWaveform;
        } catch (error) {
            this.logDebug(`Waveform calculation error: ${error.message}`);
            this.metrics.waveformCalcTime = performance.now() - startTime;
            return new Array(1000).fill(0); // Return flat line as fallback
        }
    }
    
    // Get the cached waveform or calculate it if needed
    getWaveform() {
        if (this.needsWaveformRecalculation) {
            return this.calculateWaveform();
        }
        return this.cachedWaveform;
    }
    
    // Export the canvas to an image file
    exportCanvas(format = 'png') {
        try {
            const renderer = this.getModule('renderer');
            if (!renderer) {
                throw new Error('Renderer module not found');
            }
            
            // Get the background canvas for export
            const canvas = renderer.canvases.background;
            if (!canvas) {
                throw new Error('Background canvas not found');
            }
            
            // Create a new canvas to combine all layers
            const exportCanvas = document.createElement('canvas');
            const scaleFactor = 2; // Higher resolution export
            exportCanvas.width = canvas.width * scaleFactor;
            exportCanvas.height = canvas.height * scaleFactor;
            
            const ctx = exportCanvas.getContext('2d');
            ctx.fillStyle = this.state.backgroundColor;
            ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
            
            // Draw all canvas layers onto the export canvas
            Object.values(renderer.canvases).forEach(layerCanvas => {
                ctx.drawImage(layerCanvas, 0, 0, exportCanvas.width, exportCanvas.height);
            });
            
            // Generate filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `harmonic-explorer-${timestamp}.${format}`;
            
            // Convert to blob and download
            exportCanvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
                
                // Clean up
                setTimeout(() => URL.revokeObjectURL(url), 100);
            }, `image/${format}`);
            
            this.logDebug(`Exported canvas as ${format}`);
        } catch (error) {
            this.logDebug(`Export error: ${error.message}`);
        }
    }
}

// Base Module class that all modules should extend
class HarmonicXplorerModule {
    constructor() {
        this.core = null;
    }
    
    setCore(core) {
        this.core = core;
    }
    
    async initialize() {
        // To be implemented by subclasses
    }
    
    onStateUpdate(state) {
        // To be implemented by subclasses
    }
    
    onResize(width, height) {
        // To be implemented by subclasses
    }
    
    onStart() {
        // To be implemented by subclasses
    }
    
    onStop() {
        // To be implemented by subclasses
    }
    
    render() {
        // To be implemented by subclasses
    }
}

// Export classes for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HarmonicXplorerCore, HarmonicXplorerModule };
} else {
    window.HarmonicXplorerCore = HarmonicXplorerCore;
    window.HarmonicXplorerModule = HarmonicXplorerModule;
} 