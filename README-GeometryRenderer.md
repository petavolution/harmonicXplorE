# GeometryRenderer.js

## Overview
GeometryRenderer is responsible for rendering visual representations of harmonic data in the HarmonicXplorer application. It transforms waveform data into stunning visual geometry on HTML5 Canvas and communicates rendering updates through EventGear.

## Core Responsibilities

### Visual Rendering
The module renders waveforms, harmonic relationships, and geometric patterns derived from harmonic data onto the canvas.

### Animation Coordination
GeometryRenderer manages smooth transitions and animations between different visualization states.

### Event-Based Updates
When new waveform data is available, the module updates its visual representations and notifies other components through EventGear events.

## Key Features

### Canvas Management
```javascript
// Initialize the renderer with a canvas
geometryRenderer.initialize(canvas);

// Resize the renderer
geometryRenderer.resize(width, height);

// Clear the canvas
geometryRenderer.clear();
```

### Geometry Rendering
```javascript
// Update the geometry with new waveform data
geometryRenderer.updateGeometry({
  waveform: new Float32Array(1024),
  harmonics: [1, 0.5, 0.33, 0.25]
});

// Render specific visualization modes
geometryRenderer.renderWaveform();
geometryRenderer.renderHarmonicCircles();
geometryRenderer.renderSpectrogram();
```

### Visualization Options
```javascript
// Set visualization options
geometryRenderer.setOptions({
  mode: 'circular',           // Visualization mode
  colorScheme: 'spectrum',    // Color scheme
  lineWidth: 2,               // Line width for paths
  showHarmonicMarkers: true,  // Show markers for harmonics
  rotationAngle: 45,          // Rotation angle in degrees
  zoomLevel: 1.2              // Zoom level
});
```

## Integration with EventGear

GeometryRenderer communicates with other components through EventGear:

### Emitted Events
- `geometryUpdated`: When new geometry is rendered
- `renderComplete`: When a full render cycle is complete
- `viewportChanged`: When the viewport size or parameters change

### Handled Events
- `waveformCalculated`: Triggers geometry updates when new waveform data is available
- `parameterChanged`: Updates rendering parameters when AppState changes
- `animation.frame`: Triggers animation updates on animation frames

### Event Metadata
Events include detailed metadata about the rendering:

```javascript
// Example geometryUpdated event
{
  type: 'geometryUpdated',
  renderTime: 5.2,            // Rendering time in ms
  vertexCount: 2048,          // Number of vertices rendered
  mode: 'circular',           // Current visualization mode
  zoomLevel: 1.2,             // Current zoom level
  dimensions: {width: 800, height: 600}, // Canvas dimensions
  timestamp: performance.now()
}
```

## Visualization Modes

GeometryRenderer supports multiple visualization modes:

```javascript
// Available visualization modes
const modes = {
  'linear': { /* Linear waveform visualization */ },
  'circular': { /* Circular waveform visualization */ },
  'spiral': { /* Spiral harmonic visualization */ },
  'spectrogram': { /* Frequency spectrogram */ },
  'lissajous': { /* Lissajous figures from harmonics */ },
  'custom': { /* Custom visualization defined by user */ }
};
```

## Performance Optimizations

- Canvas optimization using requestAnimationFrame
- Path caching for frequently used geometry
- Off-screen canvas rendering for complex visualizations
- Adaptive detail level based on device performance
- WebGL acceleration for supported browsers

## WebSocket Integration

Rendering parameters can be synchronized via WebSocket:

```javascript
// Send rendering parameters via WebSocket
eventGear.websocketSendEvent({
  type: 'renderingParameters',
  mode: geometryRenderer.getMode(),
  zoomLevel: geometryRenderer.getZoomLevel(),
  rotationAngle: geometryRenderer.getRotationAngle(),
  timestamp: performance.now()
});
```

## Example Usage in HarmonicXplorer

```javascript
// In main.js
const eventGear = new EventGear();
const appState = new AppState(eventGear);
const waveformCalculator = new WaveformCalculator(eventGear, appState);
const geometryRenderer = new GeometryRenderer(eventGear, appState);

// Connect events
eventGear.registerEventConnection('waveformCalculator', 'geometryRenderer', 'waveformCalculated', 'updateGeometry');
eventGear.registerEventConnection('geometryRenderer', 'visualizer', 'geometryUpdated', 'render');

// Initialize the renderer with canvas
const canvas = document.getElementById('visualization-canvas');
geometryRenderer.initialize(canvas);
```

## Mathematical Foundations

GeometryRenderer implements various mathematical transformations:

### Circular Mapping
```javascript
// Convert linear coordinates to circular
function mapToCircle(x, y, radius, angle) {
  const theta = (x / width) * 2 * Math.PI + angle;
  const r = radius * (1 + y / height);
  return {
    x: centerX + r * Math.cos(theta),
    y: centerY + r * Math.sin(theta)
  };
}
```

### Harmonic Relationships
```javascript
// Calculate geometric relationships between harmonics
function calculateHarmonicGeometry(harmonics) {
  // Create geometric structures from harmonic relationships
  // such as connecting lines between related harmonics
}
```

## Advanced Features

### Custom Visualization Functions
```javascript
// Register a custom visualization function
geometryRenderer.registerCustomMode('myVisualization', (ctx, data) => {
  // Custom drawing code using canvas context (ctx) and data
});

// Use the custom visualization
geometryRenderer.setOptions({ mode: 'myVisualization' });
```

### Interactive Elements
```javascript
// Add interactive elements to the visualization
geometryRenderer.addInteractivePoint(x, y, {
  radius: 10,
  color: 'red',
  onHover: () => console.log('Point hovered'),
  onClick: () => eventGear.emit('pointClicked', { x, y })
});
```

## Best Practices

- Initialize the renderer early in the application lifecycle
- Adjust detail level based on device performance
- Use appropriate visualization modes for different data types
- Implement smooth transitions between visualization states
- Leverage canvas optimization techniques for complex visualizations
- Handle window resize events properly to maintain aspect ratios 