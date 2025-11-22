/**
 * EventGearBridges.js
 *
 * Communication bridges for EventGear framework.
 * Provides WebSocket and Node.js event communication.
 */

import { executeCallback, NODE_IS_INSTALLED } from './EventGearUtils.js';

/**
 * WebSocketBridge - Dual-channel WebSocket communication.
 */
export class WebSocketBridge {
    #incomingSocket;
    #outgoingSocket;
    #incomingWsIsActive;
    #outgoingWsIsActive;
    #autoReceive;
    #autoSend;
    #autoPassThrough;
    #channelIn;
    #channelOut;
    #callback;
    #incomingToken;
    #outgoingToken;
    #maxReconnectAttempts;
    #reconnectInterval;
    #currentReconnectAttempts;
    #outgoingQueue;
    #maxQueueSize;
    #eventListeners;

    constructor(options = {}) {
        this.#incomingSocket = null;
        this.#outgoingSocket = null;
        this.#incomingWsIsActive = false;
        this.#outgoingWsIsActive = false;
        this.#autoReceive = options.autoReceive ?? false;
        this.#autoSend = options.autoSend ?? false;
        this.#autoPassThrough = options.autoPassThrough ?? false;
        this.#channelIn = options.channelIn || '';
        this.#channelOut = options.channelOut || '';
        this.#callback = () => {};
        this.#incomingToken = options.incomingToken || null;
        this.#outgoingToken = options.outgoingToken || null;
        this.#maxReconnectAttempts = options.maxReconnectAttempts || 5;
        this.#reconnectInterval = options.reconnectInterval || 5000;
        this.#currentReconnectAttempts = 0;
        this.#outgoingQueue = [];
        this.#maxQueueSize = options.maxQueueSize || 100;
        this.#eventListeners = new Map();

        if (options.url) {
            this.setIncomingWebSocket(options.url, this.#incomingToken);
            this.setOutgoingWebSocket(options.outgoingUrl || options.url, this.#outgoingToken);
        }
    }

    setIncomingWebSocket(url, token = null) {
        if (!url) {
            this.#handleError(new Error('Incoming WebSocket URL is required'), 'incoming');
            return;
        }
        this.#incomingToken = token;
        const fullUrl = this.#appendTokenToUrl(url, token);
        this.#incomingSocket = new WebSocket(fullUrl);
        this.#incomingSocket.onopen = () => {
            this.#incomingWsIsActive = true;
            this.#currentReconnectAttempts = 0;
            this.#autoReceiveRefresh();
            this.emit('connected', 'incoming');
        };
        this.#incomingSocket.onclose = () => {
            this.#incomingWsIsActive = false;
            this.#reconnect('incoming');
            this.emit('disconnected', 'incoming');
        };
        this.#incomingSocket.onerror = (error) => this.#handleError(error, 'incoming');
    }

