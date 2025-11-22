/**
 * AudioSynthesis.js
 * 
 * Implements additive synthesis using the current harmonic series.
 * Uses Web Audio API for efficient audio processing.
 */

export default class AudioSynthesis {
  constructor(eventGear, appState) {
    this.eventGear = eventGear;
    this.appState = appState;
    
    // Initialize audio context
    this.initAudio();
    
    // Register event listeners
    this.registerEvents();
  }
  
  /**
   * Initializes the Web Audio API context and components
   */
  initAudio() {
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.mainGain = this.context.createGain();
      this.mainGain.gain.value = 0.3; // Set default volume
      this.mainGain.connect(this.context.destination);
      
      // Track oscillators for each harmonic
      this.oscillators = [];
      this.isPlaying = false;
      
    } catch (error) {
      console.error('Web Audio API not supported:', error);
    }
  }
  
  /**
   * Registers event listeners
   */
  registerEvents() {
    // Listen for harmonic series updates
    this.eventGear.on('harmonicSeries.updated', (data) => {
      if (this.isPlaying) {
        this.updateOscillators(data.harmonicSeries);
      }
    });
    
    // Listen for audio toggle events
    this.eventGear.on('audio.toggle', (data) => {
      if (data.play) {
        this.start();
      } else {
        this.stop();
      }
    });
    
    // Listen for frequency changes
    this.eventGear.on('ui.parameterChanged', (data) => {
      if (data.key === 'calcFrequency' && this.isPlaying) {
        this.updateFrequency(data.newValue);
      }
    });
  }
  
  /**
   * Starts audio synthesis
   */
  start() {
    if (this.isPlaying) return;
    
    try {
      // Resume audio context if suspended
      if (this.context.state === 'suspended') {
        this.context.resume();
      }
      
      // Get current harmonic series
      const harmonicSeries = this.appState.getCachedData('harmonicSeries');
      if (!harmonicSeries) return;
      
      // Create oscillators
      this.createOscillators(harmonicSeries);
      
      this.isPlaying = true;
      
    } catch (error) {
      console.error('Error starting audio synthesis:', error);
    }
  }
  
  /**
   * Stops audio synthesis
   */
  stop() {
    if (!this.isPlaying) return;
    
    try {
      // Stop all oscillators
      this.oscillators.forEach(osc => {
        try {
          osc.oscillator.stop();
          osc.gain.disconnect();
          osc.oscillator.disconnect();
        } catch (e) {
          // Ignore errors when stopping oscillators
        }
      });
      
      this.oscillators = [];
      this.isPlaying = false;
      
    } catch (error) {
      console.error('Error stopping audio synthesis:', error);
    }
  }
  
  /**
   * Creates oscillators for each harmonic
   * @param {Array} harmonicSeries - Array of harmonic values
   */
  createOscillators(harmonicSeries) {
    // Stop existing oscillators
    this.oscillators.forEach(osc => {
      try {
        osc.oscillator.stop();
        osc.gain.disconnect();
        osc.oscillator.disconnect();
      } catch (e) {
        // Ignore errors when stopping oscillators
      }
    });
    
    this.oscillators = [];
    
    // Get base frequency
    const baseFrequency = this.appState.getParam('calcFrequency') || 220;
    
    // Create new oscillators
    harmonicSeries.forEach((harmonic, index) => {
      try {
        // Create oscillator
        const oscillator = this.context.createOscillator();
        oscillator.type = 'sine';
        
        // Calculate frequency based on harmonic value
        const frequency = baseFrequency * harmonic;
        oscillator.frequency.value = frequency;
        
        // Create gain node for amplitude control
        const gain = this.context.createGain();
        const amplitude = 1 / (index + 1); // Amplitude decreases with harmonic number
        gain.gain.value = amplitude * 0.5; // Scale down to avoid clipping
        
        // Connect nodes
        oscillator.connect(gain);
        gain.connect(this.mainGain);
        
        // Start oscillator
        oscillator.start();
        
        // Store oscillator and gain for later control
        this.oscillators.push({
          oscillator,
          gain,
          harmonic
        });
        
      } catch (error) {
        console.error(`Error creating oscillator for harmonic ${harmonic}:`, error);
      }
    });
  }
  
  /**
   * Updates oscillators when harmonic series changes
   * @param {Array} harmonicSeries - New harmonic series
   */
  updateOscillators(harmonicSeries) {
    if (!this.isPlaying) return;
    
    // Create new oscillators with the updated series
    this.createOscillators(harmonicSeries);
  }
  
  /**
   * Updates the base frequency of all oscillators
   * @param {number} frequency - New base frequency
   */
  updateFrequency(frequency) {
    this.oscillators.forEach(osc => {
      try {
        osc.oscillator.frequency.value = frequency * osc.harmonic;
      } catch (e) {
        // Ignore errors when updating frequencies
      }
    });
  }
  
  /**
   * Sets the master volume
   * @param {number} volume - Volume level (0-1)
   */
  setVolume(volume) {
    if (this.mainGain) {
      this.mainGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }
  
  /**
   * Cleans up resources when the module is no longer needed
   */
  dispose() {
    this.stop();
    
    if (this.context) {
      this.context.close().catch(console.error);
    }
  }
} 