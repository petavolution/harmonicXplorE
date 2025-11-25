/**
 * main.js (LEGACY - Full-Featured Version)
 *
 * NOTE: This is the original, full-featured entry point with extensive
 * configuration options, debug features, WebSocket support, and neural
 * network integration. For most use cases, use main-simple.js instead.
 *
 * RECOMMENDED: See main-simple.js for the simplified, optimized entry point.
 * The simplified version focuses on core functionality with better performance
 * and easier maintainability (~150 lines vs 1054 lines).
 *
 * This file is maintained for advanced users who need:
 * - WebSocket event streaming
 * - Neural network visualization
 * - Extensive performance monitoring
 * - Waveform calculator integration
 * - Advanced debugging features
 *
 * Entry point for the HarmonicXplorer application.
 * Initializes all modules and sets up the event-driven architecture.
 */

import EventGear from './utils/EventGear.js';
import Visualizer from './core/Visualizer.js';
import AppState from './core/AppState.js';
import HarmonicSeries from './modules/HarmonicSeries.js';
import WaveformCalculator from './modules/WaveformCalculator.js';
import GeometryRenderer from './modules/GeometryRenderer.js';
import AudioSynthesis from './modules/AudioSynthesis.js';
import UIController from './modules/UIController.js';
import NeuroNetManager from './utils/NeuroNetManager.js';

