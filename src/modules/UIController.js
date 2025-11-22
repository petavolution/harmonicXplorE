/**
 * UIController.js
 * 
 * Manages DOM interactions and user input.
 * Uses EventGear for handling UI events and updating application state.
 */

export default class UIController {
  constructor(eventGear, appState) {
    this.eventGear = eventGear;
    this.appState = appState;
    
    // Element references
    this.elements = {};
    
    // Track user interaction metrics
    this.interactionMetrics = {
      lastInteraction: 0,
      interactionCount: 0,
      activeSections: new Set()
    };
    
    // Initialize event listeners
    this.initialize();
  }
  
  /**
   * Initializes the UI controller
   */
  initialize() {
    // Cache element references
    this.cacheElements();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize UI state from app state
    this.syncUIWithState();
    
    // Set up interaction tracking
    this.setupInteractionTracking();
  }
  
  /**
   * Caches references to DOM elements
   */
  cacheElements() {
    // Main controls
    this.elements.canvas = document.getElementById('canvas');
    this.elements.axis = document.getElementById('axis');
    this.elements.coordinateSystem = document.getElementById('coordinateSystem');
    this.elements.harmonics = document.getElementById('harmonics');
    this.elements.harmonicsType = document.getElementById('harmonicsType');
    this.elements.harmonicsPhase = document.getElementById('harmonicsPhase');
    this.elements.wavelength = document.getElementById('wavelength');
    this.elements.rotationAngleInput = document.getElementById('rotationAngleInput');
    this.elements.rotationSpeedInput = document.getElementById('rotationSpeedInput');
    this.elements.rotationSpeedSlider = document.getElementById('rotationSpeedSlider');
    this.elements.toggleButton = document.getElementById('toggleButton');
    this.elements.animationStatus = document.getElementById('animationStatus');
    this.elements.zoomManual = document.getElementById('zoomManual');
    this.elements.playAddSynth = document.getElementById('playAddSynth');
    this.elements.calcFrequency = document.getElementById('calcFrequency');
    
    // Modal controls
    this.elements.calculatorModal = document.getElementById('calculatorModal');
    this.elements.wavelengthButton = document.getElementById('wavelengthButton');
    
    // Buttons
    this.elements.resetAngleButton = document.getElementById('resetAngleButton');
    this.elements.fullscreenButton = document.getElementById('fullscreenButton');
    this.elements.exportButton = document.getElementById('exportButton');
    this.elements.exportFormat = document.getElementById('exportFormat');
    this.elements.saveButton = document.getElementById('saveButton');
    this.elements.loadButton = document.getElementById('loadButton');
    this.elements.licenseButton = document.getElementById('licenseButton');
    this.elements.closeLicenseButton = document.getElementById('closeLicenseButton');
    this.elements.licenseModal = document.getElementById('licenseModal');
  }
  
