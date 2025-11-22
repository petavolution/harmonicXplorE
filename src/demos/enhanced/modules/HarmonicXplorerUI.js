/**
 * HarmonicXplorerUI.js
 * UI module for the HarmonicXplorer NG application
 * Handles all user interface interactions and synchronizes with the core state
 */

class HarmonicXplorerUI extends HarmonicXplorerModule {
    constructor(options = {}) {
        super(options);
        
        // Container for cached DOM elements
        this.elements = {};
        
        // Container for controls organized by type
        this.controlsCache = {
            buttons: {},
            inputs: {},
            sliders: {},
            selects: {},
            colors: {},
            toggles: {},
            actions: {}
        };
        
        // List of numeric controls that should have sliders
        this.numericControls = [
            'harmonicCount',
            'axisCount',
            'wavelength',
            'rotationX',
            'rotationY',
            'rotationZ',
            'speed',
            'zoom',
            'baseFrequency',
            'audioVolume',
            'audioAttack',
            'audioDecay'
        ];
    }
    
    /**
     * Initialize the UI module
     */
    async initialize() {
        try {
            this.log('Initializing UI module');
            
            // Cache UI elements
            this.cacheElements();
            
            // Set up event listeners
            this.setupEventListeners();
            
            this.log('UI initialization complete');
            return true;
        } catch (error) {
            this.logError('UI initialization error:', error);
            throw new Error(`UI initialization failed: ${error.message}`);
        }
    }
    
    /**
     * Cache DOM elements for faster access
     */
    cacheElements() {
        try {
            // Cache toggle buttons
            const toggles = {
                'toggleHarmonics': document.getElementById('toggleHarmonics'),
                'toggleWaveform': document.getElementById('toggleWaveform'),
                'toggleGrid': document.getElementById('toggleGrid'),
                'toggleAutoRotate': document.getElementById('toggleAutoRotate'),
                'toggleAudio': document.getElementById('toggleAudio'),
                'toggleSpectrum': document.getElementById('toggleSpectrum'),
                'toggleInfo': document.getElementById('toggleInfo'),
                'toggleFPS': document.getElementById('toggleFPS')
            };
            
            // Cache numeric inputs
            const numericInputs = {};
            this.numericControls.forEach(id => {
                numericInputs[id] = document.getElementById(id);
            });
            
            // Cache sliders for numeric inputs
            const sliders = {};
            this.numericControls.forEach(id => {
                sliders[`${id}-slider`] = document.getElementById(`${id}-slider`);
            });
            
            // Cache select elements
            const selects = {
                'harmonicType': document.getElementById('harmonicType'),
                'harmonicPhase': document.getElementById('harmonicPhase'),
                'coordinateSystem': document.getElementById('coordinateSystem'),
                'oscillatorType': document.getElementById('oscillatorType'),
                'visualizationMode': document.getElementById('visualizationMode'),
                'renderQuality': document.getElementById('renderQuality')
            };
            
            // Cache color inputs
            const colors = {
                'backgroundColor': document.getElementById('backgroundColor'),
                'foregroundColor': document.getElementById('foregroundColor')
            };
            
            // Cache action buttons
            const actions = {
                'resetShape': document.getElementById('resetShape'),
                'resetColors': document.getElementById('resetColors'),
                'playSequence': document.getElementById('playSequence'),
                'playChord': document.getElementById('playChord'),
                'exportImage': document.getElementById('exportImage'),
                'exportSVG': document.getElementById('exportSVG'),
                'saveSettings': document.getElementById('saveSettings'),
                'loadSettings': document.getElementById('loadSettings')
            };
            
            // Store all cached elements
            this.controlsCache = {
                toggles,
                numericInputs,
                sliders,
                selects,
                colors,
                actions
            };
            
            // Count cached elements
            let totalElements = 0;
            Object.values(this.controlsCache).forEach(category => {
                totalElements += Object.keys(category).length;
            });
            
            this.log(`Cached ${totalElements} UI elements`);
            
            // Check for missing elements
            let missingElements = [];
            Object.entries(this.controlsCache).forEach(([category, elements]) => {
                Object.entries(elements).forEach(([id, element]) => {
                    if (!element) {
                        missingElements.push(`${category}:${id}`);
                    }
                });
            });
            
            if (missingElements.length > 0) {
                this.logWarning(`Missing UI elements: ${missingElements.join(', ')}`);
            }
        } catch (error) {
            this.logError('Error caching UI elements:', error);
            throw error;
        }
    }
    
