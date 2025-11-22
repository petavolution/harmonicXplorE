/**
 * HarmonicXplorerAudio.js
 * Audio module for the HarmonicXplorer NG application
 * Handles WebAudio sound synthesis and analysis
 */

class HarmonicXplorerAudio extends HarmonicXplorerModule {
    constructor(options = {}) {
        super(options);
        
        // Audio context and nodes
        this.audioContext = null;
        this.gainNode = null;
        this.analyserNode = null;
        
        // Active oscillators
        this.oscillators = [];
        
        // Audio state
        this.isPlaying = false;
        
        // Spectrum data
        this.spectrumData = null;
        this.spectrumAnalyzer = null;
        
        // Bind methods
        this.setupAudioContext = this.setupAudioContext.bind(this);
        this.onStateUpdate = this.onStateUpdate.bind(this);
        this.playHarmonic = this.playHarmonic.bind(this);
        this.stopAllOscillators = this.stopAllOscillators.bind(this);
    }
    
    /**
     * Initialize the audio module
     */
    async initialize() {
        try {
            this.log('Initializing audio module');
            
            // Set up audio context when needed (on first user interaction)
            // We'll defer this until playback is requested
            
            // Setup event listeners
            if (this.eventSystem) {
                this.eventSystem.on('audio:playSequence', this.playSequence, this);
                this.eventSystem.on('audio:playChord', this.playChord, this);
                this.eventSystem.on('audio:stop', this.stopAllOscillators, this);
            }
            
            this.log('Audio initialization complete');
            this.initialized = true;
            return true;
        } catch (error) {
            this.logError('Audio initialization error:', error);
            throw new Error(`Audio initialization failed: ${error.message}`);
        }
    }
    
    /**
     * Set up audio context and nodes
     */
    setupAudioContext() {
        if (this.audioContext) return;
        
        try {
            // Create audio context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            // Create main gain node
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = 0.5; // Default volume
            this.gainNode.connect(this.audioContext.destination);
            
            // Create analyser node for spectrum visualization
            this.analyserNode = this.audioContext.createAnalyser();
            this.analyserNode.fftSize = 2048;
            this.analyserNode.connect(this.gainNode);
            
            // Create buffer for spectrum data
            this.spectrumData = new Uint8Array(this.analyserNode.frequencyBinCount);
            
            this.log('Audio context initialized');
        } catch (error) {
            this.logError('Failed to initialize audio context:', error);
            throw error;
        }
    }
    
    /**
     * Start the module
     */
    start() {
        if (!super.start()) return false;
        
        // Start spectrum analyzer if enabled
        if (this.core && this.core.getStateValue('spectrum')) {
            this.startSpectrumAnalyzer();
        }
        
        return true;
    }
    
    /**
     * Stop the module
     */
    stop() {
        if (!super.stop()) return false;
        
        // Stop all audio
        this.stopAllOscillators();
        this.stopSpectrumAnalyzer();
        
        return true;
    }
    
    /**
     * Start spectrum analyzer
     */
    startSpectrumAnalyzer() {
        if (this.spectrumAnalyzer) return;
        
        // Ensure we have audio context
        if (!this.audioContext) {
            this.setupAudioContext();
        }
        
        this.spectrumAnalyzer = requestAnimationFrame(this.updateSpectrum.bind(this));
        this.log('Spectrum analyzer started');
    }
    
    /**
     * Stop spectrum analyzer
     */
    stopSpectrumAnalyzer() {
        if (this.spectrumAnalyzer) {
            cancelAnimationFrame(this.spectrumAnalyzer);
            this.spectrumAnalyzer = null;
            this.log('Spectrum analyzer stopped');
        }
    }
    
    /**
     * Update spectrum data
     */
    updateSpectrum() {
        if (!this.analyserNode || !this.spectrumData) {
            this.spectrumAnalyzer = null;
            return;
        }
        
        // Get spectrum data
        this.analyserNode.getByteFrequencyData(this.spectrumData);
        
        // Continue loop
        this.spectrumAnalyzer = requestAnimationFrame(this.updateSpectrum.bind(this));
    }
    
    /**
     * Handle state updates from core
     * @param {Object} state - Application state
     * @param {Object} changes - What has changed
     */
    onStateUpdate(state, changes) {
        if (!this.audioContext && state.audio) {
            // Initialize audio on first enable
            this.setupAudioContext();
        }
        
        // Update volume if changed
        if (changes.audioChanged && this.gainNode) {
            this.gainNode.gain.value = state.audioVolume;
            
            // Start/stop spectrum analyzer based on spectrum state
            if (state.spectrum && !this.spectrumAnalyzer) {
                this.startSpectrumAnalyzer();
            } else if (!state.spectrum && this.spectrumAnalyzer) {
                this.stopSpectrumAnalyzer();
            }
            
            this.log(`Audio settings updated: volume=${state.audioVolume}, type=${state.oscillatorType}`);
        }
    }
    
