# Visualizer.js

## Overview
Visualizer is the central orchestration module for the HarmonicXplorer application. It coordinates the visual rendering process, animation loop, and serves as a hub for communication between components through EventGear.

## Core Responsibilities

### Animation Management
The Visualizer controls the animation loop using requestAnimationFrame, maintaining smooth rendering performance while emitting events with frame timing data.

### Performance Monitoring
The module tracks frame rates, jitter, and rendering performance, triggering warnings when performance degrades below configurable thresholds.

### Event Coordination
As the central hub, the Visualizer connects various modules like GeometryRenderer, WaveformCalculator, and AudioSynthesis through EventGear.

## Key Features

### Animation Control
```javascript
// Start animation
visualizer.start();

// Stop animation
visualizer.stop();

// Toggle animation state
visualizer.toggleAnimation();
```

### Debug Mode
```javascript
// Enable debug mode with FPS counter and metrics
visualizer.setupDebugMode(true);

// Access debug metrics
const debugMetrics = visualizer.getDebugMetrics();
```

### Performance Tracking
```javascript
// Get current FPS
const currentFPS = visualizer.getFPS();

// Get performance report
const report = visualizer.generatePerformanceReport();
```

## Integration with EventGear

The Visualizer both emits and listens for events through EventGear:

### Emitted Events
- `animation.start`: When animation begins
- `animation.stop`: When animation stops
- `animation.frame`: On each animation frame with timing data
- `visualizer.fpsUpdate`: When FPS is calculated
- `warning.lowFPS`: When FPS drops below threshold

### Handled Events
- `geometryUpdated`: Triggers rendering of new geometry
- `parameterChanged`: Updates visualization parameters

### Metadata Tracking
The Visualizer maintains detailed metadata about the visualization state:

```javascript
// Example metadata structure
{
  animation: {
    isRunning: true,
    startTime: 1610000000000,
    frameCount: 1420,
    lastFrameTime: 1610000023456
  },
  performance: {
    fps: 58.7,
    jitterHistory: [...],
    averageFrameTime: 16.92
  }
}
```

## Performance Alarms and Monitoring

The Visualizer includes sophisticated performance monitoring capabilities:

```javascript
// Setup performance tracking
visualizer.setupPerformanceTracking({
  lowFpsThreshold: 30,
  trackJitter: true,
  logWarnings: true
});

// Track FPS performance
visualizer.trackFpsPerformance((fps, isLow) => {
  if (isLow) {
    console.warn(`Low FPS detected: ${fps.toFixed(1)}`);
  }
});
```

## WebSocket Integration

The Visualizer can emit visualization states through EventGear's WebSocket bridge:

```javascript
// When important visual state changes occur
eventGear.websocketSendEvent({
  type: 'visualState',
  fps: visualizer.getFPS(),
  frameCount: visualizer.getFrameCount(),
  timestamp: performance.now()
});
```

## Debug UI Support

The Visualizer can create a debug overlay for monitoring performance metrics:

```javascript
// Create debug UI
visualizer.createDebugUI({
  showFPS: true,
  showFrameTime: true,
  showEventCount: true
});
```

## Resource Management

The Visualizer properly manages resources for cleanup:

```javascript
// Clean up resources
visualizer.dispose();
```

## Chained Configuration

The Visualizer supports a chained configuration pattern:

```javascript
const visualizer = new Visualizer(eventGear)
  .configureEventGear()
  .setupMetadataTracking()
  .setupEventCallbacks()
  .setupPerformanceTracking()
  .setupDebugMode(config.debug.showFPS);
```

## Example Usage in HarmonicXplorer

```javascript
// In main.js
const eventGear = new EventGear();
const visualizer = new Visualizer(eventGear);

// Setup event callbacks
visualizer.setupEventCallbacks();
visualizer.registerVisualizerEvents();

// Connect with other components
eventGear.registerEventConnection('geometryRenderer', 'visualizer', 'geometryUpdated', 'render');

// Start visualization
visualizer.start();
```

## Performance Tips

- Use `requestAnimationFrame` for animation (handled internally)
- Only update visual elements when needed via events
- Monitor FPS and jitter to identify performance bottlenecks
- Toggle debug mode only when needed for performance diagnostics 