    /**
     * Set up event listeners for all UI controls
     */
    setupEventListeners() {
        try {
            // Set up toggle buttons
            Object.entries(this.controlsCache.toggles).forEach(([id, element]) => {
                if (element) {
                    element.addEventListener('click', () => this.handleToggleChange(id));
                }
            });
            
            // Set up numeric inputs and sliders
            this.setupNumericInputs();
            
            // Set up select elements
            Object.entries(this.controlsCache.selects).forEach(([id, element]) => {
                if (element) {
                    element.addEventListener('change', () => this.handleSelectChange(id, element.value));
                }
            });
            
            // Set up color inputs
            Object.entries(this.controlsCache.colors).forEach(([id, element]) => {
                if (element) {
                    element.addEventListener('input', () => this.handleColorChange(id, element.value));
                }
            });
            
            // Set up action buttons
            const actionHandlers = {
                'resetShape': this.handleResetShape.bind(this),
                'resetColors': this.handleResetColors.bind(this),
                'playSequence': this.handlePlaySequence.bind(this),
                'playChord': this.handlePlayChord.bind(this),
                'exportImage': this.handleExportImage.bind(this),
                'exportSVG': this.handleExportSVG.bind(this),
                'saveSettings': this.handleSaveSettings.bind(this),
                'loadSettings': this.handleLoadSettings.bind(this)
            };
            
            Object.entries(this.controlsCache.actions).forEach(([id, element]) => {
                if (element && actionHandlers[id]) {
                    element.addEventListener('click', actionHandlers[id]);
                }
            });
            
            this.log('Event listeners set up successfully');
        } catch (error) {
            this.logError('Error setting up event listeners:', error);
            throw error;
        }
    }
    
    /**
     * Set up numeric inputs and their corresponding sliders
     */
    setupNumericInputs() {
        this.numericControls.forEach(id => {
            const input = this.controlsCache.numericInputs[id];
            const slider = this.controlsCache.sliders[`${id}-slider`];
            
            if (input && slider) {
                // Ensure slider attributes match input attributes
                slider.min = input.min;
                slider.max = input.max;
                slider.step = input.step;
                slider.value = input.value;
                
                // Set up input event
                input.addEventListener('input', () => {
                    slider.value = input.value;
                    this.handleNumericInputChange(id, parseFloat(input.value));
                });
                
                // Set up slider event
                slider.addEventListener('input', () => {
                    input.value = slider.value;
                    this.handleSliderChange(id, parseFloat(slider.value));
                });
            } else if (!input) {
                this.logWarning(`Missing numeric input: ${id}`);
            } else if (!slider) {
                this.logWarning(`Missing slider for numeric input: ${id}`);
            }
        });
    }
    
    /**
     * Handle toggle button click
     * @param {string} id - Button ID
     */
    handleToggleChange(id) {
        const button = this.controlsCache.toggles[id];
        if (!button) return;
        
        const currentState = button.textContent === 'ON';
        const newState = !currentState;
        
        // Update button text
        button.textContent = newState ? 'ON' : 'OFF';
        button.classList.toggle('active', newState);
        
        // Extract property name from button ID
        let property = id.replace('toggle', '');
        property = property.charAt(0).toLowerCase() + property.slice(1);
        
        // Update core state
        const updateData = {};
        updateData[property] = newState;
        this.core.updateState(updateData);
        
        this.log(`Toggle ${id} changed to ${newState}`);
    }
    
    /**
     * Handle numeric input change
     * @param {string} id - Input ID
     * @param {number} value - New value
     */
    handleNumericInputChange(id, value) {
        // Update core state
        const updateData = {};
        updateData[id] = value;
        this.core.updateState(updateData);
        
        this.log(`Numeric input ${id} changed to ${value}`);
    }
    
    /**
     * Handle slider change
     * @param {string} id - Associated input ID
     * @param {number} value - New value
     */
    handleSliderChange(id, value) {
        // Update core state (same as numeric input change)
        this.handleNumericInputChange(id, value);
    }
    
    /**
     * Handle select change
     * @param {string} id - Select ID
     * @param {string} value - Selected value
     */
    handleSelectChange(id, value) {
        // Update core state
        const updateData = {};
        updateData[id] = value;
        this.core.updateState(updateData);
        
        this.log(`Select ${id} changed to ${value}`);
    }
    
    /**
     * Handle color input change
     * @param {string} id - Color input ID
     * @param {string} value - Color value
     */
    handleColorChange(id, value) {
        // Update core state
        const updateData = {};
        updateData[id] = value;
        this.core.updateState(updateData);
        
        this.log(`Color ${id} changed to ${value}`);
    }
    
