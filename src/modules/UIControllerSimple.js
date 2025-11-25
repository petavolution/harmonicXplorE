/**
 * UIControllerSimple.js
 *
 * Simplified UI controller for basic HarmonicXplorer interface.
 * Works with the simplified index.html structure.
 */

import { validateParam } from '../config/app-config.js';

export default class UIControllerSimple {
  constructor(eventGear, appState) {
    this.eventGear = eventGear;
    this.appState = appState;
    this.audioPlaying = false;

    // Store handler references for cleanup
    this.handlers = {
      frequency: null,
      harmonics: null,
      harmonicsType: null,
      coordinateSystem: null,
      audioToggle: null,
      reset: null,
      fpsToggle: null
    };
  }

  /**
   * Initializes the UI controller
   */
  initialize() {
    this.setupBasicControls();
    this.setupFPSToggle();
    this.syncUIWithState();
    console.log('✅ UI Controller initialized');
  }

  /**
   * Sets up basic control event listeners
   */
  setupBasicControls() {
    // Frequency control (with validation)
    const frequency = document.getElementById('frequency');
    if (frequency) {
      this.handlers.frequency = (e) => {
        const rawValue = parseFloat(e.target.value);
        const validValue = validateParam('calcFrequency', rawValue);
        this.appState.updateParam('calcFrequency', validValue);

        // Update input if value was clamped
        if (validValue !== rawValue) {
          e.target.value = validValue;
        }
      };
      frequency.addEventListener('input', this.handlers.frequency);
    }

    // Harmonics count control (with validation)
    const harmonics = document.getElementById('harmonics');
    const harmonicsValue = document.getElementById('harmonics-value');
    if (harmonics) {
      this.handlers.harmonics = (e) => {
        const rawValue = parseInt(e.target.value);
        const validValue = validateParam('harmonics', rawValue);
        this.appState.updateParam('harmonics', validValue);
        if (harmonicsValue) {
          harmonicsValue.textContent = validValue;
        }

        // Update input if value was clamped
        if (validValue !== rawValue) {
          e.target.value = validValue;
        }
      };
      harmonics.addEventListener('input', this.handlers.harmonics);
    }

    // Harmonics type control
    const harmonicsType = document.getElementById('harmonicsType');
    if (harmonicsType) {
      this.handlers.harmonicsType = (e) => {
        this.appState.updateParam('harmonicsType', e.target.value);
      };
      harmonicsType.addEventListener('change', this.handlers.harmonicsType);
    }

    // Coordinate system control
    const coordinateSystem = document.getElementById('coordinateSystem');
    if (coordinateSystem) {
      this.handlers.coordinateSystem = (e) => {
        this.appState.updateParam('coordinateSystem', e.target.value);
      };
      coordinateSystem.addEventListener('change', this.handlers.coordinateSystem);
    }

    // Audio toggle button
    const audioToggle = document.getElementById('audio-toggle');
    if (audioToggle) {
      this.handlers.audioToggle = () => {
        this.audioPlaying = !this.audioPlaying;
        this.eventGear.emit('audio.toggle', {
          play: this.audioPlaying
        });
        audioToggle.textContent = this.audioPlaying ? 'Stop Audio' : 'Play Audio';
        audioToggle.classList.toggle('stop', this.audioPlaying);
      };
      audioToggle.addEventListener('click', this.handlers.audioToggle);
    }

    // Reset button
    const reset = document.getElementById('reset');
    if (reset) {
      this.handlers.reset = () => {
        this.appState.resetToDefaults();
        this.syncUIWithState();
        if (this.audioPlaying) {
          this.audioPlaying = false;
          this.eventGear.emit('audio.toggle', { play: false });
          if (audioToggle) {
            audioToggle.textContent = 'Play Audio';
            audioToggle.classList.remove('stop');
          }
        }
      };
      reset.addEventListener('click', this.handlers.reset);
    }

    // Update FPS display if it exists (EventGear listener, managed by EventGear)
    this.eventGear.on('visualizer.fpsUpdate', (data) => {
      const fpsValue = document.getElementById('fps-value');
      if (fpsValue) {
        fpsValue.textContent = data.fps.toFixed(0);
      }
    });
  }

  /**
   * Sets up FPS display toggle (click FPS counter to toggle)
   */
  setupFPSToggle() {
    const fpsCounter = document.getElementById('fps-counter');
    if (fpsCounter) {
      fpsCounter.style.cursor = 'pointer';
      fpsCounter.title = 'Click to toggle FPS display';

      this.handlers.fpsToggle = () => {
        fpsCounter.classList.toggle('hidden');
      };
      fpsCounter.addEventListener('click', this.handlers.fpsToggle);
    }
  }

  /**
   * Syncs UI elements with current app state
   */
  syncUIWithState() {
    const params = this.appState.getAllParams();

    // Update all input values from state
    const updates = [
      ['frequency', params.calcFrequency],
      ['harmonics', params.harmonics],
      ['harmonicsType', params.harmonicsType],
      ['coordinateSystem', params.coordinateSystem]
    ];

    updates.forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.value = value;
      }
    });

    // Update harmonics display
    const harmonicsValue = document.getElementById('harmonics-value');
    if (harmonicsValue) {
      harmonicsValue.textContent = params.harmonics;
    }
  }

  /**
   * Cleans up resources when the module is no longer needed
   */
  dispose() {
    // Remove DOM event listeners
    const elements = {
      frequency: document.getElementById('frequency'),
      harmonics: document.getElementById('harmonics'),
      harmonicsType: document.getElementById('harmonicsType'),
      coordinateSystem: document.getElementById('coordinateSystem'),
      audioToggle: document.getElementById('audio-toggle'),
      reset: document.getElementById('reset'),
      fpsCounter: document.getElementById('fps-counter')
    };

    // Remove each listener if element and handler exist
    if (elements.frequency && this.handlers.frequency) {
      elements.frequency.removeEventListener('input', this.handlers.frequency);
    }
    if (elements.harmonics && this.handlers.harmonics) {
      elements.harmonics.removeEventListener('input', this.handlers.harmonics);
    }
    if (elements.harmonicsType && this.handlers.harmonicsType) {
      elements.harmonicsType.removeEventListener('change', this.handlers.harmonicsType);
    }
    if (elements.coordinateSystem && this.handlers.coordinateSystem) {
      elements.coordinateSystem.removeEventListener('change', this.handlers.coordinateSystem);
    }
    if (elements.audioToggle && this.handlers.audioToggle) {
      elements.audioToggle.removeEventListener('click', this.handlers.audioToggle);
    }
    if (elements.reset && this.handlers.reset) {
      elements.reset.removeEventListener('click', this.handlers.reset);
    }
    if (elements.fpsCounter && this.handlers.fpsToggle) {
      elements.fpsCounter.removeEventListener('click', this.handlers.fpsToggle);
    }

    // Clear handler references
    this.handlers = {
      frequency: null,
      harmonics: null,
      harmonicsType: null,
      coordinateSystem: null,
      audioToggle: null,
      reset: null,
      fpsToggle: null
    };

    // EventGear listeners are managed by EventGear itself

    console.log('UIControllerSimple disposed');
  }
}
