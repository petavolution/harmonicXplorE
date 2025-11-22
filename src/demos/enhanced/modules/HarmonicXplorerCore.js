/**
 * HarmonicXplorerCore.js
 * Core module for the HarmonicXplorer NG application
 * Manages state and coordinates between modules
 */

class HarmonicXplorerCore extends HarmonicXplorerModule {
    constructor(options = {}) {
        super(options);
        
        // Modules registry
        this.modules = {};
        
        // Application state
        this.state = {
            // Display settings
            harmonics: true,
            waveform: true,
            grid: true,
            info: false,
            fps: false,
            
            // Harmonic settings
            harmonicCount: 12,
            harmonicType: 'natural',
            harmonicPhase: '0',
            
            // Coordinate system
            coordinateSystem: 'polar',
            axisCount: 12,
            wavelength: 1,
            
            // Rotation settings
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            autoRotate: false,
            speed: 10,
            
            // Shape controls
            zoom: 1,
            
            // Color settings
            backgroundColor: '#1a1a2e',
            foregroundColor: '#e94560',
            
            // Audio settings
            audio: false,
            baseFrequency: 440,
            audioVolume: 0.5,
            audioAttack: 0.1,
            audioDecay: 0.05,
            oscillatorType: 'sine',
            spectrum: false,
            
            // Visualization settings
            visualizationMode: 'standard',
            renderQuality: 'high'
        };
        
        // Computed values
        this.harmonics = [];
        this.waveform = [];
        
        // Track whether we need to recalculate
        this.needsHarmonicRecalc = true;
        this.needsWaveformRecalc = true;
    }
    
    /**
     * Initialize the core module
     */
    async initialize() {
        try {
            this.log('Initializing core module');
            
            // Initial calculations
            this.recalculateHarmonics();
            this.recalculateWaveform();
            
            this.log('Core initialization complete');
            return true;
        } catch (error) {
            this.logError('Core initialization error:', error);
            throw new Error(`Core initialization failed: ${error.message}`);
        }
    }
    
    /**
     * Register a module with the core
     * @param {string} name - Module name/key
     * @param {HarmonicXplorerModule} module - Module instance
     */
    registerModule(name, module) {
        if (!module || !(module instanceof HarmonicXplorerModule)) {
            throw new Error(`Invalid module registration for ${name}`);
        }
        
        this.modules[name] = module;
        this.log(`Registered module: ${name}`);
    }
    
    /**
     * Get the current application state
     * @return {Object} Current state
     */
    getState() {
        return {...this.state};
    }
    
    /**
     * Get a specific state value
     * @param {string} key - State property name
     * @return {*} State value
     */
    getStateValue(key) {
        return this.state[key];
    }
    
    /**
     * Update application state with new values
     * @param {Object} newValues - Object with new state values
     */
    updateState(newValues) {
        // Track what has changed
        let displayChanged = false;
        let harmonicsChanged = false;
        let waveformChanged = false;
        let audioChanged = false;
        
        // Track changed keys for logging
        const changedKeys = [];
        
        Object.entries(newValues).forEach(([key, value]) => {
            // Skip if value hasn't changed
            if (this.state[key] === value) return;
            
            // Update state
            this.state[key] = value;
            changedKeys.push(key);
            
            // Check what type of state changed
            switch (key) {
                case 'harmonics':
                case 'waveform':
                case 'grid':
                case 'info':
                case 'fps':
                case 'visualizationMode':
                case 'renderQuality':
                case 'backgroundColor':
                case 'foregroundColor':
                case 'zoom':
                case 'rotationX':
                case 'rotationY':
                case 'rotationZ':
                    displayChanged = true;
                    break;
                    
                case 'harmonicCount':
                case 'harmonicType':
                case 'harmonicPhase':
                    harmonicsChanged = true;
                    waveformChanged = true;
                    break;
                    
                case 'coordinateSystem':
                case 'axisCount':
                case 'wavelength':
                    waveformChanged = true;
                    break;
                    
                case 'audio':
                case 'baseFrequency':
                case 'audioVolume':
                case 'audioAttack':
                case 'audioDecay':
                case 'oscillatorType':
                case 'spectrum':
                    audioChanged = true;
                    break;
            }
        });
        
        if (changedKeys.length > 0) {
            this.log(`State updated: ${changedKeys.join(', ')}`);
            
            // Recalculate if needed
            if (harmonicsChanged) {
                this.needsHarmonicRecalc = true;
            }
            
            if (waveformChanged) {
                this.needsWaveformRecalc = true;
            }
            
            // Notify modules
            this.notifyModules({
                displayChanged,
                harmonicsChanged,
                waveformChanged,
                audioChanged
            });
        }
    }
    
    /**
     * Notify all registered modules of state changes
     * @param {Object} changes - What type of changes occurred
     */
    notifyModules(changes) {
        // Recalculate harmonics and waveform if needed
        if (this.needsHarmonicRecalc) {
            this.recalculateHarmonics();
        }
        
        if (this.needsWaveformRecalc) {
            this.recalculateWaveform();
        }
        
        // Get full state
        const state = this.getState();
        
        // Add computed data
        state.harmonicsData = this.harmonics;
        state.waveformData = this.waveform;
        
        // Notify modules of state changes
        Object.entries(this.modules).forEach(([name, module]) => {
            if (typeof module.onStateUpdate === 'function') {
                module.onStateUpdate(state, changes);
            }
        });
        
        // Always request a render when state changes
        if (this.modules.renderer && changes.displayChanged) {
            this.log('Requesting render after state update');
            this.modules.renderer.requestRender();
        }
    }
    
