/**
 * HarmonicXplorerAudio.js
 * Handles audio synthesis based on the harmonic series
 */

class HarmonicXplorerAudio extends HarmonicXplorerModule {
    constructor(config = {}) {
        super();
        this.config = Object.assign({
            baseFrequency: 220, // A3
            masterVolume: 0.5,
            fadeTime: 0.05
        }, config);
        
        this.audioContext = null;
        this.masterGain = null;
        this.oscillators = [];
        this.gains = [];
        this.initialized = false;
        this.isPlaying = false;
    }
    
    async initialize() {
        try {
            // Create audio context with fallback
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) {
                throw new Error('Web Audio API not supported in this browser');
            }
            
            this.audioContext = new AudioContext();
            
            // Create master gain node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0; // Start silent
            this.masterGain.connect(this.audioContext.destination);
            
            this.initialized = true;
            return true;
        } catch (error) {
            console.error('Audio initialization error:', error);
            return false;
        }
    }
    
    onStateUpdate(state) {
        if (!this.initialized) return;
        
        // Update audio state based on application state
        if (state.audioEnabled !== undefined) {
            if (state.audioEnabled && !this.isPlaying) {
                this.startAudio();
            } else if (!state.audioEnabled && this.isPlaying) {
                this.stopAudio();
            }
        }
        
        // Update oscillators if they're active
        if (this.isPlaying) {
            this.updateOscillators();
        }
    }
    
    async startAudio() {
        if (!this.initialized || this.isPlaying) return;
        
        try {
            // Resume audio context if suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            // Create oscillators
            this.createOscillators();
            
            // Fade in master volume
            this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
            this.masterGain.gain.linearRampToValueAtTime(
                this.config.masterVolume,
                this.audioContext.currentTime + this.config.fadeTime
            );
            
            this.isPlaying = true;
            this.core.logDebug('Audio started');
        } catch (error) {
            this.core.logDebug(`Audio start error: ${error.message}`);
            console.error('Audio start error:', error);
        }
    }
    
    stopAudio() {
        if (!this.initialized || !this.isPlaying) return;
        
        try {
            // Fade out master volume
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.audioContext.currentTime);
            this.masterGain.gain.linearRampToValueAtTime(
                0,
                this.audioContext.currentTime + this.config.fadeTime
            );
            
            // Schedule destruction of oscillators after fade
            setTimeout(() => {
                this.destroyOscillators();
            }, this.config.fadeTime * 1000);
            
            this.isPlaying = false;
            this.core.logDebug('Audio stopped');
        } catch (error) {
            this.core.logDebug(`Audio stop error: ${error.message}`);
            console.error('Audio stop error:', error);
        }
    }
    
    createOscillators() {
        // Clear any existing oscillators
        this.destroyOscillators();
        
        try {
            const harmonics = this.core.calculateHarmonics();
            const startTime = this.audioContext.currentTime;
            
            // Create an oscillator for each harmonic
            harmonics.forEach((harmonic, index) => {
                // Create oscillator
                const oscillator = this.audioContext.createOscillator();
                oscillator.type = 'sine';
                oscillator.frequency.value = this.config.baseFrequency * harmonic.ratio;
                
                // Create gain node for this oscillator
                const gain = this.audioContext.createGain();
                gain.gain.value = 1.0 / (index + 1); // Decrease amplitude for higher harmonics
                
                // Connect nodes
                oscillator.connect(gain);
                gain.connect(this.masterGain);
                
                // Start oscillator
                oscillator.start(startTime);
                
                // Store references
                this.oscillators.push(oscillator);
                this.gains.push(gain);
            });
            
            this.core.logDebug(`Created ${harmonics.length} oscillators`);
        } catch (error) {
            this.core.logDebug(`Oscillator creation error: ${error.message}`);
            console.error('Oscillator creation error:', error);
        }
    }
    
    destroyOscillators() {
        try {
            // Stop all oscillators
            const stopTime = this.audioContext.currentTime;
            
            this.oscillators.forEach(osc => {
                try {
                    osc.stop(stopTime);
                    osc.disconnect();
                } catch (e) {
                    // Ignore errors from already stopped oscillators
                }
            });
            
            // Clear arrays
            this.oscillators = [];
            this.gains = [];
        } catch (error) {
            console.error('Oscillator destruction error:', error);
        }
    }
    
    updateOscillators() {
        if (!this.initialized || !this.isPlaying) return;
        
        try {
            const startTime = performance.now();
            
            // If oscillator count doesn't match current harmonics, recreate them
            const harmonics = this.core.calculateHarmonics();
            if (this.oscillators.length !== harmonics.length) {
                this.createOscillators();
                return;
            }
            
            // Update frequency and phase of existing oscillators
            harmonics.forEach((harmonic, index) => {
                if (index < this.oscillators.length) {
                    const osc = this.oscillators[index];
                    const gain = this.gains[index];
                    
                    // Update frequency with small time constant for smoother transitions
                    osc.frequency.setTargetAtTime(
                        this.config.baseFrequency * harmonic.ratio,
                        this.audioContext.currentTime,
                        0.03
                    );
                    
                    // Adjust gain based on harmonic index
                    gain.gain.setTargetAtTime(
                        1.0 / (index + 1),
                        this.audioContext.currentTime,
                        0.03
                    );
                }
            });
            
            // Update audio latency metric
            this.core.metrics.audioLatency = performance.now() - startTime;
        } catch (error) {
            this.core.logDebug(`Oscillator update error: ${error.message}`);
            console.error('Oscillator update error:', error);
        }
    }
    
    onStart() {
        // Update oscillators when animation starts
        if (this.initialized && this.isPlaying) {
            this.updateOscillators();
        }
    }
    
    onStop() {
        // Nothing special needed when animation stops
        // Audio can keep playing if enabled
    }
}

// Export class for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HarmonicXplorerAudio };
} else {
    window.HarmonicXplorerAudio = HarmonicXplorerAudio;
} 