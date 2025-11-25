# HarmonicXplorer - Project Structure

## Overview

This document describes the simplified and optimized project structure of HarmonicXplorer, focusing on modularity, maintainability, and clarity.

## Directory Structure

```
harmonicXplorE/
├── index.html                    # Main application entry point (simplified UI)
├── src/
│   ├── main-simple.js           # Simplified main entry point (< 150 lines)
│   ├── main.js                  # Original full-featured entry point
│   │
│   ├── config/                  # Configuration management
│   │   ├── app-config.js       # Centralized application configuration
│   │   └── index.js            # Configuration module exports
│   │
│   ├── init/                    # Initialization helpers
│   │   ├── eventGearSetup.js   # EventGear initialization and connection logic
│   │   ├── performanceMonitoring.js  # Performance monitoring setup
│   │   └── index.js            # Initialization module exports
│   │
│   ├── core/                    # Core application modules
│   │   ├── AppState.js         # Central state management (804 lines)
│   │   └── Visualizer.js       # Animation coordination (912 lines)
│   │
│   ├── modules/                 # Feature modules
│   │   ├── HarmonicSeries.js   # Harmonic generation (200 lines)
│   │   ├── GeometryRenderer.js # Canvas rendering
│   │   ├── AudioSynthesis.js   # Web Audio synthesis (221 lines)
│   │   ├── UIController.js     # Full UI controller
│   │   ├── UIControllerSimple.js  # Simplified UI controller (135 lines)
│   │   └── WaveformCalculator.js  # Waveform computation
│   │
│   ├── utils/                   # Utility modules
│   │   ├── EventGear.js        # Main EventGear class (5254 lines)
│   │   ├── EventGearAssertion.js  # Assertion utilities
│   │   ├── EventGearBridges.js    # WebSocket & Node.js bridges
│   │   ├── EventGearCallback.js   # Callback management
│   │   ├── EventGearLite.js      # Lightweight EventGear
│   │   ├── EventGearMetrics.js   # Performance metrics classes
│   │   ├── EventGearUtils.js     # Utility functions
│   │   ├── NeuroNetManager.js    # Neural network integration
│   │   └── index.js              # Utils module exports
│   │
│   └── demos/                   # Demo applications (various implementations)
│
├── tests/                       # Test suite
│   ├── test-runner.js
│   └── debug-logger.js
│
├── design-docu/                 # Design documentation
│   └── project-vision.md       # Comprehensive project vision
│
└── README-*.md                  # Module-specific documentation
```

## Entry Points

### Simplified Entry Point (Recommended for Basic Use)

- **File**: `index.html` → `src/main-simple.js`
- **Purpose**: Clean, minimal implementation focusing on core functionality
- **Size**: ~150 lines of code
- **Features**:
  - Basic harmonic visualization
  - Audio synthesis
  - Simple UI controls
  - Performance monitoring
  - Debug API

### Full-Featured Entry Point

- **File**: Various HTML files → `src/main.js`
- **Purpose**: Complete implementation with all advanced features
- **Size**: ~1054 lines of code
- **Features**:
  - All simplified features plus:
  - WebSocket integration
  - Node.js bridge
  - Neural network hooks
  - DOM binding system
  - Advanced metrics logging

## Key Design Principles

### 1. Modular Configuration
- All configuration centralized in `src/config/app-config.js`
- Easy to modify without touching application logic
- Feature flags for enabling/disabling components

### 2. Clean Initialization
- Initialization logic separated into `src/init/` modules
- EventGear setup isolated from business logic
- Performance monitoring can be toggled independently

### 3. Component Independence
- All modules communicate through EventGear only
- Zero direct dependencies between components
- Easy to add, remove, or replace modules

### 4. File Size Management
- Target: Keep files under 1440 lines
- EventGear.js is the exception (5254 lines) - already modularized into separate utility files
- Main application files kept concise through extraction

## Module Responsibilities

### Core Layer

**AppState** (`src/core/AppState.js`)
- Manages application state
- Provides undo/redo functionality
- Tracks state change metrics
- Emits events on state changes

**Visualizer** (`src/core/Visualizer.js`)
- Manages animation loop (requestAnimationFrame)
- Tracks FPS and performance metrics
- Coordinates rendering operations
- Emits frame events

### Computation Layer

**HarmonicSeries** (`src/modules/HarmonicSeries.js`)
- Generates harmonic series (natural, octave, odd, even, prime, etc.)
- Implements memoization for performance
- Applies phase transformations

**WaveformCalculator** (`src/modules/WaveformCalculator.js`)
- Transforms harmonic series into waveform data
- Supports multiple calculation modes

### Presentation Layer

**GeometryRenderer** (`src/modules/GeometryRenderer.js`)
- Renders geometric visualizations (circles, hexagons, triangles, squares)
- Supports cartesian and radial coordinate systems
- Handles canvas management and resizing

**AudioSynthesis** (`src/modules/AudioSynthesis.js`)
- Web Audio API-based additive synthesis
- Dynamic oscillator management
- Real-time frequency updates

**UIController** / **UIControllerSimple**
- UIController: Full-featured UI with all controls
- UIControllerSimple: Minimal UI for basic demo
- Handles user input and updates AppState

### EventGear Framework

The core event-driven architecture consists of:

**EventGear.js** - Main event bus (monolithic, 5254 lines)

**Modular Components** (already extracted):
- **EventGearUtils.js** - Utility functions
- **EventGearMetrics.js** - Performance metrics classes
- **EventGearCallback.js** - Callback management
- **EventGearAssertion.js** - Assertion utilities
- **EventGearBridges.js** - WebSocket & Node.js bridges
- **EventGearLite.js** - Simplified version

## Usage

### Quick Start (Simplified Version)

1. Open `index.html` in a modern browser
2. Adjust controls to explore harmonics
3. Click "Play Audio" to hear the harmonics
4. Use browser console to access `harmonicXplorerDebug` API

### Advanced Usage (Full Version)

1. Choose one of the HTML files in `src/demos/`
2. Configure `src/config/app-config.js` as needed
3. Enable desired features (WebSocket, Neural Net, etc.)
4. Load the demo HTML in a browser

## Development Guidelines

### Adding New Modules

1. Create module file in appropriate directory
2. Implement constructor accepting `(eventGear, appState)`
3. Register event listeners in constructor or init method
4. Emit events for state changes
5. Update `src/init/eventGearSetup.js` to connect events

### Keeping Files Under Size Limit

- Extract helper functions into separate files
- Move configuration to `src/config/`
- Use initialization helpers in `src/init/`
- Split large classes into smaller focused classes

### Testing

```bash
npm test           # Run all tests
npm run test:utils # Run utility tests only
```

## Performance Targets

- **Frame Rate**: 60 FPS
- **Audio Latency**: < 50ms
- **Event Throughput**: 60,000+ events/second
- **Memory Usage**: < 150 MB
- **State Update**: < 5ms

## Next Steps

See `design-docu/project-vision.md` for:
- Detailed architectural vision
- Implementation roadmap (4 phases)
- Feature specifications
- Real-world constraints

## Questions?

- Check module-specific README files (`README-*.md`)
- Examine inline code documentation
- Use browser console debug API: `harmonicXplorerDebug`
