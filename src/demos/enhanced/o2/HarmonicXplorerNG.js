/**
 * HarmonicXplorerNG.js
 * Main entry point for the HarmonicXplorer next generation application
 * 
 * This file initializes the application and its modules, setting up
 * the core infrastructure for visualization, audio, and user interaction.
 */

// Minimal EventGear implementation as fallback
if (!window.EventGear) {
    console.warn("EventGear not loaded, using minimal fallback implementation");
    class MinimalEventGear {
        constructor() {
            this.callbacks = new Map();
            this.isRunning = false;
        }
        
        start() {
            this.isRunning = true;
            console.log("MinimalEventGear started");
            return this;
        }
        
        stop() {
            this.isRunning = false;
            console.log("MinimalEventGear stopped");
            return this;
        }
        
        registerEvent(eventName, metaData = {}) {
            if (!this.callbacks.has(eventName)) {
                this.callbacks.set(eventName, new Set());
            }
            return this;
        }
        
        linkEventListener(eventName, callback) {
            if (!this.callbacks.has(eventName)) {
                this.registerEvent(eventName);
            }
            this.callbacks.get(eventName).add(callback);
            return this;
        }
        
        unlinkEventListener(eventName, callback) {
            if (this.callbacks.has(eventName)) {
                this.callbacks.get(eventName).delete(callback);
            }
            return this;
        }
        
        trigger(eventName, payload = {}) {
            if (this.callbacks.has(eventName)) {
                this.callbacks.get(eventName).forEach(callback => {
                    try {
                        callback(payload);
                    } catch (error) {
                        console.error(`Error in event handler for ${eventName}:`, error);
                    }
                });
            }
            return this;
        }
    }
    
    window.EventGear = MinimalEventGear;
}

// Main application class
class HarmonicXplorerApp {
    constructor(config = {}) {
        this.config = Object.assign({
            containerId: 'visualization',
            autoStart: false
        }, config);
        
        this.core = null;
        this.events = null;
        this.initialized = false;
    }
    
