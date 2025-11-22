# WaveformCalculator.js

## Overview
WaveformCalculator is responsible for transforming harmonic series data into waveform representations in the HarmonicXplorer application. It offloads complex calculations to a Web Worker for improved performance and distributes calculated waveforms to other components through EventGear.

## Core Responsibilities

### Waveform Generation
The module transforms harmonic series into time-domain waveforms using mathematical calculations like additive synthesis.

### Performance Optimization
WaveformCalculator offloads CPU-intensive calculations to a Web Worker to maintain UI responsiveness.

### Event-Based Updates
When new harmonic data is received, the module recalculates waveforms and notifies other components through EventGear events.

## Key Features

### Web Worker Integration
```javascript
// Initialize the Web Worker
waveformCalculator.initWebWorker();

// Terminate the Web Worker when no longer needed
waveformCalculator.terminateWebWorker();
```

### Waveform Calculation
```javascript
// Calculate a waveform based on harmonic series
waveformCalculator.calculateWaveform({
  harmonics: [1, 0.5, 0.33, 0.25],
  resolution: 1024,
  phaseOffsets: [0, 0, 0, 0]
});

// Get the current waveform data
const waveformData = waveformCalculator.getWaveformData();
```

### Calculation Options
```javascript
// Set calculation options
waveformCalculator.setOptions({
  resolution: 2048,       // Points in the waveform
  normalization: true,    // Normalize amplitude
  cacheResults: true,     // Cache results for similar inputs
  useWebWorker: true,     // Use Web Worker for calculations
  interpolation: 'cubic'  // Interpolation method
});
```

## Integration with EventGear

WaveformCalculator communicates with other components through EventGear:

### Emitted Events
- `waveformCalculated`: When a new waveform is calculated
- `waveformCalculationStarted`: When calculation begins
- `waveformCalculationError`: When an error occurs during calculation

### Handled Events
- `harmonicsUpdated`: Triggers waveform recalculation when harmonic series changes
- `parameterChanged`: Updates calculation parameters when AppState changes

### Event Metadata
Events include detailed metadata about the waveform:

```javascript
// Example waveformCalculated event
{
  type: 'waveformCalculated',
  waveform: Float32Array(1024), // The waveform data array
  peakAmplitude: 0.87,          // Peak amplitude before normalization
  calculationTime: 12.5,        // Calculation time in ms
  resolution: 1024,             // Resolution of the waveform
  harmonicCount: 16,            // Number of harmonics used
  timestamp: performance.now()
}
```

## Web Worker Architecture

The WaveformCalculator uses a sophisticated Web Worker architecture:

```javascript
// Worker communication
{
  // Message to worker
  cmd: 'calculate',
  harmonics: [1, 0.5, 0.33, 0.25],
  resolution: 1024,
  phaseOffsets: [0, 0, 0, 0],
  id: 'calc-123'
}

// Response from worker
{
  cmd: 'result',
  waveform: Float32Array(1024),
  peakAmplitude: 0.87,
  calculationTime: 12.5,
  id: 'calc-123'
}
```

## Performance Considerations

- Web Worker offloads calculations from the main thread
- Caching prevents redundant calculations for the same input
- Progressive calculation for large waveforms
- Resolution adjustment based on device capabilities
- Efficient array operations using TypedArrays

## WebSocket Integration

Waveform data can be streamed via WebSocket:

```javascript
// Send waveform data via WebSocket
eventGear.websocketSendEvent({
  type: 'waveformData',
  waveform: waveformCalculator.getWaveformData(),
  resolution: waveformCalculator.getResolution(),
  timestamp: performance.now()
});
```

## Example Usage in HarmonicXplorer

```javascript
// In main.js
const eventGear = new EventGear();
const appState = new AppState(eventGear);
const harmonicSeries = new HarmonicSeries(eventGear, appState);
const waveformCalculator = new WaveformCalculator(eventGear, appState);

// Connect events
eventGear.registerEventConnection('harmonicSeries', 'waveformCalculator', 'harmonicsUpdated', 'calculateWaveform');
eventGear.registerEventConnection('waveformCalculator', 'geometryRenderer', 'waveformCalculated', 'updateGeometry');

// Initialize the Web Worker
waveformCalculator.initWebWorker();
```

## Mathematical Foundation

The WaveformCalculator implements additive synthesis based on the formula:

```
y(t) = ∑ A_n * sin(2π * f_n * t + φ_n)
```

Where:
- y(t) is the waveform value at time t
- A_n is the amplitude of the nth harmonic
- f_n is the frequency of the nth harmonic
- φ_n is the phase offset of the nth harmonic

## Advanced Features

### Multi-Waveform Calculation
```javascript
// Calculate multiple waveforms simultaneously
waveformCalculator.calculateMultipleWaveforms([
  { harmonics: [1, 0.5, 0.33], resolution: 1024 },
  { harmonics: [1, 0, 0.33, 0, 0.2], resolution: 1024 }
]);
```

### Waveform Transformations
```javascript
// Apply transformations to waveform
waveformCalculator.applyTransformation('rectify', { mode: 'half' });
waveformCalculator.applyTransformation('clip', { threshold: 0.8 });
waveformCalculator.applyTransformation('fold', { amount: 0.5 });
```

## Best Practices

- Initialize the Web Worker early to avoid calculation delays
- Dispose resources properly when the application is closed
- Consider device capabilities when setting resolution
- Use event-based approach rather than polling for results
- Handle calculation errors gracefully
- Synchronize waveform calculations with animation frames for smooth rendering 