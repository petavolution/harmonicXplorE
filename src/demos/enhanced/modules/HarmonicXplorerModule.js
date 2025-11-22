/**
 * HarmonicXplorerModule.js
 * Base module class for all HarmonicXplorer NG modules
 */

class HarmonicXplorerModule {
    constructor(options = {}) {
        // Core reference
        this.core = null;
        
        // Event system reference
        this.eventSystem = null;
        
        // Module state
        this.enabled = true;
        this.initialized = false;
        this.running = false;
        
        // Debug mode
        this.debug = options.debug || false;
    }
    
    /**
     * Initialize the module - should be overridden by derived classes
     * @return {boolean} Success indicator
     */
    async initialize() {
        this.log('Module initialized');
        this.initialized = true;
        return true;
    }
    
    /**
     * Set the core module reference
     * @param {HarmonicXplorerCore} core - Core module instance
     */
    setCore(core) {
        if (!core) {
            throw new Error('Invalid core module');
        }
        this.core = core;
        this.log('Core module reference set');
    }
    
    /**
     * Set the event system reference
     * @param {EventGear} eventSystem - Event system instance
     */
    setEventSystem(eventSystem) {
        if (!eventSystem) {
            throw new Error('Invalid event system');
        }
        this.eventSystem = eventSystem;
        this.log('Event system reference set');
    }
    
    /**
     * Start the module
     */
    start() {
        if (!this.initialized) {
            this.logWarning('Cannot start uninitialized module');
            return false;
        }
        
        if (this.running) {
            return true;
        }
        
        this.running = true;
        this.onStart();
        this.log('Module started');
        return true;
    }
    
    /**
     * Stop the module
     */
    stop() {
        if (!this.running) {
            return true;
        }
        
        this.running = false;
        this.onStop();
        this.log('Module stopped');
        return true;
    }
    
    /**
     * Enable the module
     */
    enable() {
        if (this.enabled) {
            return true;
        }
        
        this.enabled = true;
        this.onEnable();
        this.log('Module enabled');
        return true;
    }
    
    /**
     * Disable the module
     */
    disable() {
        if (!this.enabled) {
            return true;
        }
        
        this.enabled = false;
        this.onDisable();
        this.log('Module disabled');
        return true;
    }
    
    /**
     * Set debug mode
     * @param {boolean} debug - Debug flag
     */
    setDebugMode(debug) {
        this.debug = debug;
        this.log(`Debug mode ${debug ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Handle module start - can be overridden by derived classes
     */
    onStart() {
        // Placeholder for derived classes
    }
    
    /**
     * Handle module stop - can be overridden by derived classes
     */
    onStop() {
        // Placeholder for derived classes
    }
    
    /**
     * Handle module enable - can be overridden by derived classes
     */
    onEnable() {
        // Placeholder for derived classes
    }
    
    /**
     * Handle module disable - can be overridden by derived classes
     */
    onDisable() {
        // Placeholder for derived classes
    }
    
    /**
     * Log a message
     * @param {string} message - Message to log
     */
    log(message) {
        const moduleName = this.constructor.name;
        console.log(`[${moduleName}] ${message}`);
        
        // Send to core if available
        if (this.core && typeof this.core.logDebug === 'function') {
            this.core.logDebug(`${moduleName}: ${message}`);
        }
    }
    
    /**
     * Log an error
     * @param {string} message - Error message
     * @param {Error} [error] - Error object
     */
    logError(message, error) {
        const moduleName = this.constructor.name;
        if (error) {
            console.error(`[${moduleName}] ${message}`, error);
        } else {
            console.error(`[${moduleName}] ${message}`);
        }
        
        // Send to core if available
        if (this.core && typeof this.core.logError === 'function') {
            this.core.logError(`${moduleName}: ${message}`);
        }
    }
    
    /**
     * Log a warning
     * @param {string} message - Warning message
     */
    logWarning(message) {
        const moduleName = this.constructor.name;
        console.warn(`[${moduleName}] ${message}`);
        
        // Send to core if available
        if (this.core && typeof this.core.logWarning === 'function') {
            this.core.logWarning(`${moduleName}: ${message}`);
        }
    }
} 