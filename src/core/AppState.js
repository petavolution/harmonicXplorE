/**
 * AppState.js
 * 
 * Manages application state and provides a centralized store for parameters.
 * Uses EventGear for communication with other modules.
 */

export default class AppState {
  constructor(eventGear) {
    this.eventGear = eventGear;
    
    // Application parameters with default values
    this.params = {
      // Visualization parameters
      axis: 3,
      coordinateSystem: 'cartesian',
      harmonics: 8,
      harmonicsType: 'sine',
      harmonicsPhase: 'cosine',
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
    };
    
    // State change history for undo/redo functionality
    this.stateHistory = [];
    this.historyIndex = -1;
    this.maxHistorySize = 50;

    // Cached computed data (e.g., sin/cos values for rotation)
    this.cachedData = {};
    
    // Performance metrics for state changes
    this.metrics = {
      totalStateChanges: 0,
      parameterChangeCount: {},
      lastChangeTime: 0,
      changeFrequency: 0,
      peakChangeFrequency: 0,
      lastChangeTimestamps: [],
      frequentlyChangedParams: [],
      changeHistory: []
    };
    
    // Initialize metadata tracking
    this.setupMetadataTracking();
    
    // Register state-related events
    this.registerStateEvents();
    
    // Set up performance monitoring for state changes
    this.setupPerformanceMonitoring();
  }
  
  /**
   * Sets up metadata tracking for AppState
   */
  setupMetadataTracking() {
    // Initialize metadata for state tracking
    this.eventGear.setMetadata({
      ...this.eventGear.getMetadata(),
      appState: {
        lastUpdate: Date.now(),
        modifiedParams: [],
        changeCount: 0,
        historySize: this.stateHistory.length,
        historyIndex: this.historyIndex
      }
    });
    
    // Set up callback for metadata changes
    this.eventGear.setCallbackMetadataChange((key, oldValue, newValue) => {
      if (key === 'appState') {
        console.log(`AppState metadata changed:`, {
          old: oldValue,
          new: newValue
        });
        
        // Track changes in a clean metadata object
        if (newValue && oldValue) {
          const changedKeys = [];
          
          // Find what keys changed
          Object.keys(newValue).forEach(k => {
            if (JSON.stringify(oldValue[k]) !== JSON.stringify(newValue[k])) {
              changedKeys.push(k);
            }
          });
          
          // Register metadata change event if there were changes
          if (changedKeys.length > 0) {
            this.eventGear.registerEvent({
              type: 'state.metadataChanged',
              changedKeys,
              timestamp: performance.now()
            });
          }
        }
      }
    });
  }
  
  /**
   * Registers state-related events with EventGear
   */
  registerStateEvents() {
    // Register state change events
    this.eventGear.registerEvent({
      type: 'state.initialized',
      initialParams: { ...this.params },
      timestamp: performance.now()
    });
    
    // Set up frequency monitor to warn about high state change rates
    this.eventGear.monitorEventFrequency('state.change', 1000, (frequency) => {
      // Update change frequency metrics
      this.metrics.changeFrequency = frequency;
      
      // Update peak frequency if current is higher
      if (frequency > this.metrics.peakChangeFrequency) {
        this.metrics.peakChangeFrequency = frequency;
      }
      
      if (frequency > 10) { // More than 10 state changes per second
        console.warn(`High state change frequency detected: ${frequency.toFixed(2)} changes/sec`);
        
        // Register high frequency warning
        this.eventGear.registerEvent({
          type: 'state.warning',
          frequency,
          timestamp: performance.now()
        });
      }
    });
    
    // Set up interval-based monitoring if available
    if (typeof this.eventGear.setCallbackIntervalTime === 'function') {
      this.eventGear.setCallbackIntervalTime(30000, (totalTime) => { // Every 30 seconds
        // Generate state metrics report
        this.generateStateMetricsReport();
      });
    }
  }
  
