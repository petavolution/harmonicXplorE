/**
 * Visualizer.js
 * 
 * Core visualization manager responsible for the animation loop and
 * coordinating rendering operations. It uses EventGear for efficient
 * event-driven communication.
 */

export default class Visualizer {
  /**
   * Creates a new Visualizer instance
   * @param {Object} eventGear - EventGear instance for event coordination
   * @param {Object} options - Configuration options
   */
  constructor(eventGear, options = {}) {
    // Use provided EventGear instance or create a new one
    this.eventGear = eventGear;
    
    // Animation state
    this.isAnimating = false;
    this.animationId = null;
    this.lastFrameTime = 0;
    this.frameCount = 0;
    
    // Configuration options
    this.options = {
      targetFPS: 60,
      showFPS: options.showFPS || false,
      enableDebug: options.debug || false,
      performanceTracking: options.performanceTracking || true,
      ...options
    };
    
    // Performance tracking data
    this.fps = 0;
    this.frameTime = 0;
    this.jitterHistory = [];
    this.fpsHistory = [];
    this.eventFrequencyHistory = {};
    this.performanceWarnings = [];
    this.lowFpsCount = 0;
    this.performanceReportTimer = null;
    this.criticalPerformanceEvents = [];
    
    // Configure EventGear with chained method pattern
    this.configureEventGear();
    
    // Set up metadata tracking
    this.setupMetadataTracking();
    
    // Set up event callbacks
    this.setupEventCallbacks();
    
    // Set up performance tracking
    this.setupPerformanceTracking();
    
    // Set up resize observer
    this.setupResizeObserver();
    
    // Register visualizer events
    this.registerVisualizerEvents();
    
    // Set up debug mode if enabled
    if (this.options.enableDebug) {
      this.setupDebugMode();
    }
    
    console.log('Visualizer initialized with EventGear');
  }
  
  /**
   * Configures EventGear with chained method calls
   */
  configureEventGear() {
    if (typeof this.eventGear.setMaxHistorySize === 'function') {
      this.eventGear
        .setMaxHistorySize(200)
        .setFrameDuration(1000 / this.options.targetFPS)
        .setEventPerformanceMetricsActive(true);
    }
  }
  
  /**
   * Sets up metadata tracking for the visualizer
   */
  setupMetadataTracking() {
    // Initialize metadata for the visualizer
    const existingMetadata = this.eventGear.getMetadata() || {};
    
    this.eventGear.setMetadata({
      ...existingMetadata,
      visualizer: {
        initialized: true,
        startTime: performance.now(),
        isAnimating: this.isAnimating,
        frameCount: 0,
        fps: 0,
        frameTime: 0,
        performanceWarnings: [],
        lastEventTimestamps: {},
        eventFrequencies: {}
      }
    });
    
    // Set up callback for metadata changes
    this.eventGear.setCallbackMetadataChange((key, oldValue, newValue) => {
      if (key === 'visualizer') {
        // Track significant changes in visualizer metadata
        const significantChanges = [];
        
        if (oldValue && newValue) {
          if (oldValue.isAnimating !== newValue.isAnimating) {
            significantChanges.push('animationState');
          }
          
          if (Math.abs(oldValue.fps - newValue.fps) > 5) {
            significantChanges.push('fps');
          }
          
          if (newValue.performanceWarnings?.length > (oldValue.performanceWarnings?.length || 0)) {
            significantChanges.push('warnings');
          }
          
          if (significantChanges.length > 0) {
            this.eventGear.registerEvent({
              type: 'visualizer.metadataChanged',
              changes: significantChanges,
              timestamp: performance.now()
            });
            
            // Log in debug mode
            if (this.options.enableDebug) {
              console.log(`Visualizer metadata changed: ${significantChanges.join(', ')}`, {
                old: oldValue,
                new: newValue
              });
            }
          }
        }
      }
    });
  }
  
