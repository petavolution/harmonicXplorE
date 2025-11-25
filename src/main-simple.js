/**
 * main-simple.js
 *
 * Simplified entry point for HarmonicXplorer application.
 * Refactored for clarity, maintainability, and simplicity.
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

  // Generate session ID
  const sessionId = generateSessionId();

  // Create EventGear instance
  const eventGear = new EventGear();
  setupEventGear(eventGear, sessionId);

  // Initialize core state
  const appState = new AppState(eventGear);
  const visualizer = new Visualizer(eventGear, {
    showFPS: AppConfig.debug.showFPS
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
  eventGear.on('animation.frame', (data) => {
    const rotationAngle = appState.getParam('rotationAngle');
    const rotationSpeed = appState.getParam('rotationSpeed');

    // Update rotation
    const newAngle = rotationAngle + rotationSpeed;
    appState.params.rotationAngle = newAngle;

    // Cache sin/cos for renderers
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

  // Initialize rotation cache before starting
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
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Export for potential programmatic use
export { initializeApp };
