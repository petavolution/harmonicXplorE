/**
 * EventGearUtils.js
 *
 * Utility functions for EventGear framework.
 * Provides calculation helpers, object utilities, and callback execution.
 */

// Global constants
export const DATA_TIMESTAMP_COUNT_BUFFER_MAX = 300000;
export const CLASS_EVENTTARGET = typeof EventTarget !== 'undefined' ? EventTarget : class {};
export const NODE_IS_INSTALLED = (typeof process !== 'undefined' && process.versions && process.versions.node);

/**
 * Calculates the frequency of events.
 * @param {number} count - Total number of events.
 * @param {number} seconds - Total elapsed seconds.
 * @returns {number} Calculated frequency (events per second).
 */
export function calculateFrequency(count, seconds) {
    if (typeof count !== 'number' || typeof seconds !== 'number' || count < 0 || seconds < 0) {
        throw new TypeError('Invalid parameter.');
    }
    return seconds > 0 ? count / seconds : 0;
}

/**
 * Calculates the average interval between events.
 * @param {number} count - Total number of events.
 * @param {number} seconds - Total elapsed seconds.
 * @returns {number} Calculated interval (seconds per event).
 */
export function calculateInterval(count, seconds) {
    if (typeof count !== 'number' || typeof seconds !== 'number' || count < 0 || seconds < 0) {
        throw new TypeError('Invalid parameter.');
    }
    return count > 0 ? seconds / count : 0;
}

/**
 * Calculates jitter from event timestamps.
 * @param {Array<number|Object>} timestamps - Event timestamps or objects with timestamp and count.
 * @returns {number} Calculated jitter value.
 */
export function calculateJitter(timestamps) {
    if (timestamps.length < 2) return 0;
    let totalInterval = 0, totalIntervalSquared = 0, totalCount = 0;
    let prevTimestamp = null;
    for (let i = 0; i < timestamps.length; i++) {
        const current = timestamps[i];
        const timestamp = typeof current === 'number' ? current : current.timestamp;
        const count = typeof current === 'number' ? 1 : current.count;
        if (prevTimestamp !== null) {
            const interval = (timestamp - prevTimestamp) / count;
            for (let j = 0; j < count; j++) {
                totalInterval += interval;
                totalIntervalSquared += interval * interval;
                totalCount++;
            }
        }
        prevTimestamp = timestamp;
    }
    if (totalCount < 2) return 0;
    const meanInterval = totalInterval / totalCount;
    return Math.sqrt((totalIntervalSquared / totalCount) - (meanInterval * meanInterval));
}

/**
 * Calculates next threshold by adding or subtracting interval.
 * @param {number} currentValue - Current value to check against threshold.
 * @param {number} interval - Interval to add/subtract.
 * @param {number} threshold - Current threshold.
 * @param {boolean} intervalAddition - Add (true) or subtract (false).
 * @returns {number} Updated threshold.
 */
export function calculateIntervalThreshold(currentValue, interval, threshold, intervalAddition = true) {
    if (interval === 0) throw new Error('Interval must be a non-zero number');
    if (!Number.isFinite(currentValue) || !Number.isFinite(threshold) || !Number.isFinite(interval)) {
        return NaN;
    }
    if ((intervalAddition && currentValue < threshold) || (!intervalAddition && currentValue > threshold)) {
        return threshold;
    }
    let newThreshold = intervalAddition ? threshold + interval : threshold - interval;
    if ((intervalAddition && newThreshold > currentValue) || (!intervalAddition && newThreshold < currentValue)) {
        return newThreshold;
    }
    const difference = Math.abs(currentValue - threshold);
    const intervalCount = Math.floor(difference / Math.abs(interval));
    const adjustment = (intervalCount + 1) * Math.abs(interval);
    return intervalAddition ? threshold + adjustment : threshold - adjustment;
}

/**
 * Retrieves nested property value from an object using dot/bracket notation.
 * @param {Object} obj - Source object.
 * @param {string} path - Property path (e.g., 'user.address.street').
 * @param {boolean} returnUndefined - Return undefined instead of throwing.
 * @returns {*} The property value.
 */
export function getValueFromObject(obj, path, returnUndefined = false) {
    if (typeof obj !== 'object' || obj === null) {
        throw new TypeError('First argument must be a non-null object.');
    }
    if (typeof path !== 'string') {
        throw new TypeError('Second argument must be a string.');
    }
    if (!path.includes('.') && !path.includes('[')) {
        return returnUndefined ? obj[path] : (path in obj ? obj[path] : undefined);
    }
    const keys = path.match(/\w+|\d+|\[(\w+)\]/g);
    let value = obj;
    for (const key of keys) {
        if (value == null) {
            if (!returnUndefined) throw new Error(`Cannot read property '${key}' of ${value}`);
            return undefined;
        }
        const cleanKey = key.replace(/[\[\]']/g, '');
        if (!(cleanKey in value)) {
            if (!returnUndefined) throw new Error(`Property '${path}' not found.`);
            return undefined;
        }
        value = value[cleanKey];
    }
    return value;
}

/**
 * Executes a callback function safely.
 * @param {Function} fn - Callback function.
 * @param {...any} args - Arguments to pass.
 * @returns {any|Promise<any>} Callback result.
 */
export function executeCallback(fn, ...args) {
    if (typeof fn !== 'function') {
        throw new TypeError('Callback must be a function');
    }
    try {
        const result = fn(...args);
        if (result instanceof Promise) {
            return result.catch(error => {
                console.error('Async callback error:', error);
                throw error;
            });
        }
        return result;
    } catch (error) {
        console.error('Callback execution error:', error);
        throw error;
    }
}

/**
 * Executes an async callback function.
 * @param {Function} fn - Callback function.
 * @param {...any} args - Arguments to pass.
 * @returns {Promise<any>} Callback result.
 */
export async function executeAsyncCallback(fn, ...args) {
    if (typeof fn !== 'function') {
        throw new TypeError('Callback must be a function');
    }
    try {
        return await Promise.resolve(fn(...args));
    } catch (error) {
        console.error('Async callback execution error:', error);
        throw error;
    }
}

/**
 * Generates a unique ID.
 * @returns {string} Unique identifier.
 */
export function generateUniqueId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Deep clones an object.
 * @param {*} obj - Object to clone.
 * @returns {*} Cloned object.
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(deepClone);
    const cloned = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

/**
 * Throttles a function to execute at most once per interval.
 * @param {Function} fn - Function to throttle.
 * @param {number} interval - Minimum interval between executions (ms).
 * @returns {Function} Throttled function.
 */
export function throttle(fn, interval) {
    let lastCall = 0;
    return function(...args) {
        const now = performance.now();
        if (now - lastCall >= interval) {
            lastCall = now;
            return fn.apply(this, args);
        }
    };
}

/**
 * Debounces a function to execute after delay since last call.
 * @param {Function} fn - Function to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {Function} Debounced function.
 */
export function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}
