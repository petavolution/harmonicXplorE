/**
 * app-config.js
 *
 * Centralized configuration for HarmonicXplorer application.
 * Separates configuration from initialization logic for better maintainability.
 */

export const AppConfig = {
  // Debug and Development Settings
  debug: {
    enabled: true,
    logEvents: false,
    logPerformance: true,
    showFPS: true,
    trackEventFrequency: true,
    alarmThresholds: {
      highEventFrequency: 100,  // Events per second
      lowFPS: 30,               // FPS threshold for warning
      memoryUsage: 150          // MB threshold for warning
    },
    metricLoggingInterval: 60000,  // Log metrics every minute
    eventGearMaxHistory: 500       // Maximum events in history
  },

  // WebSocket Configuration
  webSocket: {
    enabled: false,  // Disabled by default for simpler startup
    incoming: {
      url: 'ws://localhost:8080/events',
      channel: 'incomingWebSocketChannel',
      autoReceive: true
    },
    outgoing: {
      url: 'ws://localhost:8080/publish',
      channel: 'outgoingWebSocketChannel',
      autoSend: true
    }
  },

  // Neural Network Configuration
  neuralNet: {
    enabled: false,  // Disabled by default for simpler startup
    neurons: 5,
    bufferSize: 1000,
    activationFunction: 'relu'
  },

  // DOM Binding Configuration
  domBinding: {
    enabled: true,
    attributePrefix: 'data-eg-bind'
  },

  // Default Application Parameters
  defaults: {
    // Visualization parameters
    axis: 3,
    coordinateSystem: 'cartesian',
    harmonics: 8,
    harmonicsType: 'natural',
    harmonicsPhase: 'phaseFull',
    wavelength: 1.0,
    rotationAngle: 0.0,
    rotationSpeed: 0.01,
    zoomManual: 1.0,

    // Audio parameters
    isAddSynthPlaying: false,
    calcFrequency: 440,

    // System parameters
    fps: 0,
    calculationTime: 0
  }
};

export default AppConfig;
