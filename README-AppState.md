# AppState.js

## Overview
AppState is the central state management module for the HarmonicXplorer application. It maintains application parameters, implements undo/redo functionality, and uses EventGear to notify components about state changes.

## Core Responsibilities

### State Management
AppState maintains a central store of all application parameters, providing a single source of truth for the application state.

### Change Notification
When state changes occur, AppState emits events through EventGear, enabling other components to react to these changes.

### State History
AppState implements undo/redo functionality by maintaining a history of state changes.

## Key Features

### Parameter Management
```javascript
// Update a single parameter
appState.updateParam('frequency', 440);

// Update multiple parameters at once
appState.updateMultipleParams({
  frequency: 440,
  amplitude: 0.8,
  harmonics: [1, 0.5, 0.33]
});

// Get a parameter value
const frequency = appState.getParam('frequency');

// Get all parameters
const allParams = appState.getAllParams();
```

### History Management
```javascript
// Undo the last change
appState.undo();

// Redo a previously undone change
appState.redo();

// Reset parameters to defaults
appState.resetToDefaults();
```

### Metadata Tracking
AppState tracks detailed metadata about state changes:

```javascript
// Example metadata structure
{
  parameters: {
    frequency: {
      value: 440,
      lastChanged: 1610000000000,
      changeCount: 5
    },
    amplitude: {
      value: 0.8,
      lastChanged: 1610000010000,
      changeCount: 3
    }
  },
  stateHistory: {
    position: 10,
    totalChanges: 10,
    lastUndoTime: null
  }
}
```

## Integration with EventGear

AppState is deeply integrated with EventGear for state management:

### Emitted Events
- `parameterChanged`: When a single parameter changes
- `multipleParametersChanged`: When multiple parameters change at once
- `stateReset`: When all parameters are reset to defaults
- `stateUndone`: When an undo operation is performed
- `stateRedone`: When a redo operation is performed

### Event Metadata
Each event includes rich metadata:

```javascript
// Example parameterChanged event
{
  type: 'parameterChanged',
  parameter: 'frequency',
  oldValue: 440,
  newValue: 880,
  timestamp: 1610000050000,
  source: 'uiController'
}
```

### State Change Frequency Monitoring
AppState can monitor the frequency of state changes and emit warnings when changes occur too frequently:

```javascript
// Monitor state change frequency
appState.monitorStateChangeFrequency(5, (frequency) => {
  console.warn(`High state change frequency: ${frequency} changes/second`);
});
```

## Performance Considerations

AppState implements several optimizations:

- Changes are only emitted when values actually change
- Bulk updates are handled in a single event to reduce overhead
- State change history can be limited to prevent memory issues
- Frequency monitoring prevents excessive state changes

## WebSocket Integration

AppState can sync state changes over WebSocket:

```javascript
// When state changes
eventGear.websocketSendEvent({
  type: 'stateChanged',
  parameters: appState.getAllParams(),
  timestamp: performance.now()
});
```

## Debug Support

AppState provides methods for debugging:

```javascript
// Get state metrics
const metrics = appState.getStateMetrics();

// Register debug events for all parameters
appState.registerDebugEvents();
```

## Example Usage in HarmonicXplorer

```javascript
// In main.js
const eventGear = new EventGear();
const appState = new AppState(eventGear);

// Connect with other components
eventGear.registerEventConnection('appState', 'harmonicSeries', 'parameterChanged', 'updateHarmonics');
eventGear.registerEventConnection('appState', 'audioSynthesis', 'parameterChanged', 'updateAudioParameters');

// Listen for UI changes
eventGear.on('uiParameterChanged', (data) => {
  appState.updateParam(data.parameter, data.value);
});
```

## Advanced Usage

### Custom Parameter Validation
```javascript
// Extend AppState with custom validation
class CustomAppState extends AppState {
  validateParam(name, value) {
    if (name === 'frequency' && (value < 20 || value > 20000)) {
      console.warn('Frequency out of human hearing range');
      return false;
    }
    return true;
  }
}
```

### State Persistence
```javascript
// Save state to localStorage
appState.saveState = () => {
  localStorage.setItem('appState', JSON.stringify(appState.getAllParams()));
};

// Load state from localStorage
appState.loadState = () => {
  const savedState = JSON.parse(localStorage.getItem('appState'));
  if (savedState) {
    appState.updateMultipleParams(savedState);
  }
};
```

## Best Practices

- Always update state through AppState methods, never directly
- Listen for state change events instead of polling state
- Group related parameter changes using updateMultipleParams
- Use meaningful parameter names for better code readability
- Include source information in parameter updates for debugging 