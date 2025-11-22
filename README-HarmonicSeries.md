# HarmonicSeries.js

## Overview
HarmonicSeries is responsible for generating and managing harmonic series data in the HarmonicXplorer application. It creates mathematically accurate harmonic series based on various parameters and distributes this data to other components through EventGear.

## Core Responsibilities

### Harmonic Generation
The module generates harmonic series with configurable parameters such as fundamental frequency, amplitude scaling, and harmonic count.

### Mathematical Accuracy
HarmonicSeries ensures mathematical precision in harmonic calculations following principles of wave physics and acoustics.

### Event-Based Updates
When parameters change, the module recalculates harmonics and notifies other components through EventGear events.

## Key Features

### Harmonic Series Generation
```javascript
// Update harmonics with new parameters
harmonicSeries.updateHarmonics({
  fundamentalFreq: 440,
  numHarmonics: 16,
  amplitudeScaling: 'inverse'
});

// Get the current harmonic series
const series = harmonicSeries.getHarmonicSeries();
```

### Scaling Methods
The module supports various amplitude scaling methods:

```javascript
// Available scaling methods
const scalingMethods = {
  'inverse': (n) => 1/n,             // 1/n scaling (natural harmonics)
  'inverseSq': (n) => 1/(n*n),       // 1/n² scaling (faster falloff)
  'evenOdd': (n) => n % 2 === 0 ? 0.7/n : 0.3/n, // Emphasize even harmonics
  'custom': (n) => customScalingFunction(n) // Custom scaling function
};
```

### Harmonic Analysis
```javascript
// Analyze the harmonic series for properties
const analysis = harmonicSeries.analyzeHarmonics();

// Example analysis result
{
  fundamentalFreq: 440,
  highestFreq: 7040,
  totalHarmonics: 16,
  amplitudeSum: 1.76,
  timbre: 'bright', // Timbral characteristic
  evenOddRatio: 1.2 // Ratio of even to odd harmonic energy
}
```

## Integration with EventGear

HarmonicSeries communicates with other components through EventGear:

### Emitted Events
- `harmonicsUpdated`: When a new harmonic series is calculated
- `harmonicsAnalysisComplete`: When harmonic analysis is completed

### Handled Events
- `parameterChanged`: Updates harmonic parameters when AppState changes
- `customScalingUpdated`: Updates custom scaling function

### Event Metadata
Events include detailed metadata about the harmonic series:

```javascript
// Example harmonicsUpdated event
{
  type: 'harmonicsUpdated',
  harmonics: [1, 0.5, 0.33, 0.25, ...],
  frequencies: [440, 880, 1320, 1760, ...],
  fundamentalFreq: 440,
  scalingMethod: 'inverse',
  timestamp: performance.now()
}
```

## Neural Network Integration

HarmonicSeries can feed data directly to neural networks for analysis:

```javascript
// When harmonics update, they can be processed by the neural network
eventGear.on('harmonicsUpdated', async (data) => {
  const result = await neuroNetManager.analyzeHarmonicSeries(data.harmonics);
  
  // Neural network might detect patterns in harmonics
  // and provide insights about the harmonic structure
});
```

## WebSocket Integration

Harmonic data can be streamed via WebSocket:

```javascript
// Send harmonic series via WebSocket
eventGear.websocketSendEvent({
  type: 'harmonicData',
  harmonics: harmonicSeries.getHarmonicSeries(),
  frequencies: harmonicSeries.getFrequencies(),
  timestamp: performance.now()
});
```

## Performance Optimizations

- Caching of series calculations to prevent redundant processing
- Efficient array operations for fast generation of large harmonic sets
- Throttling to prevent excessive recalculations on rapid parameter changes

## Example Usage in HarmonicXplorer

```javascript
// In main.js
const eventGear = new EventGear();
const appState = new AppState(eventGear);
const harmonicSeries = new HarmonicSeries(eventGear, appState);

// Connect events
eventGear.registerEventConnection('appState', 'harmonicSeries', 'parameterChanged', 'updateHarmonics');
eventGear.registerEventConnection('harmonicSeries', 'waveformCalculator', 'harmonicsUpdated', 'calculateWaveform');

// Update harmonics directly (although typically done via AppState)
harmonicSeries.updateHarmonics({
  fundamentalFreq: 261.63, // Middle C
  numHarmonics: 32
});
```

## Mathematical Foundation

The HarmonicSeries module is based on the mathematical principles of harmonic series:

```
f(n) = f₀ × n
a(n) = a₀ × scaling(n)
```

Where:
- f(n) is the frequency of the nth harmonic
- f₀ is the fundamental frequency
- a(n) is the amplitude of the nth harmonic
- a₀ is the amplitude of the fundamental
- scaling(n) is the scaling function for the nth harmonic

## Advanced Usage

### Custom Scaling Functions
```javascript
// Define a custom scaling function
const bellCurve = (n, center = 5, width = 4) => {
  return Math.exp(-Math.pow(n - center, 2) / (2 * Math.pow(width, 2)));
};

// Apply custom scaling
harmonicSeries.setCustomScaling(bellCurve);
harmonicSeries.updateHarmonics({ scalingMethod: 'custom' });
```

### Harmonic Presets
```javascript
// Apply harmonic presets for common timbres
harmonicSeries.applyPreset('organ');

// Example presets
const presets = {
  'organ': { scalingMethod: 'evenOdd', numHarmonics: 8 },
  'string': { scalingMethod: 'inverse', numHarmonics: 16 },
  'brass': { scalingMethod: 'inverseSq', numHarmonics: 12 }
};
```

## Best Practices

- Update harmonics through AppState rather than directly when possible
- Listen for 'harmonicsUpdated' events rather than polling for changes
- Consider performance implications when using large numbers of harmonics
- Use the analysis methods to understand harmonic characteristics
- Combine with the WaveformCalculator for visualization and synthesis 