  /**
   * Sets up event callbacks for the visualizer
   */
  setupEventCallbacks() {
    // Monitor FPS and jitter
    this.eventGear.on('animation.frame', (data) => {
      // Track frame time for jitter calculation
      this.jitterHistory.push(data.delta);
      
      // Keep only last 60 frames for jitter calculation
      if (this.jitterHistory.length > 60) {
        this.jitterHistory.shift();
      }
      
      // Calculate jitter (variation in frame times)
      if (this.jitterHistory.length > 10) {
        const avg = this.jitterHistory.reduce((a, b) => a + b, 0) / this.jitterHistory.length;
        const variance = this.jitterHistory.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / this.jitterHistory.length;
        const jitter = Math.sqrt(variance);
        
        // Update metadata
        const metadata = this.eventGear.getMetadata() || {};
        const visualizerMetadata = metadata.visualizer || {};
        
        this.eventGear.setMetadata({
          ...metadata,
          visualizer: {
            ...visualizerMetadata,
            jitter
          }
        });
        
        // Emit high jitter warning if needed
        if (jitter > 16.67) { // More than one frame (at 60fps) of variation
          this.eventGear.emit('visualizer.warning', {
            type: 'highJitter',
            jitter,
            threshold: 16.67,
            timestamp: performance.now()
          });
          
          // Add to performance warnings
          this.performanceWarnings.push({
            type: 'highJitter',
            value: jitter,
            timestamp: performance.now()
          });
          
          // Update metadata
          const metadata = this.eventGear.getMetadata() || {};
          const visualizerMetadata = metadata.visualizer || {};
          
          this.eventGear.setMetadata({
            ...metadata,
            visualizer: {
              ...visualizerMetadata,
              performanceWarnings: [
                ...visualizerMetadata.performanceWarnings || [],
                {
                  type: 'highJitter',
                  jitter,
                  timestamp: performance.now()
                }
              ]
            }
          });
        }
      }
    });
    
    // Track event registration
    if (typeof this.eventGear.setCallbackEventRegistration === 'function') {
      this.eventGear.setCallbackEventRegistration((event) => {
        // Track event frequencies for visualization-related events
        const visualizationEvents = [
          'animation.frame',
          'animation.start',
          'animation.stop',
          'visualizer.resize',
          'visualizer.fpsUpdate',
          'visualizer.warning'
        ];
        
        if (visualizationEvents.includes(event.type)) {
          // Update event timestamp
          const now = performance.now();
          const lastTimestamp = this.eventGear.getMetadata()?.visualizer?.lastEventTimestamps?.[event.type] || 0;
          
          // Calculate frequency if we have a previous timestamp
          if (lastTimestamp > 0) {
            const timeDiff = now - lastTimestamp;
            const frequency = 1000 / timeDiff; // events per second
            
            // Update event frequency history
            if (!this.eventFrequencyHistory[event.type]) {
              this.eventFrequencyHistory[event.type] = [];
            }
            
            this.eventFrequencyHistory[event.type].push(frequency);
            
            // Keep only last 60 frequency measurements
            if (this.eventFrequencyHistory[event.type].length > 60) {
              this.eventFrequencyHistory[event.type].shift();
            }
            
            // Update metadata
            const metadata = this.eventGear.getMetadata() || {};
            const visualizerMetadata = metadata.visualizer || {};
            
            this.eventGear.setMetadata({
              ...metadata,
              visualizer: {
                ...visualizerMetadata,
                lastEventTimestamps: {
                  ...visualizerMetadata.lastEventTimestamps,
                  [event.type]: now
                },
                eventFrequencies: {
                  ...visualizerMetadata.eventFrequencies,
                  [event.type]: frequency
                }
              }
            });
          } else {
            // First event of this type, just record timestamp
            const metadata = this.eventGear.getMetadata() || {};
            const visualizerMetadata = metadata.visualizer || {};
            
            this.eventGear.setMetadata({
              ...metadata,
              visualizer: {
                ...visualizerMetadata,
                lastEventTimestamps: {
                  ...visualizerMetadata.lastEventTimestamps,
                  [event.type]: now
                }
              }
            });
          }
        }
      });
    }
  }
  
