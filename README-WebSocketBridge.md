# WebSocketBridge.js

## Overview
WebSocketBridge provides bidirectional, real-time communication between the HarmonicXplorer application and remote systems. It seamlessly integrates with EventGear to bridge local events with remote services, enabling distributed processing, collaborative features, and remote control capabilities.

## Core Responsibilities

### WebSocket Communication
The module manages WebSocket connections to remote servers, handling connection establishment, reconnection logic, and message passing.

### Event Bridging
WebSocketBridge translates between EventGear events and WebSocket messages, allowing local events to be sent remotely and remote messages to be converted into local events.

### Connection Management
The module provides robust connection handling with automatic reconnection, authentication, and health monitoring.

## Key Features

### WebSocket Initialization
```javascript
// Initialize the WebSocket bridge
const wsConfig = {
  url: 'wss://example.com/harmonic-explorer',
  autoReconnect: true,
  reconnectInterval: 3000,
  maxReconnectAttempts: 10,
  protocols: ['harmonics-v1']
};

const bridge = new WebSocketBridge(eventGear, wsConfig);

// Connect to the server
bridge.connect();

// Handle connection events
bridge.onConnected(() => {
  console.log('Connected to remote server');
});

bridge.onDisconnected(() => {
  console.log('Disconnected from remote server');
});

bridge.onError((error) => {
  console.error('WebSocket error:', error);
});
```

### Event Bridging
```javascript
// Register events to be forwarded to server
bridge.addBridgeEvent('harmonicsUpdated', {
  direction: 'outgoing',
  transformFn: (eventData) => {
    // Optionally transform data before sending
    return {
      type: 'harmonics.update',
      data: eventData.harmonics,
      timestamp: Date.now()
    };
  }
});

// Register incoming event handlers
bridge.addBridgeEvent('remote.command', {
  direction: 'incoming',
  localEventName: 'remoteCommand', 
  transformFn: (messageData) => {
    // Transform incoming WebSocket message to local event format
    return {
      command: messageData.command,
      parameters: messageData.params,
      source: 'remote'
    };
  }
});
```

### Selective Event Forwarding
```javascript
// Forward only specific parameters
bridge.addBridgeEvent('parameterChanged', {
  direction: 'outgoing',
  filter: (eventData) => {
    // Only forward fundamental frequency and amplitude changes
    return ['frequency', 'amplitude'].includes(eventData.paramName);
  }
});

// Throttle high-frequency events
bridge.addBridgeEvent('visualizationFrame', {
  direction: 'outgoing',
  throttle: 100, // Send at most once every 100ms
  sampleMode: 'latest' // Alternative: 'average', 'first'
});
```

## Integration with EventGear

WebSocketBridge communicates with other components through EventGear:

### Emitted Events
- `websocket.connected`: When connection is established
- `websocket.disconnected`: When connection is lost
- `websocket.message`: When a message is received from server
- `websocket.error`: When an error occurs
- Custom events translated from incoming WebSocket messages

### Handled Events
- `websocket.send`: To send a message to the server
- Any events registered via `addBridgeEvent` with direction 'outgoing'

### Event Metadata
Events include detailed metadata about WebSocket operations:

```javascript
// Example websocket.message event
{
  type: 'websocket.message',
  originalType: 'remote.command',
  data: {
    command: 'setAmplitude',
    params: { value: 0.75 }
  },
  receivedAt: 1623452789123,
  latency: 42, // ms
  messageId: '8a7b6c5d',
  sequence: 143
}

// Example outgoing event with metadata
{
  type: 'parameterChanged',
  paramName: 'frequency',
  value: 440,
  previousValue: 432,
  source: 'ui',
  timestamp: 1623452789123,
  _metadata: {
    forwarded: true,
    messageId: '1a2b3c4d',
    sequence: 144
  }
}
```

## Protocol Handling

WebSocketBridge implements a flexible protocol system:

