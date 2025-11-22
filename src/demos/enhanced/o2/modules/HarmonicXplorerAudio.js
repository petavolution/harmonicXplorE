/**
 * HarmonicXplorerAudio.js
 * Audio module for synthesizing sound from harmonic series
 */

class HarmonicXplorerAudio extends HarmonicXplorerModule {
    constructor(config = {}) {
        super();
        
        this.config = Object.assign({
            defaultVolume: 0.5,
            defaultAttack: 0.1,
            defaultDecay: 0.05,
            defaultOscillatorType: 'sine'
        }, config);
        
        // Audio properties
        this.audioContext = null;
        this.gainNode = null;
        this.oscillators = [];
        this.isPlaying = false;
        this.analysisData = null;
        this.frequencyData = null;
        this.analyser = null;
        
        // For latency measurement
        this._audioStartTime = 0;
    }
    
    async initialize() {
        try {
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create main gain node
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = this.config.defaultVolume;
            this.gainNode.connect(this.audioContext.destination);
            
            // Create analyser for visualization
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.analyser.connect(this.audioContext.destination);
            this.gainNode.connect(this.analyser);
            
            // Initialize frequency data array
            this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
            
            this.core.logDebug('Audio module initialized');
            return true;
        } catch (error) {
            this.core.logDebug(`Audio initialization error: ${error.message}`);
            console.error('Audio initialization error:', error);
            return false;
        }
    }
    
    onStateUpdate(state) {
        try {
            // Update audio parameters if playing
            if (this.isPlaying) {
                // Update volume
                if (this.gainNode) {
                    this.gainNode.gain.setTargetAtTime(
                        state.audioVolume,
                        this.audioContext.currentTime,
                        0.01
                    );
                }
                
                // Update oscillators if harmonics changed
                if (this.core.needsHarmonicRecalculation || 
                    state.baseFrequency !== this._lastBaseFrequency ||
                    state.oscillatorType !== this._lastOscillatorType) {
                    this._lastBaseFrequency = state.baseFrequency;
                    this._lastOscillatorType = state.oscillatorType;
                    this.updateOscillators();
                }
            }
            
            // Start/stop audio based on audioEnabled state
            if (state.audioEnabled && !this.isPlaying) {
                this.startAudio();
            } else if (!state.audioEnabled && this.isPlaying) {
                this.stopAudio();
            }
        } catch (error) {
            this.core.logDebug(`Audio state update error: ${error.message}`);
        }
    }
    
    onStart() {
        // If audio is enabled, resume audio context and start playback
        if (this.core.state.audioEnabled) {
            this.resumeAudioContext().then(() => {
                this.startAudio();
            });
        }
    }
    
    onStop() {
        // Stop audio when application stops
        if (this.isPlaying) {
            this.stopAudio();
        }
    }
    
    render() {
        // Update frequency data for visualization
        if (this.analyser && this.isPlaying) {
            this.analyser.getByteFrequencyData(this.frequencyData);
            this.updateAudioMetrics();
        }
    }
    