  /**
   * Sets up performance tracking and alarms
   */
  setupPerformanceTracking() {
    // Start performance report timer
    this.performanceReportTimer = setInterval(() => {
      this.generatePerformanceReport();
    }, 60000); // Generate report every minute
    
    // Set up performance alarms
    this.setupPerformanceAlarms();
    
    // Monitor FPS performance
    this.trackFpsPerformance();
    
    // Set up monitoring for critical events
    this.monitorCriticalEvents();
  }
  
  /**
   * Sets up performance alarms for the visualizer
   */
  setupPerformanceAlarms() {
    // Set up alarm for continuous low FPS
    if (typeof this.eventGear.setCallbackIntervalCount === 'function') {
      this.eventGear.setCallbackIntervalCount('visualizer.warning', 5, (count) => {
        this.eventGear.registerEvent({
          type: 'visualizer.criticalWarning',
          message: `Multiple performance warnings (${count}) detected in a short interval`,
          warnings: this.performanceWarnings.slice(-5),
          timestamp: performance.now()
        });
        
        console.warn(`Critical: Multiple performance warnings (${count}) detected`);
      });
    }
    
    // Set up alarm for long running sessions
    if (typeof this.eventGear.setCallbackTotalTime === 'function') {
      this.eventGear.setCallbackTotalTime(1800000, (totalTime) => { // 30 minutes
        this.generatePerformanceReport(true); // Force a report
        
        this.eventGear.registerEvent({
          type: 'visualizer.sessionLengthWarning',
          totalTime,
          message: `Visualization session running for ${Math.round(totalTime / 60000)} minutes`,
          timestamp: performance.now()
        });
      });
    }
  }
  
  /**
   * Tracks FPS performance and emits warnings for continuous low FPS
   */
  trackFpsPerformance() {
    // Add event listener for FPS updates
    this.eventGear.on('visualizer.fpsUpdate', (data) => {
      const { fps } = data;
      
      // Add to FPS history
      this.fpsHistory.push(fps);
      
      // Keep only last 60 FPS measurements
      if (this.fpsHistory.length > 60) {
        this.fpsHistory.shift();
      }
      
      // Check for continuous low FPS
      if (fps < 30) {
        this.lowFpsCount++;
        
        // If low FPS for 5 consecutive frames, register a critical performance event
        if (this.lowFpsCount >= 5) {
          const avgFps = this.fpsHistory.slice(-5).reduce((a, b) => a + b, 0) / 5;
          
          this.eventGear.registerEvent({
            type: 'visualizer.criticalPerformance',
            fps: avgFps,
            message: `Critical: Continuous low FPS (${avgFps.toFixed(1)})`,
            timestamp: performance.now()
          });
          
          // Add to critical performance events
          this.criticalPerformanceEvents.push({
            type: 'lowFps',
            fps: avgFps,
            timestamp: performance.now()
          });
          
          // Reset counter after warning
          this.lowFpsCount = 0;
        }
      } else {
        // Reset counter if FPS is good
        this.lowFpsCount = 0;
      }
    });
  }
  
  /**
   * Monitors critical events for the visualizer
   */
  monitorCriticalEvents() {
    // Monitor animation frame events for overload
    this.eventGear.monitorEventFrequency('animation.frame', 1000, (frequency) => {
      // Update metadata
      const metadata = this.eventGear.getMetadata() || {};
      const visualizerMetadata = metadata.visualizer || {};
      
      this.eventGear.setMetadata({
        ...metadata,
        visualizer: {
          ...visualizerMetadata,
          frameFrequency: frequency
        }
      });
      
      // Warn if frequency is too high (more than 120 frames per second)
      if (frequency > 120) {
        this.eventGear.emit('visualizer.warning', {
          type: 'highFrameRate',
          frequency,
          threshold: 120,
          timestamp: performance.now()
        });
        
        // Add to performance warnings
        this.performanceWarnings.push({
          type: 'highFrameRate',
          value: frequency,
          timestamp: performance.now()
        });
      }
    });
  }
  
