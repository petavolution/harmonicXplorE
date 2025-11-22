# DOMBinder.js

## Overview
DOMBinder provides a powerful, declarative way to bind DOM elements to the EventGear system within the HarmonicXplorer application. It creates a two-way connection between UI elements and application state, automatically synchronizing changes and handling user interactions through the event system.

## Core Responsibilities

### DOM-to-EventGear Binding
Connects DOM elements to EventGear events, automatically emitting events when users interact with the UI.

### EventGear-to-DOM Binding
Updates DOM elements when events are triggered, keeping the UI in sync with application state.

### Declarative Configuration
Offers a simple, attribute-based API for defining bindings directly in HTML.

## Key Features

### Initialization
```javascript
// Initialize DOM Binder
const domBinder = new DOMBinder(eventGear, {
  rootElement: document.body,
  defaultNamespace: 'ui',
  validateSelectors: true,
  debug: false
});

// Start binding
domBinder.initialize();

// Clean up bindings when needed
domBinder.dispose();
```

### Data Binding Attributes

```html
<!-- Basic parameter binding -->
<input type="range" 
       data-bind-value="frequency" 
       data-bind-event="input" 
       min="20" max="2000">

<!-- Element content binding -->
<div data-bind-content="currentMode"></div>

<!-- Attribute binding -->
<button data-bind-attr="disabled:isProcessing">Start</button>

<!-- Class binding -->
<div data-bind-class="active:isPlaying,error:hasError"></div>

<!-- Style binding -->
<div data-bind-style="opacity:harmonicOpacity,backgroundColor:harmonicColor"></div>

<!-- Event binding -->
<button data-bind-event="click:startVisualization">Start</button>

<!-- One-way binding (only listen to events, don't emit) -->
<div data-bind-content="statusMessage" data-bind-oneway="true"></div>

<!-- Custom transform function -->
<input type="text" 
       data-bind-value="frequency" 
       data-bind-transform="toFixedTwo">
```

### Two-way Data Binding

```javascript
// Register a two-way binding
domBinder.bindTwoWay({
  // DOM element selector
  selector: '#frequency-slider',
  
  // Parameter in AppState
  parameter: 'frequency',
  
  // DOM events to listen for
  events: ['input', 'change'],
  
  // Value transformation (DOM to parameter)
  transformToParam: (domValue) => parseFloat(domValue),
  
  // Value transformation (parameter to DOM)
  transformToDOM: (paramValue) => paramValue.toFixed(2),
  
  // DOM property to bind (default: 'value')
  property: 'value',
  
  // Event namespace and type
  eventNamespace: 'ui',
  eventType: 'parameterChanged'
});
```

### Event Binding

```javascript
// Register a simple event binding
domBinder.bindEvent({
  selector: '#start-button',
  events: ['click'],
  eventType: 'startVisualization',
  includeElement: true, // Include element reference in event data
  preventDefault: true, // Prevent default browser behavior
  metadata: { source: 'button', importance: 'high' }
});

// Register event with data extraction
domBinder.bindEvent({
  selector: '.preset-button',
  events: ['click'],
  eventType: 'loadPreset',
  getData: (element, event) => ({
    presetId: element.dataset.presetId,
    presetName: element.textContent,
    shiftKey: event.shiftKey // Include original event data
  })
});
```

### Binding Groups

```javascript
// Create a binding group
domBinder.createBindingGroup('harmonicsControls', {
  root: '#harmonics-panel',
  namespace: 'harmonics',
  defaultTransform: (val) => parseFloat(val)
});

// Add bindings to the group
domBinder.bindToGroup('harmonicsControls', [
  {
    selector: '.harmonic-amplitude',
    parameter: (el) => `harmonic${el.dataset.index}.amplitude`,
    events: ['input'],
    property: 'value'
  },
  {
    selector: '.harmonic-phase',
    parameter: (el) => `harmonic${el.dataset.index}.phase`,
    events: ['input'],
    property: 'value'
  }
]);
```

## Integration with EventGear

DOMBinder communicates with other components through EventGear:

### Emitted Events
- `ui.parameterChanged`: When bound form elements are modified
- `ui.{eventType}`: Custom events defined in event bindings
- `ui.bindingInitialized`: When bindings are established
- `ui.bindingError`: When binding errors occur

### Handled Events
- `parameterChanged`: To update bound DOM elements
- `{paramName}Changed`: Parameter-specific change events
- `bindingRefresh`: To force refresh all bindings

### Event Metadata
Events include metadata about the DOM interaction:

```javascript
// Example ui.parameterChanged event
{
  type: 'ui.parameterChanged',
  paramName: 'frequency',
  value: 440,
  previousValue: 432,
  element: HTMLInputElement,  // Reference to DOM element
  originalEvent: InputEvent,  // Original DOM event
  timestamp: performance.now(),
  source: 'user-input',
  inputType: 'slider'
}
```

## Form Integration

```javascript
// Bind an entire form
domBinder.bindForm({
  selector: '#settings-form',
  paramPrefix: 'settings.',
  submitEventType: 'saveSettings',
  validateBeforeSubmit: true, // Use HTML5 validation
  resetOnSubmit: false
});

// Form validation integration
domBinder.setFormValidator('#settings-form', {
  validateOnEvents: ['input', 'change'],
  errorClass: 'input-error',
  errorMessageSelector: '.error-message',
  customValidators: {
    'divisibleBy': (value, arg) => parseInt(value) % parseInt(arg) === 0
  }
});
```