// Configuration for debug mode
const config = {
  debug: {
    enabled: true,
    logEvents: false,          // Log all events to console
    logPerformance: true,      // Log performance metrics
    showFPS: true,             // Show FPS counter in UI
    trackEventFrequency: true, // Track frequency of events
    alarmThresholds: {
      highEventFrequency: 100, // Events per second
      lowFPS: 30,              // FPS threshold for warning
      memoryUsage: 150         // MB threshold for warning
    },
    metricLoggingInterval: 60000, // Log metrics every minute
    eventGearMaxHistory: 500   // Maximum number of events to keep in history
  },
  webSocket: {
    enabled: true,
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
  neuralNet: {
    enabled: true,
    neurons: 5,
    bufferSize: 1000,
    activationFunction: 'relu'
  },
  domBinding: {
    enabled: true,
    attributePrefix: 'data-eg-bind'
  }
};

// Listen for DOM content loaded to initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

/**
 * Initializes the application
 */
function initializeApp() {
  console.log('Initializing HarmonicXplorer...');
  
  // Generate a unique session ID
  const sessionId = generateSessionId();
  
  // Create a new EventGear instance with advanced configuration
  const eventGear = setupEventGear(sessionId);
  
  // Initialize and connect components
  const appState = new AppState(eventGear);
  const visualizer = new Visualizer(eventGear);

  // Get or create the canvas element for rendering
  let canvas = document.getElementById('canvas');
  if (!canvas) {
    // Create canvas if it doesn't exist
    const visualization = document.getElementById('visualization') || document.body;
    canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
    visualization.appendChild(canvas);
  }

  // Initialize modules with EventGear for communication
  const harmonicSeries = new HarmonicSeries(eventGear, appState);
  const waveformCalculator = new WaveformCalculator(eventGear, appState);
  const geometryRenderer = new GeometryRenderer(eventGear, appState, canvas);
  const audioSynthesis = new AudioSynthesis(eventGear, appState);
  const uiController = new UIController(eventGear, appState);
  
  // Initialize the neural network manager if enabled
  let neuroNetManager = null;
  if (config.neuralNet.enabled) {
    neuroNetManager = new NeuroNetManager(eventGear, {
      numberOfNeurons: config.neuralNet.neurons,
      bufferSize: config.neuralNet.bufferSize,
      activationFunction: config.neuralNet.activationFunction
    }).initialize();
    
    // Setup neural network to work with harmonics
    setupNeuralNetworkIntegration(eventGear, harmonicSeries, neuroNetManager);
  }
  
  // Set up WebSocket connections if enabled
  if (config.webSocket.enabled) {
    setupWebSocketBridges(eventGear);
  }
  
  // Setup DOM element binding if enabled
  if (config.domBinding.enabled) {
    setupDOMElementBinding(eventGear);
  }
  
  // Connect components through events
  connectComponentEvents(eventGear, {
    visualizer,
    appState,
    harmonicSeries,
    waveformCalculator,
    geometryRenderer,
    audioSynthesis,
    uiController,
    neuroNetManager
  });

  // Update rotation angle and cache sin/cos during animation
  eventGear.on('animation.frame', (data) => {
    // Get current rotation parameters
    const rotationAngle = appState.getParam('rotationAngle');
    const rotationSpeed = appState.getParam('rotationSpeed');

    // Update rotation angle based on speed (if auto-rotating)
    const newAngle = rotationAngle + rotationSpeed;
    appState.params.rotationAngle = newAngle; // Direct update to avoid triggering events

    // Calculate and cache sin/cos values for renderers
    const angleRadians = newAngle * Math.PI / 180;
    appState.setCachedData('angleSinCos', {
      sin: Math.sin(angleRadians),
      cos: Math.cos(angleRadians),
      angle: newAngle,
      radians: angleRadians
    });
  });
  
  // Set up advanced performance monitoring
  setupPerformanceMonitoring(eventGear);
  
  // Set up metrics logging at regular intervals
  setupMetricsLogging(eventGear);
  
  // Expose debug API to console
  if (config.debug.enabled) {
    window.harmonicXplorerDebug = createDebugAPI(eventGear, {
      visualizer,
      appState,
      harmonicSeries,
      waveformCalculator,
      geometryRenderer,
      audioSynthesis,
      uiController,
      neuroNetManager
    });
    
    console.log('Debug API available in console as: harmonicXplorerDebug');
  }
  
  // Initialize UI and start visualization
  uiController.initialize();
  visualizer.start();
  
  // Register application initialization complete event
  eventGear.registerEvent({
    type: 'app.initialized',
    timestamp: performance.now(),
    sessionId,
    components: [
      'visualizer',
      'appState',
      'harmonicSeries',
      'waveformCalculator',
      'geometryRenderer',
      'audioSynthesis',
      'uiController',
      ...(neuroNetManager ? ['neuroNetManager'] : []),
      ...(config.webSocket.enabled ? ['webSocketBridge'] : []),
      ...(config.domBinding.enabled ? ['domElementBinding'] : [])
    ],
    environment: getEnvironmentInfo()
  });
  
  console.log('HarmonicXplorer initialized with session ID:', sessionId);
}

/**
 * Sets up the EventGear instance with advanced configuration
 * @param {string} sessionId - Unique session identifier
 * @returns {EventGear} Configured EventGear instance
 */
function setupEventGear(sessionId) {
  // Create a new EventGear instance
  const eventGear = new EventGear();
  
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
  
  // Set up callback for when metadata changes
  eventGear.setCallbackMetadataChange((key, oldValue, newValue) => {
    if (config.debug.logEvents) {
      console.log(`Metadata changed for key: ${key}`, { old: oldValue, new: newValue });
    }
    
    // If performance metadata changed significantly, log it
    if (key === 'performance' && config.debug.logPerformance) {
      const significantChange = newValue && oldValue && (
        newValue.warnings?.length !== oldValue.warnings?.length ||
        Math.abs(newValue.totalEvents - oldValue.totalEvents) > 100
      );
      
      if (significantChange) {
        console.log('Performance metrics updated:', newValue);
      }
    }
  });
  
  // Set up callback for when events are registered
  eventGear.setCallbackEventRegistration((event) => {
    // Update metadata with event count
    const metadata = eventGear.getMetadata();
    const performance = metadata.performance || {};
    
    // Update event frequency tracking
    const eventType = event.type;
    performance.eventFrequencies[eventType] = (performance.eventFrequencies[eventType] || 0) + 1;
    performance.totalEvents = (performance.totalEvents || 0) + 1;
    performance.lastUpdateTime = performance.now();
    
    eventGear.setMetadata({
      ...metadata,
      performance
    });
    
    // Log events in debug mode
    if (config.debug.logEvents) {
      console.log(`Event registered: ${event.type}`, event);
    }
  });
  
  // Set up monitoring for critical events
  setupEventFrequencyMonitoring(eventGear);
  
  return eventGear;
}

/**
 * Connects events between components
 * @param {EventGear} eventGear - EventGear instance
 * @param {Object} components - Object containing all component instances
 */
function connectComponentEvents(eventGear, components) {
  const { visualizer, appState, harmonicSeries, waveformCalculator, geometryRenderer, audioSynthesis, uiController, neuroNetManager } = components;
  
  // Register visualizer events
  visualizer.setupEventCallbacks();
  visualizer.registerVisualizerEvents();
  
  // Connect Harmonic Series events
  eventGear.registerEventConnection('appState', 'harmonicSeries', 'parameterChanged', 'updateHarmonics');
  eventGear.registerEventConnection('harmonicSeries', 'waveformCalculator', 'harmonicsUpdated', 'calculateWaveform');
  
  // Connect Waveform Calculator events
  eventGear.registerEventConnection('waveformCalculator', 'geometryRenderer', 'waveformCalculated', 'updateGeometry');
  
  // Connect Geometry Renderer events
  eventGear.registerEventConnection('geometryRenderer', 'visualizer', 'geometryUpdated', 'render');
  
  // Connect Audio Synthesis events
  eventGear.registerEventConnection('appState', 'audioSynthesis', 'parameterChanged', 'updateAudioParameters');
  
  // Connect UI Controller events
  eventGear.registerEventConnection('uiController', 'appState', 'uiParameterChanged', 'updateParam');
  eventGear.registerEventConnection('appState', 'uiController', 'parameterChanged', 'updateUI');
  
  // Connect NeuroNet events if enabled
  if (neuroNetManager) {
    eventGear.registerEventConnection('harmonicSeries', 'neuroNetManager', 'harmonicsUpdated', 'analyzeHarmonicSeries');
    eventGear.registerEventConnection('neuroNetManager', 'appState', 'neuroNet.analysisResult', 'updateParam');
  }
  
  // Register connection completion event
  eventGear.registerEvent({
    type: 'app.connectionsEstablished',
    connections: [
      { from: 'appState', to: 'harmonicSeries', event: 'parameterChanged' },
      { from: 'harmonicSeries', to: 'waveformCalculator', event: 'harmonicsUpdated' },
      { from: 'waveformCalculator', to: 'geometryRenderer', event: 'waveformCalculated' },
      { from: 'geometryRenderer', to: 'visualizer', event: 'geometryUpdated' },
      { from: 'appState', to: 'audioSynthesis', event: 'parameterChanged' },
      { from: 'uiController', to: 'appState', event: 'uiParameterChanged' },
      { from: 'appState', to: 'uiController', event: 'parameterChanged' },
      ...(neuroNetManager ? [
        { from: 'harmonicSeries', to: 'neuroNetManager', event: 'harmonicsUpdated' },
        { from: 'neuroNetManager', to: 'appState', event: 'neuroNet.analysisResult' }
      ] : [])
    ],
    timestamp: performance.now()
  });
}

/**
 * Sets up WebSocket bridges for incoming and outgoing data
 * @param {EventGear} eventGear - EventGear instance
 */
function setupWebSocketBridges(eventGear) {
  const wsConfig = config.webSocket;
  
  // Configure incoming WebSocket
  eventGear.websocketSetIncomingUrl(wsConfig.incoming.url);
  eventGear.websocketSetIncomingChannel(wsConfig.incoming.channel);
  eventGear.websocketSetAutoReceive(wsConfig.incoming.autoReceive);
  
  // Configure outgoing WebSocket
  eventGear.websocketSetOutgoingUrl(wsConfig.outgoing.url);
  eventGear.websocketSetOutgoingChannel(wsConfig.outgoing.channel);
  eventGear.websocketSetAutoSend(wsConfig.outgoing.autoSend);
  
  // Set up event listeners for WebSocket events
  eventGear.websocketEventListenerAdd('connected', (direction) => {
    console.log(`WebSocket ${direction} connection established`);
    
    // Register WebSocket connection event
    eventGear.registerEvent({
      type: 'websocket.connected',
      direction,
      timestamp: performance.now()
    });
  });
  
  eventGear.websocketEventListenerAdd('disconnected', (direction) => {
    console.log(`WebSocket ${direction} connection closed`);
    
    // Register WebSocket disconnection event
    eventGear.registerEvent({
      type: 'websocket.disconnected',
      direction,
      timestamp: performance.now()
    });
  });
  
  // Register WebSocket configuration event
  eventGear.registerEvent({
    type: 'websocket.configured',
    config: {
      incoming: {
        url: wsConfig.incoming.url,
        channel: wsConfig.incoming.channel,
        autoReceive: wsConfig.incoming.autoReceive
      },
      outgoing: {
        url: wsConfig.outgoing.url,
        channel: wsConfig.outgoing.channel,
        autoSend: wsConfig.outgoing.autoSend
      }
    },
    timestamp: performance.now()
  });
  
  console.log('WebSocket bridges configured');
}

/**
 * Sets up the DOM element binding system
 * @param {EventGear} eventGear - EventGear instance
 */
function setupDOMElementBinding(eventGear) {
  const attributePrefix = config.domBinding.attributePrefix;
  const boundElements = {};
  
  // Initial binding of elements
  bindDOMElements();
  
  // Listen for DOM changes to rebind elements
  const observer = new MutationObserver((mutations) => {
    let shouldRebind = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        if (mutation.attributeName.startsWith(attributePrefix)) {
          shouldRebind = true;
          break;
        }
      } else if (mutation.type === 'childList') {
        shouldRebind = true;
        break;
      }
    }
    
    if (shouldRebind) {
      bindDOMElements();
    }
  });
  
  // Observe the entire document for changes
  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: [attributePrefix + '*']
  });
  
  /**
   * Binds DOM elements to EventGear events
   */
  function bindDOMElements() {
    // Find all elements with the binding attribute
    const elements = document.querySelectorAll(`[${attributePrefix}]`);
    
    elements.forEach(element => {
      const bindValue = element.getAttribute(attributePrefix);
      if (!bindValue) return;
      
      // Parse the binding value (format: "event:value")
      const [eventName, paramName] = bindValue.split(':');
      if (!eventName || !paramName) return;
      
      // Store the element binding
      if (!boundElements[eventName]) {
        boundElements[eventName] = [];
      }
      
      // Check if this element is already bound
      const existing = boundElements[eventName].findIndex(b => b.element === element);
      if (existing >= 0) {
        boundElements[eventName].splice(existing, 1);
      }
      
      // Add the new binding
      boundElements[eventName].push({
        element,
        paramName
      });
      
      // Register the event binding
      eventGear.registerEvent({
        type: 'domBinding.elementBound',
        element: element.tagName,
        id: element.id,
        eventName,
        paramName,
        timestamp: performance.now()
      });
    });
    
    // Set up event listeners for each bound event
    Object.keys(boundElements).forEach(eventName => {
      // Remove previous listener if it exists
      eventGear.off(eventName, handleEventForDOM);
      
      // Add new listener
      eventGear.on(eventName, handleEventForDOM);
    });
    
    console.log(`Bound ${elements.length} DOM elements to EventGear events`);
  }
  
  /**
   * Handles events for bound DOM elements
   * @param {Object} data - Event data
   */
  function handleEventForDOM(data) {
    const eventName = data.type || '';
    const bindings = boundElements[eventName] || [];
    
    bindings.forEach(binding => {
      const { element, paramName } = binding;
      const value = data[paramName] !== undefined ? data[paramName] : '';
      
      // Update element based on its type
      if (element.tagName === 'INPUT') {
        if (element.type === 'checkbox') {
          element.checked = Boolean(value);
        } else {
          element.value = value;
        }
      } else if (element.tagName === 'SELECT') {
        element.value = value;
      } else {
        element.textContent = value;
      }
      
      // Register DOM update event
      eventGear.registerEvent({
        type: 'domBinding.elementUpdated',
        element: element.tagName,
        id: element.id,
        paramName,
        value,
        timestamp: performance.now()
      });
    });
  }
}

