/**
 * HarmonicXplorerNG.js
 * Enhanced version combining features from HarmonicExplorerDemo and WaveformNG1
 */

// Minimal EventGear implementation (fallback)
class MinimalEventGear {
    constructor(options = {}) {
        this.options = options;
        this.events = [];
        this.eventListeners = {};
        this.startTime = Date.now();
        this.isRunning = false;
        console.log('Minimal EventGear implementation created');
    }
    
    start() {
        this.isRunning = true;
        this.startTime = Date.now();
        return this;
    }
    
    stop() {
        this.isRunning = false;
        return this;
    }
    
    registerEvent(eventData) {
        const event = {
            ...eventData,
            timestamp: Date.now(),
            id: this.events.length
        };
        this.events.push(event);
        
        const listeners = this.eventListeners[eventData.type] || [];
        listeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('Error in event listener:', error);
            }
        });
        
        return event;
    }
    
    on(eventType, callback) {
        if (!this.eventListeners[eventType]) {
            this.eventListeners[eventType] = [];
        }
        this.eventListeners[eventType].push(callback);
        return this;
    }
    
    emit(eventType, data) {
        return this.registerEvent({
            type: eventType,
            data,
            timestamp: Date.now()
        });
    }
}

// Application State Management
class AppState {
    constructor() {
        this.params = {
            harmonicCount: 8,
            harmonicType: 'natural',
            frequency: 440,
            rotation: 0,
            speed: 0,
            isPlaying: false,
            showAudio: false,
            showWaveform: true,
            showGeometry: true
        };
        
        this.cache = new Map();
    }
    
    getParam(key) {
        return this.params[key];
    }
    
    setParam(key, value) {
        this.params[key] = value;
    }
    
    getCachedData(key) {
        return this.cache.get(key);
    }
    
    setCachedData(key, value) {
        this.cache.set(key, value);
    }
}

// Harmonic Series Generator
class HarmonicGenerator {
    constructor(eventGear, appState) {
        this.eventGear = eventGear;
        this.appState = appState;
        this.cache = new Map();
    }
    