    async initialize() {
        try {
            console.log("Initializing HarmonicXplorerApp...");
            
            // Set up DOM when it's ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeApp());
            } else {
                await this.initializeApp();
            }
            
            return true;
        } catch (error) {
            console.error("Initialization error:", error);
            this.showErrorMessage(`Failed to initialize application: ${error.message}`);
            return false;
        }
    }
    
    async initializeApp() {
        try {
            console.log("Starting application initialization...");
            
            // Add a small delay to ensure DOM is fully loaded
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Verify all required modules are loaded
            this.verifyModulesLoaded();
            
            // Set up event system
            this.events = new EventGear();
            this.events.start();
            
            // Create the core
            this.core = new HarmonicXplorerCore({
                containerId: this.config.containerId
            });
            
            // Create and register modules
            const renderer = new HarmonicXplorerRenderer();
            const audio = new HarmonicXplorerAudio();
            const ui = new HarmonicXplorerUI();
            
            this.core.registerModule('renderer', renderer)
                    .registerModule('audio', audio)
                    .registerModule('ui', ui);
            
            // Add manual controls to ensure UI responsiveness
            this.setupManualControls();
            
            // Initialize the core, which will initialize all modules
            console.log("Initializing core and modules...");
            const initSuccess = await this.core.initialize();
            if (!initSuccess) {
                throw new Error("Failed to initialize core components");
            }
            
            // Set up event handling
            this.setupEvents();
            
            // Start the application if autoStart is enabled
            if (this.config.autoStart) {
                this.core.start();
            }
            
            this.initialized = true;
            console.log("HarmonicXplorerApp initialized successfully");
            
            // Update UI to reflect current state
            this.core.updateUI();
            
            // Request an initial render
            this.core.requestRender();
            
            return true;
        } catch (error) {
            console.error("App initialization error:", error);
            this.showErrorMessage(`Failed to initialize application: ${error.message}`);
            return false;
        }
    }
    
    verifyModulesLoaded() {
        // Check if all required modules are available
        const requiredModules = [
            'HarmonicXplorerCore',
            'HarmonicXplorerRenderer',
            'HarmonicXplorerAudio',
            'HarmonicXplorerUI'
        ];
        
        const missingModules = requiredModules.filter(
            moduleName => typeof window[moduleName] !== 'function'
        );
        
        if (missingModules.length > 0) {
            throw new Error(`Required modules not loaded: ${missingModules.join(', ')}`);
        }
    }
    
    setupEvents() {
        if (!this.events || !this.core) return;
        
        // Register events
        this.events.registerEvent('stateUpdate', { description: 'Application state updated' })
                  .registerEvent('harmonicUpdate', { description: 'Harmonic parameters updated' })
                  .registerEvent('renderRequest', { description: 'Rendering requested' })
                  .registerEvent('audioToggle', { description: 'Audio enabled/disabled' });
        
        // Link event listeners
        this.events.linkEventListener('stateUpdate', (payload) => {
            this.core.updateState(payload);
        });
        
        this.events.linkEventListener('renderRequest', () => {
            this.core.requestRender();
        });
        
        this.events.linkEventListener('audioToggle', (payload) => {
            this.core.updateState({ audioEnabled: payload.enabled });
        });
        
        // Expose events to window for debugging
        window.harmonicEvents = this.events;
    }
    
    setupManualControls() {
        console.log("Setting up manual UI controls...");
        
        // Handle the main control buttons
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');
        const openCalculator = document.getElementById('openCalculator');
        
        if (startBtn) {
            console.log("Setting up start button");
            startBtn.addEventListener('click', () => {
                if (this.core.state.isRunning) {
                    this.core.stop();
                } else {
                    this.core.start();
                }
            });
        } else {
            console.warn("Start button not found");
        }
        
        if (resetBtn) {
            console.log("Setting up reset button");
            resetBtn.addEventListener('click', () => {
                const ui = this.core.getModule('ui');
                if (ui && typeof ui.resetToDefaults === 'function') {
                    ui.resetToDefaults();
                }
            });
        } else {
            console.warn("Reset button not found");
        }
        
        if (openCalculator) {
            console.log("Setting up calculator button");
            openCalculator.addEventListener('click', () => {
                const modal = document.getElementById('calculatorModal');
                if (modal) {
                    modal.style.display = 'block';
                }
            });
        } else {
            console.warn("Calculator button not found");
        }
        
        // Set up modal close buttons
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                const modal = closeBtn.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // Set up display toggle buttons
        const geometryBtn = document.getElementById('geometryBtn');
        const waveformBtn = document.getElementById('waveformBtn');
        const audioBtn = document.getElementById('audioBtn');
        
        if (geometryBtn) {
            console.log("Setting up geometry button");
            geometryBtn.addEventListener('click', () => {
                this.core.updateState({ showGeometry: !this.core.state.showGeometry });
                geometryBtn.classList.toggle('active', this.core.state.showGeometry);
            });
        }
        
        if (waveformBtn) {
            console.log("Setting up waveform button");
            waveformBtn.addEventListener('click', () => {
                this.core.updateState({ showWaveform: !this.core.state.showWaveform });
                waveformBtn.classList.toggle('active', this.core.state.showWaveform);
            });
        }
        
        if (audioBtn) {
            console.log("Setting up audio button");
            audioBtn.addEventListener('click', () => {
                this.core.updateState({ audioEnabled: !this.core.state.audioEnabled });
                audioBtn.classList.toggle('active', this.core.state.audioEnabled);
            });
        }
    }
    
    showErrorMessage(message) {
        console.error(message);
        
        // Create error element if it doesn't exist
        const container = document.querySelector(`.${this.config.containerId}`);
        if (container) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(244, 67, 54, 0.9);
                color: white;
                padding: 20px;
                border-radius: 5px;
                max-width: 80%;
                text-align: center;
                z-index: 1000;
            `;
            errorElement.textContent = message;
            
            // Add a retry button
            const retryButton = document.createElement('button');
            retryButton.textContent = 'Retry';
            retryButton.style.cssText = `
                margin-top: 10px;
                padding: 8px 16px;
                background-color: white;
                color: #F44336;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            `;
            retryButton.addEventListener('click', () => {
                errorElement.remove();
                this.initialize();
            });
            
            errorElement.appendChild(document.createElement('br'));
            errorElement.appendChild(retryButton);
            
            container.appendChild(errorElement);
        }
    }
}

// Create and initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.harmonicApp = new HarmonicXplorerApp({
        containerId: 'visualization',
        autoStart: true
    });
    
    harmonicApp.initialize().then(success => {
        if (success) {
            console.log("HarmonicXplorerNG is ready!");
        } else {
            console.error("Failed to initialize HarmonicXplorerNG");
        }
    });
}); 