/**
 * Sets up integration between the neural network and harmonic series
 * @param {EventGear} eventGear - EventGear instance
 * @param {HarmonicSeries} harmonicSeries - Harmonic series instance
 * @param {NeuroNetManager} neuroNetManager - Neural network manager instance
 */
function setupNeuralNetworkIntegration(eventGear, harmonicSeries, neuroNetManager) {
  // Listen for harmonic series updates (emitted by HarmonicSeries)
  eventGear.on('harmonicSeries.updated', async (data) => {
    if (!data.harmonicSeries || !Array.isArray(data.harmonicSeries)) return;
    
    // Analyze harmonic series using neural network
    try {
      const result = await neuroNetManager.analyzeHarmonicSeries(data.harmonicSeries);
      
      // Emit analysis result
      eventGear.emit('neuroNet.analysisResult', {
        harmonics: data.harmonicSeries,
        result,
        timestamp: performance.now()
      });
      
      // Update metadata with analysis result
      const metadata = eventGear.getMetadata() || {};
      
      eventGear.setMetadata({
        ...metadata,
        harmonicAnalysis: {
          ...(metadata.harmonicAnalysis || {}),
          lastResult: result,
          timestamp: performance.now()
        }
      });
    } catch (error) {
      console.error('Error analyzing harmonic series:', error);
    }
  });
  
  // Register neural network integration event
  eventGear.registerEvent({
    type: 'neuroNet.integrationComplete',
    timestamp: performance.now()
  });
  
  console.log('Neural network integration complete');
}

