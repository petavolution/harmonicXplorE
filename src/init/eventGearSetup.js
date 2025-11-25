/**
 * eventGearSetup.js
 *
 * Handles EventGear initialization and configuration.
 * Extracted from main.js for better modularity.
 */

import { AppConfig } from '../config/app-config.js';

/**
 * Sets up the EventGear instance with configuration
 * @param {EventGear} eventGear - EventGear instance
 * @param {string} sessionId - Unique session identifier
 * @returns {EventGear} Configured EventGear instance
 */
export function setupEventGear(eventGear, sessionId) {
  const config = AppConfig;

  // Set initial metadata
  eventGear.setMetadata({
    session: {
      id: sessionId,
      startTime: Date.now(),
      userAgent: navigator.userAgent,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height
      }
    },
    performance: {
      startTime: performance.now(),
      lastUpdateTime: performance.now(),
      totalEvents: 0,
      eventFrequencies: {},
      warnings: [],
      totalRuntime: 0
    },
    debug: {
      enabled: config.debug.enabled,
      logEvents: config.debug.logEvents,
      logPerformance: config.debug.logPerformance,
      showFPS: config.debug.showFPS
    }
  });

  // Configure EventGear with chained methods
  eventGear
    .setMaxHistorySize(config.debug.eventGearMaxHistory)
    .setFrameDuration(16.67) // Target 60fps
    .setEventPerformanceMetricsActive(true);

  // Set up callback for metadata changes
  eventGear.setCallbackMetadataChange((key, oldValue, newValue) => {
    if (config.debug.logEvents) {
      console.log(`Metadata changed for key: ${key}`, { old: oldValue, new: newValue });
    }
  });

  // Set up callback for event registration
  eventGear.setCallbackEventRegistration((event) => {
    const metadata = eventGear.getMetadata();
    const performance = metadata.performance || {};

    // Update event frequency tracking
    const eventType = event.type;
    performance.eventFrequencies[eventType] = (performance.eventFrequencies[eventType] || 0) + 1;
    performance.totalEvents = (performance.totalEvents || 0) + 1;
    performance.lastUpdateTime = Date.now();

    eventGear.setMetadata({
      ...metadata,
      performance
    });

    if (config.debug.logEvents) {
      console.log(`Event registered: ${event.type}`, event);
    }
  });

  return eventGear;
}

/**
 * Connects component events
 * @param {EventGear} eventGear - EventGear instance
 * @param {Object} components - Object containing component instances
 */
export function connectComponentEvents(eventGear, components) {
  const { visualizer, appState, harmonicSeries, waveformCalculator,
          geometryRenderer, audioSynthesis, uiController, neuroNetManager } = components;

  // Register visualizer events
  visualizer.setupEventCallbacks();
  visualizer.registerVisualizerEvents();

  // Connect state to modules
  eventGear.on('parameterChanged', (data) => {
    // Harmonic series listens for parameter changes
    if (['harmonics', 'harmonicsType', 'harmonicsPhase'].includes(data.param)) {
      harmonicSeries.updateSeries();
    }
  });

  // Connect harmonic updates to waveform calculator
  eventGear.on('harmonicSeries.updated', (data) => {
    if (waveformCalculator && typeof waveformCalculator.calculate === 'function') {
      waveformCalculator.calculate(data.harmonicSeries);
    }
  });

  // Connect audio to state changes
  eventGear.on('parameterChanged', (data) => {
    if (data.param === 'calcFrequency' && audioSynthesis.isPlaying) {
      audioSynthesis.updateFrequency(data.value);
    }
  });

  // Register connection completion
  eventGear.emit('app.connectionsEstablished', {
    timestamp: performance.now()
  });
}

/**
 * Generates a unique session ID
 * @returns {string} Unique session ID
 */
export function generateSessionId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Gets environment information
 * @returns {Object} Environment information
 */
export function getEnvironmentInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    devicePixelRatio: window.devicePixelRatio,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString()
  };
}
