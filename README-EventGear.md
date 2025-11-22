# EventGear.js

## Overview

EventGear is the core event management system that powers the HarmonicXplorer application. It provides a sophisticated event bus with advanced features including event routing, metadata tracking, performance monitoring, event logging, and neural network integration. EventGear serves as the central nervous system connecting all components of the application.

## Core Responsibilities

### Event Management
EventGear implements a publish-subscribe (pub/sub) pattern, allowing components to emit events and register handlers for events without direct coupling.

### Metadata Tracking
Every event can carry detailed metadata, which EventGear tracks, stores, and makes available for analysis.

### Performance Monitoring
EventGear monitors event frequency, processing time, and overall system performance, emitting warnings and collecting metrics.

### Cross-Component Communication
It enables seamless communication between all application components, from UI interactions to audio processing.

## Key Features

### Basic Usage

```javascript
// Create a new EventGear instance
const eventGear = new EventGear({
  historySize: 1000,           // Store recent events for debugging
  debug: true,                 // Enable debug mode
  performanceTracking: true,   // Monitor event performance
  eventNamespaces: [           // Define expected namespaces
    'ui', 'audio', 'harmonics', 'visualization'
  ]
});

// Register an event handler
eventGear.on('parameterChanged', (data) => {
  console.log(`Parameter ${data.paramName} changed to ${data.value}`);
});

// Emit an event
eventGear.emit('parameterChanged', {
  paramName: 'frequency',
  value: 440,
  previousValue: 432,
  source: 'ui'
});

// Remove event handler
eventGear.off('parameterChanged', handlerFunction);

// Emit event once
eventGear.once('applicationStarted', startupData);
```

### Event Chaining

```javascript
// Method chaining for event configuration
eventGear
  .on('parameterChanged', handleParameterChange)
  .on('visualizationStarted', handleVisualizationStart)
  .setMaxListeners('audioProcessed', 10)
  .setSamplingRate('visualizationFrame', 60)
  .registerEventConnection('ui', 'audio', 'frequencyChanged', 'updateFrequency')
  .enableLogging(['parameterChanged', 'audioStarted', 'audioStopped']);
```

### Event Metadata

```javascript
// Emit event with metadata
eventGear.emit('harmonicsUpdated', {
  harmonics: [1, 0.5, 0.33, 0.25],
  timestamp: performance.now(),
  _metadata: {
    source: 'HarmonicSeries',
    importance: 'high',
    calculationTime: 1.2, // ms
    changeReason: 'userInput'
  }
});

// Register event metadata schema
eventGear.registerEventSchema('harmonicsUpdated', {
  required: ['harmonics'],
  metadata: {
    source: { type: 'string' },
    importance: { type: 'string', enum: ['low', 'medium', 'high'] },
    calculationTime: { type: 'number' },
    changeReason: { type: 'string' }
  }
});

// Validate event data against schema
eventGear.setValidationOptions({
  validateOnEmit: true,
  throwOnValidationError: false,
  logValidationErrors: true
});
```

### Event Connections

```javascript
// Register connections between components
eventGear.registerEventConnection(
  'ui',                // Source component
  'audio',             // Target component
  'frequencyChanged',  // Source event
  'updateFrequency',   // Target event
  (data) => ({         // Optional transform function
    frequency: data.value,
    immediate: data.immediate || false
  })
);

// Get all connections
const connections = eventGear.getAllConnections();

// Remove a connection
eventGear.removeEventConnection('ui', 'audio', 'frequencyChanged');
```

### Event History & Replay

```javascript
// Get event history
const recentEvents = eventGear.getEventHistory();

// Get history for specific event type
const parameterEvents = eventGear.getEventHistory('parameterChanged');

// Replay a sequence of events
eventGear.replayEvents(parameterEvents);

// Export event history
const historyJSON = eventGear.exportEventHistory();

// Import and replay
eventGear.importEventHistory(historyJSON).replayEvents();
```

### Performance Monitoring

```javascript
// Get event performance metrics
const metrics = eventGear.getPerformanceMetrics();

// Example metrics object
{
  eventCounts: {
    'parameterChanged': 242,
    'visualizationFrame': 3600,
    'harmonicsUpdated': 86
  },
  processingTime: {
    'parameterChanged': {
      average: 0.8,
      max: 4.2,
      min: 0.1,
      total: 193.6
    },
    // Other events...
  },
  eventFrequency: {
    'visualizationFrame': {
      average: 60,
      peak: 65,
      current: 59
    }
  },
  totalEvents: 4328,
  startTime: 1623452789123,
  uptime: 72000 // ms
}

// Register performance alarm
eventGear.registerPerformanceAlarm({
  name: 'highFrequencyWarning',
  condition: (metrics) => metrics.eventFrequency['visualizationFrame'].current < 30,
  action: (metrics) => {
    console.warn('Visualization frame rate dropped below 30fps');
    eventGear.emit('performanceWarning', {
      type: 'lowFrameRate',
      currentFPS: metrics.eventFrequency['visualizationFrame'].current
    });
  },
  cooldown: 5000 // ms
});
```

### Event Logging

```javascript
// Enable logging for specific events
eventGear.enableLogging(['parameterChanged', 'audioStarted', 'audioStopped']);

// Configure logging options
eventGear.setLoggingOptions({
  includeTimestamp: true,
  includeMetadata: true,
  logToConsole: true,
  logLevel: 'info', // 'debug', 'info', 'warn', 'error'
  formatter: (event, data) => `[${event}] ${JSON.stringify(data)}`
});

// Get log entries
const logs = eventGear.getLogs();

// Clear logs
eventGear.clearLogs();

// Export logs
const logsJSON = eventGear.exportLogs();
```

