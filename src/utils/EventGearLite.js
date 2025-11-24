/**
 * EventGearLite.js
 *
 * Simplified EventGear for core pub/sub, metadata, and event tracking.
 * Provides essential functionality with minimal overhead.
 * For advanced features (timeframe analysis, bridges), use the full EventGear.
 */

import { generateUniqueId, deepClone, executeCallback } from './EventGearUtils.js';

/**
 * EventGearLite - Lightweight event-driven architecture core.
 */
export default class EventGearLite {
    // Static defaults
    static MAX_HISTORY_SIZE = 1000;
    static DEFAULT_BUFFER_SIZE = 100;

    // Private fields
    #isActive = false;
    #maxHistorySize;
    #metadata = null;
    #metadataPrevious = null;
    #eventCount = 0;
    #startTime = 0;
    #lastEventTime = 0;
    #eventHistory = [];
    #eventConnections = new Map();
    #frequencyMonitors = new Map();

    // Callbacks
    #eventCallback = null;
    #metadataChangeCallback = null;
    #eventRegistrationCallback = null;

    // Pub/Sub
    #listeners = new Map();

    constructor(maxHistorySize = 100) {
        this.#maxHistorySize = Math.min(maxHistorySize, EventGearLite.MAX_HISTORY_SIZE);
        this.start();
    }

    // ===== Core Control =====

    start() {
        if (!this.#isActive) {
            this.#isActive = true;
            this.#startTime = performance.now();
        }
        return this;
    }

    stop() {
        this.#isActive = false;
        return this;
    }

    reset() {
        this.#eventCount = 0;
        this.#startTime = performance.now();
        this.#lastEventTime = 0;
        this.#eventHistory = [];
        this.#metadata = null;
        this.#metadataPrevious = null;
        return this;
    }

    // ===== Event Registration =====