## WebComponent Integration

```javascript
// Register with custom elements
domBinder.connectToWebComponent('harmonic-slider', {
  properties: ['value', 'min', 'max'],
  events: [
    { 
      name: 'value-changed', 
      dataPath: 'detail.value',
      eventType: 'parameterChanged',
      paramName: (el) => el.getAttribute('param-name')
    }
  ]
});
```

## Example Usage in HarmonicXplorer

```javascript
// In main.js
const eventGear = new EventGear();
const appState = new AppState(eventGear);

// Initialize the DOM binder
const domBinder = new DOMBinder(eventGear, {
  rootElement: document.getElementById('app'),
  debug: window.location.hostname === 'localhost'
});

// Register custom transformers
domBinder.registerTransformer('frequencyToNote', (freq) => {
  // Convert frequency to musical note
  return getNoteFromFrequency(freq);
});

domBinder.registerTransformer('percentToDecimal', (percent) => {
  return parseInt(percent) / 100;
});

// Initialize bindings
domBinder.initialize();

// Connect to AppState events
eventGear.on('ui.parameterChanged', (data) => {
  appState.updateParam(data.paramName, data.value);
});

// Listen for UI actions
eventGear.on('ui.startVisualization', (data) => {
  visualizer.start();
  appState.updateParam('isPlaying', true);
});

// Update DOM when app state changes
eventGear.on('parameterChanged', (data) => {
  domBinder.updateBoundElements(data.paramName, data.value);
});
```

## HTML Structure Example

```html
<div id="app">
  <header>
    <h1>HarmonicXplorer</h1>
    <div class="status" data-bind-content="statusMessage"></div>
  </header>
  
  <div class="main-controls">
    <button data-bind-event="click:startVisualization" 
            data-bind-class="active:isPlaying">
      Start
    </button>
    
    <button data-bind-event="click:stopVisualization" 
            data-bind-attr="disabled:!isPlaying">
      Stop
    </button>
  </div>
  
  <div class="frequency-control">
    <label for="frequency">Frequency</label>
    <input id="frequency" 
           type="range" 
           data-bind-value="frequency" 
           data-bind-event="input" 
           min="20" max="2000">
    <span data-bind-content="frequency" 
          data-bind-transform="toFixed:1"></span>Hz
    (<span data-bind-content="frequency" 
           data-bind-transform="frequencyToNote"></span>)
  </div>
  
  <div id="harmonics-panel">
    <!-- Dynamically generated elements will be bound by group -->
    <div class="harmonic-control" data-index="1">
      <input type="range" class="harmonic-amplitude" data-index="1">
      <input type="range" class="harmonic-phase" data-index="1">
    </div>
    <!-- More harmonic controls... -->
  </div>
</div>
```

## Advanced Features

### Conditional Binding
```javascript
// Conditionally apply bindings
domBinder.bindConditional({
  selector: '#advanced-controls',
  condition: () => appState.getParam('userLevel') === 'advanced',
  bindings: [
    {
      selector: '.harmonic-envelope',
      parameter: 'envelopeType',
      events: ['change'],
      property: 'value'
    }
    // More bindings...
  ],
  showHideElement: true // Toggle visibility of the element
});
```

### Dynamic Element Creation
```javascript
// Create elements based on data
domBinder.createElementsFromData({
  dataProvider: () => appState.getParam('harmonics'),
  containerSelector: '#harmonics-list',
  template: (harmonic, index) => `
    <div class="harmonic-item" data-index="${index}">
      <span class="harmonic-number">${index + 1}</span>
      <input type="range" class="harmonic-amplitude" 
             data-index="${index}" value="${harmonic.amplitude}">
      <span class="harmonic-value">${(harmonic.amplitude * 100).toFixed(0)}%</span>
    </div>
  `,
  bindings: [
    {
      selector: (index) => `.harmonic-amplitude[data-index="${index}"]`,
      parameter: (index) => `harmonics[${index}].amplitude`,
      events: ['input'],
      property: 'value'
    }
  ]
});
```

### Virtual DOM Integration
```javascript
// Use with virtual DOM implementations
domBinder.setVirtualDOMHandler({
  framework: 'lit-html', // or 'preact', 'vue', etc.
  renderFunction: render,
  container: document.getElementById('reactive-container'),
  bindAfterRender: true,
  stateToProps: (state) => ({
    frequency: state.frequency,
    amplitude: state.amplitude,
    isPlaying: state.isPlaying
  })
});
```

## Performance Considerations

- Efficient selector caching for fast element lookup
- Event delegation for dynamically created elements
- Batched DOM updates for rapid state changes
- Throttling/debouncing of high-frequency events (like mouse moves)
- Lazy initialization of complex bindings
- Intelligent rebinding only when DOM changes
- Optimized array rendering for large datasets

## Best Practices

- Use declarative data attributes for simple cases
- Use programmatic binding API for complex cases
- Keep bindings as specific as possible (avoid binding to body)
- Use binding groups for related elements
- Apply proper transformations for type conversion
- Create custom transformers for common conversions
- Validate user input before updating application state
- Handle binding errors gracefully
- Use one-way binding for display-only elements
- Clean up bindings when elements are removed from the DOM 