  /**
   * Sets up performance monitoring for state changes
   */
  setupPerformanceMonitoring() {
    // Configure EventGear with method chaining if available
    if (typeof this.eventGear.setIndependentIntervalLength === 'function') {
      this.eventGear
        .setMaxHistorySize(200)
        .setIndependentIntervalLength(1000)
        .setEventPerformanceMetricsActive(true);
    }
    
    // Set up total changes alarm if available
    if (typeof this.eventGear.setCallbackTotalCount === 'function') {
      this.eventGear.setCallbackTotalCount(1000, (totalCount) => {
        console.log(`State has changed ${totalCount} times since initialization`);
        
        // Generate state metrics report after many changes
        this.generateStateMetricsReport();
      });
    }
  }
  
  /**
   * Generates a report of state metrics
   */
  generateStateMetricsReport() {
    // Find most frequently changed parameters
    const paramEntries = Object.entries(this.metrics.parameterChangeCount);
    const sortedParams = paramEntries.sort((a, b) => b[1] - a[1]);
    
    // Store the top 5 most frequently changed params
    this.metrics.frequentlyChangedParams = sortedParams.slice(0, 5).map(entry => ({
      param: entry[0],
      changes: entry[1],
      percentOfTotal: ((entry[1] / this.metrics.totalStateChanges) * 100).toFixed(1) + '%'
    }));
    
    // Calculate change frequency based on timestamps
    const recentChanges = this.metrics.lastChangeTimestamps.slice(-20);
    let avgInterval = 0;
    
    if (recentChanges.length > 1) {
      let totalInterval = 0;
      for (let i = 1; i < recentChanges.length; i++) {
        totalInterval += recentChanges[i] - recentChanges[i-1];
      }
      avgInterval = totalInterval / (recentChanges.length - 1);
    }
    
    // Create report
    const report = {
      timestamp: performance.now(),
      totalStateChanges: this.metrics.totalStateChanges,
      currentChangeFrequency: this.metrics.changeFrequency,
      peakChangeFrequency: this.metrics.peakChangeFrequency,
      averageChangeInterval: avgInterval,
      mostFrequentlyChangedParams: this.metrics.frequentlyChangedParams,
      historySize: this.stateHistory.length,
      historyIndex: this.historyIndex
    };
    
    // Register report event
    this.eventGear.registerEvent({
      type: 'state.metricsReport',
      report,
      timestamp: performance.now()
    });
    
    // Log report in debug mode
    if (this.eventGear.getMetadata()?.debug?.enabled) {
      console.group('AppState Metrics Report');
      console.log('Total State Changes:', report.totalStateChanges);
      console.log('Current Change Frequency:', report.currentChangeFrequency.toFixed(2), 'Hz');
      console.log('Peak Change Frequency:', report.peakChangeFrequency.toFixed(2), 'Hz');
      
      if (report.mostFrequentlyChangedParams.length > 0) {
        console.log('Most Frequently Changed Parameters:');
        report.mostFrequentlyChangedParams.forEach((p, i) => {
          console.log(`  ${i+1}. ${p.param}: ${p.changes} changes (${p.percentOfTotal})`);
        });
      }
      
      console.groupEnd();
    }
    
    return report;
  }
  
  /**
   * Updates a parameter in the state
   * @param {string} param - Parameter name
   * @param {any} value - New parameter value
   * @param {boolean} addToHistory - Whether to add this change to history
   * @returns {boolean} - Whether the update was successful
   */
  updateParam(param, value, addToHistory = true) {
    // Check if parameter exists and value is different
    if (!(param in this.params) || this.params[param] === value) {
      return false;
    }
    
    // Track performance metrics for state changes
    this.trackStateChange(param);
    
    // Get current state for history if needed
    if (addToHistory) {
      const currentState = { ...this.params };
      this.addToHistory(currentState);
    }
    
    // Store previous value for event data
    const previousValue = this.params[param];
    
    // Update the parameter
    this.params[param] = value;
    
    // Update metadata
    const metadata = this.eventGear.getMetadata() || {};
    const appStateMetadata = metadata.appState || {};
    
    this.eventGear.setMetadata({
      ...metadata,
      appState: {
        ...appStateMetadata,
        lastUpdate: Date.now(),
        modifiedParams: [...(appStateMetadata.modifiedParams || []), param],
        changeCount: (appStateMetadata.changeCount || 0) + 1,
        historySize: this.stateHistory.length,
        historyIndex: this.historyIndex
      }
    });
    
    // Emit parameter change event with expanded metadata
    this.eventGear.emit('parameterChanged', {
      param,
      value,
      previousValue,
      timestamp: performance.now(),
      source: 'appState.updateParam'
    });
    
    // Also emit a more generic state change event
    this.eventGear.emit('state.change', {
      changedParams: [param],
      timestamp: performance.now()
    });
    
    // Store change in history if tracking is enabled
    if (this.metrics.changeHistory.length < 100) {
      this.metrics.changeHistory.push({
        type: 'update',
        timestamp: performance.now(),
        param,
        oldValue: previousValue,
        newValue: value
      });
    }
    
    return true;
  }
  