/**
 * Sets up monitoring for event frequencies
 * @param {EventGear} eventGear - EventGear instance
 */
function setupEventFrequencyMonitoring(eventGear) {
  // Critical events to monitor
  const criticalEvents = [
    'animation.frame',
    'waveformCalculated',
    'geometryUpdated',
    'parameterChanged'
  ];
  
  // Set up frequency monitoring for each critical event
  criticalEvents.forEach(eventType => {
    eventGear.monitorEventFrequency(eventType, 1000, (frequency) => {
      // Store event frequency in metadata
      const metadata = eventGear.getMetadata();
      
      if (metadata.performance) {
        metadata.performance.eventFrequencies[eventType] = frequency;
        eventGear.setMetadata(metadata);
      }
      
      // Check if frequency is above threshold
      if (frequency > config.debug.alarmThresholds.highEventFrequency) {
        const warning = `High frequency of ${eventType} events: ${frequency.toFixed(2)}/sec`;
        console.warn(warning);
        
        // Add warning to metadata
        const metadata = eventGear.getMetadata();
        
        if (metadata.performance) {
          metadata.performance.warnings = [
            ...(metadata.performance.warnings || []),
            {
              type: 'highEventFrequency',
              eventType,
              frequency,
              timestamp: performance.now()
            }
          ];
          
          eventGear.setMetadata(metadata);
        }
        
        // Register event warning
        eventGear.registerEvent({
          type: 'warning.highEventFrequency',
          eventType,
          frequency,
          threshold: config.debug.alarmThresholds.highEventFrequency,
          timestamp: performance.now()
        });
      }
    });
  });
  
  // Set up monitoring for event overload
  eventGear.monitorEventFrequency('*', 1000, (frequency) => {
    if (frequency > config.debug.alarmThresholds.highEventFrequency * 2) {
      const warning = `Event system overload: ${frequency.toFixed(2)} total events/sec`;
      console.warn(warning);
      
      // Register critical warning
      eventGear.registerEvent({
        type: 'warning.eventOverload',
        frequency,
        timestamp: performance.now()
      });
    }
  });
}