  /**
   * Sets up event listeners for UI elements
   */
  setupEventListeners() {
    // First, remove any existing event listeners (in case of re-initialization)
    this.eventGear.resetEventListeners();
    
    // Set up numeric input handlers
    this.setupNumericInputHandler(this.elements.axis, 'axis');
    this.setupNumericInputHandler(this.elements.harmonics, 'harmonics');
    this.setupNumericInputHandler(this.elements.wavelength, 'wavelength');
    this.setupNumericInputHandler(this.elements.rotationAngleInput, 'rotationAngle');
    this.setupNumericInputHandler(this.elements.rotationSpeedInput, 'rotationSpeed');
    this.setupNumericInputHandler(this.elements.zoomManual, 'zoomManual');
    this.setupNumericInputHandler(this.elements.calcFrequency, 'calcFrequency');
    
    // Set up select handlers
    this.setupSelectHandler(this.elements.coordinateSystem, 'coordinateSystem');
    this.setupSelectHandler(this.elements.harmonicsType, 'harmonicsType');
    this.setupSelectHandler(this.elements.harmonicsPhase, 'harmonicsPhase');
    this.setupSelectHandler(this.elements.exportFormat, 'exportFormat');
    
    // Set up checkbox handlers
    this.setupCheckboxHandler(this.elements.playAddSynth, 'isAddSynthPlaying');
    
    // Set up rotation speed slider with metadata
    this.eventGear.linkEventListener(this.elements.rotationSpeedSlider, 'input', {
      control: 'speed-slider', 
      section: 'animation'
    });
    
    this.elements.rotationSpeedSlider.addEventListener('input', () => {
      const value = parseFloat(this.elements.rotationSpeedSlider.value);
      this.elements.rotationSpeedInput.value = value.toFixed(2);
      this.appState.updateParam('rotationSpeed', value);
    });
    
    // Set up buttons with EventGear for tracking
    this.setupButtonListener(this.elements.toggleButton, () => {
      const visualizer = this.eventGear._metadata?.visualizer;
      if (visualizer) {
        visualizer.toggleAnimation();
        this.updateAnimationStatus();
      }
    }, { action: 'toggle-animation' });
    
    this.setupButtonListener(this.elements.resetAngleButton, () => {
      this.appState.updateParam('rotationAngle', 0);
      this.elements.rotationAngleInput.value = '0';
    }, { action: 'reset-angle' });
    
    this.setupButtonListener(this.elements.wavelengthButton, () => {
      const modal = this.elements.calculatorModal;
      modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
    }, { action: 'toggle-calculator' });
    
    this.setupButtonListener(this.elements.fullscreenButton, () => {
      this.toggleFullscreen();
    }, { action: 'fullscreen' });
    
    this.setupButtonListener(this.elements.exportButton, () => {
      this.exportCanvas();
    }, { action: 'export-canvas' });
    
    this.setupButtonListener(this.elements.saveButton, () => {
      this.saveState();
    }, { action: 'save-state' });
    
    this.setupButtonListener(this.elements.loadButton, () => {
      this.loadState();
    }, { action: 'load-state' });
    
    this.setupButtonListener(this.elements.licenseButton, () => {
      this.elements.licenseModal.style.display = 'block';
    }, { action: 'show-license' });
    
    this.setupButtonListener(this.elements.closeLicenseButton, () => {
      this.elements.licenseModal.style.display = 'none';
    }, { action: 'close-license' });
    
    // Register key events without direct EventGear linkage
    document.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
      
      // Register key event with metadata
      this.eventGear.registerEvent({
        type: 'key',
        key: e.key,
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
        shiftKey: e.shiftKey
      });
    });
  }
  
  /**
   * Sets up a button with EventGear event tracking
   * @param {HTMLElement} button - Button element
   * @param {Function} callback - Callback function
   * @param {Object} metadata - Metadata to attach to events
   */
  setupButtonListener(button, callback, metadata) {
    if (!button) return;
    
    // Link with EventGear for metrics
    this.eventGear.linkEventListener(button, 'click', metadata);
    
    // Attach regular event listener for functionality
    button.addEventListener('click', (e) => {
      // Record interaction in metrics
      this.interactionMetrics.lastInteraction = performance.now();
      this.interactionMetrics.interactionCount++;
      if (metadata && metadata.action) {
        this.interactionMetrics.activeSections.add(metadata.action);
      }
      
      // Execute callback
      callback(e);
    });
  }
  
  /**
   * Sets up interaction tracking using EventGear
   */
  setupInteractionTracking() {
    // Set up metadata for interaction tracking
    this.eventGear.setMetadata({
      ...this.eventGear.getMetadata(),
      uiController: {
        activeTab: 'main',
        lastInteracted: null
      }
    });
    
    // Set up callback for any UI event
    this.eventGear.setCallbackEvent((eventData) => {
      // Update metadata when UI interactions occur
      if (eventData && (eventData.action || eventData.control || eventData.section)) {
        const metadata = this.eventGear.getMetadata() || {};
        const uiMetadata = metadata.uiController || {};
        
        this.eventGear.setMetadata({
          ...metadata,
          uiController: {
            ...uiMetadata,
            lastInteracted: eventData.action || eventData.control || eventData.section,
            timestamp: performance.now()
          }
        });
      }
    });
  }
  
  /**
   * Sets up handler for numeric inputs
   * @param {HTMLElement} element - Input element
   * @param {string} paramName - Parameter name in app state
   */
  setupNumericInputHandler(element, paramName) {
    if (!element) return;
    
    element.addEventListener('change', () => {
      const value = parseFloat(element.value);
      if (!isNaN(value)) {
        this.appState.updateParam(paramName, value);
        
        // Special case for rotation speed to update slider
        if (paramName === 'rotationSpeed' && this.elements.rotationSpeedSlider) {
          this.elements.rotationSpeedSlider.value = value;
        }
      }
    });
    
    // Register with EventGear for event tracking with metadata
    this.eventGear.linkEventListener(element, 'input', {
      control: paramName,
      type: 'numeric'
    });
  }
  
  /**
   * Sets up handler for select elements
   * @param {HTMLElement} element - Select element
   * @param {string} paramName - Parameter name in app state
   */
  setupSelectHandler(element, paramName) {
    if (!element) return;
    
    element.addEventListener('change', () => {
      this.appState.updateParam(paramName, element.value);
    });
    
    // Register with EventGear for event tracking with metadata
    this.eventGear.linkEventListener(element, 'change', {
      control: paramName,
      type: 'select'
    });
  }
  
  /**
   * Sets up handler for checkbox elements
   * @param {HTMLElement} element - Checkbox element
   * @param {string} paramName - Parameter name in app state
   */
  setupCheckboxHandler(element, paramName) {
    if (!element) return;
    
    element.addEventListener('change', () => {
      this.appState.handleParameterChange(paramName, element.checked);
    });
    
    // Register with EventGear for event tracking with metadata
    this.eventGear.linkEventListener(element, 'change', {
      control: paramName,
      type: 'checkbox'
    });
  }
  
  /**
   * Handles keyboard events
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyDown(e) {
    // Get current rotation angle and speed
    const angle = this.appState.getParam('rotationAngle');
    const speed = this.appState.getParam('rotationSpeed');
    
    switch (e.key) {
      case 'ArrowLeft':
        // Decrease rotation angle
        this.appState.updateParam('rotationAngle', angle - 0.1);
        this.elements.rotationAngleInput.value = (angle - 0.1).toFixed(2);
        break;
        
      case 'ArrowRight':
        // Increase rotation angle
        this.appState.updateParam('rotationAngle', angle + 0.1);
        this.elements.rotationAngleInput.value = (angle + 0.1).toFixed(2);
        break;
        
      case 'ArrowUp':
        // Increase rotation speed
        this.appState.updateParam('rotationSpeed', speed + 0.01);
        this.elements.rotationSpeedInput.value = (speed + 0.01).toFixed(2);
        this.elements.rotationSpeedSlider.value = speed + 0.01;
        break;
        
      case 'ArrowDown':
        // Decrease rotation speed
        this.appState.updateParam('rotationSpeed', speed - 0.01);
        this.elements.rotationSpeedInput.value = (speed - 0.01).toFixed(2);
        this.elements.rotationSpeedSlider.value = speed - 0.01;
        break;
        
      case ' ':
        // Toggle animation
        const visualizer = this.eventGear._metadata?.visualizer;
        if (visualizer) {
          visualizer.toggleAnimation();
          this.updateAnimationStatus();
        }
        break;
    }
  }
  
  /**
   * Updates animation status text
   */
  updateAnimationStatus() {
    const visualizer = this.eventGear._metadata?.visualizer;
    if (visualizer && this.elements.animationStatus) {
      this.elements.animationStatus.textContent = visualizer.isAnimating ? 'Running' : 'Stopped';
      this.elements.toggleButton.textContent = visualizer.isAnimating ? 'Stop' : 'Start';
    }
  }
  
  /**
   * Synchronizes UI elements with app state
   */
  syncUIWithState() {
    // Get current state
    const params = this.appState.getAllParams();
    
    // Update UI elements with state values
    if (this.elements.axis) this.elements.axis.value = params.axis;
    if (this.elements.coordinateSystem) this.elements.coordinateSystem.value = params.coordinateSystem;
    if (this.elements.harmonics) this.elements.harmonics.value = params.harmonics;
    if (this.elements.harmonicsType) this.elements.harmonicsType.value = params.harmonicsType;
    if (this.elements.harmonicsPhase) this.elements.harmonicsPhase.value = params.harmonicsPhase;
    if (this.elements.wavelength) this.elements.wavelength.value = params.wavelength;
    if (this.elements.rotationAngleInput) this.elements.rotationAngleInput.value = params.rotationAngle;
    if (this.elements.rotationSpeedInput) this.elements.rotationSpeedInput.value = params.rotationSpeed;
    if (this.elements.rotationSpeedSlider) this.elements.rotationSpeedSlider.value = params.rotationSpeed;
    if (this.elements.zoomManual) this.elements.zoomManual.value = params.zoomManual;
    if (this.elements.calcFrequency) this.elements.calcFrequency.value = params.calcFrequency;
    
    // Update animation status
    this.updateAnimationStatus();
    
    // Register state sync event
    this.eventGear.registerEvent({
      type: 'ui.sync',
      timestamp: performance.now()
    });
  }
  
  /**
   * Toggles fullscreen mode
   */
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
  
  /**
   * Exports canvas as an image
   */
  exportCanvas() {
    if (!this.elements.canvas) return;
    
    const format = this.elements.exportFormat ? this.elements.exportFormat.value : 'png';
    const mimeType = `image/${format}`;
    
    try {
      const dataUrl = this.elements.canvas.toDataURL(mimeType);
      const link = document.createElement('a');
      link.download = `harmonic-explorer.${format}`;
      link.href = dataUrl;
      link.click();
      
      // Register export event
      this.eventGear.registerEvent({
        type: 'canvas.export',
        format: format,
        timestamp: performance.now()
      });
    } catch (error) {
      console.error('Error exporting canvas:', error);
    }
  }
  
  /**
   * Saves current state to a JSON file
   */
  saveState() {
    try {
      const state = this.appState.getAllParams();
      const json = JSON.stringify(state, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.download = 'harmonic-explorer-state.json';
      link.href = url;
      link.click();
      
      URL.revokeObjectURL(url);
      
      // Register save event
      this.eventGear.registerEvent({
        type: 'state.save',
        stateKeys: Object.keys(state),
        timestamp: performance.now()
      });
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }
  
  /**
   * Loads state from a JSON file
   */
  loadState() {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = event => {
          try {
            const state = JSON.parse(event.target.result);
            
            // Update app state with loaded values
            Object.entries(state).forEach(([key, value]) => {
              this.appState.updateParam(key, value);
            });
            
            // Sync UI with new state
            this.syncUIWithState();
            
            // Register load event
            this.eventGear.registerEvent({
              type: 'state.load',
              fileName: file.name,
              fileSize: file.size,
              stateKeys: Object.keys(state),
              timestamp: performance.now()
            });
          } catch (error) {
            console.error('Error parsing state file:', error);
          }
        };
        
        reader.readAsText(file);
      };
      
      input.click();
    } catch (error) {
      console.error('Error loading state:', error);
    }
  }
  
  /**
   * Cleans up resources when the controller is no longer needed
   */
  dispose() {
    // Clear all event listeners registered through EventGear
    this.eventGear.resetEventListeners();
  }
} 