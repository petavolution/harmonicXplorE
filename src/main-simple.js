/**
 * main-simple.js (RECOMMENDED ENTRY POINT)
 *
 * Simplified, optimized entry point for HarmonicXplorer application.
 * Refactored for clarity, maintainability, and performance.
 *
 * This is the recommended entry point for most users, focusing on:
 * - Core harmonic visualization functionality
 * - Clean, maintainable code structure (~150 lines)
 * - Optimal performance with conditional features
 * - Error handling with user-friendly messages
 * - Clear initialization sequence
 *
 * Features included:
 * ✓ Real-time harmonic visualization
 * ✓ Interactive controls (frequency, harmonics, coordinate systems)
 * ✓ Geometry rendering (circle, axis, polygons)
 * ✓ Audio synthesis (optional)
 * ✓ FPS monitoring (optional)
 * ✓ Debug API (when enabled in config)
 *
 * For advanced features (WebSocket, Neural Network, WaveformCalculator),
 * see main.js (full-featured version).
 */

import EventGear from './utils/EventGear.js';
import Visualizer from './core/Visualizer.js';
import AppState from './core/AppState.js';
import HarmonicSeries from './modules/HarmonicSeries.js';
import GeometryRenderer from './modules/GeometryRenderer.js';
import AudioSynthesis from './modules/AudioSynthesis.js';
import UIControllerSimple from './modules/UIControllerSimple.js';

import { AppConfig } from './config/app-config.js';
import {
  setupEventGear,
  connectComponentEvents,
  generateSessionId,
  getEnvironmentInfo
} from './init/eventGearSetup.js';
import {
  setupPerformanceMonitoring,
  setupMetricsLogging
} from './init/performanceMonitoring.js';

/**
 * Main application initialization
 */
function initializeApp() {
  console.log('🎵 Initializing HarmonicXplorer...');

  try {
    // Generate session ID
    const sessionId = generateSessionId();

    // Create EventGear instance
    const eventGear = new EventGear();
    setupEventGear(eventGear, sessionId);

    // Initialize core state
    const appState = new AppState(eventGear);
    const visualizer = new Visualizer(eventGear, {
      showFPS: AppConfig.debug.showFPS,
      performanceTracking: AppConfig.debug.logPerformance  // Only track if debug enabled
    });

    // Get or create canvas
    let canvas = document.getElementById('canvas');
    if (!canvas) {
      const visualization = document.getElementById('visualization') || document.body;
      canvas = document.createElement('canvas');
      canvas.id = 'canvas';
      canvas.style.cssText = 'width: 100%; height: 100%;';
      visualization.appendChild(canvas);
    }

    // Initialize modules
    const harmonicSeries = new HarmonicSeries(eventGear, appState);
    const geometryRenderer = new GeometryRenderer(eventGear, appState, canvas);
    const audioSynthesis = new AudioSynthesis(eventGear, appState);
    const uiController = new UIControllerSimple(eventGear, appState);

    // Connect components through events
    const components = {
      visualizer,
      appState,
      harmonicSeries,
      geometryRenderer,
      audioSynthesis,
      uiController
    };

    connectComponentEvents(eventGear, components);

    // Set up animation frame handler
    // Note: Direct property mutation used for performance (avoids 60 events/sec)
    eventGear.on('animation.frame', (data) => {
      const rotationAngle = appState.getParam('rotationAngle');
      const rotationSpeed = appState.getParam('rotationSpeed');

      // Update rotation (direct mutation to avoid event overhead)
      const newAngle = rotationAngle + rotationSpeed;
      appState.params.rotationAngle = newAngle;

      // Cache sin/cos for renderers (avoids recalculating in each renderer)
      const angleRadians = newAngle * Math.PI / 180;
      appState.setCachedData('angleSinCos', {
        sin: Math.sin(angleRadians),
        cos: Math.cos(angleRadians),
        angle: newAngle,
        radians: angleRadians
      });
    });

    // Set up performance monitoring
    if (AppConfig.debug.logPerformance) {
      setupPerformanceMonitoring(eventGear);
      setupMetricsLogging(eventGear);
    }

    // Expose debug API if enabled
    if (AppConfig.debug.enabled) {
      window.harmonicXplorerDebug = {
        eventGear,
        appState,
        visualizer,
        harmonicSeries,
        geometryRenderer,
        audioSynthesis,
        uiController,
        config: AppConfig,

        // Helper functions
        getMetrics: () => ({
          appState: appState.getStateMetrics(),
          eventGear: eventGear.getMetadata()
        }),

        logState: () => {
          console.log('Current State:', appState.getAllParams());
        }
      };

      console.log('🐛 Debug API available: harmonicXplorerDebug');
    }

    // Initialize rotation cache (will be updated by animation.frame handler)
    const initialAngle = appState.getParam('rotationAngle');
    const initialRadians = initialAngle * Math.PI / 180;
    appState.setCachedData('angleSinCos', {
      sin: Math.sin(initialRadians),
      cos: Math.cos(initialRadians),
      angle: initialAngle,
      radians: initialRadians
    });

    // Initialize UI and start visualization
    uiController.initialize();
    visualizer.start();

    // Emit initialization complete
    eventGear.emit('app.initialized', {
      timestamp: performance.now(),
      sessionId,
      environment: getEnvironmentInfo()
    });

    console.log(`✅ HarmonicXplorer initialized (Session: ${sessionId})`);

  } catch (error) {
    console.error('❌ Failed to initialize HarmonicXplorer:', error);

    // Display user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ff4444;
      color: white;
      padding: 20px;
      border-radius: 8px;
      font-family: sans-serif;
      max-width: 500px;
      z-index: 10000;
    `;
    errorDiv.innerHTML = `
      <h3>Initialization Error</h3>
      <p>Failed to start HarmonicXplorer. Please check the console for details.</p>
      <pre style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px; overflow: auto;">${error.message}</pre>
    `;
    document.body.appendChild(errorDiv);

    throw error; // Re-throw for debugging
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Export for potential programmatic use
export { initializeApp };