/**
 * Sets up performance monitoring
 * @param {EventGear} eventGear - EventGear instance
 */
function setupPerformanceMonitoring(eventGear) {
  // Monitor memory usage if available
  if (window.performance && window.performance.memory) {
    setInterval(() => {
      const memoryInfo = window.performance.memory;
      const usedHeapSizeMB = Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024));
      
      // Update memory usage in metadata
      const metadata = eventGear.getMetadata();
      
      if (metadata.performance) {
        metadata.performance.memoryUsageMB = usedHeapSizeMB;
        eventGear.setMetadata(metadata);
      }
      
      // Check if memory usage is above threshold
      if (usedHeapSizeMB > config.debug.alarmThresholds.memoryUsage) {
        const warning = `High memory usage: ${usedHeapSizeMB} MB`;
        console.warn(warning);
        
        // Register memory warning
        eventGear.registerEvent({
          type: 'warning.highMemoryUsage',
          memoryUsageMB: usedHeapSizeMB,
          threshold: config.debug.alarmThresholds.memoryUsage,
          timestamp: performance.now()
        });
      }
    }, 10000); // Check every 10 seconds
  }
  
  // Monitor FPS
  let lastFPSWarningTime = 0;
  
  eventGear.on('visualizer.fpsUpdate', (data) => {
    const fps = data.fps;
    const now = performance.now();
    
    // Update FPS in metadata
    const metadata = eventGear.getMetadata();
    
    if (metadata.performance) {
      metadata.performance.currentFPS = fps;
      eventGear.setMetadata(metadata);
    }
    
    // Check if FPS is below threshold and we haven't warned recently
    if (fps < config.debug.alarmThresholds.lowFPS && now - lastFPSWarningTime > 5000) {
      const warning = `Low FPS detected: ${fps.toFixed(1)}`;
      console.warn(warning);
      
      // Register FPS warning
      eventGear.registerEvent({
        type: 'warning.lowFPS',
        fps,
        threshold: config.debug.alarmThresholds.lowFPS,
        timestamp: now
      });
      
      lastFPSWarningTime = now;
    }
  });
}