    registerEvent(eventData = {}) {
        if (!this.#isActive) return this;

        const timestamp = performance.now();
        this.#eventCount++;
        this.#lastEventTime = timestamp;

        const event = {
            id: generateUniqueId(),
            timestamp,
            eventNumber: this.#eventCount,
            ...eventData
        };

        // Store in history
        if (this.#maxHistorySize > 0) {
            this.#eventHistory.push(event);
            if (this.#eventHistory.length > this.#maxHistorySize) {
                this.#eventHistory.shift();
            }
        }

        // Execute registration callback
        if (this.#eventRegistrationCallback) {
            try { executeCallback(this.#eventRegistrationCallback, event); }
            catch (e) { console.error('Event registration callback error:', e); }
        }

        // Execute general event callback
        if (this.#eventCallback) {
            try { executeCallback(this.#eventCallback, event); }
            catch (e) { console.error('Event callback error:', e); }
        }

        // Update frequency monitors
        this.#updateFrequencyMonitors(timestamp);

        return this;
    }

    // ===== Pub/Sub System =====

    on(eventType, callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }
        if (!this.#listeners.has(eventType)) {
            this.#listeners.set(eventType, []);
        }
        this.#listeners.get(eventType).push(callback);
        return this;
    }

    off(eventType, callback) {
        if (this.#listeners.has(eventType)) {
            const callbacks = this.#listeners.get(eventType);
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
        return this;
    }

    emit(eventType, data = {}) {
        if (!this.#isActive) return this;

        const eventData = {
            type: eventType,
            timestamp: performance.now(),
            ...data
        };

        // Register the event
        this.registerEvent(eventData);

        // Notify listeners
        if (this.#listeners.has(eventType)) {
            const callbacks = this.#listeners.get(eventType);
            callbacks.forEach(callback => {
                try { callback(eventData); }
                catch (e) { console.error(`Error in listener for ${eventType}:`, e); }
            });
        }

        // Handle wildcard listeners
        if (this.#listeners.has('*')) {
            this.#listeners.get('*').forEach(callback => {
                try { callback(eventData); }
                catch (e) { console.error('Error in wildcard listener:', e); }
            });
        }

        return this;
    }

    // ===== Event Connections =====

    registerEventConnection(sourceModule, targetModule, sourceEvent, targetMethod) {
        const connectionKey = `${sourceModule}:${sourceEvent}`;
        if (!this.#eventConnections.has(connectionKey)) {
            this.#eventConnections.set(connectionKey, []);
        }
        this.#eventConnections.get(connectionKey).push({
            targetModule,
            targetMethod,
            sourceEvent
        });
        return this;
    }

    // ===== Metadata =====

    setMetadata(metadata) {
        this.#metadataPrevious = this.#metadata ? deepClone(this.#metadata) : null;
        this.#metadata = metadata;

        if (this.#metadataChangeCallback) {
            try {
                executeCallback(this.#metadataChangeCallback,
                    Object.keys(metadata)[0] || 'metadata',
                    this.#metadataPrevious,
                    this.#metadata
                );
            } catch (e) {
                console.error('Metadata change callback error:', e);
            }
        }
        return this;
    }

    getMetadata() {
        return this.#metadata ? deepClone(this.#metadata) : null;
    }

    getMetadataPrevious() {
        return this.#metadataPrevious ? deepClone(this.#metadataPrevious) : null;
    }

    // ===== Callbacks =====

    setCallbackEvent(callback) {
        this.#eventCallback = typeof callback === 'function' ? callback : null;
        return this;
    }

    setCallbackEventRegistration(callback) {
        this.#eventRegistrationCallback = typeof callback === 'function' ? callback : null;
        return this;
    }

    setCallbackMetadataChange(callback) {
        this.#metadataChangeCallback = typeof callback === 'function' ? callback : null;
        return this;
    }

    // ===== Frequency Monitoring =====

    monitorEventFrequency(eventType, intervalMs, callback) {
        if (typeof callback !== 'function') return this;

        const monitorId = `${eventType}_${intervalMs}`;

        // Clear existing monitor
        if (this.#frequencyMonitors.has(monitorId)) {
            clearInterval(this.#frequencyMonitors.get(monitorId).intervalId);
        }

        const monitor = {
            eventType,
            intervalMs,
            callback,
            eventCounts: [],
            lastCount: 0,
            intervalId: null
        };

        monitor.intervalId = setInterval(() => {
            const currentCount = this.#eventCount;
            const countDiff = currentCount - monitor.lastCount;
            const frequency = (countDiff / intervalMs) * 1000;

            monitor.lastCount = currentCount;
            monitor.eventCounts.push({ timestamp: performance.now(), count: countDiff });

            // Keep only last 10 measurements
            if (monitor.eventCounts.length > 10) monitor.eventCounts.shift();

            try { callback(frequency); }
            catch (e) { console.error('Frequency monitor callback error:', e); }
        }, intervalMs);

        this.#frequencyMonitors.set(monitorId, monitor);
        return this;
    }

    #updateFrequencyMonitors(timestamp) {
        // Monitors are updated via intervals, this is a placeholder for event-based updates
    }

    // ===== Configuration =====

    setMaxHistorySize(size) {
        this.#maxHistorySize = Math.min(Math.max(0, size), EventGearLite.MAX_HISTORY_SIZE);
        return this;
    }

    setFrameDuration(duration) {
        // Compatibility method - frame duration not used in lite version
        return this;
    }

    setEventPerformanceMetricsActive(active) {
        // Compatibility method
        return this;
    }

    setIndependentIntervalLength(length) {
        // Compatibility method
        return this;
    }

    // ===== Getters =====

    getEventCountTotal() {
        return this.#eventCount;
    }

    getTotalRunningTime() {
        return (performance.now() - this.#startTime) / 1000;
    }

    getRecentEvents(count = 10) {
        return this.#eventHistory.slice(-count);
    }

    getEventPerformanceMetrics() {
        const runningTime = this.getTotalRunningTime();
        return {
            totalEvents: this.#eventCount,
            runningTimeSeconds: runningTime,
            averageFrequency: runningTime > 0 ? this.#eventCount / runningTime : 0,
            historySize: this.#eventHistory.length
        };
    }

    get isActive() { return this.#isActive; }
    get eventCount() { return this.#eventCount; }

    // ===== WebSocket Stub Methods (for compatibility) =====

    websocketSetIncomingUrl(url) { return this; }
    websocketSetOutgoingUrl(url) { return this; }
    websocketSetIncomingChannel(channel) { return this; }
    websocketSetOutgoingChannel(channel) { return this; }
    websocketSetAutoReceive(active) { return this; }
    websocketSetAutoSend(active) { return this; }
    websocketSendEvent(data) { return this; }
    websocketEventListenerAdd(event, callback) { return this; }
    websocketReset() { return this; }
    websocketGetIncomingWebSocketActive() { return false; }
    websocketGetOutgoingWebSocketActive() { return false; }
    websocketGetIncomingChannel() { return ''; }
    websocketGetOutgoingChannel() { return ''; }
    websocketGetAutoReceive() { return false; }
    websocketGetAutoSend() { return false; }
    websocketGetAutoPassThrough() { return false; }

    // ===== Node Bridge Stub Methods (for compatibility) =====

    nodeSetIncomingChannel(channel) { return this; }
    nodeSetOutgoingChannel(channel) { return this; }
    nodeGetIncomingChannel() { return ''; }
    nodeGetOutgoingChannel() { return ''; }
    nodeSend(channel, data) { return this; }

    // ===== Callback Tracker Stub Methods (for compatibility) =====

    setCallbackIntervalTime(interval, callback) { return this; }
    setCallbackIntervalCount(interval, callback) { return this; }
    setCallbackTotalTime(threshold, callback) { return this; }
    setCallbackTotalCount(threshold, callback) { return this; }
}

// Re-export for convenience
export { EventGearLite };