    /**
     * Handle reset shape button
     */
    handleResetShape() {
        // Reset shape-related state
        this.core.updateState({
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            zoom: 1,
            wavelength: 1
        });
        
        // Update UI elements
        ['rotationX', 'rotationY', 'rotationZ', 'zoom', 'wavelength'].forEach(id => {
            const defaultValue = id === 'zoom' || id === 'wavelength' ? 1 : 0;
            const input = this.controlsCache.numericInputs[id];
            const slider = this.controlsCache.sliders[`${id}-slider`];
            
            if (input) input.value = defaultValue;
            if (slider) slider.value = defaultValue;
        });
        
        this.log('Shape reset');
    }
    
    /**
     * Handle reset colors button
     */
    handleResetColors() {
        const defaultColors = {
            backgroundColor: '#1a1a2e',
            foregroundColor: '#e94560'
        };
        
        // Update core state
        this.core.updateState(defaultColors);
        
        // Update UI elements
        Object.entries(defaultColors).forEach(([id, value]) => {
            const colorInput = this.controlsCache.colors[id];
            if (colorInput) colorInput.value = value;
        });
        
        this.log('Colors reset');
    }
    
    /**
     * Handle play sequence button
     */
    handlePlaySequence() {
        // Trigger play sequence event
        this.eventSystem.trigger('audio:playSequence');
        this.log('Play sequence requested');
    }
    
    /**
     * Handle play chord button
     */
    handlePlayChord() {
        // Trigger play chord event
        this.eventSystem.trigger('audio:playChord');
        this.log('Play chord requested');
    }
    
    /**
     * Handle export image button
     */
    handleExportImage() {
        // Trigger export image event
        this.eventSystem.trigger('renderer:exportImage');
        this.log('Export image requested');
    }
    
    /**
     * Handle export SVG button
     */
    handleExportSVG() {
        // Trigger export SVG event
        this.eventSystem.trigger('renderer:exportSVG');
        this.log('Export SVG requested');
    }
    
    /**
     * Handle save settings button
     */
    handleSaveSettings() {
        // Get current state from core
        const settings = this.core.getState();
        
        // Convert to JSON string
        const settingsJson = JSON.stringify(settings, null, 2);
        
        // Download as file
        this.downloadFile('harmonic-explorer-settings.json', settingsJson, 'application/json');
        
        this.log('Settings saved');
    }
    
    /**
     * Handle load settings button
     */
    handleLoadSettings() {
        // Create file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        
        // Handle file selection
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const settings = JSON.parse(e.target.result);
                        this.core.updateState(settings);
                        this.log('Settings loaded');
                    } catch (error) {
                        this.logError('Error loading settings:', error);
                        alert('Invalid settings file');
                    }
                };
                reader.readAsText(file);
            }
        });
        
        // Trigger file selection
        fileInput.click();
    }
    
    /**
     * Handle state update from core
     * @param {Object} state - New state object
     */
    onStateUpdate(state) {
        // Update UI elements based on state
        this.log('Updating UI from state changes');
        
        // Update toggles
        const toggleMappings = {
            'harmonics': 'toggleHarmonics',
            'waveform': 'toggleWaveform',
            'grid': 'toggleGrid',
            'autoRotate': 'toggleAutoRotate',
            'audio': 'toggleAudio',
            'spectrum': 'toggleSpectrum',
            'info': 'toggleInfo',
            'fps': 'toggleFPS'
        };
        
        Object.entries(toggleMappings).forEach(([stateProp, buttonId]) => {
            if (state[stateProp] !== undefined) {
                const button = this.controlsCache.toggles[buttonId];
                if (button) {
                    button.textContent = state[stateProp] ? 'ON' : 'OFF';
                    button.classList.toggle('active', state[stateProp]);
                }
            }
        });
        
        // Update numeric inputs and sliders
        this.numericControls.forEach(id => {
            if (state[id] !== undefined) {
                const input = this.controlsCache.numericInputs[id];
                const slider = this.controlsCache.sliders[`${id}-slider`];
                
                if (input) input.value = state[id];
                if (slider) slider.value = state[id];
            }
        });
        
        // Update selects
        Object.keys(this.controlsCache.selects).forEach(id => {
            if (state[id] !== undefined) {
                const select = this.controlsCache.selects[id];
                if (select) select.value = state[id];
            }
        });
        
        // Update colors
        Object.keys(this.controlsCache.colors).forEach(id => {
            if (state[id] !== undefined) {
                const colorInput = this.controlsCache.colors[id];
                if (colorInput) colorInput.value = state[id];
            }
        });
    }
    
    /**
     * Helper to download a file
     * @param {string} filename - File name
     * @param {string} content - File content
     * @param {string} contentType - MIME type
     */
    downloadFile(filename, content, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
} 