  /**
   * Gets EventGear metrics for performance reporting
   * @returns {Object} EventGear metrics
   */
  getEventGearMetrics() {
    if (typeof this.eventGear.getEventPerformanceMetrics !== 'function') {
      return null;
    }
    
    return this.eventGear.getEventPerformanceMetrics();
  }
  
  /**
   * Generates a performance report for the visualizer
   * @param {boolean} forceLog - Force logging even if debug is disabled
   */
  generatePerformanceReport(forceLog = false) {
    // Calculate average FPS and jitter
    const avgFps = this.fpsHistory.length > 0 ? 
      this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length : 0;
    
    const avgJitter = this.jitterHistory.length > 0 ? 
      this.jitterHistory.reduce((a, b) => a + b, 0) / this.jitterHistory.length : 0;
    
    // Get EventGear metrics
    const eventGearMetrics = this.getEventGearMetrics();
    
    // Create performance report
    const report = {
      timestamp: performance.now(),
      frameCount: this.frameCount,
      averageFps: avgFps,
      currentFps: this.fps,
      averageFrameTime: avgJitter,
      eventFrequencies: this.eventFrequencyHistory,
      criticalEvents: this.criticalPerformanceEvents,
      eventGearMetrics
    };
    
    // Register performance report event
    this.eventGear.registerEvent({
      type: 'visualizer.performanceReport',
      report,
      timestamp: performance.now()
    });
    
    // Log report if in debug mode or forced
    if (this.options.enableDebug || forceLog) {
      console.group('Visualizer Performance Report');
      console.log('Frame Count:', this.frameCount);
      console.log('Average FPS:', avgFps.toFixed(2));
      console.log('Current FPS:', this.fps.toFixed(2));
      console.log('Average Frame Time:', avgJitter.toFixed(2), 'ms');
      
      if (this.criticalPerformanceEvents.length > 0) {
        console.log('Critical Performance Events:', this.criticalPerformanceEvents.length);
        this.criticalPerformanceEvents.slice(-5).forEach(event => {
          console.log(`- ${new Date(event.timestamp).toISOString()}: ${event.type} (${event.fps})`);
        });
      }
      
      if (eventGearMetrics) {
        console.log('EventGear Metrics:', eventGearMetrics);
      }
      
      console.groupEnd();
    }
    
    return report;
  }
  
  /**
   * Registers visualizer events
   */
  registerVisualizerEvents() {
    // Register initialization event
    this.eventGear.registerEvent({
      type: 'visualizer.initialized',
      options: this.options,
      timestamp: performance.now()
    });
    
    // Register performance tracking initialization
    if (this.options.performanceTracking) {
      this.eventGear.registerEvent({
        type: 'visualizer.performanceTrackingEnabled',
        timestamp: performance.now()
      });
    }
    
    // Register visualization configuration
    this.eventGear.registerEvent({
      type: 'visualizer.configured',
      config: {
        targetFPS: this.options.targetFPS,
        showFPS: this.options.showFPS,
        enableDebug: this.options.enableDebug
      },
      timestamp: performance.now()
    });
  }
  
  /**
   * Sets up a resize observer to detect viewport changes
   */
  setupResizeObserver() {
    // Track viewport size
    const updateViewportSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Register resize event
      this.eventGear.emit('visualizer.resize', {
        width,
        height,
        aspectRatio: width / height,
        timestamp: performance.now()
      });
      
      // Update metadata
      const metadata = this.eventGear.getMetadata() || {};
      const visualizerMetadata = metadata.visualizer || {};
      
      this.eventGear.setMetadata({
        ...metadata,
        visualizer: {
          ...visualizerMetadata,
          viewport: {
            width,
            height,
            aspectRatio: width / height
          }
        }
      });
    };
    
    // Initial size update
    updateViewportSize();
    
