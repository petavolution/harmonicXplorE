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

    // Shape visibility
    showAxis: true,
    showCircle: true,
    showHex: false,
    showHexIn: false,
    showSquare: false,
    showSquareIn: false,
    showTriangle: false,
    showWave: false,

    // Shape colors
    AxisColor: '#444444',
    circleColor: '#00ff00',
    hexColor: '#ff00ff',
    hexInColor: '#ffff00',
    squareColor: '#00ffff',
    squareInColor: '#ff8800',
    triangleColor: '#ff0088',

    // Audio parameters
    isAddSynthPlaying: false,
    calcFrequency: 440,

    // System parameters
    fps: 0,
    calculationTime: 0
  },

  // Parameter constraints for validation
  constraints: {
    calcFrequency: { min: 20, max: 20000 },      // Human hearing range
    harmonics: { min: 1, max: 32 },               // Reasonable harmonic count
    rotationSpeed: { min: -0.5, max: 0.5 },       // Prevent extreme rotation
    zoomManual: { min: 0.1, max: 10 },            // Reasonable zoom range
    axis: { min: 1, max: 12 }                     // Reasonable axis count
  }
};

/**
 * Validates and clamps a parameter value to its constraints
 * @param {string} param - Parameter name
 * @param {any} value - Value to validate
 * @returns {any} - Validated/clamped value
 */
export function validateParam(param, value) {
  // If no constraints defined, return value as-is
  if (!AppConfig.constraints[param]) {
    return value;
  }

  const { min, max } = AppConfig.constraints[param];

  // For numeric values, clamp to range
  if (typeof value === 'number' && !isNaN(value)) {
    return Math.max(min, Math.min(max, value));
  }

  return value;
}

export default AppConfig;