/**
 * Sets up metrics logging at regular intervals
 * @param {EventGear} eventGear - EventGear instance
 */
function setupMetricsLogging(eventGear) {
  setInterval(() => {
    if (!config.debug.logPerformance) return;
    
    // Get EventGear metrics if available
    const metrics = typeof eventGear.getEventPerformanceMetrics === 'function' 
      ? eventGear.getEventPerformanceMetrics() 
      : null;
    
    // Get metadata
    const metadata = eventGear.getMetadata();
    
    // Create metrics report
    const report = {
      timestamp: performance.now(),
      totalRuntime: metadata.performance?.totalRuntime || performance.now() - metadata.performance?.startTime,
      totalEvents: metadata.performance?.totalEvents || 0,
      eventFrequencies: metadata.performance?.eventFrequencies || {},
      warnings: metadata.performance?.warnings || [],
      memory: metadata.performance?.memoryUsageMB,
      fps: metadata.performance?.currentFPS,
      eventGearMetrics: metrics
    };
    
    // Register metrics report
    eventGear.registerEvent({
      type: 'app.metricsReport',
      report,
      timestamp: performance.now()
    });
    
    // Log report
    console.group('HarmonicXplorer Metrics Report');
    console.log('Total Runtime:', (report.totalRuntime / 60000).toFixed(2), 'minutes');
    console.log('Total Events:', report.totalEvents);
    console.log('Current FPS:', report.fps ? report.fps.toFixed(1) : 'unknown');
    console.log('Memory Usage:', report.memory ? `${report.memory} MB` : 'unknown');
    
    if (metrics) {
      console.log('Event Performance Metrics:', metrics);
    }
    
    if (Object.keys(report.eventFrequencies).length > 0) {
      console.log('Event Frequencies:');
      Object.entries(report.eventFrequencies)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([eventType, frequency]) => {
          console.log(`  ${eventType}: ${frequency.toFixed(2)}/sec`);
        });
    }
    
    if (report.warnings.length > 0) {
      console.log('Recent Warnings:', report.warnings.slice(-5));
    }
    
    console.groupEnd();
  }, config.debug.metricLoggingInterval);
}

