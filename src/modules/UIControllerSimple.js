/**
 * UIControllerSimple.js
 *
 * Simplified UI controller for basic HarmonicXplorer interface.
 * Works with the simplified index.html structure.
 */

export default class UIControllerSimple {
  constructor(eventGear, appState) {
    this.eventGear = eventGear;
    this.appState = appState;
    this.audioPlaying = false;
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
    // Frequency control
    const frequency = document.getElementById('frequency');
    if (frequency) {
      frequency.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        this.appState.updateParam('calcFrequency', value);
      });
    }

    // Harmonics count control
    const harmonics = document.getElementById('harmonics');
    const harmonicsValue = document.getElementById('harmonics-value');
    if (harmonics) {
      harmonics.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        this.appState.updateParam('harmonics', value);
        if (harmonicsValue) {
          harmonicsValue.textContent = value;
        }
      });
    }

    // Harmonics type control
    const harmonicsType = document.getElementById('harmonicsType');
    if (harmonicsType) {
      harmonicsType.addEventListener('change', (e) => {
        this.appState.updateParam('harmonicsType', e.target.value);
      });
    }

    // Coordinate system control
    const coordinateSystem = document.getElementById('coordinateSystem');
    if (coordinateSystem) {
      coordinateSystem.addEventListener('change', (e) => {
        this.appState.updateParam('coordinateSystem', e.target.value);
      });
    }

    // Audio toggle button
    const audioToggle = document.getElementById('audio-toggle');
    if (audioToggle) {
      audioToggle.addEventListener('click', () => {
        this.audioPlaying = !this.audioPlaying;
        this.eventGear.emit('audio.toggle', {
          play: this.audioPlaying
        });
        audioToggle.textContent = this.audioPlaying ? 'Stop Audio' : 'Play Audio';
        audioToggle.classList.toggle('stop', this.audioPlaying);
      });
    }

    // Reset button
    const reset = document.getElementById('reset');
    if (reset) {
      reset.addEventListener('click', () => {
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
      });
    }

    // Update FPS display if it exists
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

      fpsCounter.addEventListener('click', () => {
        fpsCounter.classList.toggle('hidden');
      });
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
}
