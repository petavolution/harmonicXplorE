/**
 * HarmonicXplorerUI.js
 * Handles user interface elements and user interactions
 */

class HarmonicXplorerUI extends HarmonicXplorerModule {
    constructor(config = {}) {
        super();
        this.config = Object.assign({
            controlsId: 'controls',
            modals: {
                calculator: 'calculatorModal'
            }
        }, config);
        
        this.elements = {};
        this.initialized = false;
    }
    
    async initialize() {
        try {
            // Cache UI elements
            this.cacheElements();
            
            // Set up event listeners
            this.setupEventListeners();
            
            this.initialized = true;
            return true;
        } catch (error) {
            console.error('UI initialization error:', error);
            return false;
        }
    }
    
    cacheElements() {
        // Find container elements
        this.elements.controls = document.getElementById(this.config.controlsId);
        
        // Control buttons
        this.elements.startBtn = document.getElementById('startBtn');
        this.elements.resetBtn = document.getElementById('resetBtn');
        this.elements.audioBtn = document.getElementById('audioBtn');
        this.elements.geometryBtn = document.getElementById('geometryBtn');
        this.elements.waveformBtn = document.getElementById('waveformBtn');
        
        // Sliders and inputs
        this.elements.harmonicType = document.getElementById('harmonicType');
        this.elements.harmonicPhase = document.getElementById('harmonicPhase');
        this.elements.harmonicCount = document.getElementById('harmonicCount');
        this.elements.harmonicCountSlider = document.getElementById('harmonicCountSlider');
        this.elements.axisCount = document.getElementById('axisCount');
        this.elements.axisCountSlider = document.getElementById('axisCountSlider');
        this.elements.wavelength = document.getElementById('wavelength');
        this.elements.wavelengthSlider = document.getElementById('wavelengthSlider');
        this.elements.rotation = document.getElementById('rotation');
        this.elements.rotationSlider = document.getElementById('rotationSlider');
        this.elements.speed = document.getElementById('speed');
        this.elements.speedSlider = document.getElementById('speedSlider');
        this.elements.zoom = document.getElementById('zoom');
        this.elements.zoomSlider = document.getElementById('zoomSlider');
        
        // Shape controls
        this.elements.showCircle = document.getElementById('showCircle');
        this.elements.showHexagon = document.getElementById('showHexagon');
        this.elements.showTriangle = document.getElementById('showTriangle');
        this.elements.circleColor = document.getElementById('circleColor');
        this.elements.hexagonColor = document.getElementById('hexagonColor');
        this.elements.triangleColor = document.getElementById('triangleColor');
        this.elements.showHarmonicRepresentation = document.getElementById('showHarmonicRepresentation');
        this.elements.showWaveformCalculation = document.getElementById('showWaveformCalculation');
        
        // Status elements
        this.elements.animationStatus = document.getElementById('animationStatus');
        this.elements.metricsPanel = document.getElementById('metricsPanel');
        this.elements.debugPanel = document.getElementById('debugPanel');
        
        // Modal elements
        this.elements.calculatorModal = document.getElementById(this.config.modals.calculator);
        this.elements.calculatorOpenBtn = document.getElementById('openCalculator');
        this.elements.calculatorCloseBtn = document.getElementById('closeCalculator');
    }
    
