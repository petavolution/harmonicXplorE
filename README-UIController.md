# UIController.js

## Overview
UIController manages all user interactions and UI updates in the HarmonicXplorer application. It handles DOM events, binds UI elements to application state through EventGear, and provides a responsive user interface for exploring harmonic relationships.

## Core Responsibilities

### DOM Interaction
UIController captures user interactions from buttons, sliders, inputs, and other UI elements, translating them into events for the application.

### UI State Synchronization
The module ensures the UI always reflects the current application state by listening for state changes and updating DOM elements.

### Event-Based Communication
UIController uses EventGear to decouple UI interactions from application logic, enabling clean architecture and testability.

## Key Features

### Initialization and Setup
```javascript
// Initialize the UI controller
uiController.initialize();

// Cache DOM elements for performance
uiController.cacheElements();

// Set up event listeners
uiController.setupEventListeners();
```

### UI Event Handling
```javascript
// Handle numeric input changes
uiController.handleNumericInput(inputElement, 'frequency');

// Handle button clicks
uiController.handleButtonClick(buttonElement, 'toggleAnimation');

// Handle select element changes
uiController.handleSelectChange(selectElement, 'visualizationMode');
```

### UI State Updates
```javascript
// Synchronize UI with application state
uiController.syncUIWithState({
  frequency: 440,
  amplitude: 0.5,
  visualizationMode: 'circular'
});

// Update a specific UI element
uiController.updateUIElement('frequency-input', 440);
```

## Integration with EventGear

UIController communicates with other components through EventGear:

### Emitted Events
- `uiParameterChanged`: When a UI control changes a parameter
- `uiActionTriggered`: When a UI action button is pressed
- `uiModeChanged`: When visualization mode is changed via UI
- `uiExportRequested`: When export functionality is triggered

### Handled Events
- `parameterChanged`: Updates UI when AppState parameters change
- `animationStateChanged`: Updates animation controls when animation state changes
- `warning.lowFPS`: May update UI to indicate performance issues

### Event Metadata
Events include detailed metadata about UI interactions:

```javascript
// Example uiParameterChanged event
{
  type: 'uiParameterChanged',
  parameter: 'frequency',
  value: 440,
  previousValue: 220,
  source: 'frequency-slider',
  interactionType: 'drag',
  timestamp: performance.now()
}
```

## Interaction Tracking

UIController can track user interactions for analytics or debugging:

```javascript
// Example interaction metrics
{
  interactions: {
    total: 47,
    byType: {
      'click': 12,
      'drag': 23,
      'input': 8,
      'select': 4
    },
    byElement: {
      'frequency-slider': 15,
      'play-button': 5,
      'visualization-mode-select': 4,
      // ...other elements
    }
  },
  sessionDuration: 340, // seconds
  mostUsedControls: ['frequency-slider', 'amplitude-slider', 'play-button']
}
```

## WebSocket Integration

UI interactions can be synchronized via WebSocket:

```javascript
// Send UI interaction events via WebSocket
eventGear.websocketSendEvent({
  type: 'uiInteraction',
  element: 'frequency-slider',
  value: 440,
  timestamp: performance.now()
});

// Receive remote UI updates via WebSocket
eventGear.on('websocket.message', (data) => {
  if (data.type === 'remoteUIUpdate') {
    uiController.syncUIWithState(data.parameters);
  }
});
```

## Example Usage in HarmonicXplorer

```javascript
// In main.js
const eventGear = new EventGear();
const appState = new AppState(eventGear);
const uiController = new UIController(eventGear, appState);

// Connect events
eventGear.registerEventConnection('uiController', 'appState', 'uiParameterChanged', 'updateParam');
eventGear.registerEventConnection('appState', 'uiController', 'parameterChanged', 'updateUI');

// Initialize UI
uiController.initialize();
```

## Advanced UI Features

### Modal Dialogs
```javascript
// Show modal dialog
uiController.showModal('settings', {
  title: 'Application Settings',
  content: settingsFormHTML,
  onSave: (formData) => {
    appState.updateMultipleParams(formData);
    eventGear.emit('settingsUpdated', formData);
  }
});
```

### Keyboard Shortcuts
```javascript
// Register keyboard shortcuts
uiController.registerShortcut('Space', () => {
  uiController.togglePlayback();
});

uiController.registerShortcut('Ctrl+S', () => {
  uiController.saveState();
});
```

### UI Themes and Customization
```javascript
// Change UI theme
uiController.setTheme('dark');

// Customize UI elements
uiController.customizeUI({
  mainColor: '#3498db',
  accentColor: '#e74c3c',
  fontSize: '16px',
  controlSize: 'large'
});
```

### State Import/Export
```javascript
// Export application state to JSON
uiController.exportState().then(stateJSON => {
  // Download or share state
});

// Import application state from JSON
uiController.importState(stateJSON).then(() => {
  console.log('State imported successfully');
});
```

## DOM Binding Integration

UIController works with the DOM binding system:

```javascript
// HTML with data binding attributes
// <input type="range" id="frequency-slider" data-eg-bind="parameterChanged:frequency">
// <div id="frequency-display" data-eg-bind="parameterChanged:frequency"></div>

// Register bindings
uiController.registerDOMBindings();
```

## Performance Optimizations

- DOM element caching to avoid repeated queries
- Event delegation for complex UI structures
- Throttling and debouncing for high-frequency interactions like sliders
- Batch updates for related UI elements
- RAF scheduling for visual updates

## Best Practices

- Use event delegation instead of individual listeners when possible
- Cache DOM elements during initialization
- Use data attributes to mark elements for interaction
- Implement proper cleanup when the application is destroyed
- Separate UI logic from business logic through event-based communication
- Use templates for complex UI structures to maintain readability
- Handle invalid user input gracefully
- Provide visual feedback for long-running operations