```javascript
// Define a custom protocol handler
bridge.registerProtocolHandler('harmonics-v1', {
  serialize: (eventData) => {
    // Convert event data to protocol-specific format
    return JSON.stringify({
      msgType: eventData.type,
      payload: eventData.data,
      seq: bridge.getNextSequence(),
      ts: Date.now()
    });
  },
  
  deserialize: (message) => {
    const data = JSON.parse(message);
    return {
      type: data.msgType,
      data: data.payload,
      sequence: data.seq,
      timestamp: data.ts
    };
  },
  
  heartbeat: {
    message: () => JSON.stringify({ msgType: 'ping', ts: Date.now() }),
    interval: 30000, // 30 seconds
    timeoutAction: 'reconnect'
  }
});
```

## Authentication and Security

```javascript
// Configure authentication
bridge.setAuthConfig({
  method: 'token',
  token: 'user-auth-token',
  renewToken: async () => {
    // Fetch new token from authentication server
    const response = await fetch('/api/renew-token', {
      credentials: 'include'
    });
    const data = await response.json();
    return data.token;
  },
  tokenExpiry: 3600000, // 1 hour
  onAuthFailed: (error) => {
    console.error('Authentication failed:', error);
    // Redirect to login or show auth error
  }
});

// Enable encryption for sensitive data
bridge.enableEncryption({
  method: 'AES-GCM',
  keyExchange: 'serverProvided',
  sensitiveEvents: ['user.preferences', 'auth.credentials']
});
```

## Example Usage in HarmonicXplorer

```javascript
// In main.js
const eventGear = new EventGear();
const appState = new AppState(eventGear);

// Initialize WebSocket bridge
const bridge = new WebSocketBridge(eventGear, {
  url: 'wss://harmonic-explorer.example.com/ws',
  autoReconnect: true
});

// Connect to server
bridge.connect();

// Bridge local events to remote server
bridge.addBridgeEvent('harmonicsUpdated', { direction: 'outgoing' });
bridge.addBridgeEvent('parameterChanged', { direction: 'outgoing' });

// Handle remote commands
bridge.addBridgeEvent('remote.preset', {
  direction: 'incoming',
  localEventName: 'loadPreset'
});

// Listen for connection status
eventGear.on('websocket.connected', () => {
  appState.updateParam('connectionStatus', 'connected');
  document.querySelector('#connection-indicator').classList.add('connected');
});

eventGear.on('websocket.disconnected', () => {
  appState.updateParam('connectionStatus', 'disconnected');
  document.querySelector('#connection-indicator').classList.remove('connected');
});

// Send a message manually
eventGear.emit('websocket.send', {
  type: 'client.hello',
  clientInfo: {
    version: APP_VERSION,
    platform: navigator.platform,
    capabilities: ['audio', 'webgl']
  }
});
```

## Collaborative Features

WebSocketBridge enables real-time collaboration:

```javascript
// Setup collaboration
bridge.setupCollaboration({
  room: 'harmonic-session-123',
  userId: 'user-456',
  userName: 'Alice',
  
  // Join collaboration room
  joinRoom: (roomId) => {
    bridge.sendMessage({
      type: 'collab.join',
      roomId: roomId
    });
  },
  
  // Track participants
  onParticipantJoined: (participant) => {
    console.log(`${participant.name} joined the session`);
    appState.updateParam('participants', [
      ...appState.getParam('participants'),
      participant
    ]);
  },
  
  // Handle shared control
  onRemoteControl: (control) => {
    if (control.type === 'takeControl') {
      appState.updateParam('activeController', control.userId);
    }
  }
});

// Share current state with new participants
eventGear.on('collab.participantJoined', (participant) => {
  bridge.sendMessage({
    type: 'collab.currentState',
    targetUserId: participant.id,
    state: appState.getAllParams()
  });
});
```

## Performance Considerations

- Binary message protocols for large data (using ArrayBuffers)
- Message batching for high-frequency events
- Throttling and debouncing of rapidly changing values
- Selective event forwarding to reduce bandwidth
- Heartbeat mechanism to detect connection health
- Automatic reconnection with exponential backoff

## Best Practices

- Handle connection failures gracefully with offline fallback
- Implement proper auth token renewal
- Use message compression for large payloads
- Add sequence numbers to detect message loss
- Implement bi-directional heartbeats
- Log connection metrics for troubleshooting
- Use secure WebSocket (wss://) in production
- Implement rate limiting for outgoing messages
- Filter sensitive data from logs and debugging
- Validate all incoming messages before processing 