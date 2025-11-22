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
                calculator: 'calculatorModal',
                geometry: 'geometryModal',
                addSynth: 'addSynthModal'
            }
        }, config);
        
        this.elements = {};
        this.initialized = false;
        
        // Constants for decimal precision
        this.DECIMALS_WAVELENGTH = 6;
        this.DECIMALS_ANGLE = 3;
        this.DECIMALS_SPEED = 2;
        
        // Constants for audio defaults
        this.AUDIO_DEFAULTS = {
            volume: 0.5,
            attack: 0.3,
            decay: 0.05,
            oscillatorType: 'sine'
        };

        // Constants for harmonic types
        this.HARMONIC_TYPES = [
            { value: 'natural', label: 'Natural Series' },
            { value: 'octave', label: 'Octaves' },
            { value: 'odd', label: 'Odd Harmonics' },
            { value: 'even', label: 'Even Harmonics' },
            { value: 'prime', label: 'Prime Numbers' },
            { value: 'fibonacci', label: 'Fibonacci Series' },
            { value: 'upper', label: 'Upper Series' },
            { value: 'lower', label: 'Lower Series' },
            { value: 'under', label: 'Undertones' },
            { value: 'geometric', label: 'Geometric Series' },
            { value: 'harmonic', label: 'Harmonic Series' },
            { value: 'singular', label: 'Single Harmonic' }
        ];
    }
    
    async initialize() {
        try {
            console.log('UI module: Initializing...');
            
            // Cache UI elements
            this.cacheElements();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Debug log all found elements
            this.logFoundElements();
            
            this.initialized = true;
            console.log('UI module: Initialization complete');
            return true;
        } catch (error) {
            console.error('UI initialization error:', error);
            return false;
        }
    }
    
    cacheElements() {
        // Find container elements
        this.elements.controls = document.getElementById(this.config.controlsId);
        
        // Main control buttons
        this.elements.geometryBtn = document.getElementById('geometryButton');
        this.elements.axisBtn = document.getElementById('axisButton');
        this.elements.harmonicBtn = document.getElementById('harmonicButton');
        this.elements.wavelengthBtn = document.getElementById('wavelengthButton');
        this.elements.resetAngleBtn = document.getElementById('resetAngleButton');
        this.elements.animationBtn = document.getElementById('animationButton');
        this.elements.toggleBtn = document.getElementById('toggleButton');
        
        // Main controls
        this.elements.axis = document.getElementById('axis');
        this.elements.coordinateSystem = document.getElementById('coordinateSystem');
        this.elements.harmonics = document.getElementById('harmonics');
        this.elements.harmonicsType = document.getElementById('harmonicsType');
        this.elements.harmonicsPhase = document.getElementById('harmonicsPhase');
        this.elements.wavelength = document.getElementById('wavelength');
        this.elements.rotationAngle = document.getElementById('rotationAngleInput');
        this.elements.rotationSpeed = document.getElementById('rotationSpeedInput');
        this.elements.rotationSpeedSlider = document.getElementById('rotationSpeedSlider');
        this.elements.zoomManual = document.getElementById('zoomManual');
        
        // Shape controls
        this.elements.showAxis = document.getElementById('showAxis');
        this.elements.axisColor = document.getElementById('AxisColor');
        this.elements.showCircle = document.getElementById('showCircle');
        this.elements.circleColor = document.getElementById('circleColor');
        this.elements.showHex = document.getElementById('showHex');
        this.elements.hexColor = document.getElementById('hexColor');
        this.elements.showHexIn = document.getElementById('showHexIn');
        this.elements.hexInColor = document.getElementById('hexInColor');
        this.elements.showSquare = document.getElementById('showSquare');
        this.elements.squareColor = document.getElementById('squareColor');
        this.elements.showSquareIn = document.getElementById('showSquareIn');
        this.elements.squareInColor = document.getElementById('squareInColor');
        this.elements.showWave = document.getElementById('showWave');
        this.elements.waveColor = document.getElementById('waveColor');
        this.elements.showTriangle = document.getElementById('showTriangle');
        this.elements.triangleColor = document.getElementById('triangleColor');
        this.elements.canvasBackgroundColor = document.getElementById('canvasBackgroundColor');
        this.elements.gridColor = document.getElementById('gridColor');
        
        // Calculator controls
        this.elements.calcFrequency = document.getElementById('calcFrequency');
        this.elements.calcKeyStepSelection = document.getElementById('calcKeyStepSelection');
        this.elements.calcKeyStepFactor = document.getElementById('calcKeyStepFactor');
        
        // Audio controls
        this.elements.playAddSynth = document.getElementById('playAddSynth');
        this.elements.addSynthVolume = document.getElementById('addSynthVolume');
        this.elements.addSynthAttack = document.getElementById('addSynthAttack');
        this.elements.addSynthDecay = document.getElementById('addSynthDecay');
        this.elements.addSynthOscType = document.getElementById('addSynthOscType');
        
        // Export and utility controls
        this.elements.fullscreenBtn = document.getElementById('fullscreenButton');
        this.elements.exportFormat = document.getElementById('exportFormat');
        this.elements.exportBtn = document.getElementById('exportButton');
        this.elements.saveBtn = document.getElementById('saveButton');
        this.elements.loadBtn = document.getElementById('loadButton');
        this.elements.licenseBtn = document.getElementById('licenseButton');
        
        // Status elements
        this.elements.animationStatus = document.getElementById('animationStatus');
        this.elements.metricsPanel = document.getElementById('metricsPanel');
        this.elements.debugPanel = document.getElementById('debugPanel');
        
        // Additional controls from reference
        this.elements.showHarmonicRepresentation = document.getElementById('showHarmonicRepresentation');
        this.elements.showWaveformCalculation = document.getElementById('showWaveformCalculation');
        this.elements.showSpectrum = document.getElementById('showSpectrum');
        this.elements.baseFrequency = document.getElementById('baseFrequency');
        this.elements.keyStepSelection = document.getElementById('keyStepSelection');
        this.elements.keyStepFactor = document.getElementById('keyStepFactor');
        this.elements.exportQuality = document.getElementById('exportQuality');
        this.elements.exportScale = document.getElementById('exportScale');
        this.elements.showMetrics = document.getElementById('showMetrics');
        this.elements.showDebug = document.getElementById('showDebug');
        
        // Harmonic type selection
        this.elements.harmonicTypeSelector = document.getElementById('harmonicTypeSelector');
        if (this.elements.harmonicTypeSelector) {
            // Clear existing options
            this.elements.harmonicTypeSelector.innerHTML = '';
            
            // Add options from the harmonic types array
            this.HARMONIC_TYPES.forEach(type => {
                const option = document.createElement('option');
                option.value = type.value;
                option.textContent = type.label;
                this.elements.harmonicTypeSelector.appendChild(option);
            });
        }
        
        // Audio visualization controls
        this.elements.spectrumScale = document.getElementById('spectrumScale');
        this.elements.spectrumSmoothing = document.getElementById('spectrumSmoothing');
        this.elements.peakThreshold = document.getElementById('peakThreshold');
        
        // Advanced harmonic controls
        this.elements.harmonicAmplitude = document.getElementById('harmonicAmplitude');
        this.elements.harmonicDetune = document.getElementById('harmonicDetune');
        this.elements.harmonicSpread = document.getElementById('harmonicSpread');
        this.elements.harmonicBlend = document.getElementById('harmonicBlend');
        
        // Waveform visualization controls
        this.elements.waveformResolution = document.getElementById('waveformResolution');
        this.elements.waveformThickness = document.getElementById('waveformThickness');
        this.elements.waveformOpacity = document.getElementById('waveformOpacity');
        this.elements.showWaveformPoints = document.getElementById('showWaveformPoints');
        
        // Performance controls
        this.elements.targetFPS = document.getElementById('targetFPS');
        this.elements.qualityPreset = document.getElementById('qualityPreset');
        this.elements.enableVSync = document.getElementById('enableVSync');
        this.elements.useWorker = document.getElementById('useWorker');
        
        // Sweep tone controls
        this.elements.sweepStart = document.getElementById('sweepStart');
        this.elements.sweepEnd = document.getElementById('sweepEnd');
        this.elements.sweepDuration = document.getElementById('sweepDuration');
        this.elements.sweepType = document.getElementById('sweepType');
        this.elements.playSweep = document.getElementById('playSweep');
        
        // Spectrum analyzer advanced options
        this.elements.spectrumMaxFreq = document.getElementById('spectrumMaxFreq');
        this.elements.spectrumLogScale = document.getElementById('spectrumLogScale');
        this.elements.spectrumShowPeaks = document.getElementById('spectrumShowPeaks');
        this.elements.spectrumColorMode = document.getElementById('spectrumColorMode');
        
        // Export preset controls
        this.elements.exportPreset = document.getElementById('exportPreset');
        this.elements.exportWidth = document.getElementById('exportWidth');
        this.elements.exportHeight = document.getElementById('exportHeight');
        this.elements.exportBackground = document.getElementById('exportBackground');
        
        // Waveform sampling controls
        this.elements.samplingMode = document.getElementById('samplingMode');
        this.elements.aliasingSuppression = document.getElementById('aliasingSuppression');
        this.elements.interpolationMethod = document.getElementById('interpolationMethod');
    }
    
    setupEventListeners() {
        if (!this.elements.controls) return;
        
        // Modal buttons
        this.setupModalButton(this.elements.geometryBtn, 'geometryModal');
        this.setupModalButton(this.elements.wavelengthBtn, 'calculatorModal');
        this.setupModalButton(this.elements.harmonicBtn, 'addSynthModal');
        
        // Main control buttons
        this.setupToggleButton(this.elements.toggleBtn);
        this.setupResetButton(this.elements.resetAngleBtn);
        
        // Coordinate system and axis controls
        this.setupNumberInput(this.elements.axis, null, 'axisCount', 1, 1024);
        this.setupSelectInput(this.elements.coordinateSystem, 'coordinateSystem');
        
        // Harmonic controls
        this.setupNumberInput(this.elements.harmonics, null, 'harmonicCount', 1, 64);
        this.setupSelectInput(this.elements.harmonicsType, 'harmonicType');
        this.setupSelectInput(this.elements.harmonicsPhase, 'harmonicPhase');
        
        // Wavelength and rotation controls
        this.setupNumberInput(this.elements.wavelength, null, 'wavelength', 0.1, 1024, this.DECIMALS_WAVELENGTH);
        this.setupNumberInput(this.elements.rotationAngle, this.elements.rotationSpeedSlider, 'rotation', -6.28, 6.28, this.DECIMALS_ANGLE);
        this.setupNumberInput(this.elements.rotationSpeed, this.elements.rotationSpeedSlider, 'speed', -128, 128, this.DECIMALS_SPEED);
        
        // Shape controls
        this.setupShapeControls();
        
        // Calculator controls
        this.setupCalculatorControls();
        
        // Audio controls
        this.setupAudioControls();
        
        // Export and utility controls
        this.setupExportControls();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Additional event listeners from reference
        this.setupVisualizationControls();
        this.setupFrequencyControls();
        this.setupDebugControls();
        
        // Window events
        window.addEventListener('resize', () => this.core.handleResize());
        window.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
        
        // New event listener for gridColor
        if (this.elements.gridColor) {
            this.elements.gridColor.addEventListener('input', () => {
                this.core.updateState({ gridColor: this.elements.gridColor.value });
            });
        }
        
        // Audio visualization controls
        if (this.elements.spectrumScale) {
            this.elements.spectrumScale.addEventListener('input', () => {
                this.core.updateState({ spectrumScale: parseFloat(this.elements.spectrumScale.value) });
            });
        }
        
        if (this.elements.spectrumSmoothing) {
            this.elements.spectrumSmoothing.addEventListener('input', () => {
                this.core.updateState({ spectrumSmoothing: parseFloat(this.elements.spectrumSmoothing.value) });
            });
        }
        
        if (this.elements.peakThreshold) {
            this.elements.peakThreshold.addEventListener('input', () => {
                this.core.updateState({ peakThreshold: parseFloat(this.elements.peakThreshold.value) });
            });
        }
        
        // Advanced harmonic controls
        if (this.elements.harmonicAmplitude) {
            this.elements.harmonicAmplitude.addEventListener('input', () => {
                this.core.updateState({ harmonicAmplitude: parseFloat(this.elements.harmonicAmplitude.value) });
            });
        }
        
        if (this.elements.harmonicDetune) {
            this.elements.harmonicDetune.addEventListener('input', () => {
                this.core.updateState({ harmonicDetune: parseFloat(this.elements.harmonicDetune.value) });
            });
        }
        
        if (this.elements.harmonicSpread) {
            this.elements.harmonicSpread.addEventListener('input', () => {
                this.core.updateState({ harmonicSpread: parseFloat(this.elements.harmonicSpread.value) });
            });
        }
        
        if (this.elements.harmonicBlend) {
            this.elements.harmonicBlend.addEventListener('input', () => {
                this.core.updateState({ harmonicBlend: parseFloat(this.elements.harmonicBlend.value) });
            });
        }
        
        // Waveform visualization controls
        if (this.elements.waveformResolution) {
            this.elements.waveformResolution.addEventListener('change', () => {
                this.core.updateState({ waveformResolution: parseInt(this.elements.waveformResolution.value) });
            });
        }
        
        if (this.elements.waveformThickness) {
            this.elements.waveformThickness.addEventListener('input', () => {
                this.core.updateState({ waveformThickness: parseFloat(this.elements.waveformThickness.value) });
            });
        }
        
        if (this.elements.waveformOpacity) {
            this.elements.waveformOpacity.addEventListener('input', () => {
                this.core.updateState({ waveformOpacity: parseFloat(this.elements.waveformOpacity.value) });
            });
        }
        
        if (this.elements.showWaveformPoints) {
            this.elements.showWaveformPoints.addEventListener('change', () => {
                this.core.updateState({ showWaveformPoints: this.elements.showWaveformPoints.checked });
            });
        }
        
        // Performance controls
        if (this.elements.targetFPS) {
            this.elements.targetFPS.addEventListener('change', () => {
                this.core.updateState({ targetFPS: parseInt(this.elements.targetFPS.value) });
            });
        }
        
        if (this.elements.qualityPreset) {
            this.elements.qualityPreset.addEventListener('change', () => {
                this.applyQualityPreset(this.elements.qualityPreset.value);
            });
        }
        
        if (this.elements.enableVSync) {
            this.elements.enableVSync.addEventListener('change', () => {
                this.core.updateState({ enableVSync: this.elements.enableVSync.checked });
            });
        }
        
        if (this.elements.useWorker) {
            this.elements.useWorker.addEventListener('change', () => {
                this.core.updateState({ useWorker: this.elements.useWorker.checked });
            });
        }
    }
    
    setupModalButton(button, modalId) {
        if (!button) return;
        
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        button.addEventListener('click', () => {
            modal.style.display = 'block';
        });
        
        const closeBtn = modal.querySelector('button[onclick*="toggleModal"]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    setupShapeControls() {
        const shapeControls = [
            { show: this.elements.showAxis, color: this.elements.axisColor, key: 'axis' },
            { show: this.elements.showCircle, color: this.elements.circleColor, key: 'circle' },
            { show: this.elements.showHex, color: this.elements.hexColor, key: 'hexagon' },
            { show: this.elements.showHexIn, color: this.elements.hexInColor, key: 'hexagonIn' },
            { show: this.elements.showSquare, color: this.elements.squareColor, key: 'square' },
            { show: this.elements.showSquareIn, color: this.elements.squareInColor, key: 'squareIn' },
            { show: this.elements.showWave, color: this.elements.waveColor, key: 'wave' },
            { show: this.elements.showTriangle, color: this.elements.triangleColor, key: 'triangle' }
        ];
        
        shapeControls.forEach(control => {
            if (control.show) {
                control.show.addEventListener('change', () => {
                    const update = { shapes: {} };
                    update.shapes[control.key] = { show: control.show.checked };
                    this.core.updateState(update);
                });
            }
            
            if (control.color) {
                control.color.addEventListener('input', () => {
                    const update = { shapes: {} };
                    update.shapes[control.key] = { color: control.color.value };
                    this.core.updateState(update);
                });
            }
        });
        
        if (this.elements.canvasBackgroundColor) {
            this.elements.canvasBackgroundColor.addEventListener('input', () => {
                this.core.updateState({ backgroundColor: this.elements.canvasBackgroundColor.value });
            });
        }
    }
    
    setupCalculatorControls() {
        if (this.elements.calcFrequency) {
            this.elements.calcFrequency.addEventListener('change', () => {
                const frequency = parseFloat(this.elements.calcFrequency.value);
                if (!isNaN(frequency)) {
                    const wavelength = this.calculateWavelength(frequency);
                    this.elements.wavelength.value = wavelength.toFixed(this.DECIMALS_WAVELENGTH);
                    this.core.updateState({ wavelength });
                }
            });
        }
        
        if (this.elements.calcKeyStepSelection) {
            this.elements.calcKeyStepSelection.addEventListener('change', () => {
                const factor = this.getKeyStepFactor(this.elements.calcKeyStepSelection.value);
                if (this.elements.calcKeyStepFactor) {
                    this.elements.calcKeyStepFactor.value = factor;
                }
            });
        }
        
        if (this.elements.calcKeyStepFactor) {
            this.elements.calcKeyStepFactor.addEventListener('input', () => {
                const factor = parseFloat(this.elements.calcKeyStepFactor.value);
                if (!isNaN(factor)) {
                    this.elements.calcKeyStepSelection.value = 'custom';
                }
            });
        }
    }
    
    setupAudioControls() {
        if (this.elements.playAddSynth) {
            this.elements.playAddSynth.addEventListener('change', () => {
                this.core.updateState({ audioEnabled: this.elements.playAddSynth.checked });
            });
        }
        
        const audioControls = [
            { element: this.elements.addSynthVolume, key: 'audioVolume' },
            { element: this.elements.addSynthAttack, key: 'audioAttack' },
            { element: this.elements.addSynthDecay, key: 'audioDecay' }
        ];
        
        audioControls.forEach(control => {
            if (control.element) {
                control.element.addEventListener('input', () => {
                    const update = {};
                    update[control.key] = parseFloat(control.element.value);
                    this.core.updateState(update);
                });
            }
        });
        
        if (this.elements.addSynthOscType) {
            this.elements.addSynthOscType.addEventListener('change', () => {
                this.core.updateState({ oscillatorType: this.elements.addSynthOscType.value });
            });
        }
        
        // Add audio playback controls
        const playSequence = document.getElementById('playSequence');
        if (playSequence) {
            playSequence.addEventListener('click', () => {
                const audio = this.core.getModule('audio');
                if (audio && audio.playHarmonicSequence) {
                    audio.playHarmonicSequence();
                }
            });
        }
        
        const playChord = document.getElementById('playChord');
        if (playChord) {
            playChord.addEventListener('click', () => {
                const audio = this.core.getModule('audio');
                if (audio && audio.playHarmonicChord) {
                    audio.playHarmonicChord();
                }
            });
        }
        
        const playWaveform = document.getElementById('playWaveform');
        if (playWaveform) {
            playWaveform.addEventListener('click', () => {
                const audio = this.core.getModule('audio');
                if (audio && audio.playWaveformBuffer) {
                    audio.playWaveformBuffer();
                }
            });
        }
        
        // Sweep tone controls
        if (this.elements.sweepStart) {
            this.elements.sweepStart.addEventListener('input', () => {
                this.core.updateState({ sweepStart: parseFloat(this.elements.sweepStart.value) });
            });
        }
        
        if (this.elements.sweepEnd) {
            this.elements.sweepEnd.addEventListener('input', () => {
                this.core.updateState({ sweepEnd: parseFloat(this.elements.sweepEnd.value) });
            });
        }
        
        if (this.elements.sweepDuration) {
            this.elements.sweepDuration.addEventListener('input', () => {
                this.core.updateState({ sweepDuration: parseFloat(this.elements.sweepDuration.value) });
            });
        }
        
        if (this.elements.sweepType) {
            this.elements.sweepType.addEventListener('change', () => {
                this.core.updateState({ sweepType: this.elements.sweepType.value });
            });
        }
        
        if (this.elements.playSweep) {
            this.elements.playSweep.addEventListener('click', () => {
                const audio = this.core.getModule('audio');
                if (audio && audio.playSweepTone) {
                    audio.playSweepTone(
                        this.core.state.sweepStart, 
                        this.core.state.sweepEnd, 
                        this.core.state.sweepDuration, 
                        this.core.state.sweepType
                    );
                }
            });
        }
    }
    
    setupExportControls() {
        if (this.elements.fullscreenBtn) {
            this.elements.fullscreenBtn.addEventListener('click', () => {
                const container = document.querySelector(`.${this.core.config.containerId}`);
                if (container) {
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        container.requestFullscreen();
                    }
                }
            });
        }
        
        if (this.elements.exportBtn && this.elements.exportFormat) {
            this.elements.exportBtn.addEventListener('click', () => {
                this.core.exportCanvas(this.elements.exportFormat.value);
            });
        }
        
        if (this.elements.saveBtn) {
            this.elements.saveBtn.addEventListener('click', () => this.saveSettings());
        }
        
        if (this.elements.loadBtn) {
            this.elements.loadBtn.addEventListener('click', () => this.loadSettings());
        }
        
        if (this.elements.exportQuality) {
            this.elements.exportQuality.addEventListener('input', () => {
                this.core.updateState({ exportQuality: parseFloat(this.elements.exportQuality.value) });
            });
        }
        
        if (this.elements.exportScale) {
            this.elements.exportScale.addEventListener('input', () => {
                this.core.updateState({ exportScale: parseFloat(this.elements.exportScale.value) });
            });
        }
        
        // Export preset controls
        if (this.elements.exportPreset) {
            this.elements.exportPreset.addEventListener('change', () => {
                this.applyExportPreset(this.elements.exportPreset.value);
            });
        }
        
        if (this.elements.exportWidth) {
            this.elements.exportWidth.addEventListener('input', () => {
                this.core.updateState({ exportWidth: parseInt(this.elements.exportWidth.value) });
            });
        }
        
        if (this.elements.exportHeight) {
            this.elements.exportHeight.addEventListener('input', () => {
                this.core.updateState({ exportHeight: parseInt(this.elements.exportHeight.value) });
            });
        }
        
        if (this.elements.exportBackground) {
            this.elements.exportBackground.addEventListener('input', () => {
                this.core.updateState({ exportBackground: this.elements.exportBackground.checked });
            });
        }
    }
    
    setupKeyboardShortcuts() {
        window.addEventListener('keydown', (event) => {
            if (event.target.tagName === 'INPUT') return;
            
            const shortcuts = {
                'Space': () => {
                    event.preventDefault();
                    this.core.toggleAnimation();
                },
                'KeyA': () => this.core.updateState({ audioEnabled: !this.core.state.audioEnabled }),
                'KeyG': () => this.core.updateState({ showGeometry: !this.core.state.showGeometry }),
                'KeyW': () => this.core.updateState({ showWaveform: !this.core.state.showWaveform }),
                'KeyH': () => this.core.updateState({ showHarmonicRepresentation: !this.core.state.showHarmonicRepresentation }),
                'KeyC': () => this.core.updateState({ showWaveformCalculation: !this.core.state.showWaveformCalculation }),
                'KeyR': () => this.resetToDefaults(),
                'KeyM': () => this.core.updateState({ showMetrics: !this.core.state.showMetrics }),
                'KeyD': () => this.core.updateState({ showDebug: !this.core.state.showDebug }),
                'Digit0': () => this.core.updateState({ rotation: 0, speed: 0 })
            };
            
            if (shortcuts[event.code]) {
                shortcuts[event.code]();
            }
        });
    }
    
    setupVisualizationControls() {
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
        
        if (this.elements.showSpectrum) {
            this.elements.showSpectrum.addEventListener('change', () => {
                this.core.updateState({ showSpectrum: this.elements.showSpectrum.checked });
            });
        }
        
        // Visualization presets
        const visualPresets = document.getElementById('visualPresets');
        if (visualPresets) {
            visualPresets.addEventListener('change', () => {
                const preset = visualPresets.value;
                
                switch (preset) {
                    case 'circle':
                        this.core.updateState({
                            shapes: {
                                circle: { show: true },
                                hexagon: { show: false },
                                hexagonIn: { show: false },
                                square: { show: false },
                                squareIn: { show: false },
                                triangle: { show: false }
                            }
                        });
                        break;
                    case 'hex':
                        this.core.updateState({
                            shapes: {
                                circle: { show: false },
                                hexagon: { show: true },
                                hexagonIn: { show: true },
                                square: { show: false },
                                squareIn: { show: false },
                                triangle: { show: false }
                            }
                        });
                        break;
                    case 'square':
                        this.core.updateState({
                            shapes: {
                                circle: { show: false },
                                hexagon: { show: false },
                                hexagonIn: { show: false },
                                square: { show: true },
                                squareIn: { show: true },
                                triangle: { show: false }
                            }
                        });
                        break;
                    case 'all':
                        this.core.updateState({
                            shapes: {
                                circle: { show: true },
                                hexagon: { show: true },
                                hexagonIn: { show: true },
                                square: { show: true },
                                squareIn: { show: true },
                                triangle: { show: true }
                            }
                        });
                        break;
                }
            });
        }
        
        // Spectrum analyzer advanced controls
        if (this.elements.spectrumMaxFreq) {
            this.elements.spectrumMaxFreq.addEventListener('change', () => {
                this.core.updateState({ spectrumMaxFreq: parseInt(this.elements.spectrumMaxFreq.value) });
            });
        }
        
        if (this.elements.spectrumLogScale) {
            this.elements.spectrumLogScale.addEventListener('change', () => {
                this.core.updateState({ spectrumLogScale: this.elements.spectrumLogScale.checked });
            });
        }
        
        if (this.elements.spectrumShowPeaks) {
            this.elements.spectrumShowPeaks.addEventListener('change', () => {
                this.core.updateState({ spectrumShowPeaks: this.elements.spectrumShowPeaks.checked });
            });
        }
        
        if (this.elements.spectrumColorMode) {
            this.elements.spectrumColorMode.addEventListener('change', () => {
                this.core.updateState({ spectrumColorMode: this.elements.spectrumColorMode.value });
            });
        }
        
        // Waveform sampling controls
        if (this.elements.samplingMode) {
            this.elements.samplingMode.addEventListener('change', () => {
                this.core.updateState({ samplingMode: this.elements.samplingMode.value });
            });
        }
        
        if (this.elements.aliasingSuppression) {
            this.elements.aliasingSuppression.addEventListener('change', () => {
                this.core.updateState({ aliasingSuppression: this.elements.aliasingSuppression.checked });
            });
        }
        
        if (this.elements.interpolationMethod) {
            this.elements.interpolationMethod.addEventListener('change', () => {
                this.core.updateState({ interpolationMethod: this.elements.interpolationMethod.value });
            });
        }
    }
    
    setupFrequencyControls() {
        if (this.elements.baseFrequency) {
            this.elements.baseFrequency.addEventListener('input', () => {
                const freq = parseFloat(this.elements.baseFrequency.value);
                if (!isNaN(freq)) {
                    this.core.updateState({ baseFrequency: freq });
                }
            });
        }
        
        if (this.elements.keyStepSelection) {
            this.elements.keyStepSelection.addEventListener('change', () => {
                const factor = this.getKeyStepFactor(this.elements.keyStepSelection.value);
                if (this.elements.keyStepFactor) {
                    this.elements.keyStepFactor.value = factor.toFixed(4);
                }
                this.updateFrequency(factor);
            });
        }
        
        if (this.elements.keyStepFactor) {
            this.elements.keyStepFactor.addEventListener('input', () => {
                const factor = parseFloat(this.elements.keyStepFactor.value);
                if (!isNaN(factor)) {
                    this.elements.keyStepSelection.value = 'custom';
                    this.updateFrequency(factor);
                }
            });
        }
    }
    
    setupDebugControls() {
        if (this.elements.showMetrics) {
            this.elements.showMetrics.addEventListener('change', () => {
                this.core.updateState({ showMetrics: this.elements.showMetrics.checked });
                this.updateMetricsVisibility();
            });
        }
        
        if (this.elements.showDebug) {
            this.elements.showDebug.addEventListener('change', () => {
                this.core.updateState({ showDebug: this.elements.showDebug.checked });
                this.updateDebugVisibility();
            });
        }
    }
    
    // Helper methods
    calculateWavelength(frequency) {
        return 343.2 / frequency; // Speed of sound in air at 20°C
    }
    
    getKeyStepFactor(selection) {
        const factors = {
            'octave': 2,
            'fifth': 1.5,
            'fourth': 1.333,
            'major': 1.125,
            'minor': 1.0667,
            'custom': parseFloat(this.elements.keyStepFactor?.value || '1')
        };
        return factors[selection] || 1;
    }
    
    updateFrequency(factor) {
        const currentFreq = this.core.state.baseFrequency;
        const newFreq = currentFreq * factor;
        if (newFreq >= 20 && newFreq <= 20000) { // Keep within audible range
            this.core.updateState({ baseFrequency: newFreq });
        }
    }
    
    updateMetricsVisibility() {
        if (this.elements.metricsPanel) {
            this.elements.metricsPanel.style.display = 
                this.core.state.showMetrics ? 'block' : 'none';
        }
    }
    
    updateDebugVisibility() {
        if (this.elements.debugPanel) {
            this.elements.debugPanel.style.display = 
                this.core.state.showDebug ? 'block' : 'none';
        }
    }
    
    resetToDefaults() {
        this.core.updateState({
            isRunning: false,
            showGeometry: true,
            showWaveform: true,
            showHarmonicRepresentation: false,
            showWaveformCalculation: false,
            showSpectrum: false,
            audioEnabled: false,
            axisCount: 6,
            harmonicCount: 8,
            wavelength: 6,
            rotation: 0,
            speed: 0,
            zoom: 1,
            baseFrequency: 440,
            audioVolume: this.AUDIO_DEFAULTS.volume,
            audioAttack: this.AUDIO_DEFAULTS.attack,
            audioDecay: this.AUDIO_DEFAULTS.decay,
            oscillatorType: this.AUDIO_DEFAULTS.oscillatorType,
            shapes: {
                circle: { show: true, color: '#4CAF50' },
                hexagon: { show: true, color: '#2196F3' },
                hexagonIn: { show: true, color: '#2196F3' },
                square: { show: true, color: '#FF5722' },
                squareIn: { show: true, color: '#FF9800' },
                triangle: { show: false, color: '#FFC107' },
                wave: { show: true, color: '#00BCD4' }
            },
            harmonicType: 'natural',
            harmonicPhase: 'phaseFull',
            coordinateSystem: 'radial',
            backgroundColor: '#000000',
            gridColor: '#333333',
            showMetrics: false,
            showDebug: false,
            exportQuality: 1,
            exportScale: 1,
            
            // Audio visualization defaults
            spectrumScale: 1.0,
            spectrumSmoothing: 0.7,
            peakThreshold: 0.5,
            
            // Advanced harmonic defaults
            harmonicAmplitude: 1.0,
            harmonicDetune: 0,
            harmonicSpread: 0,
            harmonicBlend: 0.5,
            
            // Waveform visualization defaults
            waveformResolution: 1000,
            waveformThickness: 2,
            waveformOpacity: 1.0,
            showWaveformPoints: false,
            
            // Performance defaults
            targetFPS: 60,
            enableVSync: true,
            useWorker: true,
            
            // Sweep tone defaults
            sweepStart: 220,
            sweepEnd: 880,
            sweepDuration: 1.0,
            sweepType: 'linear',
            
            // Spectrum analyzer additional defaults
            spectrumMaxFreq: 8000,
            spectrumLogScale: true,
            spectrumShowPeaks: true,
            spectrumColorMode: 'gradient',
            
            // Export preset defaults
            exportWidth: 1280,
            exportHeight: 720,
            exportBackground: true,
            
            // Waveform sampling defaults
            samplingMode: 'uniform',
            aliasingSuppression: true,
            interpolationMethod: 'linear'
        });
        
        this.core.stop();
        this.updateMetricsVisibility();
        this.updateDebugVisibility();
        this.core.logDebug('Reset to defaults');
    }
    
    onStateUpdate(state) {
        // UI updates are handled by the core's updateUI method
    }
    
    onResize(width, height) {
        // Nothing to do for UI resize
    }
    
    // Save current application settings to a file
    async saveSettings() {
        try {
            // Get all settings
            const settings = this.getAppSettings();
            
            // Create blob and download
            const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'HarmonicXplorer-Settings.json';
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            this.core.logDebug(`Save settings error: ${error.message}`);
        }
    }
    
    // Load settings from a file
    loadSettings() {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = (event) => {
                const file = event.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const settings = JSON.parse(e.target.result);
                        this.applySettings(settings);
                    } catch (error) {
                        this.core.logDebug(`Parse settings error: ${error.message}`);
                    }
                };
                reader.readAsText(file);
            };
            
            input.click();
        } catch (error) {
            this.core.logDebug(`Load settings error: ${error.message}`);
        }
    }
    
    // Get all current application settings
    getAppSettings() {
        return {
            // Basic settings
            zoom: this.core.state.zoom,
            wavelength: this.core.state.wavelength,
            axisCount: this.core.state.axisCount,
            coordinateSystem: this.core.state.coordinateSystem,
            harmonicCount: this.core.state.harmonicCount,
            harmonicType: this.core.state.harmonicType,
            harmonicPhase: this.core.state.harmonicPhase,
            rotation: this.core.state.rotation,
            speed: this.core.state.speed,
            showAxis: this.core.state.showAxis,
            axisColor: this.core.state.axisColor,
            
            // Shapes
            shapes: this.core.state.shapes,
            
            // Colors
            backgroundColor: this.core.state.backgroundColor,
            waveformColor: this.core.state.waveformColor,
            
            // Audio
            audioEnabled: this.core.state.audioEnabled,
            baseFrequency: this.core.state.baseFrequency,
            audioVolume: this.core.state.audioVolume,
            audioAttack: this.core.state.audioAttack,
            audioDecay: this.core.state.audioDecay,
            oscillatorType: this.core.state.oscillatorType,
            
            // Display options
            showGeometry: this.core.state.showGeometry,
            showWaveform: this.core.state.showWaveform,
            showHarmonicRepresentation: this.core.state.showHarmonicRepresentation,
            showWaveformCalculation: this.core.state.showWaveformCalculation,
            
            // Export options
            exportQuality: this.core.state.exportQuality,
            exportScale: this.core.state.exportScale,
            
            // Metrics
            showMetrics: this.core.state.showMetrics,
            showDebug: this.core.state.showDebug,
            
            // Audio visualization settings
            spectrumScale: this.core.state.spectrumScale,
            spectrumSmoothing: this.core.state.spectrumSmoothing,
            peakThreshold: this.core.state.peakThreshold,
            
            // Advanced harmonic settings
            harmonicAmplitude: this.core.state.harmonicAmplitude,
            harmonicDetune: this.core.state.harmonicDetune,
            harmonicSpread: this.core.state.harmonicSpread,
            harmonicBlend: this.core.state.harmonicBlend,
            
            // Waveform visualization settings
            waveformResolution: this.core.state.waveformResolution,
            waveformThickness: this.core.state.waveformThickness,
            waveformOpacity: this.core.state.waveformOpacity,
            showWaveformPoints: this.core.state.showWaveformPoints,
            
            // Performance settings
            targetFPS: this.core.state.targetFPS,
            enableVSync: this.core.state.enableVSync,
            useWorker: this.core.state.useWorker,
            
            // Sweep tone settings
            sweepStart: this.core.state.sweepStart,
            sweepEnd: this.core.state.sweepEnd,
            sweepDuration: this.core.state.sweepDuration,
            sweepType: this.core.state.sweepType,
            
            // Spectrum analyzer additional settings
            spectrumMaxFreq: this.core.state.spectrumMaxFreq,
            spectrumLogScale: this.core.state.spectrumLogScale,
            spectrumShowPeaks: this.core.state.spectrumShowPeaks,
            spectrumColorMode: this.core.state.spectrumColorMode,
            
            // Export preset settings
            exportWidth: this.core.state.exportWidth,
            exportHeight: this.core.state.exportHeight,
            exportBackground: this.core.state.exportBackground,
            
            // Waveform sampling settings
            samplingMode: this.core.state.samplingMode,
            aliasingSuppression: this.core.state.aliasingSuppression,
            interpolationMethod: this.core.state.interpolationMethod
        };
    }
    
    // Apply loaded settings to the application
    applySettings(settings) {
        try {
            // Update application state with loaded settings
            this.core.updateState(settings);
            
            // Update UI elements to reflect the new state
            this.updateUI(settings);
            
            this.core.logDebug('Settings applied successfully');
        } catch (error) {
            this.core.logDebug(`Apply settings error: ${error.message}`);
        }
    }
    
    applyQualityPreset(preset) {
        const presets = {
            low: {
                waveformResolution: 500,
                spectrumSmoothing: 0.5,
                showWaveformPoints: false,
                useWorker: false
            },
            medium: {
                waveformResolution: 1000,
                spectrumSmoothing: 0.7,
                showWaveformPoints: false,
                useWorker: true
            },
            high: {
                waveformResolution: 2000,
                spectrumSmoothing: 0.8,
                showWaveformPoints: true,
                useWorker: true
            }
        };
        
        if (presets[preset]) {
            this.core.updateState(presets[preset]);
        }
    }
    
    applyExportPreset(preset) {
        const presets = {
            'instagram': { exportWidth: 1080, exportHeight: 1080, exportScale: 2, exportQuality: 0.9 },
            'twitter': { exportWidth: 1200, exportHeight: 675, exportScale: 1.5, exportQuality: 0.85 },
            'desktop': { exportWidth: 1920, exportHeight: 1080, exportScale: 1, exportQuality: 1.0 },
            'print': { exportWidth: 3000, exportHeight: 2000, exportScale: 3, exportQuality: 1.0 }
        };
        
        if (presets[preset]) {
            this.core.updateState(presets[preset]);
        }
    }
    
    // Helper method to log which UI elements were found
    logFoundElements() {
        console.log('UI Elements found:');
        const foundElements = [];
        const nullElements = [];
        
        for (const [key, element] of Object.entries(this.elements)) {
            if (element) {
                foundElements.push(key);
            } else {
                nullElements.push(key);
            }
        }
        
        console.log('Found:', foundElements.join(', '));
        if (nullElements.length > 0) {
            console.warn('Missing elements:', nullElements.join(', '));
        }
    }
    
    // Helper method to safely set up event listeners
    setupNumberInput(input, slider, stateKey, min, max, decimals = 0) {
        if (!input) {
            console.warn(`Missing number input for ${stateKey}`);
            return;
        }
        
        console.log(`Setting up number input for ${stateKey}`);
        
        input.addEventListener('input', () => {
            let value = parseFloat(input.value);
            if (isNaN(value)) return;
            
            // Clamp value between min and max
            value = Math.max(min, Math.min(max, value));
            
            // Round to the specified number of decimal places
            if (decimals > 0) {
                const factor = Math.pow(10, decimals);
                value = Math.round(value * factor) / factor;
            } else {
                value = Math.round(value);
            }
            
            // Update input if value changed
            if (value !== parseFloat(input.value)) {
                input.value = value.toFixed(decimals);
            }
            
            // Update slider if one exists
            if (slider) {
                const sliderValue = value * ((stateKey === 'rotation' || stateKey === 'speed') ? 100 : 1);
                if (parseFloat(slider.value) !== sliderValue) {
                    slider.value = sliderValue;
                }
            }
            
            // Update application state
            const update = {};
            update[stateKey] = value;
            this.core.updateState(update);
        });
        
        // Add change event for when input loses focus or enter is pressed
        input.addEventListener('change', () => {
            let value = parseFloat(input.value);
            if (isNaN(value)) {
                // Reset to default if invalid
                value = this.core.state[stateKey] || 0;
                input.value = value.toFixed(decimals);
            }
        });
        
        // Set up slider if one exists
        if (slider) {
            slider.addEventListener('input', () => {
                const value = parseFloat(slider.value) / ((stateKey === 'rotation' || stateKey === 'speed') ? 100 : 1);
                input.value = value.toFixed(decimals);
                
                const update = {};
                update[stateKey] = value;
                this.core.updateState(update);
            });
        }
    }
    
    setupSelectInput(select, stateKey) {
        if (!select) {
            console.warn(`Missing select input for ${stateKey}`);
            return;
        }
        
        console.log(`Setting up select input for ${stateKey}`);
        
        select.addEventListener('change', () => {
            const update = {};
            update[stateKey] = select.value;
            this.core.updateState(update);
        });
    }
    
    setupToggleButton(button) {
        if (!button) {
            console.warn('Missing toggle button');
            return;
        }
        
        console.log('Setting up toggle button');
        
        button.addEventListener('click', () => {
            this.core.toggleAnimation();
        });
    }
    
    setupResetButton(button) {
        if (!button) {
            console.warn('Missing reset button');
            return;
        }
        
        console.log('Setting up reset button');
        
        button.addEventListener('click', () => {
            this.resetToDefaults();
        });
    }
}

// Export class for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HarmonicXplorerUI };
} else {
    window.HarmonicXplorerUI = HarmonicXplorerUI;
} 