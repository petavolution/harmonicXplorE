/**
 * HarmonicXplorerNG.js
 * Main application file for the HarmonicXplorer Next Generation
 */

class HarmonicXplorerNG {
    constructor() {
        // Module references
        this.eventSystem = null;
        this.core = null;
        this.ui = null;
        this.renderer = null;
        this.audio = null;
        
        // Visualization container
        this.container = null;
        
        // Debug mode
        this.debug = false;
        
        // Bind instance methods
        this.initializeApp = this.initializeApp.bind(this);
        this.handleDebugToggle = this.handleDebugToggle.bind(this);
        this.handleHelpToggle = this.handleHelpToggle.bind(this);
        this.logDebug = this.logDebug.bind(this);
    }
    
    /**
     * Initialize the application
     */
    async initializeApp() {
        try {
            console.log('Initializing HarmonicXplorer NG...');
            
            // Allow a small delay for DOM to be ready
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Verify all modules are loaded
            this.verifyModuleLoading();
            
            // Set up visualization container
            this.setupVisualizationContainer();
            
            // Set up event system
            this.setupEventSystem();
            
            // Create and register core modules
            this.setupCoreModules();
            
            // Initialize debug panel
            this.setupDebugPanel();
            
            // Set up modal dialogs
            this.setupModals();
            
            // Start the application
            this.start();
            
            console.log('HarmonicXplorer NG initialization complete');
            return true;
        } catch (error) {
            console.error('Application initialization error:', error);
            this.showErrorMessage('Initialization error: ' + error.message);
            return false;
        }
    }
    
    /**
     * Verify that all required modules are loaded
     */
    verifyModuleLoading() {
        const requiredClasses = [
            'HarmonicXplorerModule',
            'EventGear',
            'HarmonicXplorerCore',
            'HarmonicXplorerUI',
            'HarmonicXplorerRenderer',
            'HarmonicXplorerAudio'
        ];
        
        const missingClasses = requiredClasses.filter(className => {
            return typeof window[className] !== 'function';
        });
        
        if (missingClasses.length > 0) {
            throw new Error(`Missing required modules: ${missingClasses.join(', ')}`);
        }
        
        this.logDebug('All modules verified');
    }
    
    /**
     * Set up the visualization container and create canvas layers
     */
    setupVisualizationContainer() {
        // Get the container
        this.container = document.getElementById('visualization');
        
        if (!this.container) {
            throw new Error('Visualization container not found');
        }
        
        // Clear any existing content
        this.container.innerHTML = '';
        
        this.logDebug('Visualization container ready');
    }
    
    /**
     * Set up the event system
     */
    setupEventSystem() {
        this.eventSystem = new EventGear();
        this.logDebug('Event system initialized');
    }
    
    /**
     * Create and initialize all core modules
     */
    async setupCoreModules() {
        try {
            // Create core module
            this.core = new HarmonicXplorerCore({
                debug: this.debug
            });
            
            // Create UI module
            this.ui = new HarmonicXplorerUI({
                debug: this.debug
            });
            
            // Create renderer module
            this.renderer = new HarmonicXplorerRenderer({
                debug: this.debug
            });
            
            // Create audio module
            this.audio = new HarmonicXplorerAudio({
                debug: this.debug
            });
            
            // Register modules with core
            this.core.registerModule('ui', this.ui);
            this.core.registerModule('renderer', this.renderer);
            this.core.registerModule('audio', this.audio);
            
            // Register event system with all modules
            this.core.setEventSystem(this.eventSystem);
            this.ui.setEventSystem(this.eventSystem);
            this.renderer.setEventSystem(this.eventSystem);
            this.audio.setEventSystem(this.eventSystem);
            
            // Register core with all modules
            this.ui.setCore(this.core);
            this.renderer.setCore(this.core);
            this.audio.setCore(this.core);
            
            // Initialize modules
            await this.ui.initialize();
            await this.renderer.initialize(this.container);
            await this.audio.initialize();
            
            // Initialize core last
            await this.core.initialize();
            
            this.logDebug('All modules initialized');
        } catch (error) {
            console.error('Module setup error:', error);
            throw error;
        }
    }
    