    setupEventListeners() {
        // Avoid setting up listeners if elements aren't found
        if (!this.elements.controls) return;
        
        // Button click handlers
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => {
                this.core.toggleAnimation();
            });
        }
        
        if (this.elements.resetBtn) {
            this.elements.resetBtn.addEventListener('click', () => {
                this.resetToDefaults();
            });
        }
        
        if (this.elements.audioBtn) {
            this.elements.audioBtn.addEventListener('click', () => {
                this.core.updateState({ audioEnabled: !this.core.state.audioEnabled });
            });
        }
        
        if (this.elements.geometryBtn) {
            this.elements.geometryBtn.addEventListener('click', () => {
                this.core.updateState({ showGeometry: !this.core.state.showGeometry });
            });
        }
        
        if (this.elements.waveformBtn) {
            this.elements.waveformBtn.addEventListener('click', () => {
                this.core.updateState({ showWaveform: !this.core.state.showWaveform });
            });
        }
        
        // Select inputs
        this.setupSelectInput(this.elements.harmonicType, 'harmonicType');
        this.setupSelectInput(this.elements.harmonicPhase, 'harmonicPhase');
        
        // Number inputs with sliders
        this.setupNumberInput(this.elements.harmonicCount, this.elements.harmonicCountSlider, 'harmonicCount', 1, 32);
        this.setupNumberInput(this.elements.axisCount, this.elements.axisCountSlider, 'axisCount', 3, 24);
        this.setupNumberInput(this.elements.wavelength, this.elements.wavelengthSlider, 'wavelength', 1, 20);
        this.setupNumberInput(this.elements.rotation, this.elements.rotationSlider, 'rotation', 0, Math.PI * 2, 0.01);
        this.setupNumberInput(this.elements.speed, this.elements.speedSlider, 'speed', -10, 10, 0.01);
        this.setupNumberInput(this.elements.zoom, this.elements.zoomSlider, 'zoom', 0.1, 3, 0.01);
        
        // Shape controls
        this.setupCheckbox(this.elements.showCircle, 'shapes', 'circle', 'show');
        this.setupCheckbox(this.elements.showHexagon, 'shapes', 'hexagon', 'show');
        this.setupCheckbox(this.elements.showTriangle, 'shapes', 'triangle', 'show');
        
        this.setupColorPicker(this.elements.circleColor, 'shapes', 'circle', 'color');
        this.setupColorPicker(this.elements.hexagonColor, 'shapes', 'hexagon', 'color');
        this.setupColorPicker(this.elements.triangleColor, 'shapes', 'triangle', 'color');
        
        if (this.elements.showHarmonicRepresentation) {
            this.elements.showHarmonicRepresentation.addEventListener('change', () => {
                this.core.updateState({ showHarmonicRepresentation: this.elements.showHarmonicRepresentation.checked });
            });
        }
        
        if (this.elements.showWaveformCalculation) {
            this.elements.showWaveformCalculation.addEventListener('change', () => {
                this.core.updateState({ showWaveformCalculation: this.elements.showWaveformCalculation.checked });
            });
        }
        
        // Modal controls
        if (this.elements.calculatorOpenBtn && this.elements.calculatorModal) {
            this.elements.calculatorOpenBtn.addEventListener('click', () => {
                this.elements.calculatorModal.style.display = 'block';
            });
        }
        
        if (this.elements.calculatorCloseBtn && this.elements.calculatorModal) {
            this.elements.calculatorCloseBtn.addEventListener('click', () => {
                this.elements.calculatorModal.style.display = 'none';
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (this.elements.calculatorModal && event.target === this.elements.calculatorModal) {
                this.elements.calculatorModal.style.display = 'none';
            }
        });
        
        // Keyboard shortcuts
        window.addEventListener('keydown', (event) => {
            if (event.key === ' ' || event.code === 'Space') {
                // Space bar toggles animation
                event.preventDefault();
                this.core.toggleAnimation();
            } else if (event.key === 'a' || event.code === 'KeyA') {
                // 'A' key toggles audio
                this.core.updateState({ audioEnabled: !this.core.state.audioEnabled });
            } else if (event.key === 'g' || event.code === 'KeyG') {
                // 'G' key toggles geometry
                this.core.updateState({ showGeometry: !this.core.state.showGeometry });
            } else if (event.key === 'w' || event.code === 'KeyW') {
                // 'W' key toggles waveform
                this.core.updateState({ showWaveform: !this.core.state.showWaveform });
            } else if (event.key === 'r' || event.code === 'KeyR') {
                // 'R' key resets to defaults
                this.resetToDefaults();
            }
        });
    }
    
    setupSelectInput(element, stateKey) {
        if (!element) return;
        
        // Set initial value
        element.value = this.core.state[stateKey];
        
        // Add change event listener
        element.addEventListener('change', () => {
            const update = {};
            update[stateKey] = element.value;
            this.core.updateState(update);
        });
    }
    
    setupNumberInput(inputElement, sliderElement, stateKey, min, max, multiplier = 1) {
        if (!inputElement && !sliderElement) return;
        
        // Set up input element
        if (inputElement) {
            // Set initial value
            inputElement.value = this.core.state[stateKey];
            
            // Set min/max if specified
            if (min !== undefined) inputElement.min = min;
            if (max !== undefined) inputElement.max = max;
            
            // Add change event listener
            inputElement.addEventListener('change', () => {
                const value = parseFloat(inputElement.value);
                if (!isNaN(value)) {
                    const update = {};
                    update[stateKey] = value;
                    this.core.updateState(update);
                    
                    // Update slider if it exists
                    if (sliderElement) {
                        sliderElement.value = value * (1 / multiplier);
                    }
                }
            });
        }
        
        // Set up slider element
        if (sliderElement) {
            // Set initial value
            sliderElement.value = this.core.state[stateKey] * (1 / multiplier);
            
            // Set min/max if specified
            if (min !== undefined) sliderElement.min = min * (1 / multiplier);
            if (max !== undefined) sliderElement.max = max * (1 / multiplier);
            
            // Add input event listener (for real-time updates)
            sliderElement.addEventListener('input', () => {
                const value = parseFloat(sliderElement.value) * multiplier;
                
                // Update input if it exists
                if (inputElement) {
                    inputElement.value = value;
                }
                
                // Update state
                const update = {};
                update[stateKey] = value;
                this.core.updateState(update);
            });
        }
    }
    
    setupCheckbox(element, objectKey, subKey, property) {
        if (!element) return;
        
        // Set initial value
        element.checked = this.core.state[objectKey][subKey][property];
        
        // Add change event listener
        element.addEventListener('change', () => {
            const update = {};
            update[objectKey] = {
                [subKey]: {
                    [property]: element.checked
                }
            };
            this.core.updateState(update);
        });
    }
    
    setupColorPicker(element, objectKey, subKey, property) {
        if (!element) return;
        
        // Set initial value
        element.value = this.core.state[objectKey][subKey][property];
        
        // Add change event listener
        element.addEventListener('change', () => {
            const update = {};
            update[objectKey] = {
                [subKey]: {
                    [property]: element.value
                }
            };
            this.core.updateState(update);
        });
    }
    
    resetToDefaults() {
        // Reset to default state
        this.core.updateState({
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
            harmonicType: 'natural',
            harmonicPhase: 'full'
        });
        
        this.core.stop();
        this.core.logDebug('Reset to defaults');
    }
    
    onStateUpdate(state) {
        // UI updates are handled by the core's updateUI method
    }
    
    onResize(width, height) {
        // Nothing to do for UI resize
    }
}

// Export class for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HarmonicXplorerUI };
} else {
    window.HarmonicXplorerUI = HarmonicXplorerUI;
} 