/**
 * Creates a debug API exposed to the browser console
 * @param {EventGear} eventGear - EventGear instance
 * @param {Object} components - Application components
 * @returns {Object} Debug API object
 */
function createDebugAPI(eventGear, components) {
  return {
    // Core access
    eventGear,
    components,
    
    // Toggle debug features
    toggleEventLogging: () => {
      const metadata = eventGear.getMetadata();
      metadata.debug.logEvents = !metadata.debug.logEvents;
      eventGear.setMetadata(metadata);
      console.log(`Event logging ${metadata.debug.logEvents ? 'enabled' : 'disabled'}`);
      return metadata.debug.logEvents;
    },
    
    togglePerformanceLogging: () => {
      const metadata = eventGear.getMetadata();
      metadata.debug.logPerformance = !metadata.debug.logPerformance;
      eventGear.setMetadata(metadata);
      console.log(`Performance logging ${metadata.debug.logPerformance ? 'enabled' : 'disabled'}`);
      return metadata.debug.logPerformance;
    },
    
    toggleFPSDisplay: () => {
      const metadata = eventGear.getMetadata();
      metadata.debug.showFPS = !metadata.debug.showFPS;
      eventGear.setMetadata(metadata);
      components.visualizer.setDebugMode(metadata.debug.showFPS);
      console.log(`FPS display ${metadata.debug.showFPS ? 'enabled' : 'disabled'}`);
      return metadata.debug.showFPS;
    },
    
    // WebSocket and Node.js communication controls
    websocket: {
      getStatus: () => {
        return {
          incomingActive: eventGear.websocketGetIncomingWebSocketActive(),
          outgoingActive: eventGear.websocketGetOutgoingWebSocketActive(),
          incomingChannel: eventGear.websocketGetIncomingChannel(),
          outgoingChannel: eventGear.websocketGetOutgoingChannel(),
          autoReceive: eventGear.websocketGetAutoReceive(),
          autoSend: eventGear.websocketGetAutoSend(),
          autoPassThrough: eventGear.websocketGetAutoPassThrough()
        };
      },
      
      connect: (incoming = config.webSocket.incoming.url, outgoing = config.webSocket.outgoing.url) => {
        eventGear.websocketSetIncomingUrl(incoming);
        eventGear.websocketSetOutgoingUrl(outgoing || incoming);
        console.log(`WebSocket connections initiated to ${incoming}`);
        return 'Connection attempt initiated';
      },
      
      disconnect: () => {
        eventGear.websocketReset();
        console.log('WebSocket connections reset');
        return 'WebSocket connections reset';
      },
      
      sendTestEvent: (data = { test: 'message', timestamp: Date.now() }) => {
        eventGear.websocketSendEvent(data);
        console.log('Test event sent via WebSocket:', data);
        return 'Test event sent';
      },
      
      setChannels: (incoming, outgoing) => {
        if (incoming) eventGear.websocketSetIncomingChannel(incoming);
        if (outgoing) eventGear.websocketSetOutgoingChannel(outgoing);
        console.log(`WebSocket channels set - In: ${incoming}, Out: ${outgoing}`);
        return 'WebSocket channels updated';
      }
    },
    
    nodejs: {
      getStatus: () => {
        return {
          isNodeEnvironment: typeof process !== 'undefined' && process.versions && process.versions.node,
          nodeIntegrationEnabled: typeof eventGear.nodeGetIncomingChannel === 'function',
          incomingChannel: typeof eventGear.nodeGetIncomingChannel === 'function' ? 
            eventGear.nodeGetIncomingChannel() : 'Not available',
          outgoingChannel: typeof eventGear.nodeGetOutgoingChannel === 'function' ? 
            eventGear.nodeGetOutgoingChannel() : 'Not available'
        };
      },
      
      setChannels: (incoming, outgoing) => {
        if (typeof eventGear.nodeSetIncomingChannel !== 'function' || 
            typeof eventGear.nodeSetOutgoingChannel !== 'function') {
          return 'Node.js integration not available';
        }
        
        if (incoming) eventGear.nodeSetIncomingChannel(incoming);
        if (outgoing) eventGear.nodeSetOutgoingChannel(outgoing);
        console.log(`Node.js channels set - In: ${incoming}, Out: ${outgoing}`);
        return 'Node.js channels updated';
      },
      
      sendTestEvent: (data = { test: 'message', timestamp: Date.now() }) => {
        if (typeof eventGear.nodeSend !== 'function') {
          return 'Node.js integration not available';
        }
        
        eventGear.nodeSend('test', data);
        console.log('Test event sent via Node.js:', data);
        return 'Test event sent';
      }
    },
    
    // Data access
    getMetrics: () => {
      const appStateMetrics = components.appState.getStateMetrics();
      const eventGearMetrics = typeof eventGear.getEventPerformanceMetrics === 'function' 
        ? eventGear.getEventPerformanceMetrics() 
        : null;
      
      return {
        appState: appStateMetrics,
        eventGear: eventGearMetrics,
        metadata: eventGear.getMetadata()
      };
    },
    
    getRecentEvents: (count = 10) => {
      return typeof eventGear.getRecentEvents === 'function' 
        ? eventGear.getRecentEvents(count) 
        : 'Event history not available';
    },
    
    // Neural network controls
    neuroNet: {
      getStatus: () => {
        if (!components.neuroNetManager) {
          return 'Neural network not enabled';
        }
        
        const metadata = eventGear.getMetadata() || {};
        return metadata.neuroNet || 'Neural network metadata not available';
      },
      
      analyzeHarmonics: async (harmonics = [1, 0.5, 0.33, 0.25, 0.2]) => {
        if (!components.neuroNetManager) {
          return 'Neural network not enabled';
        }
        
        try {
          const result = await components.neuroNetManager.analyzeHarmonicSeries(harmonics);
          console.log('Harmonic series analysis result:', result);
          return result;
        } catch (error) {
          console.error('Error analyzing harmonic series:', error);
          return 'Error analyzing harmonic series';
        }
      },
      
      loadTestModel: () => {
        if (!components.neuroNetManager) {
          return 'Neural network not enabled';
        }
        
        components.neuroNetManager.loadSimpleFeedforwardModel();
        components.neuroNetManager.activateModel('simpleFeedforward');
        console.log('Test neural network model loaded and activated');
        return 'Test neural network model loaded and activated';
      }
    },
    
    // Testing and stress testing
    simulateRapidStateChanges: (count = 10, interval = 50) => {
      let counter = 0;
      const timer = setInterval(() => {
        components.appState.updateParam('rotationAngle', Math.random() * 360);
        counter++;
        
        if (counter >= count) {
          clearInterval(timer);
          console.log(`Completed ${count} rapid state changes`);
        }
      }, interval);
      
      return `Simulating ${count} state changes at ${interval}ms intervals`;
    },
    
    injectTestEvent: (eventType, data = {}) => {
      eventGear.emit(eventType, {
        ...data,
        source: 'debugAPI',
        timestamp: performance.now()
      });
      
      return `Test event "${eventType}" injected`;
    },
    
    // DOM binding controls
    domBinding: {
      getBindings: () => {
        const elements = document.querySelectorAll(`[${config.domBinding.attributePrefix}]`);
        const bindings = [];
        
        elements.forEach(element => {
          const bindValue = element.getAttribute(config.domBinding.attributePrefix);
          if (bindValue) {
            const [eventName, paramName] = bindValue.split(':');
            bindings.push({
              element: element.tagName,
              id: element.id,
              eventName,
              paramName
            });
          }
        });
        
        return bindings;
      },
      
      simulateEvent: (eventName, params = {}) => {
        eventGear.emit(eventName, {
          ...params,
          type: eventName,
          source: 'debugAPI',
          timestamp: performance.now()
        });
        
        return `Event "${eventName}" simulated for DOM binding`;
      }
    }
  };
}

/**
 * Generates a unique session ID
 * @returns {string} Unique session ID
 */
function generateSessionId() {
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
function getEnvironmentInfo() {
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