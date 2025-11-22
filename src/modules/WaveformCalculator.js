/**
 * WaveformCalculator.js
 * 
 * Computes and normalizes waveform data for visualization and synthesis.
 * Offloads heavy calculations to a Web Worker for better performance.
 */

export default class WaveformCalculator {
  constructor(eventGear, appState) {
    this.eventGear = eventGear;
    this.appState = appState;
    
    // Initialize Web Worker for calculations
    this.initWorker();
    
    // Listen for harmonic series updates
    this.eventGear.on('harmonicSeries.updated', (data) => {
      this.calculateWaveform(data.harmonicSeries);
    });
  }
  
  /**
   * Initializes the Web Worker for waveform calculations
   */
  initWorker() {
    // Create the worker code as a Blob
    const workerCode = `
      // Waveform calculation worker
      
      /**
       * Calculates a waveform based on harmonic series
       * @param {Array} harmonicSeries - Array of harmonic values
       * @param {number} resolution - Number of points in the waveform
       * @returns {Object} - Calculated waveform data
       */
      function calculateWaveform(harmonicSeries, resolution) {
        const waveform = new Array(resolution).fill(0);
        const timeStep = 2 * Math.PI / resolution;
        
        // For each harmonic, add its contribution to the waveform
        for (let i = 0; i < harmonicSeries.length; i++) {
          const harmonic = harmonicSeries[i];
          const amplitude = 1 / (i + 1); // Amplitude decreases with harmonic number
          
          for (let t = 0; t < resolution; t++) {
            const angle = timeStep * t * harmonic;
            waveform[t] += amplitude * Math.sin(angle);
          }
        }
        
        // Normalize the waveform
        let max = 0;
        for (let i = 0; i < resolution; i++) {
          max = Math.max(max, Math.abs(waveform[i]));
        }
        
        if (max > 0) {
          for (let i = 0; i < resolution; i++) {
            waveform[i] /= max;
          }
        }
        
        return {
          waveform,
          max,
          resolution
        };
      }
      
      self.onmessage = function(e) {
        if (e.data.action === 'calculate') {
          const result = calculateWaveform(
            e.data.harmonicSeries,
            e.data.resolution
          );
          self.postMessage({ result });
        }
      };
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    
    try {
      this.worker = new Worker(workerUrl);
      
      // Set up worker message handling
      this.worker.onmessage = (e) => {
        if (e.data.result) {
          // Store the result in the app state
          this.appState.setCachedData('waveformData', e.data.result);
          
          // Emit event with the calculated waveform
          this.eventGear.emit('waveform.calculated', {
            waveformData: e.data.result
          });
        }
      };
      
      // Handle errors
      this.worker.onerror = (error) => {
        console.error('Waveform calculation worker error:', error);
      };
    } catch (error) {
      console.error('Failed to initialize Web Worker:', error);
      // Fall back to main thread calculations if Web Worker fails
      this.useWebWorker = false;
    }
  }
  
  /**
   * Triggers waveform calculation
   * @param {Array} harmonicSeries - Array of harmonic values to use
   */
  calculateWaveform(harmonicSeries) {
    if (!harmonicSeries || harmonicSeries.length === 0) {
      console.warn('Empty harmonic series provided, skipping calculation');
      return;
    }
    
    const resolution = 1024; // Number of points in the waveform
    
    try {
      if (this.worker) {
        // Use Web Worker for calculation
        this.worker.postMessage({
          action: 'calculate',
          harmonicSeries,
          resolution
        });
      } else {
        // Fall back to main thread calculation
        this.calculateWaveformSync(harmonicSeries, resolution);
      }
    } catch (error) {
      console.error('Error during waveform calculation:', error);
    }
  }
  
  /**
   * Synchronous waveform calculation (fallback if Web Worker fails)
   * @param {Array} harmonicSeries - Array of harmonic values
   * @param {number} resolution - Number of points in the waveform
   */
  calculateWaveformSync(harmonicSeries, resolution) {
    const waveform = new Array(resolution).fill(0);
    const timeStep = 2 * Math.PI / resolution;
    
    // For each harmonic, add its contribution to the waveform
    for (let i = 0; i < harmonicSeries.length; i++) {
      const harmonic = harmonicSeries[i];
      const amplitude = 1 / (i + 1); // Amplitude decreases with harmonic number
      
      for (let t = 0; t < resolution; t++) {
        const angle = timeStep * t * harmonic;
        waveform[t] += amplitude * Math.sin(angle);
      }
    }
    
    // Normalize the waveform
    let max = 0;
    for (let i = 0; i < resolution; i++) {
      max = Math.max(max, Math.abs(waveform[i]));
    }
    
    if (max > 0) {
      for (let i = 0; i < resolution; i++) {
        waveform[i] /= max;
      }
    }
    
    const result = {
      waveform,
      max,
      resolution
    };
    
    // Store the result and emit event
    this.appState.setCachedData('waveformData', result);
    this.eventGear.emit('waveform.calculated', {
      waveformData: result
    });
  }
  
  /**
   * Cleans up resources when the module is no longer needed
   */
  dispose() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
} 