  /**
   * Tracks a state change for performance metrics
   * @param {string} param - The parameter that changed
   */
  trackStateChange(param) {
    // Increment total state changes
    this.metrics.totalStateChanges++;
    
    // Increment counter for this specific parameter
    this.metrics.parameterChangeCount[param] = (this.metrics.parameterChangeCount[param] || 0) + 1;
    
    // Record timestamp for frequency calculation
    const now = performance.now();
    this.metrics.lastChangeTime = now;
    this.metrics.lastChangeTimestamps.push(now);
    
    // Keep only the last 100 timestamps
    if (this.metrics.lastChangeTimestamps.length > 100) {
      this.metrics.lastChangeTimestamps.shift();
    }
  }
  
  /**
   * Updates multiple parameters at once
   * @param {Object} updates - Object with parameter updates
   * @returns {boolean} - Whether any updates were successful
   */
  updateMultipleParams(updates) {
    if (!updates || typeof updates !== 'object') {
      return false;
    }
    
    // Get current state for history
    const currentState = { ...this.params };
    this.addToHistory(currentState);
    
    // Track which parameters were updated
    const changedParams = [];
    const paramChanges = {};
    
    // Apply all updates
    Object.entries(updates).forEach(([param, value]) => {
      if (param in this.params && this.params[param] !== value) {
        // Store old value for event data
        paramChanges[param] = {
          oldValue: this.params[param],
          newValue: value
        };
        
        // Update the parameter
        this.params[param] = value;
        
        // Track this parameter change
        this.trackStateChange(param);
        
        changedParams.push(param);
      }
    });
    
    if (changedParams.length === 0) {
      return false;
    }
    
    // Update metadata
    const metadata = this.eventGear.getMetadata() || {};
    const appStateMetadata = metadata.appState || {};
    
    this.eventGear.setMetadata({
      ...metadata,
      appState: {
        ...appStateMetadata,
        lastUpdate: Date.now(),
        modifiedParams: [...(appStateMetadata.modifiedParams || []), ...changedParams],
        changeCount: (appStateMetadata.changeCount || 0) + 1,
        batchUpdate: true,
        historySize: this.stateHistory.length,
        historyIndex: this.historyIndex
      }
    });
    
    // Emit bulk parameter change event
    this.eventGear.emit('multipleParametersChanged', {
      changedParams,
      paramChanges,
      timestamp: performance.now(),
      source: 'appState.updateMultipleParams'
    });
    
    // Also emit a more generic state change event
    this.eventGear.emit('state.change', {
      changedParams,
      isBulkUpdate: true,
      timestamp: performance.now()
    });
    
    // Store change in history if tracking is enabled
    if (this.metrics.changeHistory.length < 100) {
      this.metrics.changeHistory.push({
        type: 'bulkUpdate',
        timestamp: performance.now(),
        changes: changedParams.length,
        params: changedParams
      });
    }
    
    return true;
  }
  
  /**
   * Handles a parameter change from another source (e.g., UI)
   * @param {string} param - Parameter name
   * @param {any} value - New parameter value
   */
  handleParameterChange(param, value) {
    this.updateParam(param, value);
  }
  
  /**
   * Gets a parameter value
   * @param {string} param - Parameter name
   * @returns {any} - Parameter value
   */
  getParam(param) {
    return this.params[param];
  }
  
  /**
   * Gets all parameters
   * @returns {Object} - All parameters
   */
  getAllParams() {
    return { ...this.params };
  }