    /**
     * Set up the debug panel
     */
    setupDebugPanel() {
        // Get debug button
        const debugButton = document.getElementById('debugButton');
        if (debugButton) {
            debugButton.addEventListener('click', this.handleDebugToggle);
        }
        
        // Clear debug panel
        const debugContent = document.getElementById('debugContent');
        if (debugContent) {
            debugContent.innerHTML = '';
        }
        
        this.logDebug('Debug panel initialized');
    }
    
    /**
     * Set up modal dialogs
     */
    setupModals() {
        // Help modal
        const helpButton = document.getElementById('helpButton');
        const helpModal = document.getElementById('helpModal');
        const helpClose = helpModal?.querySelector('.modal-close');
        
        if (helpButton && helpModal) {
            helpButton.addEventListener('click', this.handleHelpToggle);
            helpClose?.addEventListener('click', () => {
                helpModal.style.display = 'none';
            });
        }
        
        // Settings modal
        const loadSettingsButton = document.getElementById('loadSettings');
        const loadSettingsModal = document.getElementById('loadSettingsModal');
        const settingsClose = loadSettingsModal?.querySelector('.modal-close');
        const applySettingsButton = document.getElementById('applySettings');
        
        if (loadSettingsButton && loadSettingsModal) {
            loadSettingsButton.addEventListener('click', () => {
                loadSettingsModal.style.display = 'block';
            });
            
            settingsClose?.addEventListener('click', () => {
                loadSettingsModal.style.display = 'none';
            });
            
            applySettingsButton?.addEventListener('click', () => {
                const settingsInput = document.getElementById('settingsInput');
                if (settingsInput && settingsInput.value) {
                    try {
                        const settings = JSON.parse(settingsInput.value);
                        this.core.loadSettings(settings);
                        loadSettingsModal.style.display = 'none';
                    } catch (error) {
                        this.showErrorMessage('Invalid settings format: ' + error.message);
                    }
                }
            });
        }
        
        // Close modals when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === helpModal) {
                helpModal.style.display = 'none';
            }
            if (event.target === loadSettingsModal) {
                loadSettingsModal.style.display = 'none';
            }
        });
        
        this.logDebug('Modals initialized');
    }
    
    /**
     * Start the application
     */
    start() {
        // Start all modules
        this.core.start();
        this.ui.start();
        this.renderer.start();
        this.audio.start();
        
        this.logDebug('Application started');
    }
    
    /**
     * Handle debug button toggle
     */
    handleDebugToggle() {
        this.debug = !this.debug;
        
        // Update debug mode on all modules
        if (this.core) this.core.setDebugMode(this.debug);
        if (this.ui) this.ui.setDebugMode(this.debug);
        if (this.renderer) this.renderer.setDebugMode(this.debug);
        if (this.audio) this.audio.setDebugMode(this.debug);
        
        // Show/hide debug panel
        const debugPanel = document.getElementById('debugPanel');
        if (debugPanel) {
            debugPanel.style.display = this.debug ? 'block' : 'none';
        }
        
        // Update button text
        const debugButton = document.getElementById('debugButton');
        if (debugButton) {
            debugButton.textContent = this.debug ? 'Hide Debug' : 'Debug';
            debugButton.classList.toggle('active', this.debug);
        }
        
        this.logDebug(`Debug mode ${this.debug ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Handle help button toggle
     */
    handleHelpToggle() {
        const helpModal = document.getElementById('helpModal');
        if (helpModal) {
            helpModal.style.display = 'block';
        }
    }
    
    /**
     * Log debug message
     * @param {string} message - Debug message to log
     */
    logDebug(message) {
        console.log(`[HarmonicXplorer] ${message}`);
        
        // Add to debug panel if in debug mode
        if (this.debug) {
            const debugContent = document.getElementById('debugContent');
            if (debugContent) {
                const entry = document.createElement('div');
                entry.className = 'debug-entry';
                entry.textContent = `${new Date().toISOString().split('T')[1].slice(0, -1)} | ${message}`;
                debugContent.appendChild(entry);
                debugContent.scrollTop = debugContent.scrollHeight;
            }
        }
    }
    
    /**
     * Show error message to user
     * @param {string} message - Error message to display
     */
    showErrorMessage(message) {
        console.error(message);
        
        // Create and show alert
        alert(`Error: ${message}`);
    }
}

// Create and initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new HarmonicXplorerNG();
    app.initializeApp();
}); 