## Integration With Components

EventGear serves as the central hub connecting all components of the HarmonicXplorer application:

### AppState Integration
```javascript
// AppState emits events when parameters change
appState.updateParam('frequency', 440);
// EventGear carries the event to all interested components
eventGear.on('parameterChanged', (data) => {
  if (data.paramName === 'frequency') {
    // Update UI, audio engine, etc.
  }
});
```

### UI Integration
```javascript
// DOM event handlers emit EventGear events
document.querySelector('#frequency-slider').addEventListener('input', (e) => {
  eventGear.emit('ui.parameterChanged', {
    paramName: 'frequency',
    value: parseFloat(e.target.value),
    source: 'user-input'
  });
});

// EventGear events update UI
eventGear.on('parameterChanged', (data) => {
  const elements = document.querySelectorAll(`[data-param="${data.paramName}"]`);
  elements.forEach(el => {
    el.value = data.value;
    el.dispatchEvent(new Event('update'));
  });
});
```

### Visualizer Integration
```javascript
// Visualizer animation loop emits frame events
visualizer.animate = function() {
  // Process frame
  eventGear.emit('visualizationFrame', {
    timestamp: performance.now(),
    frameCount: this.frameCount++,
    deltaTime: this.lastFrameTime ? performance.now() - this.lastFrameTime : 0
  });
  this.lastFrameTime = performance.now();
  
  requestAnimationFrame(this.animate.bind(this));
};

// EventGear notifies visualizer of harmonic changes
eventGear.on('harmonicsUpdated', (data) => {
  visualizer.updateHarmonics(data.harmonics);
});
```

### Audio Integration
```javascript
// Audio engine receives parameter updates
eventGear.on('parameterChanged', (data) => {
  if (data.paramName === 'frequency') {
    audioSynthesis.setFrequency(data.value);
  } else if (data.paramName.startsWith('harmonic')) {
    const harmonicIndex = parseInt(data.paramName.match(/\d+/)[0]);
    const property = data.paramName.split('.')[1]; // amplitude or phase
    audioSynthesis.setHarmonicProperty(harmonicIndex, property, data.value);
  }
});

// Audio engine emits state changes
audioSynthesis.start = function() {
  // Start audio
  this.audioContext.resume();
  // Notify system
  eventGear.emit('audioStarted', {
    timestamp: performance.now(),
    sampleRate: this.audioContext.sampleRate
  });
};
```

## WebSocket Integration

EventGear can bridge events over WebSocket connections:

```javascript
// Configure WebSocket bridge
eventGear.setupWebSocketBridge({
  url: 'wss://harmonic-explorer.example.com/ws',
  autoReconnect: true,
  events: {
    outgoing: ['parameterChanged', 'harmonicsUpdated'],
    incoming: ['remoteCommand', 'presetLoaded']
  }
});

// Send event over WebSocket
eventGear.emit('websocket.send', {
  type: 'parameterChanged',
  paramName: 'frequency',
  value: 440
});

// Receive remote events via WebSocket
eventGear.on('websocket.message', (message) => {
  if (message.type === 'remoteCommand') {
    eventGear.emit(message.type, message.data);
  }
});
```

## Neural Network Integration

EventGear can process events through neural networks:

```javascript
// Setup neural network processor
eventGear.setupNeuralProcessor({
  inputEvents: ['harmonicsUpdated'],
  outputEvent: 'harmonicAnalysis',
  processorFunction: (inputData) => {
    // Process data through neural network
    const harmonics = inputData.harmonics;
    
    // Calculate features
    const resonanceScore = calculateResonance(harmonics);
    const tensionScore = calculateTension(harmonics);
    
    return {
      resonanceScore,
      tensionScore,
      dominantHarmonics: findDominantHarmonics(harmonics),
      inputData
    };
  },
  processingInterval: 500 // Process at most every 500ms
});

// Listen for neural network output
eventGear.on('harmonicAnalysis', (result) => {
  console.log(`Resonance score: ${result.resonanceScore}`);
  console.log(`Tension score: ${result.tensionScore}`);
});
```

## Advanced Debugging Features

```javascript
// Enable debug mode
eventGear.setDebugMode(true);

// Access event flow visualization
const flowData = eventGear.generateEventFlowGraph();

// Monitor specific events with detailed logging
eventGear.monitorEvent('parameterChanged', {
  logData: true,
  logStack: true,
  logTimestamp: true,
  samplingRate: 0.5 // Log 50% of events
});

// Create timing spans to measure performance
eventGear.startTimingSpan('harmonicCalculation');
// ... do calculation
eventGear.endTimingSpan('harmonicCalculation').then(timing => {
  console.log(`Harmonic calculation took ${timing.duration}ms`);
});

// Inject mock events for testing
eventGear.injectEvent('parameterChanged', {
  paramName: 'frequency',
  value: 440,
  source: 'test'
});

// Expose debugging API to console
eventGear.exposeDebugAPI('hxDebug');
// Now accessible via window.hxDebug in browser console
```

## Performance Considerations

- Efficient event dispatching with minimal overhead
- Smart event batching for high-frequency events
- Event throttling and debouncing built-in
- Memory-efficient event history storage
- Lazy initialization of advanced features
- Selective performance monitoring

## Best Practices

- Use clear, consistent event naming conventions
- Add namespace prefixes for component-specific events
- Include detailed metadata for complex events
- Set up event connections at initialization time
- Use event schemas for critical events
- Enable performance monitoring in development
- Implement event throttling for UI and animation events
- Clean up event listeners to avoid memory leaks 