# AudioSynthesis.js

## Overview
AudioSynthesis is responsible for generating real-time audio from harmonic series data in the HarmonicXplorer application. It implements additive synthesis techniques using the Web Audio API and synchronizes audio generation with visual elements through EventGear.

## Core Responsibilities

### Audio Generation
The module generates audio using additive synthesis based on harmonic series data, creating rich and complex timbres.

### Real-time Parameter Control
AudioSynthesis provides precise control over audio parameters like frequency, amplitude, and envelope.

### Event-Based Audio Synchronization
When parameters change or visualizations update, the module adjusts audio output in real-time via EventGear events.

## Key Features

### Audio Engine Initialization
```javascript
// Initialize the audio engine
audioSynthesis.initialize();

// Start/stop audio
audioSynthesis.start();
audioSynthesis.stop();

// Toggle audio state
audioSynthesis.toggle();
```

### Audio Parameter Control
```javascript
// Update audio parameters
audioSynthesis.updateAudioParameters({
  fundamentalFreq: 440,
  amplitude: 0.5,
  harmonics: [1, 0.5, 0.33, 0.25]
});

// Apply envelope
audioSynthesis.applyEnvelope({
  attack: 0.1,
  decay: 0.2,
  sustain: 0.7,
  release: 0.5
});
```

### Effects Processing
```javascript
// Add audio effects
audioSynthesis.addEffect('reverb', {
  roomSize: 0.8,
  dampening: 3000,
  wet: 0.3
});

audioSynthesis.addEffect('delay', {
  delayTime: 0.5,
  feedback: 0.4,
  wet: 0.2
});
```

## Integration with EventGear

AudioSynthesis communicates with other components through EventGear:

### Emitted Events
- `audioStarted`: When audio playback begins
- `audioStopped`: When audio playback stops
- `audioParametersUpdated`: When audio parameters are updated
- `audioEffectAdded`: When an audio effect is added

### Handled Events
- `parameterChanged`: Updates audio parameters when AppState changes
- `harmonicsUpdated`: Updates harmonic content of the synthesizer
- `waveformCalculated`: Updates oscillator waveforms

### Event Metadata
Events include detailed metadata about the audio state:

```javascript
// Example audioParametersUpdated event
{
  type: 'audioParametersUpdated',
  fundamentalFreq: 440,
  amplitude: 0.5,
  harmonicCount: 16,
  effects: ['reverb', 'delay'],
  isPlaying: true,
  cpuLoad: 0.12,
  timestamp: performance.now()
}
```

## Web Audio API Integration

AudioSynthesis leverages the Web Audio API for high-performance audio processing:

```javascript
// Audio context and node setup
this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
this.masterGain = this.audioContext.createGain();
this.masterGain.connect(this.audioContext.destination);

// Oscillator creation for each harmonic
function createOscillator(frequency, amplitude) {
  const osc = this.audioContext.createOscillator();
  const gain = this.audioContext.createGain();
  osc.frequency.value = frequency;
  gain.gain.value = amplitude;
  osc.connect(gain);
  gain.connect(this.effectsChain || this.masterGain);
  return { oscillator: osc, gain: gain };
}
```

## Performance Considerations

- Dynamic voice allocation to prevent CPU overload
- Amplitude thresholding to ignore inaudible harmonics
- Audio worklet support for more efficient processing where available
- Automatic audio context suspension when idle

## WebSocket Integration

Audio parameters can be controlled via WebSocket:

```javascript
// Receive audio control commands via WebSocket
eventGear.on('websocket.message', (data) => {
  if (data.type === 'audioControl') {
    if (data.command === 'start') {
      audioSynthesis.start();
    } else if (data.command === 'stop') {
      audioSynthesis.stop();
    } else if (data.command === 'updateParams') {
      audioSynthesis.updateAudioParameters(data.parameters);
    }
  }
});
```

## Example Usage in HarmonicXplorer

```javascript
// In main.js
const eventGear = new EventGear();
const appState = new AppState(eventGear);
const harmonicSeries = new HarmonicSeries(eventGear, appState);
const audioSynthesis = new AudioSynthesis(eventGear, appState);

// Connect events
eventGear.registerEventConnection('appState', 'audioSynthesis', 'parameterChanged', 'updateAudioParameters');
eventGear.registerEventConnection('harmonicSeries', 'audioSynthesis', 'harmonicsUpdated', 'updateHarmonics');

// Initialize audio
audioSynthesis.initialize();

// Audio can be controlled from UI
document.getElementById('playButton').addEventListener('click', () => {
  audioSynthesis.toggle();
});
```

## Advanced Audio Features

### Microtonal Support
```javascript
// Set microtonal tuning
audioSynthesis.setTuningSystem('just', {
  referenceFrequency: 440,
  referenceNote: 'A4',
  ratios: [1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8, 2]
});
```

### Audio Export
```javascript
// Record and export audio
audioSynthesis.startRecording();
// ...perform audio operations...
audioSynthesis.stopRecording().then(audioBuffer => {
  // Convert to WAV, MP3, etc. and download
  const wavBlob = audioSynthesis.convertToWav(audioBuffer);
  const url = URL.createObjectURL(wavBlob);
  
  // Create download link
  const a = document.createElement('a');
  a.href = url;
  a.download = 'harmonics-recording.wav';
  a.click();
});
```

### Presets
```javascript
// Save and load synth presets
const preset = audioSynthesis.savePreset('brass-like');
// Later...
audioSynthesis.loadPreset('brass-like');

// Example preset structure
{
  name: 'brass-like',
  fundamentalFreq: 220,
  harmonics: [1, 0.7, 0.5, 0.3, 0.2, 0.1],
  envelope: { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.3 },
  effects: [
    { type: 'filter', params: { frequency: 1200, Q: 5, type: 'lowpass' } }
  ]
}
```

## Best Practices

- Initialize audio context only after user interaction (to comply with autoplay policies)
- Implement proper cleanup to avoid audio context leaks
- Use gain nodes to control amplitudes rather than directly setting oscillator amplitudes
- Apply short fade in/out when starting/stopping to avoid clicks
- Monitor CPU usage and reduce complexity if performance suffers
- Synchronize audio parameter changes with animation frames for smooth transitions 