    setOutgoingWebSocket(url, token = null) {
        if (!url) {
            this.#handleError(new Error('Outgoing WebSocket URL is required'), 'outgoing');
            return;
        }
        this.#outgoingToken = token;
        const fullUrl = this.#appendTokenToUrl(url, token);
        this.#outgoingSocket = new WebSocket(fullUrl);
        this.#outgoingSocket.onopen = () => {
            this.#outgoingWsIsActive = true;
            this.#currentReconnectAttempts = 0;
            this.#sendQueuedMessages();
            this.emit('connected', 'outgoing');
        };
        this.#outgoingSocket.onclose = () => {
            this.#outgoingWsIsActive = false;
            this.#reconnect('outgoing');
            this.emit('disconnected', 'outgoing');
        };
        this.#outgoingSocket.onerror = (error) => this.#handleError(error, 'outgoing');
    }

    #appendTokenToUrl(url, token) {
        if (!token) return url;
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}token=${encodeURIComponent(token)}`;
    }

    #handleError(error, context) {
        console.error(`WebSocket error in ${context}:`, error);
        this.emit('error', { error, context });
    }

    #reconnect(socketType) {
        if (this.#currentReconnectAttempts < this.#maxReconnectAttempts) {
            this.#currentReconnectAttempts++;
            setTimeout(() => {
                if (socketType === 'incoming') {
                    this.setIncomingWebSocket(this.#incomingSocket.url, this.#incomingToken);
                } else {
                    this.setOutgoingWebSocket(this.#outgoingSocket.url, this.#outgoingToken);
                }
            }, this.#reconnectInterval);
        } else {
            this.#handleError(new Error(`Max reconnect attempts reached for ${socketType}`), socketType);
        }
    }

    #sendQueuedMessages() {
        while (this.#outgoingQueue.length > 0 && this.#outgoingSocket.readyState === WebSocket.OPEN) {
            const message = this.#outgoingQueue.shift();
            this.#outgoingSocket.send(JSON.stringify(message));
        }
    }

    #autoReceiveRefresh() {
        if (this.#incomingWsIsActive && this.#incomingSocket) {
            this.#incomingSocket.onmessage = null;
            if ((this.#autoReceive || this.#autoPassThrough) && this.#channelIn) {
                this.#incomingSocket.onmessage = (event) => {
                    const eventData = JSON.parse(event.data);
                    if (eventData.channel === this.#channelIn) {
                        if (this.#autoReceive && this.#callback) {
                            try {
                                const result = this.#callback(eventData.data);
                                if (result instanceof Promise) {
                                    result.catch(error => this.#handleError(error, 'callback'));
                                }
                            } catch (error) {
                                this.#handleError(error, 'callback');
                            }
                        }
                        if (this.#autoPassThrough && this.#channelOut) {
                            this.sendEvent(eventData.data);
                        }
                    }
                };
            }
        }
    }

    reset() {
        this.#channelIn = '';
        this.#channelOut = '';
        this.#autoSend = false;
        this.#autoReceive = false;
        this.#autoPassThrough = false;
        this.#outgoingQueue = [];
        if (this.#incomingSocket) this.#incomingSocket.onmessage = null;
    }

    setReceiveChannel(channelName) {
        if (typeof channelName !== 'string' || !channelName.trim()) {
            throw new Error('Invalid channel name');
        }
        this.#channelIn = channelName;
        this.#autoReceiveRefresh();
    }

    setAutoReceive(isActive) {
        this.#autoReceive = Boolean(isActive);
        this.#autoReceiveRefresh();
    }

    setCallback(callback) {
        if (!callback) {
            this.#callback = () => {};
            return;
        }
        if (typeof callback === 'function') {
            this.#callback = callback;
        } else {
            throw new TypeError('Callback must be a function');
        }
    }

    clearCallback() {
        this.#callback = () => {};
    }

    setAutoPassThrough(isActive) {
        this.#autoPassThrough = Boolean(isActive);
        this.#autoReceiveRefresh();
    }

    setSendChannel(channelName) {
        if (typeof channelName !== 'string' || !channelName.trim()) {
            throw new Error('Invalid channel name');
        }
        this.#channelOut = channelName;
    }

    setAutoSend(isActive) {
        this.#autoSend = Boolean(isActive);
    }

    sendEvent(metadata) {
        if (this.#channelOut) {
            this.send(this.#channelOut, { metadata });
        } else {
            this.#handleError(new Error('Outgoing channel not set'), 'outgoing');
        }
    }

    send(channel, data) {
        const message = { channel, data };
        if (this.#outgoingToken) message.token = this.#outgoingToken;

        if (this.#outgoingWsIsActive && this.#outgoingSocket.readyState === WebSocket.OPEN) {
            this.#sendQueuedMessages();
            this.#outgoingSocket.send(JSON.stringify(message));
        } else {
            if (this.#outgoingQueue.length < this.#maxQueueSize) {
                this.#outgoingQueue.push(message);
            } else {
                this.#handleError(new Error('Outgoing message queue is full'), 'outgoing');
            }
        }
    }

    setIncomingToken(token) {
        this.#incomingToken = token;
        if (this.#incomingSocket) this.setIncomingWebSocket(this.#incomingSocket.url, token);
    }

    setOutgoingToken(token) {
        this.#outgoingToken = token;
        if (this.#outgoingSocket) this.setOutgoingWebSocket(this.#outgoingSocket.url, token);
    }

    on(event, callback) {
        if (!this.#eventListeners.has(event)) this.#eventListeners.set(event, []);
        this.#eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.#eventListeners.has(event)) {
            const callbacks = this.#eventListeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index !== -1) callbacks.splice(index, 1);
        }
    }

    emit(event, data) {
        if (this.#eventListeners.has(event)) {
            this.#eventListeners.get(event).forEach(callback => {
                try { callback(data); } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    get isIncomingWebSocketActive() { return this.#incomingWsIsActive; }
    get isOutgoingWebSocketActive() { return this.#outgoingWsIsActive; }
    get autoReceive() { return this.#autoReceive; }
    get autoSend() { return this.#autoSend; }
    get autoPassThrough() { return this.#autoPassThrough; }
    get channelIn() { return this.#channelIn; }
    get channelOut() { return this.#channelOut; }
    get hasIncomingToken() { return !!this.#incomingToken; }
    get hasOutgoingToken() { return !!this.#outgoingToken; }
    get queueSize() { return this.#outgoingQueue.length; }
    get maxQueueSize() { return this.#maxQueueSize; }
}

/**
 * NodeBridge - Node.js EventEmitter communication.
 */
export class NodeBridge {
    #nodeIsActive;
    #autoReceive;
    #autoSend;
    #autoPassThrough;
    #channelIn;
    #channelOut;
    #eventEmitter;
    #emitter;
    #callback;

    constructor(options = {}) {
        this.#nodeIsActive = NODE_IS_INSTALLED;
        if (!this.#nodeIsActive) return;

        this.#autoReceive = options.autoReceive ?? false;
        this.#autoSend = options.autoSend ?? false;
        this.#autoPassThrough = options.autoPassThrough ?? false;
        this.#channelIn = options.channelIn || '';
        this.#channelOut = options.channelOut || '';
        this.#eventEmitter = null;
        this.#emitter = null;
        this.#callback = () => {};
        this.#initialize();
    }

    async #initialize() {
        if (this.#nodeIsActive) {
            try {
                // Use dynamic import for ESM compatibility
                const events = await import('events');
                this.#eventEmitter = events.EventEmitter;
                this.#emitter = new this.#eventEmitter();
            } catch (error) {
                console.error('Error setting up Node.js environment:', error);
                this.#nodeIsActive = false;
            }
        }
    }

    #autoReceiveRefresh() {
        if (this.#nodeIsActive && this.#emitter) {
            this.#emitter.removeAllListeners();
            if ((this.#autoReceive || this.#autoPassThrough) && this.#channelIn) {
                if (typeof this.#channelIn !== 'string' || !this.#channelIn.trim()) return;
                this.#emitter.on(this.#channelIn, (eventData) => {
                    if (this.#autoReceive && this.#callback) {
                        try {
                            executeCallback(this.#callback, eventData);
                        } catch (error) {
                            console.error('Callback error:', error);
                        }
                    }
                    if (this.#autoPassThrough && this.#channelOut) {
                        this.sendEvent(eventData);
                    }
                });
            }
        }
    }

    reInit() {
        this.#nodeIsActive = NODE_IS_INSTALLED;
        if (!this.#nodeIsActive) return false;
        this.#initialize();
        return true;
    }

    reset() {
        this.#channelIn = '';
        this.#channelOut = '';
        this.#autoSend = false;
        this.#autoReceive = false;
        this.#autoPassThrough = false;
        if (this.#emitter) this.#emitter.removeAllListeners();
    }

    setReceiveChannel(channelName) {
        if (typeof channelName !== 'string' || !channelName.trim()) throw new Error('Invalid channel name');
        this.#channelIn = channelName;
        this.#autoReceiveRefresh();
    }

    setAutoReceive(isActive) {
        this.#autoReceive = Boolean(isActive);
        this.#autoReceiveRefresh();
    }

    setCallback(callback) {
        if (!callback) { this.#callback = () => {}; return; }
        if (typeof callback === 'function') this.#callback = callback;
        else throw new TypeError('Callback must be a function');
    }

    clearCallback() { this.#callback = () => {}; }

    setAutoPassThrough(isActive) {
        this.#autoPassThrough = Boolean(isActive);
        this.#autoReceiveRefresh();
    }

    setSendChannel(channelName) {
        if (typeof channelName !== 'string' || !channelName.trim()) throw new Error('Invalid channel name');
        this.#channelOut = channelName;
    }

    setAutoSend(isActive) { this.#autoSend = Boolean(isActive); }

    sendEvent(metadata) {
        if (this.#nodeIsActive && this.#channelOut) {
            try { this.emit(this.#channelOut, { metadata }); }
            catch (error) { console.error(`Error sending event:`, error); }
        }
    }

    emit(channel, data) {
        if (this.#nodeIsActive && this.#emitter) {
            try { this.#emitter.emit(channel, data); }
            catch (error) { console.error(`Error emitting to "${channel}":`, error); }
        }
    }

    getListenerCount(channel) {
        if (this.#emitter && typeof channel === 'string') {
            return this.#emitter.listenerCount(channel);
        }
        return 0;
    }

    get isNodeActive() { return !!this.#nodeIsActive; }
    get autoReceive() { return !!this.#autoReceive; }
    get autoSend() { return !!this.#autoSend; }
    get autoPassThrough() { return !!this.#autoPassThrough; }
    get channelIn() { return this.#channelIn; }
    get channelOut() { return this.#channelOut; }
}