  /**
   * Gets cached computed data
   * @param {string} key - Cache key
   * @returns {any} - Cached value or undefined
   */
  getCachedData(key) {
    return this.cachedData[key];
  }

  /**
   * Sets cached computed data
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   */
  setCachedData(key, value) {
    this.cachedData[key] = value;
  }

  /**
   * Clears all cached data
   */
  clearCachedData() {
    this.cachedData = {};
  }
  
  /**
   * Adds current state to history
   * @param {Object} state - State to add to history
   */
  addToHistory(state) {
    // If we're not at the end of history, truncate
    if (this.historyIndex < this.stateHistory.length - 1) {
      this.stateHistory = this.stateHistory.slice(0, this.historyIndex + 1);
    }
    
    // Add new state to history
    this.stateHistory.push(state);
    this.historyIndex = this.stateHistory.length - 1;
    
    // Limit history size
    if (this.stateHistory.length > this.maxHistorySize) {
      this.stateHistory.shift();
      this.historyIndex--;
    }
    
    // Update state metadata
    const metadata = this.eventGear.getMetadata() || {};
    const appStateMetadata = metadata.appState || {};
    
    this.eventGear.setMetadata({
      ...metadata,
      appState: {
        ...appStateMetadata,
        historySize: this.stateHistory.length,
        historyIndex: this.historyIndex
      }
    });
    
    // Register history event
    this.eventGear.registerEvent({
      type: 'state.history',
      action: 'add',
      historyLength: this.stateHistory.length,
      historyIndex: this.historyIndex,
      timestamp: performance.now()
    });
    
    // Store history action in change history
    if (this.metrics.changeHistory.length < 100) {
      this.metrics.changeHistory.push({
        type: 'historyAdd',
        timestamp: performance.now(),
        historySize: this.stateHistory.length
      });
    }
  }
  
  /**
   * Undoes the last state change
   * @returns {boolean} - Whether undo was successful
   */
  undo() {
    if (this.historyIndex <= 0) {
      return false;
    }
    
    // Track undo operation
    this.metrics.totalStateChanges++;
    
    this.historyIndex--;
    const previousState = this.stateHistory[this.historyIndex];
    
    // Track changed parameters
    const changedParams = [];
    const paramChanges = {};
    
    // Apply previous state without adding to history
    Object.entries(previousState).forEach(([param, value]) => {
      if (this.params[param] !== value) {
        // Store change data
        paramChanges[param] = {
          oldValue: this.params[param],
          newValue: value
        };
        
        // Update parameter
        this.params[param] = value;
        changedParams.push(param);
        
        // Track parameter change
        this.trackStateChange(param);
      }
    });
    
    // Update metadata
    const metadata = this.eventGear.getMetadata() || {};
    const appStateMetadata = metadata.appState || {};
    
    this.eventGear.setMetadata({
      ...metadata,
      appState: {
        ...appStateMetadata,
        lastUpdate: Date.now(),
        modifiedParams: [...(appStateMetadata.modifiedParams || []), ...changedParams],
        changeCount: (appStateMetadata.changeCount || 0) + 1,
        lastAction: 'undo',
        historySize: this.stateHistory.length,
        historyIndex: this.historyIndex
      }
    });
    
    // Emit undo event
    this.eventGear.emit('state.undo', {
      changedParams,
      paramChanges,
      historyIndex: this.historyIndex,
      timestamp: performance.now()
    });
    
    // Store undo in change history
    if (this.metrics.changeHistory.length < 100) {
      this.metrics.changeHistory.push({
        type: 'undo',
        timestamp: performance.now(),
        changedParams,
        historyIndex: this.historyIndex
      });
    }
    
    return true;
  }
  