    /**
     * Play a single harmonic
     * @param {number} harmonic - Harmonic number
     * @param {number} [duration=1] - Duration in seconds
     */
    playHarmonic(harmonic, duration = 1) {
        if (!this.audioContext) {
            this.setupAudioContext();
        }
        
        // Get current state
        const state = this.core.getState();
        if (!state.audio) return;
        
        try {
            // Create oscillator
            const oscillator = this.audioContext.createOscillator();
            oscillator.type = state.oscillatorType;
            
            // Calculate frequency
            const baseFrequency = state.baseFrequency || 440;
            oscillator.frequency.value = baseFrequency * harmonic;
            
            // Create envelope
            const envelope = this.audioContext.createGain();
            envelope.gain.value = 0;
            
            // Connect nodes
            oscillator.connect(envelope);
            envelope.connect(this.analyserNode);
            
            // Add to active oscillators
            this.oscillators.push({
                oscillator,
                envelope,
                startTime: this.audioContext.currentTime
            });
            
            // Start oscillator
            oscillator.start();
            
            // Apply attack
            envelope.gain.setValueAtTime(0, this.audioContext.currentTime);
            envelope.gain.linearRampToValueAtTime(
                0.5 / harmonic, // Decrease volume for higher harmonics
                this.audioContext.currentTime + state.audioAttack
            );
            
            // Apply decay and stop
            envelope.gain.linearRampToValueAtTime(
                0,
                this.audioContext.currentTime + duration
            );
            
            oscillator.stop(this.audioContext.currentTime + duration + 0.1);
            
            // Remove from active oscillators when done
            oscillator.onended = () => {
                this.oscillators = this.oscillators.filter(o => o.oscillator !== oscillator);
            };
            
            this.log(`Playing harmonic ${harmonic} at ${oscillator.frequency.value.toFixed(2)} Hz`);
        } catch (error) {
            this.logError('Error playing harmonic:', error);
        }
    }
    
    /**
     * Play a sequence of harmonics
     */
    playSequence() {
        if (!this.audioContext) {
            this.setupAudioContext();
        }
        
        // Get current state and harmonics
        const state = this.core.getState();
        if (!state.audio) return;
        
        const harmonics = this.core.getHarmonics();
        if (!harmonics || !harmonics.length) return;
        
        // Stop any playing sounds
        this.stopAllOscillators();
        
        // Play each harmonic in sequence
        harmonics.forEach((harmonic, index) => {
            setTimeout(() => {
                this.playHarmonic(harmonic.n, 0.5);
            }, index * 300);
        });
        
        this.log(`Playing sequence of ${harmonics.length} harmonics`);
    }
    
    /**
     * Play all harmonics as a chord
     */
    playChord() {
        if (!this.audioContext) {
            this.setupAudioContext();
        }
        
        // Get current state and harmonics
        const state = this.core.getState();
        if (!state.audio) return;
        
        const harmonics = this.core.getHarmonics();
        if (!harmonics || !harmonics.length) return;
        
        // Stop any playing sounds
        this.stopAllOscillators();
        
        // Play all harmonics at once
        harmonics.forEach(harmonic => {
            this.playHarmonic(harmonic.n, 2);
        });
        
        this.log(`Playing chord with ${harmonics.length} harmonics`);
    }
    
    /**
     * Stop all oscillators
     */
    stopAllOscillators() {
        if (!this.oscillators.length) return;
        
        const currentTime = this.audioContext ? this.audioContext.currentTime : 0;
        
        // Stop each oscillator with a quick fade out
        this.oscillators.forEach(({ oscillator, envelope }) => {
            try {
                envelope.gain.cancelScheduledValues(currentTime);
                envelope.gain.setValueAtTime(envelope.gain.value, currentTime);
                envelope.gain.linearRampToValueAtTime(0, currentTime + 0.05);
                oscillator.stop(currentTime + 0.1);
            } catch (error) {
                // Ignore errors for already stopped oscillators
            }
        });
        
        this.log(`Stopped ${this.oscillators.length} oscillators`);
        this.oscillators = [];
    }
    
    /**
     * Get spectrum data for visualization
     * @return {Uint8Array} Frequency data
     */
    getSpectrum() {
        return this.spectrumData;
    }
} 