    calculateSeries() {
        const count = this.appState.getParam('harmonicCount');
        const type = this.appState.getParam('harmonicType');
        
        const cacheKey = `${count}:${type}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        let series = [];
        switch (type) {
            case 'natural':
                series = Array.from({ length: count }, (_, i) => i + 1);
                break;
            case 'octave':
                series = Array.from({ length: count }, (_, i) => Math.pow(2, i));
                break;
            case 'odd':
                series = Array.from({ length: count }, (_, i) => 2 * i + 1);
                break;
            case 'even':
                series = Array.from({ length: count }, (_, i) => 2 * (i + 1));
                break;
            case 'prime':
                series = this.generatePrimes(count);
                break;
            case 'fibonacci':
                series = this.generateFibonacci(count);
                break;
        }
        
        this.cache.set(cacheKey, series);
        return series;
    }
    
    generatePrimes(count) {
        const primes = [];
        let num = 2;
        while (primes.length < count) {
            if (this.isPrime(num)) primes.push(num);
            num++;
        }
        return primes;
    }
    
    isPrime(num) {
        for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
            if (num % i === 0) return false;
        }
        return num > 1;
    }
    
    generateFibonacci(count) {
        if (count <= 0) return [];
        if (count === 1) return [1];
        const fib = [1, 1];
        for (let i = 2; i < count; i++) {
            fib.push(fib[i-1] + fib[i-2]);
        }
        return fib;
    }
}

// Audio Synthesis
class AudioSynthesis {
    constructor(eventGear, appState) {
        this.eventGear = eventGear;
        this.appState = appState;
        this.oscillators = [];
        this.initAudio();
    }
    
    async initAudio() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.mainGain = this.context.createGain();
            this.mainGain.gain.value = 0.3;
            this.mainGain.connect(this.context.destination);
            
            // Create silent oscillator to unlock audio context
            const unlockOsc = this.context.createOscillator();
            unlockOsc.connect(this.context.destination);
            unlockOsc.start();
            unlockOsc.stop(this.context.currentTime + 0.001);
            
            this.eventGear.emit('audio.initialized', { success: true });
        } catch (error) {
            console.error('Audio initialization failed:', error);
            this.eventGear.emit('audio.initialized', { success: false, error });
        }
    }
    
    start() {
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
        
        const harmonics = this.appState.getCachedData('harmonicSeries');
        const baseFreq = this.appState.getParam('frequency');
        
        this.stop(); // Clean up existing oscillators
        
        harmonics.forEach((harmonic, index) => {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = baseFreq * harmonic;
            
            gain.gain.value = 0.3 / (index + 1); // Decrease amplitude with harmonic number
            
            osc.connect(gain);
            gain.connect(this.mainGain);
            
            osc.start();
            this.oscillators.push({ osc, gain });
        });
        
        this.eventGear.emit('audio.started', { harmonicCount: harmonics.length });
    }
    
    stop() {
        this.oscillators.forEach(({ osc }) => {
            try {
                osc.stop();
                osc.disconnect();
            } catch (e) {
                // Ignore errors when stopping oscillators
            }
        });
        this.oscillators = [];
        this.eventGear.emit('audio.stopped');
    }
    
    updateFrequency() {
        const baseFreq = this.appState.getParam('frequency');
        const harmonics = this.appState.getCachedData('harmonicSeries');
        
        this.oscillators.forEach(({ osc }, index) => {
            if (harmonics[index]) {
                osc.frequency.value = baseFreq * harmonics[index];
            }
        });
    }
}

// Visualization System
class VisualizationSystem {
    constructor(eventGear, appState) {
        this.eventGear = eventGear;
        this.appState = appState;
        
        this.mainCanvas = document.getElementById('mainCanvas');
        this.waveformCanvas = document.getElementById('waveformCanvas');
        this.geometryCanvas = document.getElementById('geometryCanvas');
        
        this.mainCtx = this.mainCanvas.getContext('2d');
        this.waveformCtx = this.waveformCanvas.getContext('2d');
        this.geometryCtx = this.geometryCanvas.getContext('2d');
        
        this.setupCanvases();
        this.registerEvents();
        
        // Animation state
        this.lastFrameTime = 0;
        this.isAnimating = false;
    }
    
    setupCanvases() {
        const updateCanvasSize = () => {
            const container = document.querySelector('.visualization');
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            [this.mainCanvas, this.waveformCanvas, this.geometryCanvas].forEach(canvas => {
                canvas.width = width;
                canvas.height = height;
            });
            
            this.eventGear.emit('canvas.resized', { width, height });
        };
        
        window.addEventListener('resize', updateCanvasSize);
        updateCanvasSize();
    }
    
    registerEvents() {
        this.eventGear.on('render.frame', () => this.render());
        
        // Start animation loop
        const animate = (timestamp) => {
            if (!this.isAnimating) return;
            
            const deltaTime = timestamp - this.lastFrameTime;
            this.lastFrameTime = timestamp;
            
            this.eventGear.emit('render.frame', { timestamp, deltaTime });
            requestAnimationFrame(animate);
        };
        
        this.start = () => {
            if (!this.isAnimating) {
                this.isAnimating = true;
                this.lastFrameTime = performance.now();
                requestAnimationFrame(animate);
            }
        };
        
        this.stop = () => {
            this.isAnimating = false;
        };
    }
    
    render() {
        // Clear all canvases
        [this.mainCtx, this.waveformCtx, this.geometryCtx].forEach(ctx => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        });
        
        if (this.appState.getParam('showWaveform')) {
            this.renderWaveform();
        }
        
        if (this.appState.getParam('showGeometry')) {
            this.renderGeometry();
        }
        
        // Composite everything onto main canvas
        this.mainCtx.drawImage(this.waveformCanvas, 0, 0);
        this.mainCtx.drawImage(this.geometryCanvas, 0, 0);
    }
    
    renderWaveform() {
        const harmonics = this.appState.getCachedData('harmonicSeries');
        if (!harmonics) return;
        
        const ctx = this.waveformCtx;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const points = width;
        const amplitude = height / 4;
        const centerY = height / 2;
        
        for (let x = 0; x < points; x++) {
            const t = (x / points) * Math.PI * 2;
            let y = 0;
            
            harmonics.forEach((harmonic, index) => {
                y += Math.sin(t * harmonic) / (index + 1);
            });
            
            y = centerY + y * amplitude;
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
    }
    
    renderGeometry() {
        const ctx = this.geometryCtx;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        const harmonics = this.appState.getCachedData('harmonicSeries');
        if (!harmonics) return;
        
        const rotation = this.appState.getParam('rotation');
        const radius = Math.min(width, height) * 0.4;
        
        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < harmonics.length; i++) {
            const angle = (i / harmonics.length) * Math.PI * 2 + rotation;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
            ctx.stroke();
        }
        
        // Draw harmonic points
        ctx.fillStyle = '#00ff00';
        harmonics.forEach((harmonic, index) => {
            const angle = (index / harmonics.length) * Math.PI * 2 + rotation;
            const r = (radius * harmonic) / harmonics[harmonics.length - 1];
            
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

// Main Application
class HarmonicXplorerNG {
    constructor() {
        // Initialize EventGear (use external if available, otherwise use minimal implementation)
        this.eventGear = window.EventGear ? new EventGear() : new MinimalEventGear();
        
        // Initialize application state
        this.appState = new AppState();
        
        // Initialize components
        this.harmonicGen = new HarmonicGenerator(this.eventGear, this.appState);
        this.audio = new AudioSynthesis(this.eventGear, this.appState);
        this.visualizer = new VisualizationSystem(this.eventGear, this.appState);
        
        // Setup UI handlers
        this.setupUI();
        
        // Start EventGear
        this.eventGear.start();
        
        // Initial update
        this.updateHarmonics();
        
        // Start visualization
        this.visualizer.start();
    }
    
    setupUI() {
        // Button handlers
        document.getElementById('startBtn').addEventListener('click', () => {
            const isPlaying = !this.appState.getParam('isPlaying');
            this.appState.setParam('isPlaying', isPlaying);
            
            if (isPlaying) {
                this.audio.start();
                document.getElementById('startBtn').textContent = 'Stop';
            } else {
                this.audio.stop();
                document.getElementById('startBtn').textContent = 'Start';
            }
            
            this.eventGear.emit('ui.playStateChanged', { isPlaying });
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.appState.setParam('rotation', 0);
            this.appState.setParam('speed', 0);
            document.getElementById('rotation').value = '0';
            document.getElementById('rotationSlider').value = '0';
            document.getElementById('speed').value = '0';
            document.getElementById('speedSlider').value = '0';
            this.eventGear.emit('ui.reset');
        });
        
        // Harmonic controls
        document.getElementById('harmonicCount').addEventListener('input', (e) => {
            this.appState.setParam('harmonicCount', parseInt(e.target.value));
            this.updateHarmonics();
        });
        
        document.getElementById('harmonicType').addEventListener('change', (e) => {
            this.appState.setParam('harmonicType', e.target.value);
            this.updateHarmonics();
        });
        
        // Frequency control
        const updateFrequency = (value) => {
            const freq = parseFloat(value);
            this.appState.setParam('frequency', freq);
            document.getElementById('frequency').value = freq;
            document.getElementById('frequencySlider').value = freq;
            this.audio.updateFrequency();
            this.eventGear.emit('ui.frequencyChanged', { frequency: freq });
        };
        
        document.getElementById('frequency').addEventListener('input', (e) => updateFrequency(e.target.value));
        document.getElementById('frequencySlider').addEventListener('input', (e) => updateFrequency(e.target.value));
        
        // Rotation controls
        const updateRotation = (value) => {
            const rotation = parseFloat(value);
            this.appState.setParam('rotation', rotation);
            document.getElementById('rotation').value = rotation;
            document.getElementById('rotationSlider').value = rotation * 100;
            this.eventGear.emit('ui.rotationChanged', { rotation });
        };
        
        document.getElementById('rotation').addEventListener('input', (e) => updateRotation(e.target.value));
        document.getElementById('rotationSlider').addEventListener('input', (e) => updateRotation(e.target.value / 100));
        
        // Speed controls
        const updateSpeed = (value) => {
            const speed = parseFloat(value);
            this.appState.setParam('speed', speed);
            document.getElementById('speed').value = speed;
            document.getElementById('speedSlider').value = speed * 100;
            this.eventGear.emit('ui.speedChanged', { speed });
        };
        
        document.getElementById('speed').addEventListener('input', (e) => updateSpeed(e.target.value));
        document.getElementById('speedSlider').addEventListener('input', (e) => updateSpeed(e.target.value / 100));
        
        // View toggles
        document.getElementById('audioBtn').addEventListener('click', () => {
            const showAudio = !this.appState.getParam('showAudio');
            this.appState.setParam('showAudio', showAudio);
            document.getElementById('audioBtn').classList.toggle('active', showAudio);
            this.eventGear.emit('ui.audioToggled', { showAudio });
        });
        
        document.getElementById('waveformBtn').addEventListener('click', () => {
            const showWaveform = !this.appState.getParam('showWaveform');
            this.appState.setParam('showWaveform', showWaveform);
            document.getElementById('waveformBtn').classList.toggle('active', showWaveform);
            this.eventGear.emit('ui.waveformToggled', { showWaveform });
        });
        
        document.getElementById('geometryBtn').addEventListener('click', () => {
            const showGeometry = !this.appState.getParam('showGeometry');
            this.appState.setParam('showGeometry', showGeometry);
            document.getElementById('geometryBtn').classList.toggle('active', showGeometry);
            this.eventGear.emit('ui.geometryToggled', { showGeometry });
        });
    }
    
    updateHarmonics() {
        const series = this.harmonicGen.calculateSeries();
        this.appState.setCachedData('harmonicSeries', series);
        this.eventGear.emit('harmonics.updated', { series });
        
        if (this.appState.getParam('isPlaying')) {
            this.audio.stop();
            this.audio.start();
        }
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new HarmonicXplorerNG();
}); 