  /**
   * Redoes the last undone state change
   * @returns {boolean} - Whether redo was successful
   */
  redo() {
    if (this.historyIndex >= this.stateHistory.length - 1) {
      return false;
    }
    
    // Track redo operation
    this.metrics.totalStateChanges++;
    
    this.historyIndex++;
    const nextState = this.stateHistory[this.historyIndex];
    
    // Track changed parameters
    const changedParams = [];
    const paramChanges = {};
    
    // Apply next state without adding to history
    Object.entries(nextState).forEach(([param, value]) => {
      if (this.params[param] !== value) {
        // Store change data
        paramChanges[param] = {
          oldValue: this.params[param],
          newValue: value
        };
        
        // Update parameter
        this.params[param] = value;
        changedParams.push(param);
        
        // Track parameter change
        this.trackStateChange(param);
      }
    });
    
    // Update metadata
    const metadata = this.eventGear.getMetadata() || {};
    const appStateMetadata = metadata.appState || {};
    
    this.eventGear.setMetadata({
      ...metadata,
      appState: {
        ...appStateMetadata,
        lastUpdate: Date.now(),
        modifiedParams: [...(appStateMetadata.modifiedParams || []), ...changedParams],
        changeCount: (appStateMetadata.changeCount || 0) + 1,
        lastAction: 'redo',
        historySize: this.stateHistory.length,
        historyIndex: this.historyIndex
      }
    });
    
    // Emit redo event
    this.eventGear.emit('state.redo', {
      changedParams,
      paramChanges,
      historyIndex: this.historyIndex,
      timestamp: performance.now()
    });
    
    // Store redo in change history
    if (this.metrics.changeHistory.length < 100) {
      this.metrics.changeHistory.push({
        type: 'redo',
        timestamp: performance.now(),
        changedParams,
        historyIndex: this.historyIndex
      });
    }
    
    return true;
  }
  
  /**
   * Resets state to default values
   */
  resetToDefaults() {
    const defaultParams = {
      // Visualization parameters
      axis: 3,
      coordinateSystem: 'cartesian',
      harmonics: 8,
      harmonicsType: 'sine',
      harmonicsPhase: 'cosine',
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
    };
    
    // Get current state for history
    const currentState = { ...this.params };
    this.addToHistory(currentState);
    
    // Track which parameters were reset
    const changedParams = [];
    const paramChanges = {};
    
    // Apply all defaults
    Object.entries(defaultParams).forEach(([param, value]) => {
      if (this.params[param] !== value) {
        // Store change data
        paramChanges[param] = {
          oldValue: this.params[param],
          newValue: value
        };
        
        // Update parameter
        this.params[param] = value;
        changedParams.push(param);
        
        // Track parameter change
        this.trackStateChange(param);
      }
    });
    
    // Update metadata
    const metadata = this.eventGear.getMetadata() || {};
    this.eventGear.setMetadata({
      ...metadata,
      appState: {
        lastUpdate: Date.now(),
        modifiedParams: changedParams,
        changeCount: (metadata.appState?.changeCount || 0) + 1,
        lastAction: 'reset',
        historySize: this.stateHistory.length,
        historyIndex: this.historyIndex
      }
    });
    
    // Emit reset event
    this.eventGear.emit('state.reset', {
      changedParams,
      paramChanges,
      timestamp: performance.now()
    });
    
    // Store reset in change history
    if (this.metrics.changeHistory.length < 100) {
      this.metrics.changeHistory.push({
        type: 'reset',
        timestamp: performance.now(),
        changedParams
      });
    }
    
    return changedParams.length > 0;
  }
  
  /**
   * Gets the state change metrics
   * @returns {Object} State change metrics
   */
  getStateMetrics() {
    // Generate a fresh report
    const report = this.generateStateMetricsReport();
    
    // Return metrics with history
    return {
      ...this.metrics,
      report
    };
  }
  
  /**
   * Gets the state change history
   * @returns {Array} State change history
   */
  getStateChangeHistory() {
    return [...this.metrics.changeHistory];
  }
  
  /**
   * Registers debug events for AppState
   */
  registerDebugEvents() {
    // Register events for all parameters to track usage
    Object.keys(this.params).forEach(param => {
      this.eventGear.registerEvent({
        type: 'state.parameter',
        param,
        currentValue: this.params[param],
        timestamp: performance.now()
      });
    });
    
    // Register total state changes
    this.eventGear.registerEvent({
      type: 'state.metrics',
      metrics: this.getStateMetrics(),
      timestamp: performance.now()
    });
  }
} 