    async resumeAudioContext() {
        // Resume audio context if it's suspended (browsers require user interaction)
        try {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
                this.core.logDebug('Audio context resumed');
            }
            return true;
        } catch (error) {
            this.core.logDebug(`Resume audio context error: ${error.message}`);
            return false;
        }
    }
    
    startAudio() {
        try {
            // Ensure audioContext is running (browser autoplay policy)
            this.resumeAudioContext().then(() => {
                if (this.isPlaying) return; // Already playing
                
                this._audioStartTime = performance.now();
                this.createOscillators();
                this.isPlaying = true;
                
                this.core.logDebug('Audio synthesis started');
            });
        } catch (error) {
            this.core.logDebug(`Start audio error: ${error.message}`);
        }
    }
    
    stopAudio() {
        try {
            if (!this.isPlaying) return; // Not playing
            
            // Stop all oscillators
            this.stopOscillators();
            this.isPlaying = false;
            
            this.core.logDebug('Audio synthesis stopped');
        } catch (error) {
            this.core.logDebug(`Stop audio error: ${error.message}`);
        }
    }
    
    createOscillators() {
        try {
            // Stop any existing oscillators
            this.stopOscillators();
            
            // Get state values
            const { baseFrequency, oscillatorType, audioAttack, audioDecay, harmonicType } = this.core.state;
            
            // Get harmonics
            const harmonics = this.core.getHarmonics();
            if (!harmonics || harmonics.length === 0) return;
            
            // Current audio context time for scheduling
            const now = this.audioContext.currentTime;
            
            // Create an oscillator for each harmonic
            this.oscillators = harmonics.map((harmonic, index) => {
                // Create oscillator
                const osc = this.audioContext.createOscillator();
                osc.type = oscillatorType;
                osc.frequency.value = baseFrequency * harmonic.ratio;
                
                // Create gain node for this oscillator's envelope
                const gainNode = this.audioContext.createGain();
                
                // Apply amplitude scaling based on harmonic type
                let amplitude;
                switch (harmonicType) {
                    case 'natural':
                        amplitude = 1 / (index + 1) * 0.5;
                        break;
                    case 'odd':
                        amplitude = 1 / (2 * index + 1) * 0.5;
                        break;
                    case 'even':
                        amplitude = 1 / (2 * (index + 1)) * 0.5;
                        break;
                    case 'upper':
                    case 'lower':
                        amplitude = 1 / Math.pow(1.5, index) * 0.5;
                        break;
                    case 'under':
                        amplitude = index === 0 ? 0.5 : harmonic.ratio * 0.5;
                        break;
                    default:
                        amplitude = 1 / (index + 1) * 0.5;
                }
                
                // Apply envelope
                gainNode.gain.value = 0;
                gainNode.gain.setTargetAtTime(amplitude, now, audioAttack);
                
                // Connect oscillator to its gain node, then to the main gain node
                osc.connect(gainNode);
                gainNode.connect(this.gainNode);
                
                // Start the oscillator
                osc.start();
                
                return { oscillator: osc, gain: gainNode, harmonic };
            });
            
            this.core.logDebug(`Created ${this.oscillators.length} oscillators`);
        } catch (error) {
            this.core.logDebug(`Create oscillators error: ${error.message}`);
        }
    }
    
    stopOscillators() {
        try {
            // Apply decay to all oscillators and then stop them
            const now = this.audioContext.currentTime;
            
            this.oscillators.forEach(({ oscillator, gain }) => {
                // Apply decay envelope
                gain.gain.setTargetAtTime(0, now, this.core.state.audioDecay || this.config.defaultDecay);
                
                // Schedule oscillator to stop after decay
                const stopTime = now + (this.core.state.audioDecay * 5 || this.config.defaultDecay * 5);
                oscillator.stop(stopTime);
            });
            
            this.oscillators = [];
        } catch (error) {
            this.core.logDebug(`Stop oscillators error: ${error.message}`);
        }
    }
    
    updateOscillators() {
        // Update oscillator parameters without restarting them
        if (!this.isPlaying) return;
        
        // Re-create oscillators with updated parameters
        this.createOscillators();
    }
    
    updateAudioMetrics() {
        // Calculate audio metrics like latency
        if (this._audioStartTime) {
            const latency = performance.now() - this._audioStartTime;
            this.core.metrics.audioLatency = latency;
            this._audioStartTime = 0; // Reset for next measurement
        }
    }
    
    // Get real-time spectral data for visualization
    getSpectrumData() {
        if (!this.analyser || !this.isPlaying) {
            return new Array(64).fill(0);
        }
        
        // Copy frequency data
        this.analyser.getByteFrequencyData(this.frequencyData);
        
        // Reduce the data to a manageable size for visualization
        const reduced = [];
        const step = Math.floor(this.analyser.frequencyBinCount / 64);
        
        for (let i = 0; i < 64; i++) {
            const index = i * step;
            reduced.push(this.frequencyData[index] / 255); // Normalize to 0-1
        }
        
        return reduced;
    }
    
    // Add a single tone with sweeping frequency
    addSweepingTone(startFreq, endFreq, duration) {
        if (!this.audioContext) return null;
        
        try {
            const osc = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            osc.type = this.core.state.oscillatorType;
            osc.frequency.value = startFreq;
            
            const now = this.audioContext.currentTime;
            osc.frequency.linearRampToValueAtTime(endFreq, now + duration);
            
            // Apply envelope
            gainNode.gain.value = 0;
            gainNode.gain.setTargetAtTime(0.3, now, 0.01);
            gainNode.gain.setTargetAtTime(0, now + duration - 0.2, 0.1);
            
            osc.connect(gainNode);
            gainNode.connect(this.gainNode);
            
            osc.start();
            osc.stop(now + duration);
            
            return { oscillator: osc, gain: gainNode };
        } catch (error) {
            this.core.logDebug(`Add sweeping tone error: ${error.message}`);
            return null;
        }
    }
    
    // Play a sequence of harmonic tones in series
    playHarmonicSequence() {
        if (!this.audioContext) return;
        
        try {
            const harmonics = this.core.getHarmonics();
            if (!harmonics || harmonics.length === 0) return;
            
            // Stop any existing oscillators
            this.stopOscillators();
            
            // Get parameters
            const baseFreq = this.core.state.baseFrequency;
            const oscillatorType = this.core.state.oscillatorType;
            const toneDuration = 0.3; // Duration of each tone
            
            // Play harmonics in sequence
            let startTime = this.audioContext.currentTime;
            
            harmonics.forEach((harmonic, index) => {
                // Create oscillator
                const osc = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                osc.type = oscillatorType;
                osc.frequency.value = baseFreq * harmonic.ratio;
                
                // Apply amplitude envelope
                gainNode.gain.value = 0;
                gainNode.gain.setTargetAtTime(0.5, startTime, 0.01);
                gainNode.gain.setTargetAtTime(0, startTime + toneDuration - 0.1, 0.05);
                
                // Connect oscillator to gain node
                osc.connect(gainNode);
                gainNode.connect(this.gainNode);
                
                // Schedule start and stop
                osc.start(startTime);
                osc.stop(startTime + toneDuration);
                
                // Update start time for next harmonic
                startTime += toneDuration;
            });
            
            this.core.logDebug(`Playing sequence of ${harmonics.length} harmonics`);
        } catch (error) {
            this.core.logDebug(`Play harmonic sequence error: ${error.message}`);
        }
    }
    
    // Create an audio buffer containing the waveform
    createWaveformBuffer(duration = 1) {
        if (!this.audioContext) return null;
        
        try {
            const sampleRate = this.audioContext.sampleRate;
            const numSamples = duration * sampleRate;
            const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
            
            // Get waveform data from core
            const waveform = this.core.getWaveform();
            if (!waveform || waveform.length === 0) return null;
            
            // Fill buffer with waveform data
            const channelData = buffer.getChannelData(0);
            for (let i = 0; i < numSamples; i++) {
                const index = Math.floor((i / numSamples) * waveform.length) % waveform.length;
                // Normalize waveform values to range -1 to 1
                channelData[i] = waveform[index] / this.core.radius * 5;
            }
            
            return buffer;
        } catch (error) {
            this.core.logDebug(`Create waveform buffer error: ${error.message}`);
            return null;
        }
    }
    
    // Play the waveform buffer
    playWaveformBuffer() {
        const buffer = this.createWaveformBuffer();
        if (!buffer) return;
        
        try {
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            
            // Create gain node for envelope
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = this.core.state.audioVolume;
            
            // Connect nodes
            source.connect(gainNode);
            gainNode.connect(this.gainNode);
            
            // Start playback
            source.start();
            
            this.core.logDebug('Playing waveform buffer');
        } catch (error) {
            this.core.logDebug(`Play waveform buffer error: ${error.message}`);
        }
    }
    
    // Play harmonic chord with just intonation
    playHarmonicChord() {
        if (!this.audioContext) return;
        
        try {
            // Get harmonics
            const harmonics = this.core.getHarmonics();
            if (!harmonics || harmonics.length < 3) return;
            
            // Define chord notes based on harmonic type
            let chordRatios = [];
            
            switch (this.core.state.harmonicType) {
                case 'natural':
                    // Major triad: 4:5:6 (just intonation)
                    chordRatios = [1, 5/4, 3/2];
                    break;
                case 'odd':
                    // Odd harmonics create a minor-like chord
                    chordRatios = [1, 6/5, 3/2];
                    break;
                case 'prime':
                    // Prime harmonics (2, 3, 5)
                    chordRatios = [1, 3/2, 5/4];
                    break;
                case 'fibonacci':
                    // Fibonacci series creates interesting intervals
                    chordRatios = [1, 2, 3, 5, 8].map(n => n/1);
                    break;
                default:
                    // Fall back to standard major triad
                    chordRatios = [1, 5/4, 3/2];
            }
            
            // Parameters
            const baseFreq = this.core.state.baseFrequency;
            const oscillatorType = this.core.state.oscillatorType;
            const now = this.audioContext.currentTime;
            const duration = 2; // Chord duration in seconds
            
            // Create and play oscillators for chord tones
            const oscillators = chordRatios.map(ratio => {
                const osc = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                osc.type = oscillatorType;
                osc.frequency.value = baseFreq * ratio;
                
                // Apply envelope
                gainNode.gain.value = 0;
                gainNode.gain.setTargetAtTime(0.2, now, this.core.state.audioAttack);
                gainNode.gain.setTargetAtTime(0, now + duration - 0.5, this.core.state.audioDecay);
                
                // Add slight detuning for richness
                osc.detune.value = Math.random() * 4 - 2;
                
                // Connect oscillator to gain node
                osc.connect(gainNode);
                gainNode.connect(this.gainNode);
                
                // Start and stop
                osc.start();
                osc.stop(now + duration);
                
                return { oscillator: osc, gain: gainNode };
            });
            
            this.core.logDebug(`Playing harmonic chord with ${oscillators.length} notes`);
        } catch (error) {
            this.core.logDebug(`Play harmonic chord error: ${error.message}`);
        }
    }
    
    // Get detailed spectral analysis for visualization
    getDetailedSpectrum() {
        if (!this.analyser || !this.isPlaying) {
            return { bins: [], peaks: [] };
        }
        
        try {
            // Create a more detailed frequency analysis
            const fftSize = this.analyser.fftSize;
            const bufferLength = this.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            this.analyser.getByteFrequencyData(dataArray);
            
            // Process the data for visualization
            const bins = Array.from(dataArray).map(v => v / 255);
            
            // Find frequency peaks
            const peaks = [];
            const threshold = 0.5; // Peak detection threshold
            
            for (let i = 2; i < bins.length - 2; i++) {
                if (bins[i] > threshold && 
                    bins[i] > bins[i-1] && 
                    bins[i] > bins[i-2] &&
                    bins[i] > bins[i+1] && 
                    bins[i] > bins[i+2]) {
                    
                    const frequency = i * this.audioContext.sampleRate / (2 * fftSize);
                    peaks.push({
                        binIndex: i,
                        amplitude: bins[i],
                        frequency: frequency
                    });
                }
            }
            
            // Sort peaks by amplitude (highest first)
            peaks.sort((a, b) => b.amplitude - a.amplitude);
            
            return {
                bins,
                peaks: peaks.slice(0, 10) // Return top 10 peaks
            };
        } catch (error) {
            this.core.logDebug(`Get detailed spectrum error: ${error.message}`);
            return { bins: [], peaks: [] };
        }
    }
}

// Export class for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HarmonicXplorerAudio };
} else {
    window.HarmonicXplorerAudio = HarmonicXplorerAudio;
} 