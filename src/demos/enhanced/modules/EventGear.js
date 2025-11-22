/**
 * EventGear.js
 * Event system for the HarmonicXplorer NG application
 * Handles communication between modules
 */

class EventGear {
    constructor() {
        // Event registry
        this.events = {};
        
        // Event metadata
        this.metadata = {};
        
        // Module state
        this.running = false;
        
        // Debug mode
        this.debug = false;
    }
    
    /**
     * Start the event system
     */
    start() {
        if (this.running) {
            return true;
        }
        
        this.running = true;
        
        if (this.debug) {
            console.log('[EventGear] Event system started');
        }
        
        return true;
    }
    
    /**
     * Stop the event system
     */
    stop() {
        if (!this.running) {
            return true;
        }
        
        this.running = false;
        
        if (this.debug) {
            console.log('[EventGear] Event system stopped');
        }
        
        return true;
    }
    
    /**
     * Set debug mode
     * @param {boolean} debug - Debug mode flag
     */
    setDebugMode(debug) {
        this.debug = debug;
        
        if (this.debug) {
            console.log('[EventGear] Debug mode enabled');
        }
    }
    
    /**
     * Register an event
     * @param {string} eventName - Name of the event
     * @param {string} description - Description of the event
     */
    registerEvent(eventName, description = '') {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
            this.metadata[eventName] = {
                registered: Date.now(),
                description,
                triggerCount: 0,
                lastTriggered: null
            };
            
            if (this.debug) {
                console.log(`[EventGear] Event registered: ${eventName}`);
            }
        }
    }
    
    /**
     * Unregister an event
     * @param {string} eventName - Name of the event
     */
    unregisterEvent(eventName) {
        if (this.events[eventName]) {
            delete this.events[eventName];
            delete this.metadata[eventName];
            
            if (this.debug) {
                console.log(`[EventGear] Event unregistered: ${eventName}`);
            }
        }
    }
    
    /**
     * Add an event listener
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function
     * @param {*} context - Context to call the callback in
     */
    on(eventName, callback, context = null) {
        if (!this.events[eventName]) {
            this.registerEvent(eventName);
        }
        
        this.events[eventName].push({
            callback,
            context
        });
        
        if (this.debug) {
            console.log(`[EventGear] Listener added for: ${eventName}`);
        }
    }
    
    /**
     * Remove an event listener
     * @param {string} eventName - Name of the event
     * @param {Function} callback - Callback function
     * @param {*} context - Context of the callback
     */
    off(eventName, callback, context = null) {
        if (!this.events[eventName]) {
            return false;
        }
        
        this.events[eventName] = this.events[eventName].filter(listener => {
            return listener.callback !== callback || listener.context !== context;
        });
        
        if (this.debug) {
            console.log(`[EventGear] Listener removed for: ${eventName}`);
        }
        
        return true;
    }
    
    /**
     * Trigger an event
     * @param {string} eventName - Name of the event
     * @param {*} payload - Event data
     */
    trigger(eventName, payload = null) {
        if (!this.running) {
            if (this.debug) {
                console.warn(`[EventGear] Event system not running, ignored: ${eventName}`);
            }
            return false;
        }
        
        if (!this.events[eventName]) {
            if (this.debug) {
                console.warn(`[EventGear] Unregistered event triggered: ${eventName}`);
            }
            
            // Auto-register
            this.registerEvent(eventName, 'Auto-registered');
        }
        
        // Update metadata
        if (this.metadata[eventName]) {
            this.metadata[eventName].triggerCount++;
            this.metadata[eventName].lastTriggered = Date.now();
        }
        
        if (this.debug) {
            console.log(`[EventGear] Event triggered: ${eventName}`, payload);
        }
        
        // Execute callbacks
        const listeners = this.events[eventName] || [];
        
        listeners.forEach(listener => {
            try {
                if (listener.context) {
                    listener.callback.call(listener.context, payload);
                } else {
                    listener.callback(payload);
                }
            } catch (error) {
                console.error(`[EventGear] Error in event handler for ${eventName}:`, error);
            }
        });
        
        return listeners.length > 0;
    }
    
    /**
     * Get event statistics
     * @param {string} [eventName] - Optional event name
     * @return {Object} Event statistics
     */
    getStats(eventName = null) {
        if (eventName) {
            return this.metadata[eventName] || null;
        }
        
        const stats = {
            totalEvents: Object.keys(this.events).length,
            totalListeners: 0,
            events: {}
        };
        
        Object.keys(this.events).forEach(event => {
            const listeners = this.events[event].length;
            stats.totalListeners += listeners;
            stats.events[event] = {
                listeners,
                ...this.metadata[event]
            };
        });
        
        return stats;
    }
} 