    /**
     * Load settings from an object
     * @param {Object} settings - Settings object to load
     */
    loadSettings(settings) {
        // Validate settings
        if (!settings || typeof settings !== 'object') {
            throw new Error('Invalid settings object');
        }
        
        // Update state with settings
        this.updateState(settings);
        this.log('Settings loaded');
    }
    
    /**
     * Recalculate harmonics based on current state
     */
    recalculateHarmonics() {
        const { harmonicCount, harmonicType, harmonicPhase } = this.state;
        
        // Create array of harmonics
        this.harmonics = [];
        
        // Generate harmonic numbers based on type
        let harmonicNumbers = [];
        
        switch (harmonicType) {
            case 'natural':
                harmonicNumbers = Array.from({ length: harmonicCount }, (_, i) => i + 1);
                break;
                
            case 'odd':
                harmonicNumbers = Array.from({ length: harmonicCount }, (_, i) => i * 2 + 1);
                break;
                
            case 'even':
                harmonicNumbers = Array.from({ length: harmonicCount }, (_, i) => (i + 1) * 2);
                break;
                
            case 'prime':
                // Generate prime numbers
                const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
                harmonicNumbers = primes.slice(0, harmonicCount);
                break;
                
            case 'fibonacci':
                // Generate Fibonacci sequence
                harmonicNumbers = [1, 1];
                for (let i = 2; i < harmonicCount; i++) {
                    harmonicNumbers.push(harmonicNumbers[i-1] + harmonicNumbers[i-2]);
                }
                break;
                
            case 'custom':
                // Use natural harmonics for custom (would be configured elsewhere)
                harmonicNumbers = Array.from({ length: harmonicCount }, (_, i) => i + 1);
                break;
                
            default:
                harmonicNumbers = Array.from({ length: harmonicCount }, (_, i) => i + 1);
        }
        
        // Generate phases based on phase setting
        let phases = [];
        
        switch (harmonicPhase) {
            case '0':
                phases = Array(harmonicCount).fill(0);
                break;
                
            case '90':
                phases = Array(harmonicCount).fill(Math.PI / 2);
                break;
                
            case '180':
                phases = Array(harmonicCount).fill(Math.PI);
                break;
                
            case '270':
                phases = Array(harmonicCount).fill(Math.PI * 3 / 2);
                break;
                
            case 'random':
                phases = Array.from({ length: harmonicCount }, () => Math.random() * Math.PI * 2);
                break;
                
            case 'incremental':
                phases = Array.from({ length: harmonicCount }, (_, i) => (i * Math.PI / 4) % (Math.PI * 2));
                break;
                
            default:
                phases = Array(harmonicCount).fill(0);
        }
        
        // Create harmonic objects
        for (let i = 0; i < harmonicCount; i++) {
            const n = harmonicNumbers[i];
            const amplitude = 1 / n; // Amplitude decreases with harmonic number
            const phase = phases[i];
            
            this.harmonics.push({
                n,
                amplitude,
                phase
            });
        }
        
        this.needsHarmonicRecalc = false;
        this.log(`Recalculated ${harmonicCount} harmonics`);
    }
    
    /**
     * Recalculate waveform based on current harmonics and state
     */
    recalculateWaveform() {
        const { coordinateSystem, axisCount, wavelength } = this.state;
        
        // Make sure harmonics are calculated first
        if (this.needsHarmonicRecalc) {
            this.recalculateHarmonics();
        }
        
        // Generate waveform points
        const points = [];
        const resolution = 360; // Number of points in waveform
        
        for (let i = 0; i < resolution; i++) {
            const angle = (i / resolution) * Math.PI * 2;
            let x = 0, y = 0;
            
            // Sum all harmonics to get waveform
            for (const harmonic of this.harmonics) {
                const { n, amplitude, phase } = harmonic;
                const value = amplitude * Math.sin(n * angle + phase);
                
                // Different coordinate systems
                switch (coordinateSystem) {
                    case 'polar':
                        x += value * Math.cos(angle * wavelength);
                        y += value * Math.sin(angle * wavelength);
                        break;
                        
                    case 'cartesian':
                        x += (angle / (Math.PI * 2)) * wavelength;
                        y += value;
                        break;
                        
                    case 'logarithmic':
                        const logScale = Math.log(n + 1) / Math.log(this.harmonics.length + 1);
                        x += value * logScale * Math.cos(angle * wavelength);
                        y += value * logScale * Math.sin(angle * wavelength);
                        break;
                }
            }
            
            points.push({ x, y });
        }
        
        this.waveform = points;
        this.needsWaveformRecalc = false;
        this.log(`Recalculated waveform with ${points.length} points`);
    }
    
    /**
     * Get the calculated harmonics
     * @return {Array} Harmonic data
     */
    getHarmonics() {
        if (this.needsHarmonicRecalc) {
            this.recalculateHarmonics();
        }
        return this.harmonics;
    }
    
    /**
     * Get the calculated waveform
     * @return {Array} Waveform points
     */
    getWaveform() {
        if (this.needsWaveformRecalc) {
            this.recalculateWaveform();
        }
        return this.waveform;
    }
} 