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
            audioEnabled: false,
            axisCount: 6,
            harmonicCount: 8,
            wavelength: 6,
            rotation: 0,
            speed: 0,
            zoom: 1,
            shapes: {
                circle: { show: true, color: '#4CAF50' },
                hexagon: { show: true, color: '#2196F3' },
                triangle: { show: false, color: '#FFC107' }
            },
            coordinateSystem: 'radial',
            harmonicType: 'natural',
            harmonicPhase: 'full'
        }, this.config.initialState);
        
        // Metrics & Debug info
        this.metrics = {
            fps: 0,
            frameTime: 0,
            renderTime: 0,
            audioLatency: 0
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
            // Update rotation based on speed if animation is running
            if (this.state.isRunning) {
                this.state.rotation += this.state.speed * 0.01;
            }
            
            // Notify all modules to render
            for (const module of this.modules.values()) {
                if (typeof module.render === 'function') {
                    module.render();
                }
            }
            
            // Update metrics
            this.metrics.renderTime = performance.now() - startTime;
            this.updateMetrics();
            
            // Schedule next frame if animation is running
            if (this.state.isRunning) {
                this.animationFrameId = requestAnimationFrame(() => this.render());
            }
        } catch (error) {
            this.logDebug(`Render error: ${error.message}`);
            
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
            // Apply changes to state
            Object.entries(changes).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null && typeof this.state[key] === 'object') {
                    this.state[key] = { ...this.state[key], ...value };
                } else {
                    this.state[key] = value;
                }
            });
            
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
                    if (input) input.value = value;
                    if (slider) slider.value = value * ((key === 'rotation' || key === 'speed') ? 100 : 1);
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
            const now = performance.now();
            if (!this._lastFrame) this._lastFrame = now;
            
            this.metrics.frameTime = now - this._lastFrame;
            this.metrics.fps = 1000 / this.metrics.frameTime;
            this._lastFrame = now;
            
            const metricsPanel = document.getElementById('metricsPanel');
            if (metricsPanel) {
                metricsPanel.textContent = `FPS: ${this.metrics.fps.toFixed(1)} | Frame: ${this.metrics.frameTime.toFixed(1)}ms | Render: ${this.metrics.renderTime.toFixed(1)}ms | Audio: ${this.metrics.audioLatency.toFixed(1)}ms`;
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
    
    // Calculate harmonics based on current state
    calculateHarmonics() {
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
        
        return harmonics;
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