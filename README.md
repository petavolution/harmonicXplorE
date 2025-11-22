# HarmonicXplorer

A sophisticated, real-time web application for exploring harmonic series, visualizing waveforms, and studying the relationships between sound and mathematics.

## Overview

HarmonicXplorer is a powerful interactive tool that allows users to manipulate harmonic series, visualize the resulting waveforms, and explore the mathematical relationships between harmonics. The application features real-time audio synthesis, advanced visualizations, neural network analysis, and seamless WebSocket communication for distributed processing and collaboration.

Built around the EventGear framework, HarmonicXplorer demonstrates a modern event-driven architecture with loosely coupled components that communicate through a sophisticated event system.

## Core Components

The application consists of several specialized modules that work together through the EventGear system:

- [**EventGear**](./README-EventGear.md): The central nervous system of the application, providing advanced event management with metadata tracking, performance monitoring, and neural network integration.

- [**AppState**](./README-AppState.md): Manages the application state with parameter tracking, change history, and event emission for state changes.

- [**HarmonicSeries**](./README-HarmonicSeries.md): Handles the creation, manipulation, and analysis of harmonic series that form the core of the application.

- [**Visualizer**](./README-Visualizer.md): Renders real-time visualizations of waveforms and harmonics with performance monitoring and advanced animation features.

- [**GeometryRenderer**](./README-GeometryRenderer.md): Provides specialized rendering capabilities for geometric representations of harmonic relationships.

- [**WaveformCalculator**](./README-WaveformCalculator.md): Performs mathematical calculations for waveform generation based on harmonic series.

- [**AudioSynthesis**](./README-AudioSynthesis.md): Implements real-time audio synthesis using the Web Audio API, allowing users to hear the harmonics they create.

- [**UIController**](./README-UIController.md): Manages user interactions and UI updates, connecting user actions to the application's event system.

- [**DOMBinder**](./README-DOMBinder.md): Provides declarative DOM-to-event binding for seamless UI integration with the event system.

- [**WebSocketBridge**](./README-WebSocketBridge.md): Enables real-time communication with remote systems, supporting distributed processing and collaborative features.

- [**NeuroNetManager**](./README-NeuroNetManager.md): Integrates neural network capabilities for intelligent analysis of harmonic patterns and suggestions.

## Architecture

HarmonicXplorer is built on the EventGear paradigm, where components communicate through events with rich metadata. The architecture follows these key principles:

1. **Event-Driven Communication**: All components communicate through events, without direct dependencies.

2. **Metadata Enrichment**: Events carry detailed metadata that can be tracked, analyzed, and used to trigger further processing.

3. **Loose Coupling**: Components are designed to work independently, connected only through the event system.

4. **Real-Time Processing**: The system is optimized for real-time updates with performance monitoring and optimizations.

5. **Distributed Capabilities**: WebSocket integration allows for communication with remote systems and collaborative features.

## Getting Started

### Prerequisites

- Modern web browser with Web Audio API support
- Node.js 14+ for development

### Installation

```bash
# Clone the repository
git clone https://github.com/yourname/HarmonicXplorer.git
cd HarmonicXplorer

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Usage

1. Open your browser to `http://localhost:3000`
2. Use the frequency controls to set the fundamental frequency
3. Adjust harmonic amplitudes to create different waveforms
4. Toggle the audio to hear the resulting sound
5. Explore different visualization modes

## Advanced Features

### Neural Network Analysis

The application includes neural network capabilities for analyzing harmonic series and providing intelligent feedback:

```javascript
// Get analysis of current harmonic series
const analysis = await neuroNetManager.analyzeHarmonicSeries(
  harmonicSeries.getValues()
);

console.log(`Resonance score: ${analysis.resonanceScore}`);
console.log(`Tension score: ${analysis.tensionScore}`);
```

### WebSocket Collaboration

Users can collaborate in real-time using WebSocket communication:

```javascript
// Join a collaborative session
webSocketBridge.setupCollaboration({
  room: 'session-123',
  userId: 'user-456',
  userName: 'Alice'
});

// Share current state with others
webSocketBridge.sendMessage({
  type: 'collab.currentState',
  state: appState.getAllParams()
});
```

### Custom Visualizations

Create custom visualization functions for unique representations:

```javascript
visualizer.registerVisualizationMode('custom', {
  name: 'My Custom View',
  renderFunction: (ctx, harmonics, dimensions) => {
    // Custom rendering code
    harmonics.forEach((h, i) => {
      // Draw something based on each harmonic
    });
  }
});
```

## Performance Optimization

HarmonicXplorer includes built-in performance monitoring and optimization:

- Event frequency monitoring with automatic throttling
- Frame rate tracking for visualizations
- Memory usage monitoring
- Performance alarms for detecting issues
- Debug mode with detailed metrics

## Development

### Project Structure

```
├── src/
│   ├── core/           # Core application components
│   │   ├── EventGear.js
│   │   ├── AppState.js
│   │   ├── Visualizer.js
│   │   └── ...
│   ├── utils/          # Utility modules
│   │   ├── NeuroNetManager.js
│   │   ├── WebSocketBridge.js
│   │   └── ...
│   ├── audio/          # Audio processing
│   │   └── AudioSynthesis.js
│   ├── math/           # Mathematical functions
│   │   ├── HarmonicSeries.js
│   │   └── WaveformCalculator.js
│   ├── ui/             # User interface components
│   │   ├── UIController.js
│   │   └── DOMBinder.js
│   └── main.js         # Application entry point
├── public/             # Static assets
└── index.html          # Main HTML file
```

### Building for Production

```bash
# Build optimized production version
npm run build

# Serve the built application
npm run serve
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The EventGear paradigm was inspired by Felix's insights on event-driven architecture
- Web Audio API for real-time audio synthesis
- Canvas API for high-performance visualizations 