# NeuroNetManager.js

## Overview
NeuroNetManager integrates neural network capabilities into the HarmonicXplorer application, enabling AI-powered analysis of harmonic series, pattern detection, and intelligent feedback. It leverages EventGear for seamless communication with other application components.

## Core Responsibilities

### Neural Network Management
The module creates, configures, and manages neural networks that analyze harmonic series data.

### Harmonic Pattern Analysis
NeuroNetManager analyzes harmonic series to detect patterns, calculate resonance scores, and identify interesting characteristics.

### Event-Based Communication
The module uses EventGear to receive harmonic data and emit analysis results back to the application.

## Key Features

### Neural Network Initialization
```javascript
// Initialize the neural network manager
const neuroNetManager = new NeuroNetManager(eventGear, {
  numberOfNeurons: 5,
  bufferSize: 1000,
  activationFunction: 'relu'
}).initialize();

// Load a pre-trained model
neuroNetManager.loadModel('harmonicsAnalyzer');

// Activate a specific model
neuroNetManager.activateModel('harmonicsAnalyzer');
```

### Harmonic Analysis
```javascript
// Analyze a harmonic series
const result = await neuroNetManager.analyzeHarmonicSeries([1, 0.5, 0.33, 0.25]);

// Example result structure
{
  resonanceScore: 0.87,       // Overall harmonic resonance (0-1)
  tensionScore: 0.34,         // Harmonic tension/dissonance (0-1)
  dominantHarmonics: [1, 3],  // Indexes of most influential harmonics
  pattern: 'natural',         // Identified pattern type
  recommendations: [          // Suggestions for modifications
    { index: 2, value: 0.4, reason: 'increase resonance' }
  ]
}
```

### Model Management
```javascript
// Create a simple feedforward model
neuroNetManager.loadSimpleFeedforwardModel();

// Create a harmonic analysis model
neuroNetManager.loadHarmonicsAnalysisModel();

// Get active model info
const modelInfo = neuroNetManager.getActiveModelInfo();
```

## Integration with EventGear

NeuroNetManager communicates with other components through EventGear:

### Emitted Events
- `neuroNet.analysisResult`: When harmonic analysis is complete
- `neuroNet.modelActivated`: When a new model is activated
- `neuroNet.trainingProgress`: During model training
- `neuroNet.predictionMade`: When a prediction is made

### Handled Events
- `harmonicsUpdated`: Triggers analysis when harmonic series changes
- `parameterChanged`: Updates neural network parameters when AppState changes

### Event Metadata
Events include detailed metadata about neural network operations:

```javascript
// Example neuroNet.analysisResult event
{
  type: 'neuroNet.analysisResult',
  harmonics: [1, 0.5, 0.33, 0.25],
  resonanceScore: 0.87,
  tensionScore: 0.34,
  dominantHarmonics: [1, 3],
  processingTime: 12.5, // ms
  model: 'harmonicsAnalyzer',
  confidence: 0.92,
  timestamp: performance.now()
}
```

## Neural Network Architecture

NeuroNetManager implements a flexible neural network architecture:

```javascript
class Neuron {
  constructor(options) {
    this.weights = new Float32Array(options.inputSize);
    this.bias = 0;
    this.activationFn = this.getActivationFunction(options.activation);
  }
  
  process(inputs) {
    let sum = this.bias;
    for (let i = 0; i < inputs.length; i++) {
      sum += inputs[i] * this.weights[i];
    }
    return this.activationFn(sum);
  }
  
  // ... additional neuron methods
}

// Network consisting of EventGear-connected neuron instances
class NeuralNetwork {
  constructor(eventGear, options) {
    this.eventGear = eventGear;
    this.layers = [];
    this.setupLayers(options);
  }
  
  // ... network implementation
}
```

## WebSocket Integration

Neural network analysis can be performed remotely via WebSocket:

```javascript
// Send harmonic data for remote analysis
eventGear.websocketSendEvent({
  type: 'neuroNet.analyzeRequest',
  harmonics: [1, 0.5, 0.33, 0.25],
  modelId: 'harmonicsAnalyzer',
  timestamp: performance.now()
});

// Receive analysis results from remote source
eventGear.on('websocket.message', (data) => {
  if (data.type === 'neuroNet.analyzeResponse') {
    // Process remote analysis results
    eventGear.emit('neuroNet.analysisResult', data);
  }
});
```

## Example Usage in HarmonicXplorer

```javascript
// In main.js
const eventGear = new EventGear();
const appState = new AppState(eventGear);
const harmonicSeries = new HarmonicSeries(eventGear, appState);

// Initialize neural network manager
const neuroNetManager = new NeuroNetManager(eventGear, {
  numberOfNeurons: 5,
  bufferSize: 1000,
  activationFunction: 'relu'
}).initialize();

// Load and activate a model
neuroNetManager.loadHarmonicsAnalysisModel();
neuroNetManager.activateModel('harmonicsAnalyzer');

// Connect events
eventGear.registerEventConnection('harmonicSeries', 'neuroNetManager', 
                                'harmonicsUpdated', 'analyzeHarmonicSeries');
eventGear.registerEventConnection('neuroNetManager', 'appState', 
                                'neuroNet.analysisResult', 'updateParam');

// Listen for analysis results
eventGear.on('neuroNet.analysisResult', (data) => {
  console.log(`Harmonic resonance score: ${data.resonanceScore}`);
  // Update UI or trigger other actions based on analysis
});
```

## Advanced Neural Network Features

### Training Networks with User Data
```javascript
// Train a neural network with user-provided examples
neuroNetManager.trainModel('userPreferences', {
  trainingData: [
    { input: [1, 0.5, 0.33, 0.25], output: { preference: 0.8 } },
    { input: [1, 0, 0.33, 0, 0.2], output: { preference: 0.6 } },
    // ... more examples
  ],
  epochs: 100,
  learningRate: 0.01,
  onProgress: (progress) => {
    console.log(`Training progress: ${progress.toFixed(2)}%`);
  }
});
```

### Feedback-Based Learning
```javascript
// Provide feedback to improve the model
neuroNetManager.provideFeedback({
  harmonics: [1, 0.5, 0.33, 0.25],
  userRating: 0.9, // User's subjective rating (0-1)
  expectedOutput: { resonanceScore: 0.85 }
});
```

### State Persistence
```javascript
// Save trained model to localStorage
neuroNetManager.saveModelState('userModel').then(saved => {
  console.log('Model saved successfully');
});

// Load trained model from localStorage
neuroNetManager.loadModelState('userModel').then(loaded => {
  console.log('Model loaded successfully');
});
```

## Performance Considerations

- Throttling of analysis requests for high-frequency harmonic changes
- Web Worker offloading for computationally intensive operations
- Tensor operations optimization using TypedArrays
- Dynamic model complexity based on device capabilities
- Caching of analysis results for similar inputs

## Best Practices

- Initialize neural networks with reasonable defaults
- Provide feedback mechanisms for model improvement
- Keep models simple for browser-based applications
- Consider WebSocket offloading for complex models
- Implement proper cleanup when the application is closed
- Use EventGear for all neural network communication
- Handle analysis errors gracefully with fallback options
- Provide intuitive feedback based on neural network analysis 