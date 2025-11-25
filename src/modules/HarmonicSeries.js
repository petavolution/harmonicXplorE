/**
 * HarmonicSeries.js
 * 
 * Generates various harmonic series with robust input validation.
 * Implements memoization for efficient repeated calculations.
 */

export default class HarmonicSeries {
  constructor(eventGear, appState) {
    this.eventGear = eventGear;
    this.appState = appState;

    // Cache for memoization
    this.cache = new Map();

    // Listen for parameter changes that would affect harmonic series
    this.eventGear.on('parameterChanged', (data) => {
      if (['harmonics', 'harmonicsType', 'harmonicsPhase', 'init'].includes(data.param)) {
        this.updateSeries();
      }
    });

    // Generate initial harmonic series
    this.updateSeries();
  }
  
  /**
   * Updates the harmonic series based on current parameters
   */
  updateSeries() {
    // Get current parameters
    const count = this.appState.getParam('harmonics');
    const type = this.appState.getParam('harmonicsType');
    const phase = this.appState.getParam('harmonicsPhase');
    
    // Calculate harmonic series (uses cache if unchanged)
    const series = this.calculateSeries(count, type, phase);
    
    // Update cached data
    this.appState.setCachedData('harmonicSeries', series);
    
    // Emit updated series event
    this.eventGear.emit('harmonicSeries.updated', { 
      harmonicSeries: series,
      count,
      type,
      phase 
    });
  }
  
  /**
   * Calculates a harmonic series with memoization
   * @param {number} count - Number of harmonics to generate
   * @param {string} type - Type of harmonic series (natural, octave, etc.)
   * @param {string} phase - Phase of the harmonic series
   * @returns {Array} - Generated harmonic series
   */
  calculateSeries(count, type, phase) {
    // Generate cache key
    const cacheKey = `${count}:${type}:${phase}`;
    
    // Check if we have a cached result
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    // Calculate the series based on type
    let series = [];
    
    switch (type) {
      case 'singular':
        series = [1]; // Just the fundamental
        break;
        
      case 'natural':
        // Natural harmonic series: 1, 2, 3, 4, 5, ...
        series = Array.from({ length: count }, (_, i) => i + 1);
        break;
        
      case 'octave':
        // Octave series: 1, 2, 4, 8, 16, ...
        series = Array.from({ length: count }, (_, i) => Math.pow(2, i));
        break;
        
      case 'numOdd':
        // Odd harmonics: 1, 3, 5, 7, ...
        series = Array.from({ length: count }, (_, i) => 2 * i + 1);
        break;
        
      case 'numEven':
        // Even harmonics: 2, 4, 6, 8, ...
        series = Array.from({ length: count }, (_, i) => 2 * (i + 1));
        break;
        
      case 'numPrime':
        // Prime harmonics: 2, 3, 5, 7, 11, ...
        series = this.generatePrimes(count);
        break;
        
      case 'numFibo':
        // Fibonacci series: 1, 1, 2, 3, 5, 8, ...
        series = this.generateFibonacci(count);
        break;
        
      case 'upper':
        // Upper harmonics (overtones): 2, 3, 4, 5, ...
        series = Array.from({ length: count }, (_, i) => i + 2);
        break;
        
      case 'lower':
        // Lower harmonics (undertones inverted): 1/2, 1/3, 1/4, ...
        series = Array.from({ length: count }, (_, i) => 1 / (i + 2));
        break;
        
      case 'under':
        // Undertones from fundamental: 1, 1/2, 1/3, 1/4, ...
        series = Array.from({ length: count }, (_, i) => 1 / (i + 1));
        break;
        
      default:
        series = Array.from({ length: count }, (_, i) => i + 1); // Default to natural
    }
    
    // Apply phase transformations if needed
    if (phase !== 'phaseFull') {
      series = this.applyPhase(series, phase);
    }
    
    // Cache the result
    this.cache.set(cacheKey, series);
    
    return series;
  }
  
  /**
   * Applies phase transformation to a harmonic series
   * @param {Array} series - Original harmonic series
   * @param {string} phase - Phase type ('phaseUp', 'phaseDown')
   * @returns {Array} - Phase-transformed series
   */
  applyPhase(series, phase) {
    switch (phase) {
      case 'phaseUp':
        // Ascending phase (positive values only)
        return series.map(val => Math.abs(val));
        
      case 'phaseDown':
        // Descending phase (negative values)
        return series.map(val => -Math.abs(val));
        
      default:
        return series;
    }
  }
  
  /**
   * Generates first n prime numbers
   * @param {number} count - Number of primes to generate
   * @returns {Array} - Array of prime numbers
   */
  generatePrimes(count) {
    const primes = [];
    let num = 2;
    
    while (primes.length < count) {
      if (this.isPrime(num)) {
        primes.push(num);
      }
      num++;
    }
    
    return primes;
  }
  
  /**
   * Checks if a number is prime
   * @param {number} num - Number to check
   * @returns {boolean} - Whether the number is prime
   */
  isPrime(num) {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
      if (num % i === 0) return false;
    }
    return num > 1;
  }
  
  /**
   * Generates first n Fibonacci numbers
   * @param {number} count - Number of Fibonacci numbers to generate
   * @returns {Array} - Array of Fibonacci numbers
   */
  generateFibonacci(count) {
    if (count <= 0) return [];
    if (count === 1) return [1];
    
    const fib = [1, 1];
    for (let i = 2; i < count; i++) {
      fib.push(fib[i-1] + fib[i-2]);
    }
    
    return fib;
  }
  
  /**
   * Clears the calculation cache
   */
  clearCache() {
    this.cache.clear();
  }
} 