    // Listen for resize events
    window.addEventListener('resize', () => {
      updateViewportSize();
    });
  }
  
  /**
   * Starts the visualization loop
   */
  start() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.lastFrameTime = performance.now();
    
    // Update metadata
    const metadata = this.eventGear.getMetadata() || {};
    const visualizerMetadata = metadata.visualizer || {};
    
    this.eventGear.setMetadata({
      ...metadata,
      visualizer: {
        ...visualizerMetadata,
        isAnimating: true,
        startTime: performance.now()
      }
    });
    
    // Register start event with metadata
    this.eventGear.registerEvent({
      type: 'animation.start',
      timestamp: performance.now(),
      metadata: {
        previousFrameCount: this.frameCount,
        options: this.options
      }
    });
    
    // Start animation loop
    this.animationId = requestAnimationFrame(this.animate.bind(this));
    
    // Emit animation started event
    this.eventGear.emit('animation.started', {
      timestamp: performance.now()
    });
  }
  
  /**
   * Stops the visualization loop
   */
  stop() {
    if (!this.isAnimating) return;
    
    this.isAnimating = false;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // Update metadata
    const metadata = this.eventGear.getMetadata() || {};
    const visualizerMetadata = metadata.visualizer || {};
    
    // Calculate elapsed time
    const elapsedTime = visualizerMetadata.startTime 
      ? performance.now() - visualizerMetadata.startTime 
      : 0;
    
    this.eventGear.setMetadata({
      ...metadata,
      visualizer: {
        ...visualizerMetadata,
        isAnimating: false,
        lastElapsedTime: elapsedTime
      }
    });
    
    // Register stop event with metadata
    this.eventGear.registerEvent({
      type: 'animation.stop',
      timestamp: performance.now(),
      metadata: {
        frameCount: this.frameCount,
        elapsedTime,
        averageFps: this.fps
      }
    });
    
    // Emit animation stopped event
    this.eventGear.emit('animation.stopped', {
      frameCount: this.frameCount,
      timestamp: performance.now()
    });
  }
  
  /**
   * Toggles the animation state
   */
  toggleAnimation() {
    if (this.isAnimating) {
      this.stop();
    } else {
      this.start();
    }
    
    // Register toggle event
    this.eventGear.registerEvent({
      type: 'animation.toggle',
      isAnimating: this.isAnimating,
      timestamp: performance.now()
    });
    
    return this.isAnimating;
  }
  
  /**
   * Animation frame handler
   * @param {number} timestamp - Current timestamp
   */
  animate(timestamp) {
    if (!this.isAnimating) return;
    
    // Calculate delta time
    const delta = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    this.frameTime = delta;
    this.frameCount++;
    
    // Calculate FPS
    this.fps = 1000 / delta;
    
    // Update frame statistics in metadata
    const metadata = this.eventGear.getMetadata() || {};
    const visualizerMetadata = metadata.visualizer || {};
    
    this.eventGear.setMetadata({
      ...metadata,
      visualizer: {
        ...visualizerMetadata,
        fps: this.fps,
        frameTime: delta,
        frameCount: this.frameCount,
        lastFrameTime: timestamp
      }
    });
    
    // Emit animation frame event with expanded data
    this.eventGear.emit('animation.frame', {
      timestamp,
      delta,
      fps: this.fps,
      frameCount: this.frameCount
    });
    
    // Register frame event with performance data
    this.eventGear.registerEvent({
      type: 'animation.frame.metrics',
      timestamp,
      delta,
      fps: this.fps,
      frameCount: this.frameCount,
      performanceNow: performance.now()
    });
    
    // Update FPS display if enabled
    if (this.options.showFPS) {
      // Update FPS every 10 frames
      if (this.frameCount % 10 === 0) {
        // Emit FPS update event
        this.eventGear.emit('visualizer.fpsUpdate', {
          fps: this.fps,
          timestamp: performance.now()
        });
        
        // Update debug UI if available
        this.updateDebugUI();
      }
    }
    
    // Continue animation loop
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }
  
  /**
   * Sets up debug mode for the visualizer
   */
  setupDebugMode() {
    // Create debug UI
    this.createDebugUI();
  }
  
  /**
   * Creates debug UI elements for visualizing performance
   */
  createDebugUI() {
    // Create container for debug info
    const container = document.createElement('div');
    container.id = 'visualizer-debug';
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.backgroundColor = 'rgba(0,0,0,0.7)';
    container.style.color = 'white';
    container.style.padding = '10px';
    container.style.borderRadius = '5px';
    container.style.fontFamily = 'monospace';
    container.style.fontSize = '12px';
    container.style.zIndex = '9999';
    
    // Create FPS counter
    const fpsCounter = document.createElement('div');
    fpsCounter.id = 'fps-counter';
    fpsCounter.textContent = 'FPS: 0';
    container.appendChild(fpsCounter);
    
    // Create frame time display
    const frameTime = document.createElement('div');
    frameTime.id = 'frame-time';
    frameTime.textContent = 'Frame: 0ms';
    container.appendChild(frameTime);
    
    // Create event counter
    const eventCounter = document.createElement('div');
    eventCounter.id = 'event-counter';
    eventCounter.textContent = 'Events: 0';
    container.appendChild(eventCounter);
    
    // Add to document
    document.body.appendChild(container);
    
    this.debugElements = {
      container,
      fpsCounter,
      frameTime,
      eventCounter
    };
    
    // Register debug UI created event
    this.eventGear.registerEvent({
      type: 'visualizer.debugUICreated',
      timestamp: performance.now()
    });
  }
  
  /**
   * Updates the debug UI with current performance metrics
   */
  updateDebugUI() {
    if (!this.debugElements) return;
    
    // Update FPS counter
    this.debugElements.fpsCounter.textContent = `FPS: ${this.fps.toFixed(1)}`;
    this.debugElements.fpsCounter.style.color = this.fps < 30 ? 'red' : 'white';
    
    // Update frame time
    this.debugElements.frameTime.textContent = `Frame: ${this.frameTime.toFixed(1)}ms`;
    this.debugElements.frameTime.style.color = this.frameTime > 16.67 ? 'yellow' : 'white';
    
    // Update event counter
    const totalEvents = typeof this.eventGear.getEventCountTotal === 'function' 
      ? this.eventGear.getEventCountTotal() 
      : this.frameCount;
    
    this.debugElements.eventCounter.textContent = `Events: ${totalEvents}`;
  }
  
  /**
   * Sets debug mode for the visualizer
   * @param {boolean} enabled - Whether debug mode is enabled
   */
  setDebugMode(enabled) {
    this.options.enableDebug = enabled;
    
    if (enabled && !this.debugElements) {
      this.setupDebugMode();
    } else if (!enabled && this.debugElements) {
      // Remove debug UI
      document.body.removeChild(this.debugElements.container);
      this.debugElements = null;
    }
    
    // Update show FPS option
    this.options.showFPS = enabled;
    
    // Register debug mode change event
    this.eventGear.registerEvent({
      type: 'visualizer.debugModeChanged',
      enabled,
      timestamp: performance.now()
    });
    
    return enabled;
  }
  
  /**
   * Registers multiple events for simulation or stress testing
   * @param {number} count - Number of events to register
   * @param {string} type - Event type to register
   */
  registerMultipleEvents(count, type = 'visualizer.test') {
    for (let i = 0; i < count; i++) {
      this.eventGear.registerEvent({
        type,
        index: i,
        timestamp: performance.now()
      });
    }
    
    return count;
  }
  
  /**
   * Cleans up resources when the visualizer is no longer needed
   */
  dispose() {
    // Stop animation
    this.stop();
    
    // Remove debug UI if it exists
    if (this.debugElements) {
      document.body.removeChild(this.debugElements.container);
      this.debugElements = null;
    }
    
    // Clear performance report timer
    if (this.performanceReportTimer) {
      clearInterval(this.performanceReportTimer);
      this.performanceReportTimer = null;
    }
    
    // Final performance report
    this.generatePerformanceReport(true);
    
    // Register dispose event
    this.eventGear.registerEvent({
      type: 'visualizer.disposed',
      frameCount: this.frameCount,
      timestamp: performance.now()
    });
    
    // Reset properties
    this.isAnimating = false;
    this.animationId = null;
    this.frameCount = 0;
    this.fps = 0;
    
    console.log('Visualizer disposed');
  }
} 