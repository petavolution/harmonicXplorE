/**
 * EventGear.js
 * 
 * EventGear: A Revolutionary Paradigm for Event-Driven Architecture and Intelligent Systems
 * 
 * EventGear transcends traditional event handlers and counters, representing a 
 * sophisticated programming paradigm based on Event-Driven Architecture (EDA). 
 * This advanced system provides real-time event tracking, analysis, and performance
 * monitoring capabilities, supporting metadata tracking and historical data analysis
 * without introducing performance bottlenecks.
 * 
 * Key Features and Paradigm Shifts:
 * 1. CallbackTracker Class: Integrated into EventGear as a modular component that allows developers to manage conditions through checks
 *    while executing associated actions via callbacks. It provides comprehensive performance metrics tracking capabilities,
 *    enabling developers to monitor execution times effectively. The CallbackTracker can also be used as a standalone class,
 *    giving developers the flexibility to implement it in various scenarios outside of the EventGear framework.
 * 2. Automatic Metrics Collection: Collect usage and performance metrics with 
 *    granular statistics and history in real-time for each event.
 * 3. Sophisticated State Control: Manage event handling and logic processing with 
 *    start, stop, and various reset options, maintaining metrics integrity.
 * 4. Flexible Event Callbacks: Link complex programming logic to various event 
 *    callbacks, enabling sophisticated event-driven systems.
 * 5. Advanced Metadata Handling: Transport and process variant metadata within events, 
 *    supporting simple to complex data structures with automatic change detection 
 *    and callbacks for in-depth data flow logic.
 * 6. Seamless DOM Event Integration: Directly set up DOM event listeners within the class,
 *    allowing for automatic registration of events without additional variable management.
 * 7. **Dual Channel Node.js Bridge Integration**: A flexible integration with Node.js for 
 *    receiving and sending events, supporting auto-processing of events to enhance real-time interactivity. 
 *    This includes a dedicated Single Responsibility Principle (SRP) class for 
 *    Node.js event emitter management that is usable independently.
 * 8. Code Slicing and Modular Architecture: Slice code into event-based snippets 
 *    for full control over processes and data flow, reducing global variables and 
 *    cluttered state checks.
 * 9. Customizable Configuration and Performance Optimization: Tailor each EventGear instance 
 *    with configurable buffer sizes, metrics, and parameters. Fine-tune performance by 
 *    adjusting timeframe length, history buffer size, and other numerical parameters. 
 *    Selectively enable or disable features by setting parameters to 0, allowing for 
 *    precise control over resource usage and performance.
 * 10. Adaptive Thresholds and Self-Optimization: Implement complex, self-adjusting 
 *     callbacks based on performance metrics and thresholds for dynamic behavior.
 * 11. Event-Based and Time-Based Logic: Utilize both event-driven and interval-based 
 *     operations for versatile application design.
 * 12. Sub-Millisecond Precision: Utilize micro metrics for precision in the sub-millisecond 
 *     range, with optional microsecond estimation for high-frequency events.
 * 13. Modular WebSocketBridge: A standalone class providing dual-channel WebSocket 
 *     communication, supporting independent incoming and outgoing connections with 
 *     optional authentication, auto-receive, auto-send, and passthrough capabilities.
 *
 * Advanced Capabilities:
 * - High-performance event processing (tested with 340CPS simulated Mouseclicks and 4.7M events / minute at 70kHz frequency).
 * - Real-time metrics calculation and frequency analysis.
 * - Comprehensive historical data tracking including exceedances logging via CallbackTracker.
 * - Dual interval system: timeframe-synced and developer-configurable.
 * - Full self-sustainability with getters for all internal states and metrics.
 * - Dynamic reconfiguration through setters without operation interruption.
 * - Metacognitive capabilities for self-analysis of event flows.
 * - Memory-efficient rolling buffer for timestamp storage, optimized for high-frequency events.
 * - Flexible jitter calculation supporting both simple timestamp arrays and timestamp-count pairs.
 * - Pseudo-jitter metrics for sub-millisecond performance insights with minimal overhead.
 *
 * Timeframe Analysis:
 * When activated, EventGear analyzes events based on individual timeframes,
 * logging metrics such as event count, average frequency, maximum frequency,
 * jitter, and other relevant statistics in a compressed timeframe-based history.
 *
 * User-Centric Design:
 * - Full client-side processing ensures no external dependencies or server usage,
 *   enhancing user privacy and compliance with data aggregation laws.
 *
 * Performance Flexibility:
 * - All features are designed with customizable performance in mind.
 * - Timeframe length for special analysis can be adjusted to balance between granularity and resource usage.
 * - History buffer sizes are configurable and can be deactivated to minimize memory footprint.
 * - Performance metrics of execution time duration can be enabled or disabled independently.
 * - All numerical parameters can be fine-tuned or set to 0 to disable specific functionalities, allowing for optimal performance tailoring.
 *
 * Architectural Foundation:
 * Built on OOP principles, EventGear adheres to the Single Responsibility Principle (SRP) 
 * with dedicated data classes like CallbackTracker that can be used independently or together within the framework. This design facilitates the creation 
 * of autonomous, interconnected components that mimic neural network structures, enabling intelligent automation and adaptive systems.
 *
 * Mechanical System Analogy:
 * EventGear conceptualizes events as interconnected gears, each capable of triggering 
 * and interacting with others through sophisticated threshold and callback mechanics. 
 * This approach allows for the creation of complex, adaptive event processing systems 
 * akin to flexible neural networks.
 *
 * Ideal Applications:
 * - High-frequency trading and real-time data processing
 * - Gaming engines and interactive applications
 * - IoT, sensor data analysis, network monitoring
 *
 * Key Benefits:
 * - Swiss clock precision with Swiss Army knife versatility
 * - Pure client-side data processing for informed decisions in real-time
 * - Democratic design empowering developers with simplified code structures
 */

 /**
 * @class EventGear
 * @version 0.5.8
 * @author Felix Mönnich, AlienVoices.de
 * @license GPL
 *
 * Empowerment of Developers:
 * By integrating EventGear into every application event, programmers gain full control over metrics,
 * analysis, and flow state management. The use of standardized event metadata eliminates the need for special variable declarations,
 * allowing developers to create specialized objects for their event types seamlessly. This structure supports higher-level programming logic,
 * enabling callback methods to be managed through state control without external checks. The counting of events alongside callback methods 
 * based on intervals allows for loop-like logic structures that are fully driven by events or time,
 * minimizing unnecessary iterations or boilerplate code. All functionalities are maintained through independent callback functions,
 * which can dynamically adjust based on real-time metrics.
 *
 * Usage Spectrum:
 * EventGear scales from basic event counting in simple projects to powering complex, 
 * intelligent event-driven architectures. Its intuitive design allows developers to 
 * start with basic functionalities and progressively explore advanced features,
 * facilitating the creation of sophisticated, self-aware software systems.
 *
 * The name "EventGear" reflects its multifaceted nature—combining the precision 
 * of a Swiss clock with the versatility of a Swiss Army knife in event-driven programming.


/* 
 * Usage example for EventGear.js 
 */

/*
// 0. Loading the EventGear Class as a Module
// In your main script (e.g., main.js), you can import the EventGear class like this:
import EventGear from './EventGear.js'; // Adjust the path as necessary

// 1. Instance Creation
// Create an instance of EventGear with a specified timeframe and maximum history size.
const eventGear = new EventGear(10, 100); // Analyzes 10 second timeframes and stores 100 historical entries

// 2. Starting the Counter
eventGear.start(); // Starts counting events, processing them and executing the callbacks

// 3. Setting Up Callbacks
// Set a callback for when an event is registered.
eventGear.setCallbackEvent(() => {
    console.log("Event registered!");
});

// Set a callback for when metadata changes.
eventGear.setCallbackMetadataChange(() => {
    console.log("Metadata changed from:", eventGear.getMetadataPrevious(), "to:", eventGear.getMetadata());
});

// Optionally, reset the callbacks if needed.
eventGear.resetCallbackEvent(); // Clears the current event callback
eventGear.resetCallbackMetadataChange(); // Clears the current metadata change callback

// 4. Registering Events
// Set up element event listener for the Button click that automatically registers events
const button = document.getElementById('myButton');
eventGear.linkEventListener(button, 'click');

// Clear specific element and eventType listeners
eventGear.clearEventListener(button, 'click');

// Reset and clear all elements event listeners
eventGear.resetEventListeners();

// Register an event manually.
eventGear.registerEvent();

// Register an event including optional metadata.
eventGear.registerEvent({ user: 'Alice', action: 'click' }); 

// Register multiple events in a single call without metadata.
eventGear.registerMultipleEvents(5); // Registers 5 events in quick succession.

// Register multiple events with metadata and iteration count.
eventGear.registerMultipleEvents(5, { user: 'Alice', action: 'click' }, true); // Registers 5 events with metadata and updates for each event.

// You can also register multiple events in quick succession using a loop:
for (let i = 0; i < 5; i++) {
    eventGear.registerEvent({ user: 'Alice', action: `click ${i + 1}` }); // Registers five events with different metadata.
}

// 5. Accessing Metrics
// Retrieve various metrics about the event counting process.
console.log("Total Events Counted:", eventGear.getEventCountTotal()); // Get total events counted
console.log("Total Running Time (s):", eventGear.getTotalRunningTime()); // Get total running time in seconds
console.log("Max Frequency (Hz):", eventGear.getMaxFrequency()); // Get maximum frequency observed (Hz)
console.log("Current Frequency (events/min):", eventGear.getCurrentFrequencyPerMinute()); // Get current frequency in events per minute

// Access short-term metrics
console.log("Short-Term Frequency (Hz):", eventGear.getShortTermFrequency()); // Get current short-term frequency
console.log("Short-Term Jitter:", eventGear.getShortTermJitter()); // Get current short-term jitter

// Accessing Metadata
console.log("Latest Event Metadata:", eventGear.getMetadata()); // Get latest metadata
console.log("Previous Event Metadata:", eventGear.getMetadataPrevious()); // Get previous metadata

// 6. Setting Alarms
// Configure alarms for various thresholds to monitor performance.
eventGear.setCallbackTotalTime(60, (totalTime) => {
    console.log(`Total running time exceeded: ${totalTime} seconds`);
});

eventGear.setCallbackFrequency(5, 15, (frequency) => {
    console.log(`Frequency alarm triggered: ${frequency} Hz`);
});

// Set alarms for max events per frame
eventGear.setCallbackMaxEventsPerFrame(2, 10, (events) => {
    console.log(`Max events per frame exceeded: ${events}`);
});

// 7. Stopping and Resuming the Counter
// Stop the event counter when needed.
eventGear.stop(); // Stops counting but retains the last state

// Resume counting from the last state.
eventGear.start(); // Resumes counting

// 8. Resetting the Counter
// Reset all counters and alarms if needed.
eventGear.resetEventGear(); // Resets all internal states and callbacks without affecting active state

// 9. Accessing Historical Data
// Retrieve historical data for analysis.
const history = eventGear.getTimeframeHistory(); // Get historical data of completed timeframes
console.log("Timeframe History:", history);

const exceedances = eventGear.getExceedancesHistory(); // Get historical exceedance data
console.log("Exceedances History:", exceedances);

// 10. Advanced Usage: Chaining Methods and Interval-Based Alarms
// Demonstrating method chaining for configuration settings:
eventGear.setMaxHistorySize(200)
    .setFrameDuration(15)
    .setIndependentIntervalLength(1000)
    .setEventPerformanceMetricsActive(true);

// Set interval-based alarms to monitor performance over specific intervals.
eventGear.setCallbackIntervalTime(30000, (totalTime) => { 
    console.log(`Interval-based time alarm triggered: ${totalTime / 1000} seconds`);
});

eventGear.setCallbackIntervalCount(50, (totalCount) => { 
    console.log(`Interval-based count alarm triggered: ${totalCount} events`);
});

// Example of continuous monitoring:
setInterval(() => {
    eventGear.registerEvent({ user: 'Alice', action: 'heartbeat' }); // Simulate continuous event registration with metadata
}, 200); // Register an event every 200 milliseconds


// *** Node.js Bridge Usage Example for EventGear.js 
// Set the incoming channel to listen for events from Node.js.
eventGear.nodeSetIncomingChannel('incomingChannel');

// Set the outgoing channel for sending events to Node.js.
eventGear.nodeSetOutgoingChannel('outgoingChannel');

// Enable auto-receiving of events.
eventGear.nodeSetAutoReceive(true);

// Enable auto-sending of events.
eventGear.nodeSetAutoSend(true);

// You can also send events manually without relying on auto-send:
eventGear.nodeSendEvent({ user: 'Bob', action: 'submit' }); // Manually sends an event with metadata.

// Reset all configurations related to incoming and outgoing channels.
eventGear.nodeReset(); // Resets all internal states and callbacks without affecting active state

// *** WebSocket Bridge Usage Example for EventGear.js 
// Set up WebSocket connection URLs for incoming and outgoing data.
eventGear.websocketSetIncomingUrl('ws://localhost:8080/events');
eventGear.websocketSetOutgoingUrl('ws://localhost:8080/publish');

// Set incoming and outgoing channels for WebSocket communication.
eventGear.websocketSetIncomingChannel('incomingWebSocketChannel');
eventGear.websocketSetOutgoingChannel('outgoingWebSocketChannel');

// Enable auto-receiving of WebSocket messages.
eventGear.websocketSetAutoReceive(true);

// Enable auto-sending of WebSocket messages.
eventGear.websocketSetAutoSend(true);

// Send an initial message through WebSocket manually.
eventGear.websocketSendEvent({ user: 'Charlie', action: 'connect' });

// Reset all configurations related to WebSocket channels.
eventGear.websocketReset(); // Resets all internal states and callbacks without affecting active state
*/

/**
 * ***** EventGear ***** Global Functions Usage Examples *****
 *
 * These functions provide utilities for calculating event frequency, intervals, jitter,
 * and executing callbacks in a consistent manner.
 *
 *  Usage Examples
 *
 *  1. Calculating Frequency of Events
 * 
 * // Calculate the frequency of events
 * const totalEvents = 100;
 * const elapsedTime = 10; // seconds
 * const frequency = calculateFrequency(totalEvents, elapsedTime);
 * console.log(`Frequency: ${frequency} events per second`); // Output: Frequency: 10 events per second
 * 
 *
 *  2. Calculating Average Interval Between Events
 * 
 * // Calculate the average interval between events
 * const totalEvents = 50;
 * const totalTime = 5; // seconds
 * const averageInterval = calculateInterval(totalEvents, totalTime);
 * console.log(`Average Interval: ${averageInterval} seconds per event`); // Output: Average Interval: 0.1 seconds per event
 * 
 *
 *  3. Calculating Jitter from Event Timestamps
 * 
 * // Calculate jitter from an array of timestamps
 * const timestamps = [1000, 2000, 3000, 5000, 8000]; // milliseconds
 * const jitterValue = calculateJitter(timestamps);
 * console.log(`Calculated Jitter: ${jitterValue}`); // Output: Calculated Jitter: <some value>
 *
 * // Example with timestamp-count pairs
 * const timestampCountPairs = [
 *     { timestamp: 1000, count: 1 },
 *     { timestamp: 2000, count: 2 },
 *     { timestamp: 3000, count: 1 }
 * ];
 * const jitterFromPairs = calculateJitter(timestampCountPairs);
 * console.log(`Calculated Jitter from pairs: ${jitterFromPairs}`); // Output: Calculated Jitter from pairs: <some value>
 * 
 *
 *  4. Executing a Callback Function
 * 
 * // Define a simple callback function
 * function sayHello(name) {
 *     return `Hello, ${name}!`;
 * }
 *
 * // Execute the callback and log the result
 * const result = executeCallback(sayHello, 'Alice');
 * console.log(result); // Output: Hello, Alice!
 *
 * // Example with an asynchronous callback function
 * async function fetchData() {
 *     return new Promise((resolve) => {
 *         setTimeout(() => resolve('Data fetched!'), 1000);
 *     });
 * }
 *
 * executeCallback(fetchData).then(data => {
 *     console.log(data); // Output after 1 second: Data fetched!
 * }).catch(error => {
 *     console.error('Error:', error);
 * });
 *
 * // Example of error handling in callback execution
 * try {
 *     executeCallback(null); // This will throw an error
 * } catch (error) {
 *     console.error(error.message); // Output: Callback must be a function
 * }
*/

/**
 * ***** EventGear ***** CallbackTracker Class Usage Examples *****
 *
 * CallbackTracker class for managing and executing callbacks based on custom check conditions.
 *
 * This class allows developers to register callbacks that can be executed based on specific conditions,
 * manage their activation states, and track performance metrics. Callbacks can be synchronous or asynchronous,
 * and their execution can be dynamically controlled.
 *
 *  Usage Examples
 *
 *  1. Basic Callback Registration and Execution
 * 
 * const tracker = new CallbackTracker();
 *
 * // Register a simple callback
 * tracker.registerCallback('greetUser', () => {
 *     console.log('Hello, User!');
 * });
 *
 * // Set an interval to check callbacks every 2 seconds
 * tracker.IntervalDuration = 2000;
 * 
 *
 *  2. Conditional Execution with Check Function
 * 
 * let userLoggedIn = false;
 *
 * const tracker = new CallbackTracker();
 *
 * // Register a callback with a check function
 * tracker.registerCallback('welcomeMessage', () => {
 *     console.log('Welcome back!');
 * }, null, 5, null, true, true);
 *
 * // Check function to determine if the user is logged in
 * tracker.registerCallback('checkUserStatus', () => {
 *     return userLoggedIn; // Only execute if the user is logged in
 * });
 *
 * // Set an interval to check callbacks every second
 * tracker.IntervalDuration = 1000;
 *
 * // Simulate user logging in after 5 seconds
 * setTimeout(() => {
 *     userLoggedIn = true;
 * }, 5000);
 * 
 *
 *  3. One-Time Callback Execution
 * 
 * const tracker = new CallbackTracker();
 *
 * // Register a one-time callback
 * tracker.registerCallback('oneTimeAlert', () => {
 *     console.log('This alert will only show once!');
 *
 *     // Deactivate its own check after execution
 *     tracker.setCheckActiveById('oneTimeAlert', false);
 * });
 *
 * // Start checking callbacks every second
 * tracker.IntervalDuration = 1000;
 * 
 *
 *  4. Managing Activation States
 * 
 * const tracker = new CallbackTracker();
 *
 * // Register a callback that logs a message
 * tracker.registerCallback('logMessage', () => {
 *     console.log('Logging message...');
 * });
 *
 * // Start checking callbacks every second
 * tracker.IntervalDuration = 1000;
 *
 * // Disable the callback after 5 seconds
 * setTimeout(() => {
 *     tracker.setCheckActiveById('logMessage', false);
 *     console.log('logMessage callback deactivated.');
 * }, 5000);
 *
 * // Re-enable the callback after another 5 seconds
 * setTimeout(() => {
 *     tracker.setCheckActiveById('logMessage', true);
 *     console.log('logMessage callback reactivated.');
 * }, 10000);
 * 
 *
 *  5. Performance Metrics Tracking
 * 
 * const tracker = new CallbackTracker(true); // Enable performance metrics
 *
 * // Register a performance-intensive callback
 * tracker.registerCallback('heavyComputation', () => {
 *     let sum = 0;
 *     for (let i = 0; i < 1e6; i++) {
 *         sum += i;
 *     }
 *     console.log(`Sum: ${sum}`);
 * });
 *
 * // Start checking callbacks every second
 * tracker.IntervalDuration = 1000;
 *
 * // Execute the heavy computation every second until deactivated
 * setTimeout(() => {
 *     tracker.setCheckActiveById('heavyComputation', false);
 * }, 5000);
 *
 * // After some time, retrieve performance metrics
 * setTimeout(() => {
 *     console.log(tracker.getCallbackMetrics());
 * }, 7000);
 * 
 */

/*
***** EventGear *****  Gobal Functions Overview *****

Calculation Functions:
    calculateFrequency(count, seconds)		Calculates the frequency of events (events per second).
    calculateInterval(count, seconds)		Calculates the average interval between events (seconds per event).
    calculateJitter(timestamps)			Computes jitter based on event timestamps or timestamp-count pairs.

Callback Execution Functions:
    executeCallback(fn, ...args)		Executes a callback function, handling both sync and async functions.
    executeAsyncCallback(fn, ...args)		Executes an asynchronous callback function and returns a Promise.
*/

/*
***** EventGear *****  Assertion Class Overview *****

Can be configured to return boolean or raise error on failed test

Boolean Assertions:
    true(condition)				Checks if a condition is true.
    false(condition)				Checks if a condition is false.

Equality Assertions:
    equal(actual, expected)			Checks if two values are strictly equal.
    notEqual(actual, expected)			Checks if two values are not strictly equal.
    approxEqual(actual, expected, tolerance)	Checks if values are approximately equal within a tolerance.
    notApproxEqual(actual, expected, tolerance)	Checks if values are not approximately equal.

Numeric Comparisons:
    bigger(actual, expected)			Checks if actual is greater than expected.
    smaller(actual, expected)			Checks if actual is less than expected.
    biggerOrEqual(actual, expected)		Checks if actual is greater than or equal to expected.
    smallerOrEqual(actual, expected)		Checks if actual is less than or equal to expected.
    notBigger(actual, expected)			Checks if actual is not greater than expected.
    notSmaller(actual, expected)		Checks if actual is not less than expected.

Range Assertions:
    between(actual, lowerBound, upperBound)	Checks if actual is between bounds (exclusive).
    notBetween(actual, lowerBound, upperBound)	Checks if actual is not between bounds (inclusive).

Null / Undefined / Type Checks:
    isNullOrUndefined(value)			Checks if a value is null or undefined.
    isFunction(value)				Checks if the value is a Function.
    isObject(value)				Checks if the value is a non-null object.

Array Assertions:
    arrayEqual(arr1, arr2)			Checks if two arrays are equal.
    arrayContains(arr, element)			Checks if an array contains an element.
    arrayNotContains(arr, element)		Checks if an array does not contain an element.

Object Assertions:
    objectEqual(obj1, obj2)			Checks if two objects are equal.
    objectHasProperty(obj, prop)		Checks if an object has a specific property.

String Assertions:
    stringContains(str, substr)			Checks if a string contains a substring.
    stringNotContains(str, substr)		Checks if a string does not contain a substring.

Date Assertions:
    dateAfter(date1, date2)			Checks if date1 is after date2.
    dateNotAfter(date1, date2)			Checks if date1 is not after date2.
*/

/*
***** EventGear ***** CallbackTracker Class Overview *****

Constructor:
    constructor(performanceMetricsActivated = true, intervalDuration = 0) 
        Initializes a new CallbackTracker instance with optional performance metrics
        and interval duration settings.

Interval Management:
    set IntervalDuration(value)				Sets the duration for automatic callback checking.
    get IntervalDuration()				Retrieves the current interval duration.

Callback Registration:
    registerCallback(id, checkFunction, callback = null, priority = 5, type = null, checkActive = true, callbackActive = true, checkMethod = 'default', 
        threshold = 0, interval = 0) 			Registers a new callback or updates an existing one.
                     			                     				
Callback Management:
    removeCallback(id)					Removes a callback by its ID.
    setCallbackProperties(id, updates)			Updates specific properties of a registered callback.
    setCheckActive(value, id = this.#callbackId)	Sets whether the check function is active for a specific callback by ID.
    setCallbackActive(value, id = this.#callbackId)	Sets whether the callback function is active for a specific callback by ID.
    setCheckFunction(func, id = this.#callbackId)	Sets the check function for a specific callback by ID.
    setCallback(func, id = this.#callbackId)		Sets the main callback function for a specific callback by ID.
    setPriority(value, id = this.#callbackId)		Sets the priority for a specific callback by ID.
    setType(value, id = this.#callbackId)		Sets the type for a specific callback by ID.
    setCheckMethod(method, id = this.#callbackId)	Sets the check method for a specific callback by ID.
    setCheckTrueFlag(value, id = this.#callbackId)	Sets whether the check function has previously returned true for a specific callback by ID.
    setThresholdInterval(value, id = this.#callbackId)	Sets the threshold interval for a specific callback by ID.
    setThreshold(value, id = this.#callbackId)		Sets the threshold for a specific callback by ID.

Callback Execution:
    checkCallbacks(timestampNow = performance.now())	Checks and executes all active callbacks based on registered conditions.
    executeCallbackById(id)				Manually executes a specific callback by its ID.

Metrics and Reporting:
    getCallbackMetrics()				Retrieves performance metrics for all registered callbacks.
    getCallbackMetricsById(id)				Retrieves performance metrics for a specific callback by its ID.
    resetMetrics()					Resets all performance metrics for registered callbacks.
    get performanceMetricsActivated()			Checks if performance metrics tracking is activated.
    set performanceMetricsActivated(value)		Activates or deactivates performance metrics tracking.
    get totalCheckExecutionTime()			Retrieves total execution time for all checks performed so far.
    get totalCallbackExecutionTime()			Retrieves total execution time for all callbacks executed so far.

System Management:
    reset()						Resets the CallbackTracker, clearing all registered callbacks and global metrics.

Utility Methods:
    get callbackIds()					Returns an array of all registered callback IDs.
    getCheckTrueFlag(id = this.#callbackId)		Gets whether the check function already returned true for a specific callback by ID.
    getThresholdInterval(id = this.#callbackId)		Gets the threshold interval for a specific callback by ID.
    getThreshold(id = this.#callbackId)			Gets the threshold value for a specific callback by ID.
    getPriority(id = this.#callbackId)			Gets the priority for a specific callback by ID.
    getType(id = this.#callbackId)			Gets the type for a specific callback by ID.
    getIsCallbackSet(id = this.#callbackId)		Checks if a main callback function is set for a specific callback by ID.
    getIsCheckFunctionSet(id = this.#callbackId)	Checks if a check function is set for a specific callback by ID.
    getCheckMethod(id = this.#callbackId)		Gets the check method for a specific callback by ID.
    getCheckActive(id = this.#callbackId)		Gets whether the check function is active for a specific callback by ID.
*/

/*
    ***** EventGear ***** WebSocketBridge Class Overview *****

Constructor:
    constructor(options = {})			Initializes a new WebSocketBridge instance with configuration options

WebSocket Setup:
    setIncomingWebSocket(url, token = null)	Sets up the incoming WebSocket connection with the specified URL and optional authentication token.
    setOutgoingWebSocket(url, token = null)	Sets up the outgoing WebSocket connection with the specified URL and optional authentication token.

Message Management:
    sendEvent(metadata)				Sends data with metadata through the predefined outgoing channel.
    send(channel, data)				Sends data on a specified channel using the WebSocket connection.

Token Management:
    setIncomingToken(token)			Sets the incoming authentication token and reconnects if a connection exists.
    setOutgoingToken(token)			Sets the outgoing authentication token and reconnects if a connection exists.

Event Management:
    on(event, callback)				Adds an event listener for WebSocketBridge events.
    off(event, callback)			Removes an event listener for WebSocketBridge events.
    emit(event, data) (private)			Emits an event with the given data to registered listeners.

Configuration Management:
    reset()					Resets all configurations and switches off auto receive and send.
    setReceiveChannel(channelName)		Sets the name of the incoming channel for event reception.
    setAutoReceive(isActive)			Sets the auto-receive flag for incoming events and refreshes the listener.
    setCallback(callback)			Sets the callback function for handling received events.
    clearCallback()				Clears the callback function for handling received events.
    setAutoPassThrough(isActive)		Sets the auto-pass-through flag for events, forwarding incoming to the output.
    setSendChannel(channelName)			Sets the name of the outgoing channel for event transmission.
    setAutoSend(isActive)			Sets the auto-send flag for outgoing events.

Channel Management:
    getListenerCount(channel)			Gets the count of active listeners for a specified channel.

Properties:
    isIncomingWebSocketActive (getter) 		Checks whether the incoming WebSocket is active.
    isOutgoingWebSocketActive (getter) 		Checks whether the outgoing WebSocket is active.
    autoReceive (getter)			Checks if auto-receive is enabled.
    autoSend (getter)				Checks if auto-send is enabled.
    autoPassThrough (getter)			Checks if auto-pass-through is enabled.
    channelIn (getter)				Retrieves the name of the incoming channel.
    channelOut (getter)				Retrieves the name of the outgoing channel.
    hasIncomingToken (getter)			Checks if an incoming authentication token is set.
    hasOutgoingToken (getter)			Checks if an outgoing authentication token is set.
    queueSize (getter)				Retrieves the current size of the outgoing message queue.
    maxQueueSize (getter)			Retrieves the maximum size of the outgoing message queue.
*/

/*
***** EventGear ***** NodeBridge Class Overview *****

Constructor:
    constructor(options = {})			Initializes a new NodeBridge instance with configuration options.

Initialization and Configuration:
    reInit()					Initializes or reinitializes the Node.js bridge. Returns true if successful, false otherwise.
    reset()					Resets all configurations and disables auto receive and send.
    setReceiveChannel(channelName)		Sets the name of the incoming channel for event reception.
    setAutoReceive(isActive)			Sets the auto-receive flag for incoming events and refreshes the listener.
    setCallback(callback)			Sets the callback function for handling received events.
    clearCallback()				Clears the callback function for handling received events.
    setAutoPassThrough(isActive)		Sets the auto-pass through flag for events, forwarding incoming events to the output channel.
    setSendChannel(channelName)			Sets the name of the outgoing channel for event transmission.
    setAutoSend(isActive)			Sets the auto-send flag for outgoing events.

Event Management:
    sendEvent(metadata)				Sends data with metadata through the predefined outgoing channel, regardless of autoSend setting.
    emit(channel, data)				Emits an event on a specified channel using the Node.js EventEmitter.

Listener Management:
    getListenerCount(channel)			Gets the count of active listeners for a specified channel.

Properties:
    isNodeActive (getter)			Whether Node.js is active and emitter functional.
    autoReceive (getter)			Whether auto-receive is enabled.
    autoSend (getter)				Whether auto-send is enabled.
    autoPassThrough (getter)			Whether auto-pass-through is enabled.
    channelIn (getter)				Name of the incoming channel.
    channelOut (getter)				Name of the outgoing channel.
*/

/*
    ***** EventGear ***** DataMetricsBasic Class Overview *****

Properties:
    timestamp					Timestamp for the first event recorded.
    timestampLast				Timestamp of the last recorded event.
    events					Total number of events registered.
    seconds					Total elapsed time in seconds since the first event.
    interval					Average interval between events.
    frequency					The frequency of events (events per second).
    frequencyMax				The maximum frequency of events recorded.

Methods:
    constructor()				Initializes basic metrics tracking with default values.
    reset()					Resets all metrics to their initial state.
    add(timestampAdd, eventCount = 1)		Adds events and updates metrics. Takes an optional timestamp and the number of events to add.
    update(timestampUpdate)			Refreshes all metrics based on a new timestamp. Takes an optional timestamp for the update.
*/

/*
    ***** EventGear ***** DataMetricsMicro Class Overview *****

Inheritance:
    Extends: DataMetricsBasic			Inherits properties and methods from the DataMetricsBasic class for basic metrics tracking.

Properties:
    nowIsEstimated				Indicates whether to estimate ongoing metrics during high-frequency events.
    onCloseCallback				Callback function invoked at the end of each timeframe, receiving an object with metrics.
    intervalMicro				Average interval between events in the last micro timeframe for estimating ongoing metrics.
    eventsNow					Number of events in the current "Now" timeframe.
    secondsNow					Elapsed time in seconds for the current "Now" timeframe.
    intervalNow					Average interval between events in the "Now" timeframe.
    frequencyNow				Frequency of events in the "Now" timeframe (events per second).
    eventsLast					Number of events in the last completed timeframe.
    secondsLast					Elapsed time in seconds for the last completed timeframe.
    intervalLast				Average interval between events in the last completed timeframe.
    frequencyLast				Frequency of events in the last completed timeframe (events per second).
    differenceLast				Difference between estimated and actual elapsed time for the last timeframe.
    jitterLast					Pseudo-jitter based on time difference and event count for the last timeframe.

Methods:
    constructor(onCloseCallback, nowIsEstimated)Initializes micro-level metrics tracking with optional parameters for callback and estimation mode.
    reset()					Resets all metrics to their initial state, including basic metrics from DataMetricsBasic.
    resetMicroMetrics()				Resets only the metrics related to short-term micro analysis to their initial state.
    setCallbackOnClosure(callback)		Sets a callback to be executed when a millisecond timeframe closes or individual timestamps come in.
    add(timestampAdd, eventCount = 1)		Adds events and updates micro-level metrics. Takes an optional timestamp and the number of events to add.
    update(timestampUpdate)			Refreshes all metrics based on a new timestamp. Updates both general and micro-level metrics as needed.
*/

/*
    ***** EventGear ***** DataExecutionPerformance Class Overview *****

Properties:
    total					Total execution time (sum of all metrics and execution times).
    metrics					Time spent on metrics, analysis, and history tracking.
    frame					Timeframe-based metrics, analysis, and history with callbacks time.
    alarms					Time spent on threshold alarms and other special callbacks.
    response					Response callback execution time.
    metadata					Metadata change callback execution time.

Methods:
    constructor()				Initializes execution duration and performance tracking with default values for all properties.
    reset()					Resets execution duration and performance tracking to their initial state.    
*/

/*
    ***** EventGear ***** DataTimestampCountBuffer Class Overview *****

Properties:
    buffer					An array that holds the timestamp and count entries.
    maxSize					The maximum number of entries the buffer can hold, capped at DATA_TIMESTAMP_COUNT_BUFFER_MAX.
    pointer					Tracks the next write position in the circular buffer.
    size					Tracks the actual number of valid entries in the buffer.

Methods:
    constructor(maxSize)			Creates a new DataTimestampCountBuffer instance with a specified maximum size.
    reset()					Resets the buffer to its initial state, clearing all entries and resetting the pointer and size.
    addEntry(timestamp, count = 1)		Adds a new entry to the rolling buffer. It increments its count until maxlength, then it overwrites the oldest entry.
    clean(minTimestamp)				Cleans old entries from the buffer based on a minimum timestamp. This does not physically remove entries.
    filter(startTime, endTime)			Filters entries within a specific timeframe. Returns an array of entries that fall within the specified timestamps.
    getAllEntries()				Retrieves all entries currently in the buffer. Returns an array of all valid entries in chronological order.
    sumCountsInTimeframe(startTime, endTime)	Sums the event counts within a specific timeframe. Returns the total count of events within the specified timeframe.
    getCountInLastMilliseconds(timeframeMs)	Gets the total count of events that occurred within a specified timeframe in milliseconds.
*/


	// ***** Global ***** Setup Declaration *****
const CLASS_EVENTTARGET = typeof EventTarget !== 'undefined' ? EventTarget : class {};				// Check if EventTarget can be extended
const NODE_IS_INSTALLED = (typeof process !== 'undefined' && process.versions && process.versions.node); 	// Check if running in Node.js

const DATA_TIMESTAMP_COUNT_BUFFER_MAX = 300000;									// Maximum Size of DataTimestampCountBuffer

	// ***** EventGear ***** Global General Utility Functions *****

		// Calculation Functions (Frequency, Interval, Jitter, Threshold)
/**
 * Calculates the frequency of events.
 * @param {number} count - Total number of events.
 * @param {number} seconds - Total elapsed seconds.
 * @returns {number} Calculated frequency (events per second).
 * @throws {TypeError} If parameters are invalid.
 */
export function calculateFrequency(count, seconds) {
    // Unified parameter validation
    if (typeof count !== 'number' || typeof seconds !== 'number' || count < 0 || seconds < 0) {
        throw new TypeError('Invalid parameter.');
    }
    return seconds > 0 ? count / seconds : 0;
}

/**
 * Calculates the average interval between events.
 * @param {number} count - Total number of events.
 * @param {number} seconds - Total elapsed seconds.
 * @returns {number} Calculated interval (seconds per event).
 * @throws {TypeError} If parameters are invalid.
 */
export function calculateInterval(count, seconds) {
    // Unified parameter validation
    if (typeof count !== 'number' || typeof seconds !== 'number' || count < 0 || seconds < 0) {
        throw new TypeError('Invalid parameter.');
    }
    return count > 0 ? seconds / count : 0;
}

/**
 * Calculates jitter from event timestamps.
 * Computes the jitter based on an array of event timestamps or compressed timestamp-count pairs.
 *
 * @param {Array<number|Object>} timestamps - Event timestamps or objects with timestamp and count.
 * @returns {number} Calculated jitter value.
 */
export function calculateJitter(timestamps) {
    if (timestamps.length < 2) return 0;
    let totalInterval = 0, totalIntervalSquared = 0, totalCount = 0;
    let prevTimestamp = null;
    for (let i = 0; i < timestamps.length; i++) {
        const current = timestamps[i];
        const timestamp = typeof current === 'number' ? current : current.timestamp;
        const count = typeof current === 'number' ? 1 : current.count;
        if (prevTimestamp !== null) {
            const interval = (timestamp - prevTimestamp) / count;
            for (let j = 0; j < count; j++) {
                totalInterval += interval;
                totalIntervalSquared += interval * interval;
                totalCount++;
            }
        }
        prevTimestamp = timestamp;
    }
    if (totalCount < 2) return 0;
    const meanInterval = totalInterval / totalCount;
    return Math.sqrt((totalIntervalSquared / totalCount) - (meanInterval * meanInterval));
}

/**
 * Calculates next threshold by adding or subtracting interval to/from it efficiently.
 * 
 * @param {number} currentValue - Current value to check against threshold.
 * @param {number} interval - Interval to add to or subtract from the threshold.
 * @param {number} threshold - Current threshold to check.
 * @param {boolean} [intervalAddition=true] - If true, add interval; if false, subtract interval.
 * @returns {number} Updated threshold.
 * @throws {Error} If interval is zero.
 */
export function calculateIntervalThreshold(currentValue, interval, threshold, intervalAddition = true) {
    if (interval === 0) {
        throw new Error('Interval must be a non-zero number');
    }
    if (!Number.isFinite(currentValue) || !Number.isFinite(threshold) || !Number.isFinite(interval)) {
        return NaN;
    }
    // Early return if threshold is not exceeded
    if ((intervalAddition && currentValue < threshold) || (!intervalAddition && currentValue > threshold)) {
        return threshold;
    }
    // Try adding/subtracting interval once
    let newThreshold = intervalAddition ? threshold + interval : threshold - interval;
    // Check if this single adjustment is sufficient
    if ((intervalAddition && newThreshold > currentValue) || (!intervalAddition && newThreshold < currentValue)) {
        return newThreshold;
    }
    // If not, fall back to the more complex calculation
    const difference = Math.abs(currentValue - threshold);
    const intervalCount = Math.floor(difference / Math.abs(interval));
    const adjustment = (intervalCount + 1) * Math.abs(interval);
    return intervalAddition ? threshold + adjustment : threshold - adjustment;
}

		// Utility Functions 
/**
 * Retrieves the value of a nested property from an object using a dot-separated or bracket-notation path.
 * 
 * @param {Object} obj - The object from which to retrieve the property value.
 * @param {string} path - A string representing the path to the desired property (e.g., 'user.address.street' or 'users[0].name').
 * @param {boolean} returnUndefined=false - If true, returns undefined for non-existent paths instead of throwing an error.
 * @returns {*} The value of the specified property.
 * @throws {TypeError} If the first argument is not an object or if the path is not a string.
 * @throws {Error} If the specified property path does not exist (when returnUndefined is false).
 */
export function getValueFromObject(obj, path, returnUndefined = false) {
    if (typeof obj !== 'object' || obj === null) {
        throw new TypeError('First argument must be a non-null object.');
    }
    if (typeof path !== 'string') {
        throw new TypeError('Second argument must be a string representing the property path.');
    }
    // Fast path for single-key lookup
    if (!path.includes('.') && !path.includes('[')) {
        return returnUndefined ? obj[path] : (path in obj ? obj[path] : undefined);
    }
    // Resolve full path on nested object structures with support for arrays
    const keys = path.match(/\w+|\d+|\[(\w+)\]/g);
    let value = obj;
    for (const key of keys) {
        if (value == null) {
            // Throw error if value is null or undefined and returnUndefined is false
            if (!returnUndefined) {
                throw new Error(`Cannot read property '${key}' of ${value}`);
            }
            return undefined; // Return undefined if returnUndefined is true
        }
        const cleanKey = key.replace(/[\[\]']/g, '');
        // Check if cleanKey exists in value
        if (!(cleanKey in value)) {
            // Throw error if property does not exist and returnUndefined is false
            if (!returnUndefined) {
                throw new Error(`Property '${path}' not found.`);
            }
            return undefined; // Return undefined if returnUndefined is true
        }
        value = value[cleanKey]; // Access the property or getter
    }
    return value; // Return the resolved value
}


		// Callback Execution Functions
/**
 * Executes a callback function and returns its result, handling both sync and async functions
 * @param {Function} fn - Callback function
 * @param {...any} args - Arguments to pass to the callback function
 * @returns {any|Promise<any>} The result of the callback function or a Promise resolving to the result
 * @throws {TypeError} If the provided callback is not a function
 */		
export function executeCallback(fn, ...args) {
    if (typeof fn !== 'function') {
        throw new TypeError('Callback must be a function');
    }
    try {
        const result = fn(...args);
        if (result instanceof Promise) {
            return result.catch(error => {
                console.error('Async callback error:', error);
                throw error;
            });
        }
        return result;
    } catch (error) {
        console.error('Callback execution error:', error);
        throw error;
    }
}

/**
 * Executes an asynchronous callback function and returns its result
 * @param {Function} fn - Callback function
 * @param {...any} args - Arguments to pass to the callback function
 * @returns {Promise<any>} A Promise resolving to the result of the callback function
 * @throws {TypeError} If the provided callback is not a function
 */
export async function executeAsyncCallback(fn, ...args) {
    if (typeof fn !== 'function') {
        throw new TypeError('Callback must be a function');
    }
    try {
        return await Promise.resolve(fn(...args));
    } catch (error) {
        console.error('Async callback execution error:', error);
        throw error;
    }
}


	// ***** EventGear ***** Assertion Class *****

/**
 * A class for performing various assertions and comparisons.
 */
export class Assertion {
    /**
     * Creates an instance of Assertion.
     * @param {boolean} [raiseError=false] - Whether to raise errors on assertion failures.
     * @param {number} [defaultApproxTolerance=0.015] - The default tolerance for approximate equality comparisons.
     */
    constructor(raiseError = false, defaultApproxTolerance = 0.015) {
        this.raiseError = raiseError; // Set the RaiseError property
        this.defaultApproxTolerance = defaultApproxTolerance;
    }

    /**
     * Asserts that all provided arguments are numbers.
     * @private
     * @param {...number} args - The arguments to check.
     * @throws {TypeError} If any argument is not a number.
     */
    #assertNumbers(...args) {
        for (const arg of args) {
            if (typeof arg !== 'number') {
                throw new TypeError('All arguments must be numbers');
            }
        }
    }

    /**
     * Checks if a condition is true.
     * @param {boolean} condition - The condition to check.
     * @returns {boolean} True if the condition is true, false otherwise.
     * @throws {TypeError} If the condition is not a boolean and RaiseError is true.
     */
    true(condition) {
        if (typeof condition !== 'boolean') {
            if (this.raiseError) {
                throw new TypeError('Condition must be a boolean');
            }
            return false;
        }
        const result = condition === true;
        if (!result && this.raiseError) {
            throw new Error('Assertion failed: Condition is not true.');
        }
        return result;
    }

    /**
     * Checks if a condition is false.
     * @param {boolean} condition - The condition to check.
     * @returns {boolean} True if the condition is false, false otherwise.
     * @throws {TypeError} If the condition is not a boolean and RaiseError is true.
     */
    false(condition) {
        if (typeof condition !== 'boolean') {
            if (this.raiseError) {
                throw new TypeError('Condition must be a boolean');
            }
            return false;
        }
        const result = condition === false;
        if (!result && this.raiseError) {
            throw new Error('Assertion failed: Condition is not false.');
        }
        return result;
    }

    /**
     * Checks if two values are strictly equal.
     * @param {*} actual - The actual value.
     * @param {*} expected - The expected value.
     * @returns {boolean} True if the values are strictly equal, false otherwise.
     */
    equal(actual, expected) {
        const result = actual === expected;
        if (!result && this.raiseError) {
            throw new Error(`Assertion failed: ${actual} is not equal to ${expected}.`);
        }
        return result;
    }

    /**
     * Checks if two values are not strictly equal.
     * @param {*} actual - The actual value.
     * @param {*} expected - The expected value.
     * @returns {boolean} True if the values are not strictly equal, false otherwise.
     */
    notEqual(actual, expected) {
        const result = actual !== expected;
        if (!result && this.raiseError) {
            throw new Error(`Assertion failed: ${actual} should not be equal to ${expected}.`);
        }
        return result;
    }

    /**
     * Checks if the actual value is greater than the expected value.
     * @param {number} actual - The actual value.
     * @param {number} expected - The expected value.
     * @returns {boolean} True if actual is greater than expected, false otherwise.
     */
    bigger(actual, expected) {
        this.#assertNumbers(actual, expected);
        const result = actual > expected;
        if (!result && this.raiseError) {
            throw new Error(`Assertion failed: ${actual} is not bigger than ${expected}.`);
        }
        return result;
    }

    /**
     * Checks if the actual value is less than the expected value.
     * @param {number} actual - The actual value.
     * @param {number} expected - The expected value.
     * @returns {boolean} True if actual is less than expected, false otherwise.
     */
    smaller(actual, expected) {
        this.#assertNumbers(actual, expected);
        const result = actual < expected;
        if (!result && this.raiseError) {
            throw new Error(`Assertion failed: ${actual} is not smaller than ${expected}.`);
        }
        return result;
    }

    /**
     * Checks if the actual value is greater than or equal to the expected value.
     * @param {number} actual - The actual value.
     * @param {number} expected - The expected value.
     * @returns {boolean} True if actual is greater than or equal to expected, false otherwise.
     */
    biggerOrEqual(actual, expected) {
	this.#assertNumbers(actual, expected);
	const result = actual >= expected;
	if (!result && this.raiseError) {
	    throw new Error(`Assertion failed: ${actual} is not bigger than or equal to ${expected}.`);
	}
	return result;
    }

    /**
     * Checks if the actual value is less than or equal to the expected value.
     * @param {number} actual - The actual value.
     * @param {number} expected - The expected value.
     * @returns {boolean} True if actual is less than or equal to expected, false otherwise.
     */
    smallerOrEqual(actual, expected) {
        this.#assertNumbers(actual, expected);
        const result = actual <= expected;
        if (!result && this.raiseError) {
            throw new Error(`${actual} is not smaller than or equal to ${expected}.`);
        }
        return result;
    }

    /**
     * Checks if the actual value is between the lower and upper bounds (exclusive).
     * @param {number} actual - The actual value.
     * @param {number} lowerBound - The lower bound.
     * @param {number} upperBound - The upper bound.
     * @returns {boolean} True if actual is between lowerBound and upperBound, false otherwise.
     */
    between(actual, lowerBound, upperBound) {
        this.#assertNumbers(actual, lowerBound, upperBound);
        if (lowerBound >= upperBound) {
            if (this.raiseError) {
                throw new Error('Lower bound must be less than upper bound');
            }
            return false;
        }
        const result = actual > lowerBound && actual < upperBound;
        if (!result && this.raiseError) {
            throw new Error(`${actual} is not between ${lowerBound} and ${upperBound}.`);
        }
        return result;
    }

    /**
     * Checks if the actual value is not between the lower and upper bounds (inclusive).
     * @param {number} actual - The actual value.
     * @param {number} lowerBound - The lower bound.
     * @param {number} upperBound - The upper bound.
     * @returns {boolean} True if actual is not between lowerBound and upperBound (inclusive), false otherwise.
     * @throws {TypeError} If any parameter is not a number.
     * @throws {Error} If lowerBound is greater than upperBound.
     */
    notBetween(actual, lowerBound, upperBound) {
        this.#assertNumbers(actual, lowerBound, upperBound);
        if (lowerBound > upperBound) {
            if (this.raiseError) {
                throw new Error('Lower bound must be less than or equal to upper bound');
            }
            return false;
        }
        const result = actual < lowerBound || actual > upperBound;
        if (!result && this.raiseError) {
            throw new Error(`${actual} is between ${lowerBound} and ${upperBound}.`);
        }
        return result;
    }

    /**
     * Checks if the actual value is approximately equal to the expected value within a given tolerance.
     * @param {number} actual - The actual value.
     * @param {number} expected - The expected value.
     * @param {number} [tolerance] - The maximum allowed difference factor (0 to 1).
     * @returns {boolean} True if the actual value is within the tolerance range of the expected value, false otherwise.
     */
    approxEqual(actual, expected, tolerance = this.defaultApproxTolerance) {
        this.#assertNumbers(actual, expected, tolerance);
        if (tolerance < 0 || tolerance > 1) {
            if (this.raiseError) {
                throw new RangeError('Tolerance must be between 0 and 1');
            }
            return false;
        }
        const difference = Math.abs(actual - expected);
        const maxDifference = Math.abs(expected * tolerance);
        const result = difference <= maxDifference;
        if (!result && this.raiseError) {
            throw new Error(`${actual} is not approximately equal to ${expected} within tolerance ${tolerance}.`);
        }
        return result;
    }

    /**
     * Checks if the actual value is not approximately equal to the expected value within a given tolerance.
     * @param {number} actual - The actual value.
     * @param {number} expected - The expected value.
     * @param {number} [tolerance] - The maximum allowed difference factor (0 to 1).
     * @returns {boolean} True if the actual value is not within the tolerance range of the expected value, false otherwise.
     * @throws {TypeError} If actual or expected are not numbers, or if tolerance is provided and is not a number.
     * @throws {RangeError} If tolerance is provided and is not between 0 and 1.
     */
    notApproxEqual(actual, expected, tolerance = this.defaultApproxTolerance) {
        const result = !this.approxEqual(actual, expected, tolerance);
        if (!result && this.raiseError) {
            throw new Error(`${actual} is approximately equal to ${expected}.`);
        }
        return result;
    }

    /**
     * Checks if a date is after another date.
     * @param {Date} date1 - The first date.
     * @param {Date} date2 - The second date.
     * @returns {boolean} True if date1 is after date2, false otherwise.
     * @throws {TypeError} If either argument is not a Date object.
     */
    dateAfter(date1, date2) {
        if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
            if (this.raiseError) {
                throw new TypeError('Both arguments must be Date objects');
            }
            return false;
        }
        return date1.getTime() > date2.getTime();
    }

    /**
     * Checks if a date is not after another date.
     * @param {Date} date1 - The first date.
     * @param {Date} date2 - The second date.
     * @returns {boolean} True if date1 is not after date2, false otherwise.
     * @throws {TypeError} If either argument is not a Date object.
     */
    dateNotAfter(date1, date2) {
        const result = !this.dateAfter(date1, date2);
        if (!result && this.raiseError) {
            throw new Error(`${date1.toISOString()} is after ${date2.toISOString()}.`);
        }
        return result;
    }

    /**
     * Checks if two arrays are equal.
     * @param {Array} arr1 - The first array.
     * @param {Array} arr2 - The second array.
     * @returns {boolean} True if the arrays are equal, false otherwise.
     */
    arrayEqual(arr1, arr2) {
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
            if (this.raiseError) {
                throw new TypeError('Both arguments must be arrays');
            }
            return false;
        }
        const result = arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
        if (!result && this.raiseError) {
            throw new Error('Arrays are not equal.');
        }
        return result;
    }

    /**
     * Checks if an array contains a specific element.
     * @param {Array} arr - The array to search.
     * @param {*} element - The element to search for.
     * @returns {boolean} True if the array contains the element, false otherwise.
     */
    arrayContains(arr, element) {
        if (!Array.isArray(arr)) {
            if (this.raiseError) {
                throw new TypeError('First argument must be an array');
            }
            return false;
        }
        const result = arr.includes(element);
        if (!result && this.raiseError) {
            throw new Error(`Array does not contain element: ${element}`);
        }
        return result;
    }

    /**
     * Checks if an array does not contain a specific element.
     * @param {Array} arr - The array to search.
     * @param {*} element - The element to search for.
     * @returns {boolean} True if the array does not contain the element, false otherwise.
     * @throws {TypeError} If the first argument is not an array.
     */
    arrayNotContains(arr, element) {
        if (!Array.isArray(arr)) {
            if (this.raiseError) {
                throw new TypeError('First argument must be an array');
            }
            return false;
        }
        const result = !this.arrayContains(arr, element);
        if (!result && this.raiseError) {
            throw new Error(`Array contains element: ${element}`);
        }
        return result;
    }

    /**
     * Checks if a value is null or undefined.
     * @param {*} value - The value to check.
     * @returns {boolean} True if the value is null or undefined, false otherwise.
     */
    isNullOrUndefined(value) {
        const result = value === null || value === undefined;
        if (!result && this.raiseError) {
            throw new Error('Value must be null or undefined.');
        }
        return result;
    }

    /**
     * Checks if a value is a function.
     * @param {*} value - The value to check.
     * @returns {boolean} True if the value is a function, false otherwise.
     * @throws {TypeError} If the value is not a function and raiseError is true.
     */
    isFunction(value) {
        const result = typeof value === 'function';
        if (!result && this.raiseError) {
            throw new TypeError('Value must be a function.');
        }
        return result;
    }

    /**
     * Checks if a value is a non-null object.
     * @param {*} value - The value to check.
     * @returns {boolean} True if the value is a non-null object, false otherwise.
     */
    isObject(value) {
        const result = typeof value === 'object' && value !== null;
        if (!result && this.raiseError) {
            throw new TypeError('Value must be a non-null object.');
        }
        return result;
    }

    /**
     * Checks if two objects are equal.
     * @param {Object} obj1 - The first object.
     * @param {Object} obj2 - The second object.
     * @returns {boolean} True if the objects are equal, false otherwise.
     */
    objectEqual(obj1, obj2) {
        if (!this.isObject(obj1) || !this.isObject(obj2)) {
            if (this.raiseError) {
                throw new TypeError('Both arguments must be non-null objects');
            }
            return false;
        }
        
        const result = JSON.stringify(obj1) === JSON.stringify(obj2); // Basic deep comparison
        if (!result && this.raiseError) {
            throw new Error('Objects are not equal.');
        }
        
        return result;
    }

    /**
     * Checks if an object has a specific property.
     * @param {Object} obj - The object to check.
     * @param {string} prop - The property to search for.
     * @returns {boolean} True if the object has the property, false otherwise.
     * @throws {TypeError} If the first argument is not an object or the second is not a string.
     */
    objectHasProperty(obj, prop) {
        if (!this.isObject(obj)) {
            if (this.raiseError) {
                throw new TypeError('First argument must be a non-null object');
            }
            return false;
        }
        if (typeof prop !== 'string') {
            if (this.raiseError) {
                throw new TypeError('Second argument must be a string');
            }
            return false;
        }
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    /**
     * Checks if a string contains a specific substring.
     * @param {string} str - The string to search in.
     * @param {string} substr - The substring to search for.
     * @returns {boolean} True if the string contains the substring, false otherwise.
     * @throws {TypeError} If either argument is not a string.
     */
    stringContains(str, substr) {
        if (typeof str !== 'string' || typeof substr !== 'string') {
            if (this.raiseError) {
                throw new TypeError('Both arguments must be strings');
            }
            return false;
        }
        return str.includes(substr);
    }

    /**
     * Checks if a string contains a specific substring.
     * @param {string} str - The string to search in.
     * @param {string} substr - The substring to search for.
     * @returns {boolean} True if the string contains the substring, false otherwise.
     * @throws {TypeError} If either argument is not a string.
     */
    stringContains(str, substr) {
        if (typeof str !== 'string' || typeof substr !== 'string') {
            if (this.raiseError) {
                throw new TypeError('Both arguments must be strings');
            }
            return false;
        }
        return str.includes(substr);
    }

    /**
     * Checks if a string does not contain a specific substring.
     * @param {string} str - The string to search in.
     * @param {string} substr - The substring to search for.
     * @returns {boolean} True if the string does not contain the substring, false otherwise.
     * @throws {TypeError} If either argument is not a string.
     */
    stringNotContains(str, substr) {
        if (typeof str !== 'string' || typeof substr !== 'string') {
            if (this.raiseError) {
                throw new TypeError('Both arguments must be strings');
            }
            return false;
        }
        const result = !this.stringContains(str, substr);
        if (!result && this.raiseError) {
            throw new Error(`String contains substring: ${substr}`);
        }
        return result;
    }
}
const check = new Assertion(false);	// Assertion methods object that returns boolean
const assert = new Assertion(true);	// Assertion methods object that raises error on fail


	// ***** EventGear ***** CallbackTracker *****

/**
 * CallbackTracker class for managing and executing callbacks based on custom check conditions.
 */
export class CallbackTracker {
    #callbacks = [];                  	// Stores registered callbacks
    #sortedCallbacks = [];             	// Stores callbacks sorted by priority
    #performanceMetricsActivated;      	// Controls whether performance metrics tracking is active
    #callbackId = '';			// last checked callback Id for easy reference to callback function


    // Global metrics for overall execution times
    #totalCheckExecutionTime = 0;     	// Total time spent on all checks
    #totalCallbackExecutionTime = 0;   	// Total time spent on all callbacks

    // Private field for interval duration
    #intervalDuration = 0;             	// Duration for the interval in milliseconds
    #intervalId = null;                	// Stores the interval ID

    /**
     * Initializes a new instance of the CallbackTracker.
     * @param {boolean} [performanceMetricsActivated=true] - Whether to activate performance metrics tracking.
     * @param {number} [intervalDuration=0] - Duration for the interval in milliseconds (default is 0).
     */
    constructor(performanceMetricsActivated = true, intervalDuration = 0) {
        this.#performanceMetricsActivated = performanceMetricsActivated;
        this.IntervalDuration = intervalDuration; // Use setter to initialize interval duration
        if (intervalDuration > 0) {
            this.#updateInterval();
        }
    }

	// ***** CallbackTracker ***** Private Methods *****

    /**
     * Updates the internal interval based on IntervalDuration.
     * If IntervalDuration is greater than 0, starts the interval; otherwise, stops it.
     * @private
     */
    #updateInterval() {
        if (this.#intervalId) {
            clearInterval(this.#intervalId); // Clear existing interval if it exists
            this.#intervalId = null;
        }

        if (this.#intervalDuration > 0) {
            this.#intervalId = setInterval(() => {
                this.checkCallbacks(); // Call checkCallbacks at each interval
            }, this.#intervalDuration);
        }
    }

    /**
     * Sorts the callbacks by priority in descending order.
     * @private
     */
    #sortCallbacks() {
        this.#sortedCallbacks = [...this.#callbacks].sort((a, b) => b.priority - a.priority);
    }

    /**
     * Resets all metrics for a specific callback.
     * @param {Object} callback - The callback object whose metrics will be reset.
     */
    #callbackResetMetrics(callback) {
        callback.checkTrueFlag = false;
        callback.checkTrueCount = 0;
        callback.lastCheckTrueTimestamp = 0;
        callback.lastExecutionTime = 0;
        callback.totalExecutionTime = 0;
        callback.lastCheckDuration = 0;
        callback.totalCheckDuration = 0;
    }

    /**
     * Sorts the callbacks by priority in descending order.
     * @param {number} callback = callback to extract metrics from.
     * @private
     */
    #extractCallbackMetrics(callback) {
        const {
            id,
            type,
            checkTrueCount,
            lastCheckTrueTimestamp,
            lastExecutionTime,
            totalExecutionTime,
            lastCheckDuration,
            totalCheckDuration,
            checkActive,
            callbackActive,
            checkMethod,
            checkTrueFlag,
            threshold,
            interval
        } = callback;

        return {
            id,
            type,
            checkTrueCount,
            lastCheckTrueTimestamp,
            lastExecutionTime,
            totalExecutionTime,
            lastCheckDuration,
            totalCheckDuration,
            checkActive,
            callbackActive,
            checkMethod,
            checkTrueFlag,
            threshold,
            interval
        };
    }

	// ***** CallbackTracker ***** Public Methods - Main Functionality *****

    /**
     * Registers a new callback or updates an existing one.
     * @param {string} id - Unique identifier for the callback.
     * @param {function} checkFunction - Function to determine if the callback should be triggered.
     * @param {function|null} [callback=null] - Function to be executed when triggered (optional).
     * @param {number} [priority=5] - Priority of the callback (0-10).
     * @param {string|null} [type=null] - Type of the callback for categorization (optional).
     * @param {boolean} [checkActive=true] - Whether the check function is active (default is true).
     * @param {boolean} [callbackActive=true] - Whether the callback function is active (default is true).
     * @param {number} [threshold=0] - Threshold for the next check and callback for repeated interval checks
     * @param {number} [interval=0] - interval to add to the threshold for next repeated check
     * @throws {Error} If checkFunction is not a function or priority is out of range.
     */
    registerCallback(id, checkFunction, callback = null, priority = 5, type = null, checkActive = true, callbackActive = true, 
            checkMethod = 'default', threshold = 0, interval = 0) {
        if (typeof checkFunction !== 'function') {
            throw new Error("Check function must be a function");
        }
        if (callback !== null && typeof callback !== 'function') {
            throw new Error("Callback must be a function or null");
        }
        if (priority < 0 || priority > 10) {
            throw new Error("Priority must be between 0 and 10");
        }

        const existingCallbackIndex = this.#callbacks.findIndex(cb => cb.id === id);
        if (existingCallbackIndex !== -1) {
            // Update existing callback properties
            Object.assign(this.#callbacks[existingCallbackIndex], { 
                checkFunction, 
                callback, 
                priority, 
                type,
                checkActive,
                callbackActive,
                checkMethod,
                checkTrueFlag: false,
                threshold,
                interval
            });
        } else {
            // Add new callback with additional properties
            this.#callbacks.push({ 
                id, 
                type, 
                checkFunction, 
                callback, 
                priority,
                checkActive,
                callbackActive,
                checkMethod,
                checkTrueFlag: false,
                threshold,
                interval,
                checkTrueCount: 0,
                lastCheckTrueTimestamp: 0,
                lastExecutionTime: 0,
                totalExecutionTime: 0,
                lastCheckDuration: 0,
                totalCheckDuration: 0
            });
        }
        this.#sortCallbacks();
    }

    /**
     * Checks and executes applicable callbacks based on registered conditions.
     *
     * @param {number} timestampNow = performance.now() - The current timestamp used for updating lastCheckTrueTimestamp.
     */
    checkCallbacks(timestampNow = performance.now()) {
        let checkStart, checkEnd;
        checkStart = timestampNow;
        this.#sortedCallbacks.forEach(cb => {
            if (!cb.checkActive) return;
            if (this.#performanceMetricsActivated) {
                checkStart = performance.now();
            }
            this.#callbackId = cb.id;
            let checkPassedTrue = false;
            const checkFunctionDefined = (cb.checkFunction && typeof cb.checkFunction === 'function')
            if (cb.checkMethod === 'customOnce' && !cb.checkTrueFlag) {
            	if (checkFunctionDefined) {
                    checkPassedTrue = executeCallback(cb.checkFunction);
                }
            } else if (cb.checkMethod === 'timeOnce' && !cb.checkTrueFlag && timestampNow >= cb.threshold) {
            	if (checkFunctionDefined) {
                    checkPassedTrue = executeCallback(cb.checkFunction);
                } else {
                    checkPassedTrue = true
                }

            } else if (cb.checkMethod === 'timeInterval' && timestampNow >= cb.threshold) {
            	if (checkFunctionDefined) {
                    checkPassedTrue = executeCallback(cb.checkFunction);
                } else {
                    checkPassedTrue = true
                }
                if (checkPassedTrue) {
                    cb.threshold = calculateIntervalThreshold(timestampNow, cb.interval, cb.threshold);
                }
            } else {
                // This covers 'default', 'customOnce', 'customInterval', and any other cases
            	if (checkFunctionDefined) {
                    checkPassedTrue = executeCallback(cb.checkFunction);
                }
            }
            if (this.#performanceMetricsActivated) {
                checkEnd = performance.now();
                cb.lastCheckDuration = checkEnd - checkStart;
                cb.totalCheckDuration += cb.lastCheckDuration;
                this.#totalCheckExecutionTime += cb.lastCheckDuration;
            }
            if (checkPassedTrue) {
                cb.lastCheckTrueTimestamp = checkStart;
                if (!cb.checkTrueFlag) cb.checkTrueFlag = true;
                cb.checkTrueCount++;            
                if (cb.callback && cb.callbackActive && typeof cb.callback === 'function') {
                    if (this.#performanceMetricsActivated) {
                        const startTime = performance.now();
                        executeCallback(cb.callback);
                        cb.lastExecutionTime = performance.now() - startTime;
                        cb.totalExecutionTime += cb.lastExecutionTime;
                        this.#totalCallbackExecutionTime += cb.lastExecutionTime;
                    } else {
                        executeCallback(cb.callback);
                    }
                }
            }
        });
        this.#callbackId = '';
    }

    /**
     * Removes a callback by its ID.
     * @param {string} id - ID of the callback to remove.
     */
    removeCallback(id) {
        const index = this.#callbacks.findIndex(cb => cb.id === id);
        if (index !== -1) {
            this.#callbacks.splice(index, 1); // Remove from callbacks array
            this.#sortedCallbacks = this.#sortedCallbacks.filter(cb => cb.id !== id); // Update sorted callbacks
        }
    }

    /**
     * Resets the CallbackTracker, clearing all registered callbacks and global metrics.
     */
    reset() {
        this.#callbacks = [];
        this.#sortedCallbacks = [];
        // Reset global metrics
        this.#totalCheckExecutionTime = 0;
        this.#totalCallbackExecutionTime = 0;
        // Clear any active intervals
        if (this.#intervalId) {
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }
    }

    /**
     * Resets all metrics for all registered callbacks to their initial values.
     */
    resetMetrics() {
        this.#totalCheckExecutionTime = 0;
        this.#totalCallbackExecutionTime = 0;
        this.#callbacks.forEach(cb => this.#callbackResetMetrics(cb));
    }

    /**
     * Resets all metrics for a specific callback by ID, or the currently active callback if no ID is provided.
     * @param {string} [id=this.#callbackId] - The ID of the callback to reset metrics for (defaults to the currently active callback).
     * @throws {Error} If the callback ID doesn't exist.
     */
    resetMetricsById(id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
        }
        this.#callbackResetMetrics(callback);
    }


	// ***** CallbackTracker ***** Public Methods - Global Configuration Setters *****

    /**
     * Sets the interval duration. If set to 0, the interval is deactivated.
     * @param {number} value - Duration for the interval in milliseconds.
     */
    set IntervalDuration(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error("Interval duration must be a non-negative number");
        }
        this.#intervalDuration = value;
        this.#updateInterval(); // Update the internal interval based on the new duration
    }

    /**
     * Sets the state of performance metrics activation.
     * @param {boolean} value - Whether to activate performance metrics tracking.
     */
    set performanceMetricsActivated(value) {
        this.#performanceMetricsActivated = Boolean(value);
    }


	// ***** CallbackTracker ***** Public Methods - Callback Property Setters *****

    /**
     * Updates specific properties of a registered callback.
     * @param {string} id - ID of the callback to update.
     * @param {Object} updates - Object containing properties to update.
     * @param {function} [updates.checkFunction] - New check function.
     * @param {function|null} [updates.callback] - New callback function.
     * @param {number} [updates.priority] - New priority (0-10).
     * @param {string|null} [updates.type] - New type of the callback.
     * @param {boolean} [updates.checkActive=true] - Whether the check function is active (default is true).
     * @param {boolean} [updates.callbackActive=true] - Whether the callback function is active (default is true).
     * @param {string} [updates.checkMethod] - Method used for checking conditions (e.g., 'default', 'timeOnce', etc.).
     * @param {boolean} [updates.checkTrueFlag=false] - Indicates if the check has passed at least once.
     * @param {number} [updates.threshold] - The threshold for timing checks.
     * @param {number} [updates.interval] - The interval for timing checks.
     * @throws {Error} If the callback ID doesn't exist or if invalid updates are provided.
     */
    setCallbackProperties(id, updates) {
        const callbackIndex = this.#callbacks.findIndex(cb => cb.id === id);
        if (callbackIndex === -1) throw new Error(`Callback with ID ${id} not found`);
        const currentCallback = this.#callbacks[callbackIndex];
        // Validate and update properties
        if (updates.checkFunction !== undefined) {
            if (typeof updates.checkFunction !== 'function') throw new Error("Check function must be a function");
            currentCallback.checkFunction = updates.checkFunction;
        }
        if (updates.callback !== undefined) {
            if (updates.callback !== null && typeof updates.callback !== 'function') throw new Error("Callback must be a function or null");
            currentCallback.callback = updates.callback;
        }
        if (updates.priority !== undefined) {
            if (updates.priority < 0 || updates.priority > 10) throw new Error("Priority must be between 0 and 10");
            currentCallback.priority = updates.priority;
        }
        if (updates.type !== undefined) currentCallback.type = updates.type;
        // Update active states
        if (updates.checkActive !== undefined) currentCallback.checkActive = Boolean(updates.checkActive);
        if (updates.callbackActive !== undefined) currentCallback.callbackActive = Boolean(updates.callbackActive);
        // Update check passed flag and next dynamic threshold	
        if (updates.checkMethod !== undefined) currentCallback.checkMethod = updates.checkMethod;
        if (updates.checkTrueFlag !== undefined) currentCallback.checkTrueFlag = Boolean(updates.checkTrueFlag);
        if (updates.threshold !== undefined) currentCallback.threshold = updates.threshold;
        if (updates.interval !== undefined) currentCallback.interval = updates.interval;
        this.#sortCallbacks(); // Re-sort after updates
    }

    /**
     * Sets the check function for a specific callback by ID, or the currently active callback if no ID is provided.
     * @param {function|null} func - The new check function (or null).
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active callback).
     * @throws {Error} If the callback ID doesn't exist.
     */
    setCheckFunction(func, id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
        }
        // Set to null or a valid function
        if (func !== null && typeof func !== 'function') {
            throw new Error("Check function must be a function or null");
        }
        callback.checkFunction = func;
    }

    /**
     * Sets the main callback function for a specific callback by ID, or the currently active one if no ID is provided.
     * @param {function|null} func - The new main callback function (or null).
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active one).
     * @throws {Error} If the callback ID doesn't exist.
     */
    setCallback(func, id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
        }
        if (func !== null && typeof func !== 'function') {
            throw new Error("Callback must be a function or null");
        }
        callback.callback = func;
    }

    /**
     * Sets the priority for a specific callback by ID, or the currently active callback if no ID is provided.
     * @param {number} value - The new priority value (0-10).
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active callback).
     * @throws {Error} If the callback ID doesn't exist or if the priority is out of range.
     */
    setPriority(value, id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
        }
        if (value < 0 || value > 10) {
            throw new Error("Priority must be between 0 and 10");
        }
        callback.priority = value;
        this.#sortCallbacks(); // Re-sort after updates
    }

    /**
     * Sets the type for a specific callback by ID, or the currently active callback if no ID is provided.
     * @param {string|null} value - The new type value (or null).
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active callback).
     * @throws {Error} If the callback ID doesn't exist.
     */
    setType(value, id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
        }
        callback.type = value; // Allow null values
    }

    /**
     * Sets whether the callback function is active for a specific callback by ID, or the currently active one if no ID is provided.
     * @param {boolean} value - Whether to activate the callback function.
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active one).
     * @throws {Error} If the callback ID doesn't exist.
     */
    setCallbackActive(value, id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
        }
        callback.callbackActive = Boolean(value);
    }

    /**
     * Sets whether the check function is active for a specific callback by ID, or the currently active one if no ID is provided.
     * @param {boolean} value - Whether to activate the check function.
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active one).
     * @throws {Error} If the callback ID doesn't exist.
     */
    setCheckActive(value, id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
        }
        callback.checkActive = Boolean(value);
    }

    /**
     * Sets the check method for a specific callback by ID, or the currently active one if no ID is provided.
     * @param {string} method - The new check method (e.g., 'default', 'timeOnce', etc.).
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active one).
     * @throws {Error} If the callback ID doesn't exist.
     */
    setCheckMethod(method, id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
        }
         callback.checkMethod = method;
    }

    /**
     * Sets whether the check function was executed already with result true for a specific callback by ID, or the currently active one if no ID is provided.
     * @param {boolean} value - Whether the check function already returned true.
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active one).
     * @throws {Error} If the callback ID doesn't exist.
     */
    setCheckTrueFlag(value, id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
        }
        callback.checkTrueFlag = Boolean(value);
    }

    /**
     * Sets the threshold interval for a specific callback by ID, or the currently active callback if no ID is provided.
     * @param {number} value - The new interval value.
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active callback).
     */
    setThresholdInterval(value, id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
            return;
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
            return;
        }
        callback.interval = value; // No check for negative values
    }

    /**
     * Sets the threshold for a specific callback by ID, or the currently active callback if no ID is provided.
     * @param {number} value - The new threshold value.
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active callback).
     */
    setThreshold(value, id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
            return;
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
            return;
        }
        callback.threshold = value; // No check for negative values
    }


	// ***** CallbackTracker ***** Public Methods - Global Configuration, State and Metrics Getters *****

    /**
     * Gets the current interval duration.
     * @returns {number} The current interval duration in milliseconds.
     */
    get IntervalDuration() {
        return this.#intervalDuration;
    }

    /**
     * Gets the current state of performance metrics activation.
     * @returns {boolean} Whether performance metrics are currently activated.
     */
    get performanceMetricsActivated() {
        return this.#performanceMetricsActivated;
    }

    /**
     * Gets a list of all registered callback IDs.
     * @returns {string[]} Array of callback IDs.
     */
    get callbackIds() {
        return this.#callbacks.map(cb => cb.id);
    }

    /**
     * Gets the actually checked callback ID.
     * @returns {string} The ID of the last checked callback.
     */
    get callbackId() {
        return this.#callbackId;
    }

    /**
     * Gets the total execution time for all checks performed so far.
     * @returns {number} Total time spent on checks in milliseconds.
     */
    get totalCheckExecutionTime() {
        return this.#totalCheckExecutionTime;
    }

    /**
     * Gets the total execution time for all callbacks executed so far.
     * @returns {number} Total time spent on callbacks in milliseconds.
     */
    get totalCallbackExecutionTime() {
        return this.#totalCallbackExecutionTime;
    }


	// ***** CallbackTracker ***** Public Methods - Callback Metrics and Property Getters *****

    /**
     * Retrieves metrics for all registered callbacks.
     * @returns {Array} An array of callback metric objects.
     */
    getCallbackMetrics() {
        return this.#callbacks.map(callback => this.#extractCallbackMetrics(callback));
    }

    /**
     * Retrieves metrics for a specific callback by ID.
     * @param {string} id=this.#callbackId - ID of the callback to retrieve metrics for. Defaults to active callback in case of active check
     * @returns {Object|null} The callback metric object if found, null otherwise.
     */
    getCallbackMetricsById(id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
            return null;
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
            return null;
        }
        return this.#extractCallbackMetrics(callback);
    }

    /**
     * Gets whether a main callback function is set for a specific callback by ID, or for the currently active one if no ID is provided.
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active one).
     * @returns {boolean} True if a main callback function is set, false otherwise.
     */
    getIsCallbackSet(id = this.#callbackId) {
        const callback = this.#callbacks.find(cb => cb.id === id);
        return !!(callback && typeof callback.callback === 'function');
    }

    /**
     * Gets whether a check function is set for a specific callback by ID, or for the currently active one if no ID is provided.
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active one).
     * @returns {boolean} True if a check function is set, false otherwise.
     */
    getIsCheckFunctionSet(id = this.#callbackId) {
        const callback = this.#callbacks.find(cb => cb.id === id);
        return !!(callback && typeof callback.checkFunction === 'function');
    }

    /**
     * Gets the priority for a specific callback by ID, or the currently active callback if no ID is provided.
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active callback).
     * @returns {number|null} The priority value or null if not found.
     */
    getPriority(id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
        }
        return callback.priority;
    }

    /**
     * Gets the type for a specific callback by ID, or the currently active callback if no ID is provided.
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active callback).
     * @returns {string|null} The type value or null if not found.
     */
    getType(id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
        }
        return callback.type;
    }

    /**
     * Gets whether the callback function is active for a specific callback by ID, or the currently active one if no ID is provided.
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active one).
     * @returns {boolean} True if the callback function is active, false otherwise.
     */
    getCallbackActive(id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
        }
        return Boolean(callback.callbackActive);
    }

    /**
     * Gets whether the check function is active for a specific callback by ID, or the currently active one if no ID is provided.
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active one).
     * @returns {boolean} True if the check function is active, false otherwise.
     */
    getCheckActive(id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
        }
        return Boolean(callback.checkActive);
    }

    /**
     * Gets the check method for a specific callback by ID, or for the currently active one if no ID is provided.
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active one).
     * @returns {string|null} The check method or null if not found.
     */
    getCheckMethod(id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
        }
        return callback.checkMethod;
    }

    /**
     * Gets whether the check function already returned true for specific callback by ID, or the currently active one if no ID is provided.
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active one).
     * @returns {boolean} True if the check function returned true, false otherwise.
     */
    getCheckTrueFlag(id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
        }
        return Boolean(callback.checkTrueFlag);
    }

    /**
     * Gets the threshold interval for a specific callback by ID, or the currently active callback if no ID is provided.
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active callback).
     * @returns {number|null} The interval value or null if not found.
     */
    getThresholdInterval(id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
            return null;
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
            return null;
        }
        return callback.interval;
    }

    /**
     * Gets the threshold for a specific callback by ID, or the currently active callback if no ID is provided.
     * @param {string} [id=this.#callbackId] - The ID of the callback (defaults to the currently active callback).
     * @returns {number|null} The threshold value or null if not found.
     */
    getThreshold(id = this.#callbackId) {
        if (!id) {
            throw new Error("Invalid Id");
            return null;
        }
        const callback = this.#callbacks.find(cb => cb.id === id);
        if (!callback) {
            throw new Error("Id not found");
            return null;
        }
        return callback.threshold;
    }
}


	// ***** EventGear ***** WebSocketBridge for dual channel WebSocket communication *****

/**
 * WebSocketBridge class for handling WebSocket event communication.
 * Provides a dual-channel bridge for sending and receiving events in a WebSocket environment.
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

    /**
     * Creates a new WebSocketBridge instance.
     * @param {Object} [options={}] - Configuration options
     * @param {boolean} [options.autoReceive=false] - Auto receive events from WebSocket if channel is set
     * @param {boolean} [options.autoSend=false] - Auto send events to WebSocket if channel is set
     * @param {boolean} [options.autoPassThrough=false] - Auto pass through events from input to output
     * @param {string} [options.channelIn=''] - Event name channel to listen for incoming events
     * @param {string} [options.channelOut=''] - Event name channel to send outgoing events
     * @param {string} [options.url=''] - WebSocket server URL for incoming connection
     * @param {string} [options.outgoingUrl=''] - WebSocket server URL for outgoing connection
     * @param {string} [options.incomingToken=null] - Authentication token for incoming connection
     * @param {string} [options.outgoingToken=null] - Authentication token for outgoing connection
     * @param {number} [options.maxReconnectAttempts=5] - Maximum number of reconnection attempts
     * @param {number} [options.reconnectInterval=5000] - Interval between reconnection attempts in milliseconds
     * @param {number} [options.maxQueueSize=100] - Maximum size of the outgoing message queue
     */
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

    /**
     * Sets up the incoming WebSocket connection.
     * @param {string} url - The URL for the incoming WebSocket connection
     * @param {string} [token=null] - Optional authentication token
     */
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

    /**
     * Sets up the outgoing WebSocket connection.
     * @param {string} url - The URL for the outgoing WebSocket connection
     * @param {string} [token=null] - Optional authentication token
     */
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

    /**
     * Appends the token to the URL if provided.
     * @private
     */
    #appendTokenToUrl(url, token) {
        if (!token) return url;
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}token=${encodeURIComponent(token)}`;
    }

    /**
     * Handles WebSocket errors.
     * @private
     */
    #handleError(error, context) {
        console.error(`WebSocket error in ${context}:`, error);
        this.emit('error', { error, context });
    }

    /**
     * Attempts to reconnect a WebSocket.
     * @private
     */
    #reconnect(socketType) {
        if (this.#currentReconnectAttempts < this.#maxReconnectAttempts) {
            this.#currentReconnectAttempts++;
            console.log(`Attempting to reconnect ${socketType} WebSocket...`);
            setTimeout(() => {
                if (socketType === 'incoming') {
                    this.setIncomingWebSocket(this.#incomingSocket.url, this.#incomingToken);
                } else {
                    this.setOutgoingWebSocket(this.#outgoingSocket.url, this.#outgoingToken);
                }
            }, this.#reconnectInterval);
        } else {
            this.#handleError(new Error(`Max reconnect attempts reached for ${socketType} WebSocket`), socketType);
        }
    }

    /**
     * Sends queued messages when the connection is re-established.
     * @private
     */
    #sendQueuedMessages() {
        while (this.#outgoingQueue.length > 0 && this.#outgoingSocket.readyState === WebSocket.OPEN) {
            const message = this.#outgoingQueue.shift();
            this.#outgoingSocket.send(JSON.stringify(message));
        }
    }

    /**
     * Refreshes the auto-receive and passthrough status for incoming events.
     * @private
     */
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

    /**
     * Resets all configurations and switches off auto receive and send.
     */
    reset() {
        this.#channelIn = '';
        this.#channelOut = '';
        this.#autoSend = false;
        this.#autoReceive = false;
        this.#autoPassThrough = false;
        this.#outgoingQueue = [];
        if (this.#incomingSocket) {
            this.#incomingSocket.onmessage = null;
        }
    }

    /**
     * Sets the name of the incoming channel for event reception.
     * @param {string} channelName - The name of the channel to listen for incoming events
     */
    setReceiveChannel(channelName) {
        if (typeof channelName !== 'string' || !channelName.trim()) {
            throw new Error('Invalid channel name');
        }
        this.#channelIn = channelName;
        this.#autoReceiveRefresh();
    }

    /**
     * Sets the auto-receive flag for incoming events and refreshes the listener.
     * @param {boolean} isActive - If true, automatically receive events from the specified channel
     */
    setAutoReceive(isActive) {
        this.#autoReceive = Boolean(isActive);
        this.#autoReceiveRefresh();
    }

    /**
     * Sets the callback function for handling received events.
     * @param {Function} callback - The callback function to handle received events
     * @throws {TypeError} If the callback is not a function
     */
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

    /**
     * Clears the callback function for handling received events.
     */
    clearCallback() {
        this.#callback = () => {};
    }

    /**
     * Sets the auto-pass through flag for events.
     * @param {boolean} isActive - If true, automatically send incoming events to the outgoing channel
     */
    setAutoPassThrough(isActive) {
        this.#autoPassThrough = Boolean(isActive);
        this.#autoReceiveRefresh();
    }

    /**
     * Sets the name of the outgoing channel for event transmission.
     * @param {string} channelName - The name of the channel to send outgoing events
     */
    setSendChannel(channelName) {
        if (typeof channelName !== 'string' || !channelName.trim()) {
            throw new Error('Invalid channel name');
        }
        this.#channelOut = channelName;
    }

    /**
     * Sets the auto-send flag for outgoing events.
     * @param {boolean} isActive - If true, automatically send events to the specified channel
     */
    setAutoSend(isActive) {
        this.#autoSend = Boolean(isActive);
    }

    /**
     * Sends data with metadata through the predefined outgoing channel.
     * @param {*} metadata - The metadata to send along with the event
     */
    sendEvent(metadata) {
        if (this.#channelOut) {
            this.send(this.#channelOut, { metadata });
        } else {
            this.#handleError(new Error('Outgoing channel not set'), 'outgoing');
        }
    }

    /**
     * Sends data on a specified channel using the WebSocket connection.
     * @param {string} channel - The channel on which to send the data
     * @param {*} data - The data to send with the event
     */
    send(channel, data) {
        const message = { channel, data };
        if (this.#outgoingToken) {
            message.token = this.#outgoingToken;
        }
        
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

    /**
     * Sets the incoming authentication token and reconnects if a connection exists.
     * @param {string} token - The authentication token for the incoming connection
     */
    setIncomingToken(token) {
        this.#incomingToken = token;
        if (this.#incomingSocket) {
            this.setIncomingWebSocket(this.#incomingSocket.url, token);
        }
    }

    /**
     * Sets the outgoing authentication token and reconnects if a connection exists.
     * @param {string} token - The authentication token for the outgoing connection
     */
    setOutgoingToken(token) {
        this.#outgoingToken = token;
        if (this.#outgoingSocket) {
            this.setOutgoingWebSocket(this.#outgoingSocket.url, token);
        }
    }

    /**
     * Adds an event listener for WebSocketBridge events.
     * @param {string} event - The name of the event to listen for
     * @param {Function} callback - The callback function to execute when the event occurs
     */
    on(event, callback) {
        if (!this.#eventListeners.has(event)) {
            this.#eventListeners.set(event, []);
        }
        this.#eventListeners.get(event).push(callback);
    }

    /**
     * Removes an event listener for WebSocketBridge events.
     * @param {string} event - The name of the event to remove the listener from
     * @param {Function} callback - The callback function to remove
     */
    off(event, callback) {
        if (this.#eventListeners.has(event)) {
            const callbacks = this.#eventListeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * Emits an event with the given data.
     * @param {string} event - The name of the event to emit
     * @param {*} data - The data to pass to the event listeners
     * @private
     */
    emit(event, data) {
        if (this.#eventListeners.has(event)) {
            this.#eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    // Getters
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


	// ***** EventGear ***** NodeBridge class for node.js emitter *****

/**
 * NodeBridge class for handling Node.js event communication.
 * Provides a dual-channel bridge for sending and receiving events in a Node.js environment.
 */
export class NodeBridge {
    #nodeIsActive;		// State if node.js enviroment and emitter are activated
    #autoReceive;		// Configuration if events should be auto received and passed to callback function
    #autoSend;			// Configuration if events should be auto send. This setting is for external check and does not get autoprocessed
    #autoPassThrough;		// Configuration if events should be auto passed through from input to output
    #channelIn;			// Incoming Event Name Channel
    #channelOut;		// Outgoing Event Name Channel
    #eventEmitter;		// Event emitter class
    #emitter;			// Event emitter object instance
    #callback;			// callback function to handle incoming events

    /**
     * Creates a new NodeBridge instance.
     * @param {Object} [options={}] - Configuration options
     * @param {boolean} [options.autoReceive=false] - Auto receive events from Node if channel is set
     * @param {boolean} [options.autoSend=false] - Auto send events to Node if channel is set
     * @param {string} [options.channelIn=''] - Event name channel to listen for incoming events
     * @param {string} [options.channelOut=''] - Event name channel to send outgoing events
     */
    constructor(options = {}) {
        this.#nodeIsActive = NODE_IS_INSTALLED;
        if (!this.#nodeIsActive) {
            return;
        }
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

    /**
     * Initializes the Node.js bridge.
     * @private
     */
    #initialize() {
        if (this.#nodeIsActive) {
            try {
                this.#eventEmitter = require('events').EventEmitter;
                this.#emitter = new this.#eventEmitter();
            } catch (error) {
                console.error('Error setting up Node.js environment:', error);
                this.#nodeIsActive = false;
                this.#eventEmitter = null;
                this.#emitter = null;
            }
        }
    }

    /**
     * Refreshes the auto-receive and passthrough status for incoming events.
     * @private
     */
    #autoReceiveRefresh() {
        if (this.#nodeIsActive && this.#emitter) {
            this.#emitter.removeAllListeners();
            if ((this.#autoReceive || this.#autoPassThrough) && this.#channelIn) {
		if (typeof this.#channelIn !== 'string' || !this.#channelIn.trim()) {
		    console.error('Invalid incoming channel name.');
		    return;
		}
                this.#emitter.on(this.#channelIn, (eventData) => {
                    // Execute Callback with eventData if autoreceive is enabled
                    if (this.autoReceive && this.#callback) {
                        try {
                            const result = executeCallback(this.#callback, eventData);
                            if (result instanceof Promise) {
                                result.catch(error => console.error('Async callback error:', error));
                            }
                        } catch (error) {
                            console.error('Callback execution error:', error);
                        }
                    }
                    // Send the same event data to the outgoing channel if autoPassThrough is enabled
                    if (this.#autoPassThrough && this.#channelOut && typeof this.#channelOut === 'string' && this.#channelOut.trim()) {
                        this.sendEvent(eventData);
                    }
                });
            }
        }
    }

    // ***** NodeBridge ***** Public Interface *****
	
    /**
     * Initializes or reinitializes the Node.js bridge.
     * @returns {boolean} True if initialization was successful, false otherwise
     */
    reInit() {
        this.#nodeIsActive = NODE_IS_INSTALLED;
        if (!this.#nodeIsActive) {
            return false;
        }
        return this.#initialize();
    }
    
    /**
     * Resets all configurations and switches off auto receive and send.
     */
    reset() {
        this.#channelIn = '';
        this.#channelOut = '';
        this.#autoSend = false;
        this.#autoReceive = false;
        this.#autoPassThrough = false;
	this.#emitter.removeAllListeners();
    }

    /**
     * Sets the name of the incoming channel for event reception.
     * @param {string} channelName - The name of the channel to listen for incoming events
     */
    setReceiveChannel(channelName) {
        if (typeof channelName !== 'string' || !channelName.trim()) {
            throw new Error('Invalid channel name');
        }
        this.#channelIn = channelName;
        this.#autoReceiveRefresh();
    }

    /**
     * Sets the auto-receive flag for incoming events and refreshes the listener.
     * @param {boolean} isActive - If true, automatically receive events from the specified channel
     */
    setAutoReceive(isActive) {
        this.#autoReceive = Boolean(isActive);
        this.#autoReceiveRefresh();
    }

    /**
     * Sets the callback function for handling received events.
     * @param {Function} callback - The callback function to handle received events
     * @throws {TypeError} If the callback is not a function
     */
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

    /**
     * Clears the callback function for handling received events.
     */
    clearCallback() {
	this.#callback = () => {};
    }

    /**
     * Sets the auto-pass through flag for events.
     * Automatically forwards incoming events from the input channel to the output channel if enabled.
     * @param {boolean} isActive - If true, automatically send incoming events to the outgoing channel
     */
    setAutoPassThrough(isActive) {
        this.#autoPassThrough = Boolean(isActive);
        this.#autoReceiveRefresh();
    }

    /**
     * Sets the name of the outgoing channel for event transmission.
     * @param {string} channelName - The name of the channel to send outgoing events
     */
    setSendChannel(channelName) {
        if (typeof channelName !== 'string' || !channelName.trim()) {
            throw new Error('Invalid channel name');
        }
        this.#channelOut = channelName;
    }

    /**
     * Sets the auto-send flag for outgoing events.
     * @param {boolean} isActive - If true, automatically send events to the specified channel
     */
    setAutoSend(isActive) {
        this.#autoSend = Boolean(isActive);
    }

    /**
     * Sends data with metadata through the predefined outgoing channel.
     * This method sends events regardless of the autoSend setting.
     * @param {*} metadata - The metadata to send along with the event
     */
    sendEvent(metadata) {
        if (this.#nodeIsActive && this.#channelOut) {
            try {
                this.emit(this.#channelOut, { metadata });
            } catch (error) {
                console.error(`Error sending event to ${this.#channelOut}":`, error);
            }
        }
    }

    /**
     * Emits an event on a specified channel using the Node.js EventEmitter.
     * @param {string} channel - The channel on which to emit the event
     * @param {*} data - The data to emit with the event
     */
    emit(channel, data) {
        if (this.#nodeIsActive && this.#emitter) {
            try {
                this.#emitter.emit(channel, data);
            } catch (error) {
                console.error(`Error sending event to "${channel}":`, error);
            }
        }
    }
    
    /**
     * Gets the count of active listeners for a specified channel
     * @returns {number} - Count of listeners on the channel
     */
    getListenerCount(channel) {
        if (this.#emitter && typeof channel === 'string') {
            return this.#emitter.listenerCount(channel);
        }
        return 0;
    }

    get isNodeActive() { return !!this.#nodeIsActive; }   	// Whether Node.js is active and emitter functional
    get autoReceive() { return !!this.#autoReceive; }		// Whether auto-receive is enabled
    get autoSend() { return !!this.#autoSend; } 		// Whether auto-send is enabled
    get autoPassThrough() { return !!this.#autoPassThrough; } 	// Whether auto-pass-trough is enabled
    get channelIn() { return this.#channelIn; }			// The name of the incoming channel
    get channelOut() { return this.#channelOut; }		// The name of the outgoing channel
}


	// ***** EventGear ***** Data Class hierarchy *****

/**
 * Basic metrics for event tracking.
 * @class
 */
export class DataMetricsBasic {
    /**
     * Initializes basic metrics tracking
     */
    constructor() {
        this.timestamp = null;         	// Initial timestamp for the first event
        this.timestampLast = null;     	// Timestamp of the last recorded event
        this.events = 0;               	// Total number of events registered
        this.seconds = 0;              	// Total elapsed time in seconds since first event
        this.interval = 0;             	// Average interval between events
        this.frequency = 0;            	// Frequency of events (events per second)    
        this.frequencyMax = 0; 		// Maximum frequency

    }

    /**
     * Resets all metrics to initial state
     */
    reset() {
    	this.timestamp = null;
        this.timestampLast = null;
        this.events = 0;
        this.seconds = 0;
        this.interval = 0;
        this.frequency = 0;
        this.frequencyMax = 0;
    }

    /**
     * Adds events and updates metrics
     * @param {number} [timestampAdd=performance.now()] - Timestamp of event addition
     * @param {number} [eventCount=1] - Number of events to add
     */
    add(timestampAdd = performance.now(), eventCount = 1) {
	if (!this.#validateTimestamp (timestampAdd)) return;
	if (!this.timestamp) this.timestamp = timestampAdd; // Initialize timestamp in case
	if (typeof eventCount !== 'number' || eventCount < 0) {
	    throw new TypeError('Event must be positive number.');
	}
        this.events += eventCount;
        this.update(timestampAdd);
    }

    /**
     * Refresh all metrics based on new timestamp
     * @param {number} [timestampUpdate=performance.now()] - Timestamp of metrics update
     */
    update(timestampUpdate = performance.now()) {
	if (!this.#validateTimestamp (timestampUpdate)) return;
	if (!this.timestamp) this.timestamp = timestampUpdate; // Initialize timestamp in case
        this.seconds = (timestampUpdate - this.timestamp) / 1000;
        this.interval = calculateInterval(this.events, this.seconds);
        this.frequency = calculateFrequency(this.events, this.seconds);
        if (this.frequency > this.frequencyMax) this.frequencyMax = this.frequency;
    	this.timestampLast = timestampUpdate;
    }

    /**
     * Validates the provided timestamp.
     * Ensures that the timestamp is a valid number or `null` and is not earlier than 
     * the initial or last recorded timestamp.
     *
     * @private
     * @param {number|null} timestamp - The timestamp to validate. Can be `null`.
     * @returns {boolean} Returns `true` if the timestamp is valid.
     * @throws {TypeError} If the timestamp is not a number or `null`.
     * @throws {RangeError} If the timestamp is earlier than the initial or last recorded timestamp.
     */
    #validateTimestamp (timestamp) {
	if (timestamp === null) return true;
	if (typeof timestamp !== 'number') {
	    throw new TypeError('Timestamp must be a number or null.');
	}
	if ((this.timestampLast !== null && timestamp < this.timestampLast) || (this.timestamp !== null && timestamp < this.timestamp)) {
	    throw new RangeError('Timestamp cannot be earlier than the last recorded or initial timestamp.');
	}
	return true;
    }
}

/**
 * Extends DataMetricsBasic for advanced event tracking.
 * @class
 * @extends DataMetricsBasic
 */
export class DataMetricsAdvanced extends DataMetricsBasic {
    /**
     * Initializes micro-level metrics tracking
     */
    constructor() {
       super(); 			// Call the constructor of DataBasicMetrics
       this.jitter = 0; 		// jitter calculation
    }
}

/**
 * Extends DataMetricsBasic to provide micro-level metrics tracking.
 * Handles high-frequency events and provides real-time estimations.
 * @class
 * @extends DataMetricsBasic
 */
export class DataMetricsMicro extends DataMetricsBasic {
    /**
     * Initializes micro-level metrics tracking.
     * @param {function|null} [onCloseCallback=null] - Callback function invoked at the end of each timeframe. Receives an object with metrics.
     * @param {boolean} [nowIsEstimated=true] - Whether to estimate ongoing metrics during high-frequency events.
     */
    constructor(onCloseCallback = null, nowIsEstimated = true) {
        super(); 				// Call the constructor of DataBasicMetrics
        this.nowIsEstimated = nowIsEstimated; 	// Whether to estimate metrics during high-frequency events
        this.onCloseCallback = onCloseCallback; // Callback invoked at the end of each timeframe
        this.intervalMicro = 0;   		// Average interval between events in last micro timeframe for estimation of ongoing timeframe

        // Micro-level metrics for ongoing timeframe ("Now")
        this.eventsNow = 0;       // Number of events in the current "Now" timeframe
        this.secondsNow = 0;      // Elapsed time in seconds for the current "Now" timeframe
        this.intervalNow = 0;     // Average interval between events in the "Now" timeframe
        this.frequencyNow = 0;    // Frequency of events in the "Now" timeframe (events per second)

        // Metrics for the last completed timeframe ("Last")
        this.eventsLast = 0;      // Number of events in the last completed timeframe
        this.secondsLast = 0;     // Elapsed time in seconds for the last completed timeframe
        this.intervalLast = 0;    // Average interval between events in the last completed timeframe
        this.frequencyLast = 0;   // Frequency of events in the last completed timeframe (events per second)
        this.differenceLast = 0;  // Difference between estimated and actual elapsed time for the last timeframe
        this.jitterLast = 0;      // Pseudo-jitter based on time difference and event count for the last timeframe
    }

    /**
     * Resets all metrics to initial state
     */
    reset() {
        super.reset();
        this.resetMicroMetrics();
    }

    /**
     * Resets only metrics of the short term micro analysis to initial state
     */
    resetMicroMetrics() {
	this.intervalMicro = 0;
        this.eventsNow = 0;
        this.secondsNow = 0;
	this.intervalNow = 0;
        this.frequencyNow = 0;
        this.eventsLast = 0;
        this.secondsLast = 0;
	this.intervalLast = 0;
        this.frequencyLast = 0;
	this.differenceLast = 0;
	this.jitterLast = 0;
    }

    /**
     * Sets a callback to be executed when a millisecond timeframe closes or indivual timestamps come in.
     * The callback receives an object with general metrics and specific metrics from the closed timeframe.
     *
     * @param {Function|null} callback - The callback function to set, or null to remove it.
     * @throws {TypeError} If the callback is not a function or null.
     */
    setCallbackOnClosure(callback) {
        if (typeof callback === 'function' || callback === null) {
	    this.onCloseCallback = callback;
        } else {
	    throw new TypeError('Callback must be a function or null');
        }
    }
    
    /**
     * Adds events and updates micro-level metrics
     * @param {number} [timestampAdd=performance.now()] - Timestamp of event addition
     * @param {number} [eventCount=1] - Number of events to add
     */
    add(timestampAdd = performance.now(), eventCount = 1) {
	if (!this.#validateTimestamp (timestampAdd)) return;
	if (!this.timestamp) this.timestamp = timestampAdd; // Initialize timestamp in case
	if (typeof eventCount !== 'number' || eventCount < 0) {
	    throw new TypeError('Event must be positive number.');
	}
	// Update event count, timestamp and check for changes in timestamp (new millisecond timeframe from performance.now)
        this.events += eventCount;
        this.eventsNow += eventCount;	   // Upate event count in "Now" timeframe
	if (timestampAdd === this.timestampLast && this.nowIsEstimated && this.intervalMicro > 0) { // Check for Estimation-Mode and interval is valid
       	    // Estimate the metrics for "Now" from statistical analysis and average event interval time in previous micro timeframes
            this.secondsNow += eventCount * this.intervalMicro;	    	
	    this.intervalNow = calculateInterval (this.eventsNow, this.secondsNow);
            this.frequencyNow = calculateFrequency (this.eventsNow, this.secondsNow);
	}
	this.update(timestampAdd);
    }

    /**
     * Refresh all metrics based on new timestamp
     * @param {number} [timestampUpdate=performance.now()] - Timestamp of metrics update
     */
    update(timestampUpdate = performance.now()) {
	if (!this.#validateTimestamp (timestampUpdate)) return;
	if (!this.timestamp) this.timestamp = timestampUpdate; // Initialize timestamp in case
	// Update timestamp and check for changes in timestamp (new millisecond timeframe from performance.now)
    	const newTimeframe = (timestampUpdate !== this.timestampLast);
        if (newTimeframe) { // Check if new timeframe has started
	    // Calculate general basic metrics 
            this.seconds = (timestampUpdate - this.timestamp) / 1000;
	    this.interval = calculateInterval(this.events, this.seconds);
	    this.frequency = calculateFrequency(this.events, this.seconds);
	    // Pass metrics from "Now" over to closed micro timeframe
	    this.eventsLast = this.eventsNow;
	    if (this.eventsLast > 0) {
	        // Calculate metrics for closed micro timeframe based on real time from timestamp 
	        this.secondsLast = (timestampUpdate - this.timestampLast) / 1000;
	        this.intervalLast = calculateInterval (this.eventsLast, this.secondsLast);
	        this.frequencyLast = calculateFrequency (this.eventsLast, this.secondsLast);
	        if (this.nowIsEstimated) {
	            this.intervalMicro = this.intervalLast;				// Refresh micro interval for time estimation in next micro frame
	            this.differenceLast = this.secondsLast - this.secondsNow;		// Calculate time difference between estimation and performance now
		    this.jitterLast = Math.abs(this.differenceLast) / this.eventsLast;  // Calculate pseudo-jitter based on time difference and event count
	        }
	    } else {
	        // Clear Last micro Timeframe Metrics if no event happened in last "Now" timeframe
	        this.secondsLast = 0;
	        this.intervalLast = 0;
	        this.frequencyLast = 0;
	        this.differenceLast = 0;
	    }
            // Clear "Now" timeframe metrics for next micro timeframe
            this.eventsNow = 0;
	    if (this.nowIsEstimated) {
                this.secondsNow = 0;
	        this.intervalNow = 0;
                this.frequencyNow = 0;
	    }
	    // Update last timestamp 
            this.timestampLast = timestampUpdate
        }
        // Overwrite basic metrics with real time metrics in case of no basic metrics
        if (this.frequency === 0 && this.events > 0) {
            if (this.frequencyNow === 0) {
                if (this.frequencyLast !== 0 ) {
                    this.interval = this.intervalLast;
                    this.frequency = this.frequencyLast;
                    if (this.seconds === 0) this.seconds = this.secondsLast;
                }
            } else {
                if (this.seconds === 0) this.seconds = this.secondsNow;
                this.interval = this.intervalNow;
                this.frequency = this.frequencyNow;
            }
        }
	this.frequencyMax = Math.max(this.frequencyMax, this.frequency, this.frequencyLast); // Set max frequency
        if (newTimeframe && this.onCloseCallback) {					// Pass over closed "Now" timeframes with all metrics to callback method

            this.onCloseCallback ({timestamp: this.timestampLast, events: this.events, seconds: this.seconds, interval: this.interval, frequency: this.frequency,
            	frequencyMax: this.frequencyMax, eventsLast: this.eventsLast, secondsLast: this.secondsLast, intervalLast: this.intervalLast,
            	frequencyLast: this.frequencyLast, differenceLast: this.differenceLast, jitterLast: this.jitterLast});
        }        
    }

    /**
     * Validates the provided timestamp.
     * Ensures that the timestamp is a valid number or `null` and is not earlier than 
     * the initial or last recorded timestamp.
     *
     * @private
     * @param {number|null} timestamp - The timestamp to validate. Can be `null`.
     * @returns {boolean} Returns `true` if the timestamp is valid.
     * @throws {TypeError} If the timestamp is not a number or `null`.
     * @throws {RangeError} If the timestamp is earlier than the initial or last recorded timestamp.
     */
    #validateTimestamp (timestamp) {
	if (timestamp === null) return true;
	if (typeof timestamp !== 'number') {
	    throw new TypeError('Timestamp must be a number or null.');
	}
	if ((this.timestampLast !== null && timestamp < this.timestampLast) || (this.timestamp !== null && timestamp < this.timestamp)) {
	    throw new RangeError('Timestamp cannot be earlier than the last recorded or initial timestamp.');
	}
	return true;
    }   
}

/**
 * Execution times for performance tracking.
 * @class
 */
export class DataExecutionPerformance {
    /**
     * Initializes Execution duration and performance tracking
     */
    constructor() {
	// Event Execution Time for Metrics
        this.total = 0;		 						// Total Execution Time (Sum of all metrics and execution)
        this.metrics = 0;		 					// Metrics, Analysis and History Time
        this.frame = 0; 	 						// Timeframe based Metrics, Analysis and History with callbacks time
        this.alarms = 0;		 					// Threshold Alarms and other special callbacks Time
        this.response = 0;		 					// Response Callback Execution Time
        this.metadata = 0;		 					// Metadata Change Callback Execution Time
    }
    /**
     * Resets Execution duration and performance tracking
     */
    reset() {
	// Event Execution Time for Metrics
        this.total = 0;
        this.metrics = 0;
        this.frame = 0;
        this.alarms = 0;
        this.response = 0;
        this.metadata = 0;
    }
}

	// ***** EventGear ***** Rolling Buffer for timestamp & count pairs *****

/**
 * DataTimestampCountBuffer is a fixed-size circular buffer for efficiently storing timestamped event data.
 * Each entry consists of a timestamp and an associated event count, optimized for high frequency events.
 *
 * Features:
 * - Fixed-size memory allocation for predictable performance.
 * - Circular buffer logic to overwrite old entries when the buffer is full.
 * - Methods for filtering data within specific timeframes and cleaning old entries.
 *
 * @class DataTimestampCountBuffer
 */
export class DataTimestampCountBuffer {
    /**
     * Creates a new DataTimestampCountBuffer instance.
     *
     * @param {number} maxSize - The maximum number of entries the buffer can hold.
     *                           If it exceeds the global limit `DATA_TIMESTAMP_COUNT_BUFFER_MAX`,
     *                           it will be capped at that value.
     * @throws {Error} If `maxSize` is less than or equal to 0.
     */
    constructor(maxSize) {
        if (maxSize <= 0) {
            throw new Error("maxSize must be greater than 0");
        }
        maxSize = Math.min(maxSize, DATA_TIMESTAMP_COUNT_BUFFER_MAX);
        this.buffer = new Array(maxSize); // Preallocate the buffer
        this.maxSize = maxSize; // Fixed size of the buffer
        this.pointer = 0; // Tracks the next write position
        this.size = 0; // Tracks the actual number of valid entries in the buffer
    }

    /**
     * Resets the buffer to its initial state.
     * Clears all entries and resets the pointer and size.
     */
    reset() {
        this.buffer = new Array(this.maxSize);
        this.pointer = 0;
        this.size = 0;
    }
    
    /**
     * Adds a new entry to the rolling buffer.
     * If an entry with the same timestamp exists at the current pointer, it increments its count.
     * Otherwise, it overwrites the oldest entry.
     *
     * @param {number} timestamp - The timestamp of the event.
     * @param {number} count - The number of events at this timestamp.
     */
    addEntry(timestamp, count = 1) {
        const currentEntry = this.buffer[this.pointer];
        // If current pointer already has an entry with the same timestamp, aggregate counts
        if (currentEntry && currentEntry.timestamp === timestamp) {
            currentEntry.count += count;
        } else {
            // Otherwise, overwrite with a new entry
            this.buffer[this.pointer] = { timestamp, count };
            this.pointer = (this.pointer + 1) % this.maxSize; 	// Move pointer forward (circular behavior)
            if (this.size < this.maxSize) {
                this.size++; 					// Increase size until maxSize is reached
            }
        }
    }

    /**
     * Cleans old entries from the buffer based on a minimum timestamp.
     * This does not physically remove entries but skips over them during filtering.
     *
     * @param {number} minTimestamp - The minimum timestamp to retain in the buffer.
     */
    clean(minTimestamp) {
        while (this.size > 0) {
            const oldestIndex = (this.pointer - this.size + this.maxSize) % this.maxSize;
            const oldestEntry = this.buffer[oldestIndex];
            if (oldestEntry && oldestEntry.timestamp >= minTimestamp) {
                break; // Stop cleaning if oldest entry is within range
            }
            // Instead of just decreasing size, adjust the pointer directly
            this.size--;
        }
    }

    /**
     * Filters entries within a specific timeframe.
     *
     * @param {number} startTime - The start of the timeframe (inclusive).
     * @param {number} endTime - The end of the timeframe (exclusive).
     * @returns {Array<Object>} An array of entries within the specified timeframe.
     */
    filter(startTime, endTime) {
        const result = [];
        if (this.size === 0 || startTime >= endTime) {
            return result; // Early exit for empty buffer or invalid range
        }
        let index = (this.pointer - this.size + this.maxSize) % this.maxSize; // Starting index
        for (let i = 0; i < this.size; i++) {
            const entry = this.buffer[index];
            // Check if entry is within the specified timeframe
            if (entry && entry.timestamp >= startTime && entry.timestamp < endTime) {
                result.push(entry);
            }
            index = (index + 1) % this.maxSize; // Move to next index
        }
    return result;
    }

    /**
     * Retrieves all entries currently in the buffer.
     *
     * @returns {Array<Object>} An array of all valid entries in chronological order.
     */
    getAllEntries() {
        return this.filter(-Infinity, Infinity); // Return all entries without filtering
    }

    /**
     * Sums the event counts within a specific timeframe.
     *
     * @param {number} startTime - The start of the timeframe (inclusive).
     * @param {number} endTime - The end of the timeframe (inclusive).
     * @returns {number} The total count of events within the specified timeframe.
     */
    sumCountsInTimeframe(startTime, endTime) {
        let totalCount = 0;
        for (let i = 0; i < this.size; i++) {
	    const index = (this.pointer - this.size + i + this.maxSize) % this.maxSize;
    	    const entry = this.buffer[index];
	    if (entry && entry.timestamp >= startTime && entry.timestamp <= endTime) {
	        totalCount += entry.count; // Accumulate counts for entries within the timeframe
	    }
        }
        return totalCount;
    }

    /**
     * Gets the total count of events that occurred within a specified timeframe.
     *
     * @param {number} timeframeMs - The timeframe in milliseconds for which to retrieve the event count.
     * @returns {number} The total count of events within the specified timeframe.
     */
    getCountInLastMilliseconds(timeframeMs) {
        const currentTimestamp = performance.now();
        const startTime = currentTimestamp - timeframeMs;
        // Use the existing sumCountsInTimeframe method to get the total count
        return this.sumCountsInTimeframe(startTime, currentTimestamp);
    }
}

/**
 * EventGear - A framework for managing event-driven architectures.
 * 
 * EventGear provides a sophisticated programming paradigm for real-time event tracking, 
 * analysis, and performance monitoring. It supports metadata tracking and historical data 
 * analysis without introducing performance bottlenecks.
 *
 * Key Features:
 * - Automatic metrics collection for real-time performance insights.
 * - Sophisticated state control with start, stop and reset options.
 * - Flexible event callbacks enabling complex event-driven systems.
 * - Advanced metadata handling with automatic change detection.
 * - Configurable parameters for tailored event processing.
 *
 * @class EventGear
 * @version 0.5.8
 * @author Felix Mönnich
 * @license GPL
 *
 * @param {number} [maxHistorySize=0] - The maximum history size for event tracking.
 */
class EventGear extends CLASS_EVENTTARGET {
    // Static settings and Security limits
    static MAX_HISTORY_SIZE = 10000; 			// Maximum allowable history size
    static MAX_SHORT_BUFFER_SIZE = 1000; 		// Maximum Size for Short term Buffer
    static MAX_BATCH_EVENTS = 100000;			// Maximum Events that can be processed with batch methode for multiple events
    static DEFAULT_TIMEFRAME_LENGTH = 0;		// Default Timeframe Length in seconds
    static DEFAULT_INTERVAL_LENGTH = 200;		// Default Interval length for independent metrics updates and alarms in milliseconds
    static DEFAULT_BUFFER_SIZE = 20;			// Default Size for Short term Buffer
    static DEFAULT_SMOOTHING_FACTOR = 0.8;		// Default Frequency Smoothing Factor
    static DEFAULT_PERFORMANCE_METRICS_ACTIVE = true;   // Default Performance Time Calculation activation
    static CALLBACK_EVENT_RESPONSE_ACTIVE = true;    	// Default Event Response Callback activation
    static CALLBACK_METADATA_CHANGE_ACTIVE = true;    	// Default Metadata Change Callback activation
    static CALLBACK_INTERVAL_COUNT_ACTIVE = true;    	// Default Metadata Change Callback activation
    
    // Private Fields Properties

	// Overall State Management
    #isActive = false;                      					// Setting if the EventGear instance is active and processes events
    #isEventRegistrationInProgress = false;           				// Indicates if an event is getting registered right now
    #eventRegistrationPromise = null; 	 					// Promise to manage registration state

	// General Configuration Settings
    #maxHistorySize = EventGear.MAX_HISTORY_SIZE; 				// History array length
    #shortTermBufferSize = EventGear.DEFAULT_BUFFER_SIZE; 			// Short term buffer size
    #frameDuration = EventGear.DEFAULT_TIMEFRAME_LENGTH;  			// Duration for the analysis timeframes in seconds
    #independentIntervalLength = EventGear.DEFAULT_INTERVAL_LENGTH; 		// Duration of independent interval in milliseconds (default to 200 milli seconds)
    #TimeframeFrequencySmoothFactor = EventGear.DEFAULT_SMOOTHING_FACTOR; 	// Frequency Smoothing Factor for time frame based analysis
    #eventPerformanceMetricsActive = EventGear.DEFAULT_PERFORMANCE_METRICS_ACTIVE; // State if performance time gets calculated and logged

	// Alarm Thresholds and Callback Settings
    #eventCallbackResponseActivated = EventGear.CALLBACK_EVENT_RESPONSE_ACTIVE; // State if event default callback response is activated
    #eventCallbackMetadataActivated = EventGear.CALLBACK_METADATA_CHANGE_ACTIVE;// State if event metadata change callback response is activated
    #eventCallbackIntervalCountActivated = EventGear.CALLBACK_INTERVAL_COUNT_ACTIVE;// State if event count inter callback response is activated
    #totalTimeThreshold = 0;                					// Threshold for total running time alarm
    #totalTimeAlarmTriggered = false;	 					// State if total event running time alarm got triggered with callback
    #totalCountThreshold = 0;               					// Threshold for total event count alarm
    #totalCountAlarmTriggered = false;	 					// State if total event count alarm got triggered with callback
    #EventCountIntervalAlarm = 0;     	 					// Interval for repeated callbacks based on event count
    #TotalTimeIntervalAlarm = 0;     	 					// Interval for repeated callbacks based on total running time
    #intervalTimeThreshold = 0;             					// Next step Threshold for interval-based repeated time alarm 
    #intervalCountThreshold = 0;            					// Next step Threshold for interval-based repeated count alarm
    #jitterThreshold = 0;                   					// Threshold for jitter alarm
    #frequencyLowerThreshold = 0;           					// Lower threshold for frequency alarm
    #frequencyUpperThreshold = 0;           					// Upper threshold for frequency alarm
    #maxEventsPerFrameLowerThreshold = 0;   					// Lower threshold for max events per frame alarm
    #maxEventsPerFrameUpperThreshold = 0;   					// Upper threshold for max events per frame alarm

	// Event Metadata variant variables for eventData or other context
    #metadata = null;    		 					// Stores the metadata of the most recent event
    #metadataPrevious = null; 		 					// Stores the metadata of the second most recent event

	// Metrics objects composed of EventGear data classes
    #metrics = {
        micro: new DataMetricsMicro(), 						// Metrics object for total aggregation and high frequency short term 
        frame: new DataMetricsBasic()	 	 		 		// Metrics for timeframe based counting
    };
    #duration = {
	event: new DataExecutionPerformance(),					// Duration of event metrics and execution of callbacks
	total: new DataExecutionPerformance(),					// Duration of total metrics and execution of callbacks
	frame: new DataExecutionPerformance(),					// Duration of frame metrics and execution of callbacks
    };

	// Timestamps
    #timestampStart = 0;                         				// Start time of the counter (timestamp)
    #timestampFrameStart = 0;            					// Start time of the last timeframe (timestamp)
    #microTimestampBuffer = new DataTimestampCountBuffer (60000); 		// Timestamp&count pairs of events in the last minute, based on micro metrics closure
    #frameTimestampArray = [];           					// Timestamps of events in the current timeframe

	// Basic Metrics Values
    #totalFrequencyMax = 0;                      					// Maximum frequency observed (Hz)
    #totalFrameCount = 0;                    					// Number of completed timeframes

	// Short-Term Metrics
    #shortTermFrequency = 0; 		 					// Short-term frequency
    #shortTermJitter = 0; 			 				// Short-term jitter
    #shortTermEventTimestamps = [];  	 					// Buffer for short-term event timestamps        

	// Timeframe Event Counts & Metrics Values
    #frameFrequency = 0;		 					// Frequency of events in the current timeframe
    #frameJitter = 0;		 	 					// Jitter of events in the current timeframe
    #frameFrequencyLast = 0;            					// Frequency of events in the last timeframe (Hz)
    #frameHistory = [];                 					// History of completed timeframes

	// Exceedences Count in Timeframe
    #jittercheckTrueCount = 0;             					// Count of jitter exceedances
    #frequencycheckTrueCountLower = 0;     					// Count of lower frequency exceedances
    #frequencycheckTrueCountUpper = 0;     					// Count of upper frequency exceedances
    #maxEventscheckTrueCountLower = 0;     					// Count of lower max events exceedances
    #maxEventscheckTrueCountUpper = 0;     					// Count of upper max events exceedances
    #exceedancesHistory = [];               					// History of exceedances in timeframes

	// Internal Intervals
    #IntervalIDframe = null; 		 					// ID for the timeframe-based interval
    #IntervalIDindependent = null; 	 					// ID for the independent update interval

	// DOM Element Listener
    #DOMelements = [];      		 					// Array of DOM Elements for listeners
    #DOMeventTypes = [];    		 					// Array of DOM Event Types for listeners
    #DOMlisteners = [];     		 					// Array of DOM Element Listener Functions

	// Callbacks
    #EventCallback = null;							// Callback for incoming events feedback
    #metadataChangeCallback = null;      	 				// Callback for metadata change
    #totalCountAlarmCallback = null;        					// Callback for total count alarm
    #totalTimeAlarmCallback = null;         					// Callback for total time alarm
    #IntervalCountAlarmCallback = null;						// Callback for interval-based count alarm
    #IntervalTimeAlarmCallback = null; 						// Callback for interval-based time alarm
    #jitterAlarmCallback = null;            					// Callback for jitter alarms
    #frequencyAlarmCallback = null;         					// Callback for frequency alarms
    #maxEventsPerFrameAlarmCallback = null; 					// Callback for max events per frame alarms
    
	// CallbackTracker
    #callbacks = null;								// CallbackTracker control object for check and callback management and tracking

	// Communication Bridges
    #websocket = null;								// WebSocket control object for url receiver and emitter with token
    #node = null;		 	 					// NodeBridge control object with integrated event receiver and emitter
	
	// Lookup for shortcuts to property values and getters
    #shortcutLookup = {
        '$totalEventCount': () => this.#metrics.micro.events,
        '$frequencyShort': () => this.#shortTermFrequency,
        '$frequencyMicro': () => this.#metrics.micro.frequencyLast
        // Add more shortcuts as needed
    }
    
	/**
	 * Initializes an EventGear instance.
	 * 
	 * @param {number} [frameDurationSeconds=0] The duration of a frame in seconds.
	 * @param {number} [maxHistorySize=0] The maximum size of the history array.
	 */
	constructor(frameDurationSeconds = 0, maxHistorySize = 0) {
	    super();												// EventTarget super class inheritance
	    if (frameDurationSeconds >= 0) {
		this.#frameDuration = frameDurationSeconds;
	    }
	    if (maxHistorySize >= 0) {
	        this.#maxHistorySize = Math.max(0, Math.min(maxHistorySize, EventGear.MAX_HISTORY_SIZE));
	    }
	    this.#callbacks = new CallbackTracker();								// Create Callback Tracker
	    this.#metrics.micro.setCallbackOnClosure (this._handleMetricsMicroClosure);				// Set handle for millisecond closure
	    this.#node = new NodeBridge();									// Create NodeBridge instance
	    this.#node.setCallback(this._handleNodeAutoReceive);						// Set handle for NodeBridge incoming events
	    this.#websocket = new WebSocketBridge();								// Create WebSocketBridge instance
	    this.#websocket.setCallback(this._handleWebsocketAutoReceive);					// Set handle for WebSocket incoming events
	    this.reset();											// Reset for first init
	}


	// ***** EventGear Internal Methods *****

	// ***** EventGear Internal Methods ***** Independent and Timeframe Update *****

	/**
	 * Starts the independent update interval.
	 * Sets up an interval that updates independent metrics at a specified length.
	 */
 	#startIntervalIndependent() {
	    if (this.#isActive) { // Check if the counter is active before starting
		clearInterval(this.#IntervalIDindependent); // Clear any existing independent intervals

		this.#IntervalIDindependent = setInterval(() => {
		    // Return early if an event is currently being registered
		    if (this.#isEventRegistrationInProgress) {
		        return; // Skip the update if registration is in progress
		    }
		    this.#updateIndependentMetrics(performance.now()); // Call to update independent metrics on current timestamp
		}, this.#independentIntervalLength);
	    }
	}

	/**
	 * Starts the timeframe-based update interval.
	 * Sets up an interval that updates metrics based on the configured timeframe.
	 */
 	#startIntervalTimeframe() {
	    if (this.#isActive && this.#frameDuration > 0) {
		clearInterval(this.#IntervalIDframe); 		// Clear any existing intervals
		const updateIntervalMs = this.#frameDuration * 1000; 	// Convert seconds to milliseconds

		this.#IntervalIDframe = setInterval(() => {
		    if (this.#isEventRegistrationInProgress) {		// Skip the update if an event gets registered
		        return;
		    }
		    this.#updateMetrics(performance.now()); 		// Update metrics based on current timestamp
		}, updateIntervalMs);
	    }
	}

	/**
	 * Stops all internal intervals.
	 * Clears any active timeframe and independent update intervals.
	 */
 	#stopIntervals() {
	    clearInterval(this.#IntervalIDframe); // Clear the timeframe-based interval
	    clearInterval(this.#IntervalIDindependent); // Clear the independent interval
	}


	// ***** EventGear Internal Methods ***** Metrics Updates, Performance Analysis, History and Alarms *****

	/**
	 * Updates all metrics based on the current timestamp.
	 * Performs various calculations related to event metrics, including 
	 * cleaning up old events, updating running time, and checking alarms.
	 *
	 * @param {number} updateTimestamp - The current timestamp used for updating metrics.
	 */
 	#updateMetrics(updateTimestamp) {
		// Clean Up old Timestamps in standard time arrays just holding last minute and second
	    this.#cleanupOldEvents(updateTimestamp);	
		// Update the metrics objects with actual time
	    this.#updateMetricsDataObjects(updateTimestamp);	
		// Calculates and Short Term Average Frequency and jitter based on configurable short-term buffer
   	    this.#updateShortTermFrequency(updateTimestamp);
		// Updates the absolute max frequency that was measured during runtime since init or last reset
	    this.#totalFrequencyMax = Math.max(this.#totalFrequencyMax, this.#metrics.micro.frequency, this.#frameFrequencyLast, this.#shortTermFrequency);
		// Calculate Time needed for all Metrics and Analysis
	    if (this.#eventPerformanceMetricsActive) this.#duration.event.metrics = performance.now() - updateTimestamp;

		// Timeframe analysis. current timeframe metrics and full timeframes closure with alarm, history, etc.
	    this.#updateTimeframeMetrics(updateTimestamp);	
		// Calculate Time needed for timeframe analysis
	    if (this.#eventPerformanceMetricsActive) this.#duration.event.frame = performance.now() - updateTimestamp - this.#duration.event.metrics; 

		// Check for other not timeframe based alarms and thresholds after uptdating the metrics and analysis
	    this.#checkAllAlarms(updateTimestamp);
	    this.#callbacks.checkCallbacks(updateTimestamp);			
		// Calculate Time needed for Last Threshold Alarms and other special callbacks Time
	    if (this.#eventPerformanceMetricsActive) {
	    	this.#duration.event.alarms = performance.now() - updateTimestamp - this.#duration.event.metrics - this.#duration.event.frame; 
	        // Sum Up Last Event Total Execution Time
	    	this.#duration.event.total = this.#duration.event.metrics + this.#duration.event.frame + this.#duration.event.alarms;		 
	        // Sum Up Total Times
	        this.#duration.total.total += this.#duration.event.total; 		// Total EventGear Execution Time
	        this.#duration.total.metrics += this.#duration.event.metrics;     	// Total Metrics, Analysis and History Time
	        this.#duration.total.frame += this.#duration.event.frame; 		// Total Timeframe based Metrics with callbacks time
	    	this.#duration.total.alarms += this.#duration.event.alarms;	       	// Total Threshold Alarms and other special callbacks Time
	        // Sum Up Total Timeframe Times
		if (this.#frameDuration > 0) {
		    this.#duration.frame.total += this.#duration.event.total; 		// Timeframe EventGear Execution Time
		    this.#duration.frame.metrics += this.#duration.event.metrics; 	// Timeframe Metrics, Analysis and History Time
		    this.#duration.frame.frame += this.#duration.event.frame;		// Timeframe Metrics, Analysis and History with callbacks time
		    this.#duration.frame.alarms += this.#duration.event.alarms;		// Timeframe Threshold Alarms and other special callbacks Time
		}
	    }
	}
	
	/**
	 * Updates all metrics based on the independent internal interval.
	 * Calls the general metrics update method.
	 *
	 * @param {number} updateTimestamp - The current timestamp used for updating metrics.
	 */
	#updateIndependentMetrics(updateTimestamp) {
	    this.#updateMetrics(updateTimestamp);
	}
	
	/**
	 * Updates metrics data objects
	 *
	 * @param {number} updateTimestamp - The current timestamp used for calculating running time.
	 */
 	#updateMetricsDataObjects(updateTimestamp) {
 	    this.#metrics.micro.update(updateTimestamp);
 	    this.#metrics.frame.update(updateTimestamp);
	}

	/**
	 * Updates metrics for the current timeframe.
	 * Calculates and updates various metrics related to the current timeframe,
	 * including frequency, jitter, and event counts.
	 *
	 * @param {number} updateTimestamp - Current timestamp in milliseconds.
	 */
 	#updateTimeframeMetrics(updateTimestamp) {
	    const elapsedSeconds = (updateTimestamp - this.#timestampFrameStart) / 1000; 	// Calculate elapsed time in seconds
	    if (this.#isEventRegistrationInProgress) {
	        this.#frameTimestampArray.push(updateTimestamp); 				// Log the timestamp of the current event
	    }
	    // Determine minimum time elapsed to update frequency
	    const minTimeElapsed = this.#frameDuration > 0 
		? this.#frameDuration / 10 
		: this.#independentIntervalLength / 1000;

	    // If no timeframe is set, calculate current frequency directly
	    if (this.#frameDuration === 0) {
		this.#frameFrequency = this.#metrics.micro.frequency; 
	    } else {
		// Update frequency for the current timeframe
		if (elapsedSeconds > minTimeElapsed) {
		    // Calculate frequency based on events
		    const newFrequency = calculateFrequency(this.#metrics.frame.events, elapsedSeconds); 

		    // Smooth out transitions using weighted average or exponential smoothing
		    this.#frameFrequency = 
		        (this.#TimeframeFrequencySmoothFactor * newFrequency) + 
		        ((1 - this.#TimeframeFrequencySmoothFactor) * this.#frameFrequencyLast);
		} else {
		    // Retain direct frequency if not enough time has passed
		    this.#frameFrequency = this.#metrics.micro.frequency; 
		}

		// Cap the frequency at the dynamic maximum allowed derived by former max
		if (this.#frameFrequency > this.#totalFrequencyMax) {
		    this.#frameFrequency = this.#frameFrequencyLast; // Retain last timeframe frequency if exceeding max
		}
	    }

	    if (this.#frameDuration > 0) {
		// Check if the timeframe has completed
		if (elapsedSeconds >= this.#frameDuration) { 
		    // Calculate jitter
		    this.#frameJitter = calculateJitter(this.#frameTimestampArray);

		    if (this.#maxHistorySize > 0) {
		        // Add data to history if max history size is set
	    	        if (this.#eventPerformanceMetricsActive) {
				this.#addToHistory({ 
				    timestamp: updateTimestamp,					// Time of Closure
				    timeframeCount: this.#totalFrameCount, 				// Number of timeframe
				    events: this.#metrics.frame.events, 			// Events count in timeframe
				    frequency: this.#frameFrequency, 				// frequency of timeframe
				    jitter: this.#frameJitter, 					// jitter of timeframe
			    	    timeExecution: this.#duration.frame.total, 			// Timeframe EventGear Execution Time
			    	    timeMetrics: this.#duration.frame.metrics, 			// Timeframe Metrics, Analysis and History Time
			    	    timeFrameMetrics: this.#duration.frame.frame,		// Timeframe Metrics, Analysis and History with callbacks time
			    	    timeAlarmCallbacks: this.#duration.frame.alarms, 		// Timeframe Threshold Alarms and other special callbacks Time
			    	    timeResponseCall: this.#duration.frame.response,		// Total Event Response Callback Execution Time
			    	    timeMetadataCall: this.#duration.frame.metadata	 	// Total Metadata Change Callback Execution Time
				});
			} else {
				this.#addToHistory({ 
				    timestamp: updateTimestamp,					// Time of Closure
				    timeframeCount: this.#totalFrameCount, 				// Number of timeframe
				    events: this.#metrics.frame.events, 			// Events count in timeframe
				    frequency: this.#frameFrequency, 				// frequency of timeframe
				    jitter: this.#frameJitter, 					// jitter of timeframe
				});
			}
		    }

		    // Reset for next timeframe
		    this.#frameFrequencyLast = this.#frameFrequency;				// Store last timeframe's frequency
		    this.#metrics.frame.reset();						// reset timeframe metrics
		    this.#timestampFrameStart = updateTimestamp;				// Reset start time for the next timeframe
		    this.#frameTimestampArray = []; 						// Clear current timeframe events
		    this.#totalFrameCount++; 							// Increment completed timeframe count
	    	    if (this.#eventPerformanceMetricsActive) {
		        this.#duration.frame.reset();						// Reset timeframe performance metrics
		    }
		    // Check alarms based on new metrics including jitter
		    this.#checkTimeframeAlarms(this.#frameFrequencyLast, this.#frameJitter, this.#metrics.frame.events); 
		}	
	    }
	}
	
	/**
	 * Removes old event timestamps.
	 * Cleans up timestamps from compressed buffer that are older than one minute or timeframe length if bigger
	 *
	 * @param {number} updateTimestamp - Current timestamp used for cleanup.
	 */
	#cleanupOldEvents(updateTimestamp) {
	    const oneMinuteAgo = updateTimestamp - 60000;
	    // Cleanup for compressed buffer based on timeframe or last minute
	    const cleanupThreshold = this.#frameDuration > 60 ? updateTimestamp - this.#frameDuration * 1000 : oneMinuteAgo;
	    this.#microTimestampBuffer.clean(cleanupThreshold);
	}

	/**
	 * Adds timeframe data to history if applicable.
	 * Stores the provided timeframe data in history, ensuring
	 * that the history size does not exceed the maximum limit.
	 *
	 * @param {Object} timeframeData - Data to store in history.
	 */
 	#addToHistory(timeframeData) {
 	    if (this.#frameDuration === 0) return;
	    if (this.#maxHistorySize > 0) {
		if (this.#frameHistory.length >= this.#maxHistorySize) {
		    this.#frameHistory.shift();
		    this.#exceedancesHistory.shift();
		}
		this.#frameHistory.push(timeframeData);
		this.#exceedancesHistory.push(this.#getCurrentExceedances());
	    }
	}


	// ***** EventGear Internal Methods ***** Frequency Management *****

	/**
	 * Updates short-term frequency and jitter based on the last events.
	 * Calculates short-term metrics based on recent event timestamps,
	 * including frequency and jitter, while managing buffer sizes and inactivity.
	 *
	 * @param {number} updateTimestamp - Current timestamp used for updating metrics.
	 */
 	#updateShortTermFrequency(updateTimestamp) {
	    // Do nothing if buffer size is 0
	    if (this.#shortTermBufferSize === 0) {
		return;
	    }

	    const inactivityThreshold = 1000; // 1 second inactivity threshold

	    // Check for inactivity
	    if (this.#shortTermEventTimestamps.length > 0) {
		const lastTimestamp = this.#shortTermEventTimestamps[this.#shortTermEventTimestamps.length - 1];
		const interval = updateTimestamp - lastTimestamp;

		if (interval > inactivityThreshold) {
		    // Clear the buffer but keep its size
		    this.#shortTermEventTimestamps = [];
		    this.#shortTermFrequency = 0;
		    this.#shortTermJitter = 0;
		}
	    }

	    // Add current timestamp to buffer
	    if (this.#isEventRegistrationInProgress) {
		this.#shortTermEventTimestamps.push(updateTimestamp);
	    }

	    // Trim buffer if it exceeds the set size
	    if (this.#shortTermEventTimestamps.length > this.#shortTermBufferSize) {
		this.#shortTermEventTimestamps = this.#shortTermEventTimestamps.slice(-this.#shortTermBufferSize);
	    }

	    // Determine minimum required values for frequency calculation based on buffer size
	    const minRequiredValues = this.#shortTermBufferSize <= 10 ? 2 : 5;

	    // Calculate metrics if we have enough timestamps
	    if (this.#shortTermEventTimestamps.length >= minRequiredValues) {
		const timeDifference = (this.#shortTermEventTimestamps[this.#shortTermEventTimestamps.length - 1] - this.#shortTermEventTimestamps[0]) / 1000;

		if (timeDifference > 0.3) {
		    this.#shortTermFrequency = (this.#shortTermEventTimestamps.length - 1) / timeDifference;
		    this.#shortTermJitter = calculateJitter(this.#shortTermEventTimestamps);
		} else {
		    this.#shortTermFrequency = this.#metrics.micro.frequencyLast;
		    this.#shortTermJitter = this.#metrics.micro.jitterLast;
		}
	    }
	}


	// ***** EventGear Internal Methods ***** Callback Alarm Checks *****

	/**
	 * Checks all alarms based on current metrics and thresholds.
	 *
	 * @param {number} updateTimestamp - Current timestamp used for alarm checks.
	 */
 	#checkAllAlarms(updateTimestamp) {
	    this.#checkTotalCountAlarm();			// Check the total event count callback
	    this.#checkTotalTimeAlarm();			// Check the total running time callback
	    this.#checkIntervalAlarms(updateTimestamp);		// Check interval based repeated callbacks
	    this.#checkFrequencyAlarm(); 			// Add this line to check short-term frequency
	}

	/**
	 * Checks alarms specific to the current timeframe and triggers them if necessary.
	 *
	 * @param {number} frequency - Current frequency for the timeframe.
	 * @param {number} jitter - Current jitter for the timeframe.
	 * @param {number} events - Number of events in the timeframe.
	 */
 	#checkTimeframeAlarms(frequency, jitter, events) {
	    // Check if jitter exceeds threshold
	    this.jittercheckTrueCount = this.#checkThreshold(jitter, this.jitterThreshold, this.jitterAlarmCallback, this.jittercheckTrueCount, true);
	    // Check if frequency is within thresholds
	    this.frequencycheckTrueCountLower = this.#checkThreshold(frequency, this.frequencyLowerThreshold,
		this.frequencyAlarmCallback, this.frequencycheckTrueCountLower, false);

	    this.frequencycheckTrueCountUpper = this.#checkThreshold(frequency, this.frequencyUpperThreshold,
		this.frequencyAlarmCallback, this.frequencycheckTrueCountUpper, true);
	    // Max Events alarms
	    this.maxEventscheckTrueCountLower = this.#checkThreshold(events, this.maxEventsPerFrameLowerThreshold,
		this.maxEventsPerFrameAlarmCallback, this.maxEventscheckTrueCountLower, false);

	    this.maxEventscheckTrueCountUpper = this.#checkThreshold(events, this.maxEventsPerFrameUpperThreshold,
	    	this.maxEventsPerFrameAlarmCallback, this.maxEventscheckTrueCountUpper, true);
	}

	/**
	 * Checks total count alarm based on event count threshold.
	 * Triggers the alarm callback if the total event count matches the threshold.
	 */
	#checkTotalCountAlarm() {
	    // Check if total count matches threshold while a new event is being registered
	    if (
		this.#totalCountThreshold > 0 &&
		this.#metrics.micro.events === this.#totalCountThreshold &&
		this.#isEventRegistrationInProgress
	    ) {
		// Trigger callback if not already triggered
		if (this.#totalCountAlarmCallback && !this.#totalCountAlarmTriggered) {
		    this.#totalCountAlarmTriggered = true;
		    this.metaCall(this.#totalCountAlarmCallback);
		}
	    }
	}

	/**
	 * Checks total time alarm based on running time threshold.
	 * Triggers the alarm callback if the running time exceeds the threshold.
	 */
 	#checkTotalTimeAlarm() {
	    if (
		this.#totalTimeThreshold > 0 &&
		this.#metrics.micro.seconds >= this.#totalTimeThreshold
	    ) {
		if (this.#totalTimeAlarmCallback && !this.#totalTimeAlarmTriggered) {
		    this.#totalTimeAlarmTriggered = true;
		    this.metaCall(this.#totalTimeAlarmCallback);
		}
	    }
	}

	/**
	 * Checks interval-based alarms for time and count thresholds.
	 *
	 * @param {number} updateTimestamp - Current timestamp used for checking alarms.
	 */
	#checkIntervalAlarms(updateTimestamp) {
	    // Check time-based alarm
	    this.#intervalTimeThreshold = this.#checkIntervalAlarm(updateTimestamp, this.#TotalTimeIntervalAlarm,
		this.#intervalTimeThreshold, this.#IntervalTimeAlarmCallback, (threshold, interval) => threshold + interval
	    );
	    if (this.#intervalTimeThreshold === 0) {
		this.#TotalTimeIntervalAlarm = 0;
		this.#IntervalTimeAlarmCallback = null;
	    }

	    // Check count-based alarm
	    if (this.#eventCallbackIntervalCountActivated) {
  	        this.#intervalCountThreshold = this.#checkIntervalAlarm(this.#metrics.micro.events,
		    this.#EventCountIntervalAlarm, this.#intervalCountThreshold,
		    this.#IntervalCountAlarmCallback, (threshold, interval) => threshold + interval
	        );
	    }
	    if (this.#intervalCountThreshold === 0) {
		this.#EventCountIntervalAlarm = 0;
		this.#IntervalCountAlarmCallback = null;
	    }
	}

	/**
	 * Checks Frequency Alarm based on short-term frequency against thresholds.
	 * Triggers the frequency alarm callback if thresholds are exceeded.
	 */
	#checkFrequencyAlarm() {
	    // Exit early if both thresholds are deactivated or no callback is set
	    if ((this.#frequencyLowerThreshold === 0 && this.#frequencyUpperThreshold === 0) || 
		typeof this.#frequencyAlarmCallback !== 'function') {
		return;
	    }
	    // Check against lower threshold only if it's greater than 0
	    if (this.#frequencyLowerThreshold > 0 && this.#shortTermFrequency <= this.#frequencyLowerThreshold) {
	    	this.metaCall(this.#frequencyAlarmCallback);
	    }
	    // Check against upper threshold only if it's greater than 0
	    if (this.#frequencyUpperThreshold > 0 && this.#shortTermFrequency >= this.#frequencyUpperThreshold) {
	    	this.metaCall(this.#frequencyAlarmCallback);
	    }
	}

	/**
	 * Checks and updates a single threshold interval alarm and executes callback in case.
	 * Sets the next threshold for repeated interval alarms 
	 * 
	 * @param {number} currentValue - Current value to check against threshold.
	 * @param {number} interval - Interval for the alarm.
	 * @param {number} threshold - Current threshold for the alarm.
	 * @param {function} [callback] - Optional callback to invoke when alarm is triggered.
	 * @param {function} updateThreshold - Function to update the threshold.
	 * @returns {number} Updated threshold or 0 if alarm is reset.
	 * @private
	 */
	#checkIntervalAlarm(currentValue, intervalLength, threshold, callback, updateThreshold) {
	    if (intervalLength <= 0 || threshold <= 0) {
		return 0;
	    }
	    let checkTrueCounter = 0;
	    checkTrueCounter = this.#checkThreshold(currentValue, threshold, callback, checkTrueCounter);
	    if (checkTrueCounter > 0) {
		const MAX_ITERATIONS = 100;
		let iterationCount = 0;
		do {
		    threshold = updateThreshold(threshold, intervalLength);
		    iterationCount++;
		    if (iterationCount >= MAX_ITERATIONS) {
		        console.warn('Maximum threshold update iterations reached');
		        break;
		    }
		} while (threshold <= currentValue);
	    }
	    return threshold;
	}

	/**
	 * Checks if a value exceeds or underruns a threshold and executes a callback if it does.
	 *
	 * @param {number} value - The value to check.
	 * @param {number} threshold - The threshold to compare against.
	 * @param {function} [callback] - Optional callback to execute if threshold is exceeded.
	 * @param {number} checkTrueCounter - Counter for threshold exceedances.
	 * @param {boolean} [isUpperThreshold=true] - Specify upper (true) or lower (false) threshold check.
	 * @returns {number} Updated exceedance counter.
	 * @private
	 */
	#checkThreshold(value, threshold, callback, checkTrueCounter, isUpperThreshold = true) {
	    // Fast return if threshold is 0 or negative (deactivated)
	    if (threshold <= 0) {
		return checkTrueCounter;
	    }
	    if ((isUpperThreshold && value >= threshold) || (!isUpperThreshold && value <= threshold)) {
		checkTrueCounter++;
		if (typeof callback === 'function') this.metaCall(callback);
	    }
	    return checkTrueCounter;
	}


	// ***** EventGear Internal Methods ***** Exceedance Tracking *****

	/**
	 * Returns current exceedance counts for various metrics.
	 *
	 * @returns {Object} Object containing exceedance counts for different metrics.
	 */
 	#getCurrentExceedances() {
	    return {
		jitter: this.#jittercheckTrueCount,
		frequencyLower: this.#frequencycheckTrueCountLower,
		frequencyUpper: this.#frequencycheckTrueCountUpper,
		maxEventsLower: this.#maxEventscheckTrueCountLower,
		maxEventsUpper: this.#maxEventscheckTrueCountUpper
	    };
	}

	/**
	 * Adds initial entries to history arrays at startup or reset.
	 */
 	#addInitialEntries() {
	    if (this.#maxHistorySize > 0) {
		const initialEntry = { 
		    timeframeCount: this.#totalFrameCount, 
		    jitter: null, 
		    frequency: null, 
		    events: null 
		};
		this.#frameHistory.push(initialEntry);
		this.#exceedancesHistory.push(this.#getCurrentExceedances());
	    }
	}


	// ***** EventGear Internal Methods ***** Helper Methods *****

	/**
	 * Helper method to set a threshold value.
	 * Returns the threshold if valid, otherwise returns 0.
	 *
	 * @param {number} threshold - The threshold value to validate.
	 * @returns {number} The validated threshold or 0 if invalid.
	 */
	#helperSetThreshold(threshold) {
	    return (typeof threshold === 'number' && !isNaN(threshold) && threshold >= 0) ? threshold : 0;
	}

	// ***** EventGear Internal Methods ***** Metadata handling and tracking *****

	/**
	 * Updates metadata and checks for changes.
	 *
	 * @param {*} newMetadata - New metadata to be set.
	 * @returns {boolean} True if metadata changed, false otherwise.
	 */
	 
 	#updateMetadata(newMetadata) {
	    // Store previous metadata and update to new metadata
	    this.#metadataPrevious = this.#metadata;
	    this.#metadata = newMetadata;

	    // Compare current and previous metadata for changes
	    return JSON.stringify(this.#metadata) !== JSON.stringify(this.#metadataPrevious);
	}


	// ***** EventGear Sub Class Public Interface ***** Internal Handles for Callbacks from Sub Classes *****

	/**
	 * Gets callback on closure of milliseconds timeframes from micro metrics class.
	 *
	 * @param {Object} data - The data object passed from the callback.
	 */
	_handleMetricsMicroClosure = (data) => {
	    // Add the timestamp and event count to the rolling buffer
	    const { timestamp, eventsLast } = data;
	    if (eventsLast > 0) this.#microTimestampBuffer.addEntry(timestamp, eventsLast);
	};

	/**
	 * Gets callback on incoming websocket Events if Auto-Receive is activated
	 *
	 * @param {Object} eventData - The data object passed from the callback.
	 */
	_handleWebsocketAutoReceive = (eventData) => {
	    this.registerEvent(eventData);
	};

	/**
	 * Gets callback on incoming node.js Events if Auto-Receive is activated
	 *
	 * @param {Object} eventData - The data object passed from the callback.
	 */
	_handleNodeAutoReceive = (eventData) => {
	    this.registerEvent(eventData);
	};


	// ***** EventGear Public Interface ***** Main State Control Methods *****

	/**
	 * Starts event counting and handling the callback execution
	 * Initializes timers and historical data if applicable.
	 *
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	start() {
	    if (this.#isActive) return this; 					// Already active, cannot start again
	    this.#isActive = true;
	    if (!this.#timestampStart || this.#timestampStart === 0) {
	        this.#timestampStart = performance.now(); 			// Record the start time
	    }
	    if (!this.#timestampFrameStart || this.#timestampFrameStart === 0) {
	        this.#timestampFrameStart = this.#timestampStart;		// Initialize last timeframe start time
	        if (this.#frameDuration > 0 && this.#maxHistorySize > 0) { 	// Add initial entries to history if applicable
		    this.#addInitialEntries();
	        }
	    }
	    this.#startIntervalTimeframe();					// Start Timeframe based Interval for metrics update and alarms
	    this.#startIntervalIndependent();					// Start Independent Parameter based Interval for updates
	    return this;
	}

	/**
	 * Stops event counting while maintaining the last state.
	 * Halts all active timers, data collection and callback execution.
	 *
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	stop() {
	    if (this.#isActive) {
		this.#isActive = false;
		this.#stopIntervals();						// Stop both internal intervals
	    }
	    return this;
	}

	// ***** EventGear Public Interface ***** Event Registration *****

	/**
	 * Registers an incoming event with optional metadata.
	 * This method is asynchronous and will wait for any ongoing registration to complete before processing.
	 *
	 * @param {*} metadata - Optional metadata associated with the event.
	 * @returns {Promise<EventGear>} A promise that resolves to the EventGear instance for chaining.
	 */
 	async registerEvent(metadata = null) {
	    if (!this.#isActive) return this;					// Check if EventGear instance is activated
	    if (this.#isEventRegistrationInProgress) {
		await this.#eventRegistrationPromise;				// Wait for ongoing registration process to complete
	    }
	    this.#isEventRegistrationInProgress = true; 			// Mark that an event is being registered
	    this.#eventRegistrationPromise = new Promise((resolve) => {		// Create a promise to manage the registration process
		try {
		    const timestampEvent = performance.now(); 			// Save Timestamp of last incoming Event
		    let metadataChanged = false;
		    if (metadata !== null) {					// Store metadata first to ensure dataflow
		        metadataChanged = this.#updateMetadata(metadata); 	// Update metadata and check for changes
		    }
		    this.#metrics.micro.add(timestampEvent); 			// Add timestamp to total metrics
		    if (this.#frameDuration > 0) {
		        this.#metrics.frame.add(timestampEvent); 		// Add timestamp to timeframe metrics
		    }

		    // Update metrics with performance analysis and timeframe history and trigger alarm callbacks
		    this.#updateMetrics(timestampEvent);
		
		    // Event response callback
  		    if (this.#eventCallbackResponseActivated && this.#EventCallback) {
			this.metaAsyncCall(this.#EventCallback);
		        // Calculate Last Event Response Callback Execution Time and update Overall Execution
		        if (this.#eventPerformanceMetricsActive) {
			    this.#duration.event.response = performance.now() - timestampEvent - this.#duration.event.total;
			    this.#duration.event.total += this.#duration.event.response;
		        }
		    } else {
		        if (this.#eventPerformanceMetricsActive) this.#duration.event.response = 0;
		    }

		    // Metadata change callback
	            if (this.#eventCallbackMetadataActivated && metadataChanged && this.#metadataChangeCallback) {
			this.asyncCallback(this.#metadataChangeCallback, this.#metadata, this.#metadataPrevious);
		        // Calculate Metadata change Callback Execution Time and update Overall Execution, total and Timeframe
		        if (this.#eventPerformanceMetricsActive) {
			    this.#duration.event.metadata = performance.now() - timestampEvent - this.#duration.event.total;
			    this.#duration.event.total += this.#duration.event.metadata;
		        }
	            } else {
		        if (this.#eventPerformanceMetricsActive) this.#duration.event.metadata = 0;
	            }

		    if (this.#eventPerformanceMetricsActive) {
			// Update total execution times
			const additionalExecution = this.#duration.event.response + this.#duration.event.metadata;
			this.#duration.total.total += additionalExecution;
		        if (this.#frameDuration > 0) {
		    	    // Update timeframe sums
		    	    this.#duration.frame.total += additionalExecution;			// Timeframe Event Overall Execution Time
 			    this.#duration.frame.response += this.#duration.event.response;	// Timeframe Event Response Callback Execution Time
			    this.#duration.frame.metadata += this.#duration.event.metadata;	// Timeframe Metadata Change Callback Execution Time
		        }
		    }

		    // Automatically send event if websocket and outgoing channel and auto send are active
		    if (this.#websocket.outgoingWsIsActive && this.#websocket.autoSend && this.#websocket.channelOut) {
		        this.websocket.sendEvent(metadata); // Emit an event on the outgoing channel with metadata
		    }
		    // Automatically send event if node.js and outgoing channel and auto send are active
		    if (this.#node.nodeIsActive && this.#node.autoSend && this.#node.channelOut) {
		        this.node.sendEvent(metadata); // Emit an event on the outgoing channel with metadata
		    }
		    // Clear incoming Event Update Registration
		    this.#isEventRegistrationInProgress = false;

		    // Resolve promise indicating successful registration
  		    resolve(true);
		} catch (error) {
		    console.error('Error during event registration:', error);
		    this.#isEventRegistrationInProgress = false;
		    resolve(false); // Resolve with false on error
		}
	    });
	    await this.#eventRegistrationPromise; // Wait for promise resolution before returning
	    return this;
	}

	/**
	 * Registers multiple events iteratively with optional metadata.
	 * This method is asynchronous.
	 *
	 * @param {number} count - The number of events to register (1 to MAX_BATCH_EVENTS).
	 * @param {*} metadata - Optional metadata associated with each event.
	 * @param {boolean} [updateMetadata=false] - Whether to update metadata for each event with additional BatchEvent Counter.
	 * @returns {Promise<EventGear>} A promise that resolves to the EventGear instance for chaining.
	 */
	async registerMultipleEvents(count, metadata = null, updateMetadata = false) {
	    // Validate input count: must be greater than 0 and less than or equal to MAX_BATCH_EVENTS
	    if (count <= 0 || count > EventGear.MAX_BATCH_EVENTS) {
		console.warn("Count must be greater than 0 and less than or equal to " + EventGear.MAX_BATCH_EVENTS);
		return this; // Exit if count is invalid
	    }
	    // Iterate to register each event
	    for (let i = 0; i < count; i++) {
		try {
		    // Create a copy of metadata if we are updating it to add "BatchEvent" and count
		    const eventMetadata = updateMetadata ? { ...metadata, action: `BatchEvent ${i + 1}` } : metadata;
		    await this.registerEvent(eventMetadata); 		// Wait for the event registration to complete
		} catch (err) {
		    console.error("Error registering event:", err); 	// Log any errors during registration
		}
	    }
	    return this;
	}

	// ***** EventGear Public Interface ***** DOM Elements Event Listeners *****

	/**
	 * Sets up an event listener on the specified DOM element with unified event logic response callback.
	 * 
	 * This method links a DOM element and event type to the EventGear instance. All linked elements
	 * will share the same unified callback logic. If a new callback is provided, it will overwrite any
	 * previously set callback for all linked elements.
	 * 
	 * Existing listeners on the same element and event type will be cleared before adding the new listener
	 * to avoid duplication.
	 *
	 * @param {HTMLElement} element - The DOM element to attach the listener to.
	 * @param {string} eventType - The type of event to listen for (e.g., 'click').
	 * @param {function} [ListenerEventCallback=null] - Optional callback function to execute on event response.
	 *     If provided, this will overwrite any previously set callback for all linked elements.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	async linkEventListener(element, eventType, ListenerEventCallback = null) {
	    try {
		// Validate inputs
		if (!(element instanceof HTMLElement) || typeof eventType !== 'string') {
		    console.warn('Invalid input for linkEventListener');
		    return this;
		}
		// Clear existing listeners for this element and event type
		this.clearEventListener(element, eventType);
		// Overwrite the shared callback if a new one is provided
		if (ListenerEventCallback) {
		    this.setCallbackEvent(ListenerEventCallback);
		}
		// Create a unified listener that calls registerEvent with the event
		const listener = async (event) => {
		    await this.registerEvent(event);
		};
		// Add the new listener
		element.addEventListener(eventType, listener);
		// Store the new listener information
		this.#DOMelements.push(element);
		this.#DOMeventTypes.push(eventType);
		this.#DOMlisteners.push(listener);
	    } catch (error) {
		console.error('Error setting listener:', error.message);
	    }
	    return this; // Return for chaining
	}

	/**
	 * Clears all event listeners for a specific DOM element and event type.
	 * @param {Element} element - The DOM element to remove listeners from.
	 * @param {string} eventType - The type of event to remove.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	clearEventListener(element, eventType) {
	    try {
		for (let i = this.#DOMelements.length - 1; i >= 0; i--) {
		    if (this.#DOMelements[i] === element && this.#DOMeventTypes[i] === eventType) {
		        this.#DOMelements[i].removeEventListener(this.#DOMeventTypes[i], this.#DOMlisteners[i]);
		        this.#DOMelements.splice(i, 1);
		        this.#DOMeventTypes.splice(i, 1);
		        this.#DOMlisteners.splice(i, 1);
		    }
		}
	    } catch (error) {
		console.error('Error clearing listeners:', error.message);
	    }
	    return this;
	}

	/**
	 * Reset all current event listeners from the DOM elements.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	resetEventListeners() {
	    try {
                while (this.#DOMelements.length > 0) {
                    const element = this.#DOMelements.pop();
                    const eventType = this.#DOMeventTypes.pop();
                    const listener = this.#DOMlisteners.pop();
                    element.removeEventListener(eventType, listener);
                }
	    } catch (error) {
		console.error('Error removing listeners:', error.message);
	    }
	    return this; // Return for chaining
	}


	// ***** EventGear Public Interface ***** Direct Callbacks with metadata *****

	/**
	 * Simple synchronous callback method with optional metadata passing
	 * @param {Function} fn - Callback function
	 * @param {...any} args - Optional arguments to pass to the callback function
	 * @returns {EventGear} Current instance for chaining
	 */
	metaCall(fn, ...args) {
	    if (typeof fn !== 'function') return this;
	    return executeCallback(fn, ...(args.length ? args : [this.#metadata]));
	}

	/**
	 * Simple asynchronous callback method with optional metadata passing
	 * @param {Function} fn - Callback function
	 * @param {...any} args - Optional arguments to pass to the callback function
	 * @returns {Promise<EventGear>} Promise resolving to current instance
	 */
	async metaAsyncCall(fn, ...args) {
	    if (typeof fn !== 'function') return this;
	    return executeAsyncCallback(fn, ...(args.length ? args : [this.#metadata]));
	}
		
	// ***** EventGear Public Interface ***** Event Response Callbacks *****

	/**
	 * Event Callback Method
	 * Calls back on an incoming event.
	 *
	 * @param {function} callback - The callback function to invoke on incoming events.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	setCallbackEvent(callback) {
	    // Check if the provided callback is a function
	    if (typeof callback === 'function') {
		this.#EventCallback = callback; // Assign the valid callback
	    } else {
		this.#EventCallback = null; // Set to null if not a function
		console.warn('Invalid callback provided. Callback must be a function.');
	    }
	    return this;
	}

	/**
	 * Toggles the activation state of the default event response callback.
	 *
	 * @param {boolean} isActive - The state to set for the event response callback.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	setCallbackIsActivatedEventResponse(isActive) {
	    this.#eventCallbackResponseActivated = isActive; // Toggle the state for default event response callback.
	    return this;
	}

	/**
	 * Event Callback Reset Method
	 * Clears the callback function and resets the activation state to default.
	 *
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	resetCallbackEvent() {
	    this.#EventCallback = null;
	    return this;
	}

	/**
	 * Sets the metadata change callback function.
	 *
	 * @param {function} callback - The callback function to invoke on metadata changes.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	setCallbackMetadataChange(callback) {
	    // Check if the provided callback is a function
	    if (typeof callback === 'function') {
		this.#metadataChangeCallback = callback; // Assign the valid callback
	    } else {
		this.#metadataChangeCallback = null; // Set to null if not a function
		console.warn('Invalid callback provided. Callback must be a function.');
	    }
	    return this;
	}

	/**
	 * Toggles the activation state of the metadata change callback.
	 *
	 * @param {boolean} isActive - The state to set for the metadata change callback.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	setCallbackIsActivatedMetadataChange(isActive) {
	    this.#eventCallbackMetadataActivated = isActive; // Toggle the state for metadata change callback.
	    return this;
	}

	/**
	 * Resets the metadata change callback and its activation state.
	 * Setting the activation state to true indicates that it is in default mode and ready for a new setup.
	 *
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	resetCallbackMetadataChange() {
	    this.#metadataChangeCallback = null; // Clear the callback
	    return this;
	}

	// ***** EventGear Public Interface ***** Reset methods *****
	
	/**
	 * Resets all metrics, counters, and historical data in the EventGear instance to their initial states,
	 * while maintaining all event callback responses, thresholds, alarm callbacks and config settings
	 *
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
 	reset() {
		this.#timestampStart = performance.now(); 		// Set start time to current timestamp
		this.#timestampFrameStart = this.#timestampStart; 	// Set last timeframe start time
		// Event Registration
		this.#isEventRegistrationInProgress = false; 		// Clear incoming event state to false
		this.#eventRegistrationPromise = null; 			// Clear registration promise	
		// Reset Metadata variables
		this.#metadata = null;					// Clear Event Metadata
		this.#metadataPrevious = null;				// Clear previous Event Metadata
		// Metrics and Performance Objects
		this.#metrics.micro.reset();				// Reset micro metrics data
		this.#metrics.frame.reset();				// Reset timeframe metrics data
		this.#microTimestampBuffer.reset();			// Reset the rolling timestamp-count buffer
		this.#duration.event.reset();				// Reset Event Execution Time Metrics
		this.#duration.total.reset();				// Reset Total Execution Time Metrics
		this.#duration.frame.reset();				// Reset Frame Execution Time Metrics
		// Metrics and Performance Counters
		this.#totalFrameCount = 0;					// Reset completed timeframe count
		this.#frameFrequencyLast = 0; 				// Reset last timeframe frequency
		this.#totalFrequencyMax = 0; 				// Reset maximum frequency observed
		this.#frameFrequency = 0; 				// Reset frequency for the current timeframe
		this.#shortTermFrequency = 0; 				// Short-term frequency
		this.#shortTermJitter = 0; 				// Short-term jitter
		// Timestamps and history arrays
		this.#shortTermEventTimestamps.length = 0; 		// Clear buffer for short-term event timestamps efficiently
		this.#frameTimestampArray.length = 0;			// Clear current timeframe events efficiently
		this.#exceedancesHistory.length = 0; 			// Clear exceedances history efficiently
		this.#frameHistory.length = 0;				// Clear timeframe history efficiently
		// Reset exceedance counts
		this.#callbacks.resetMetrics();				// Reset all checks and callbacks metrics 
		this.#jittercheckTrueCount = 0;
		this.#frequencycheckTrueCountLower = 0;
		this.#frequencycheckTrueCountUpper = 0;
		this.#maxEventscheckTrueCountLower = 0;
		this.#maxEventscheckTrueCountUpper = 0;
		if (this.#frameDuration > 0 && this.#maxHistorySize > 0) {
			this.#addInitialEntries(); 			// Add initial entries to history if applicable
		}
	        return this;
	}

	/**
	 * Resets all callback thresholds, trigger states, and callbacks to their initial values.
	 * Maintains default event response callback and metadata callback
	 *
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
 	resetCallbacksWithTresholds() {
	    // Resets only the alarm thresholds and callbacks.
	    this.#jitterThreshold = 0;
	    this.#frequencyLowerThreshold = 0;
	    this.#frequencyUpperThreshold = 0;
	    this.#maxEventsPerFrameLowerThreshold = 0;
	    this.#maxEventsPerFrameUpperThreshold = 0;
	    // Absolute callback values for total count and running time		
	    this.#totalTimeThreshold = 0;
	    this.#totalCountThreshold = 0;
	    this.#totalTimeAlarmTriggered = false; 	// flag that the running time callback has been triggered
	    this.#totalCountAlarmTriggered = false;	// flag that the event count callback has been triggered
	    // Repeated callback intervals and next values for total count and running time
	    this.#intervalTimeThreshold = 0;
	    this.#TotalTimeIntervalAlarm = 0;
	    this.#intervalCountThreshold = 0;
	    this.#EventCountIntervalAlarm = 0;	    
	    // Clear alarm callbacks
	    this.#jitterAlarmCallback = null;
	    this.#frequencyAlarmCallback = null;
	    this.#maxEventsPerFrameAlarmCallback = null;
	    this.#totalTimeAlarmCallback = null;
	    this.#totalCountAlarmCallback = null;
	    this.#IntervalTimeAlarmCallback = null;
	    this.#IntervalCountAlarmCallback = null;
	    this.#callbacks.reset();			// Reset all checks and callbacks	    
	    return this;
	}

	/**
	 * Resets all counters, event callbacks, alarm callbacks, DOM element listeners and node.js connections.
	 * Basic configuration settings are not affected.
	 *
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	resetEventGear() {
	    this.reset();      			// Reset all counters and historical data
	    this.resetCallbackEvent(); 		// Reset the event callback
	    this.resetCallbackMetadataChange(); // Reset the Metadata Change callback
	    this.resetCallbacksWithTresholds(); // Reset all alarm thresholds and callbacks
	    this.#node.reset();			// Reset the node.js bridge
	    this.#websocket.reset();		// Reset the websocket bridge
	    this.resetEventListeners();		// Reset the element listener and clear DOM Element and event
	    return this;
	}

	/**
	 * Resets all special configurations to their default values, while maintaining timeframe and history configurations.
	 *
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
 	resetEventGearConfigurations() {
	    this.#shortTermBufferSize = EventGear.DEFAULT_BUFFER_SIZE; 			  	// Short term buffer size
            this.#independentIntervalLength = EventGear.DEFAULT_INTERVAL_LENGTH; 	        // Duration of independent interval in milliseconds
	    this.#TimeframeFrequencySmoothFactor = EventGear.DEFAULT_SMOOTHING_FACTOR;	  	// Frequency Smoothing Factor for time frame based analysis
	    this.#eventPerformanceMetricsActive = EventGear.DEFAULT_PERFORMANCE_METRICS_ACTIVE;	// State if performance time gets calculated and logged
	    this.#eventCallbackResponseActivated = EventGear.CALLBACK_EVENT_RESPONSE_ACTIVE;   	// State if event default callback response is activated
	    this.#eventCallbackMetadataActivated = EventGear.CALLBACK_METADATA_CHANGE_ACTIVE;  	// State if event metadata change callback response is activated
	    this.#eventCallbackIntervalCountActivated = EventGear.CALLBACK_INTERVAL_COUNT_ACTIVE;// State if event count interval callback response is activated
	    return this;
	}

	// ***** EventGear Public Interface ***** Alarm Setters *****

	/**
	 * Sets a jitter alarm with a specified threshold and callback.
	 * Setting a threshold to 0 or below disables the alarm.
	 *
	 * @param {number} threshold - The threshold for the jitter alarm.
	 * @param {Function} callback - The callback function to invoke when the alarm is triggered.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	setCallbackJitter(threshold, callback) {
	    // Use the reusable helper method to validate and set the threshold
	    this.#jitterThreshold = this.#helperSetThreshold(threshold);
	    // Set or clear the callback based on validity
	    this.#jitterAlarmCallback = (this.#jitterThreshold > 0 && typeof callback === 'function') ? callback : null;
	    return this;
	}

	/**
	 * Sets frequency alarm thresholds and an optional callback.
	 * The callback will be set if either threshold is greater than zero.
	 *
	 * @param {number} lowerThreshold - The lower threshold for frequency.
	 * @param {number} upperThreshold - The upper threshold for frequency.
	 * @param {Function} [callback] - Optional callback function to be invoked when thresholds are met.
	 * @returns {EventGear} Current instance for chaining.
	 */
	setCallbackFrequency(lowerThreshold, upperThreshold, callback) {
	    // Use the reusable helper method to set thresholds
	    this.#frequencyLowerThreshold = this.#helperSetThreshold(lowerThreshold);
	    this.#frequencyUpperThreshold = this.#helperSetThreshold(upperThreshold);
	    // Set or clear the callback based on validity
	    this.#frequencyAlarmCallback = ((this.#frequencyLowerThreshold > 0 || this.#frequencyUpperThreshold > 0) &&
		typeof callback === 'function') ? callback : null;
	    return this;
	}

	/**
	 * Sets alarms for maximum events per frame with specified thresholds and a callback.
	 * Setting a threshold to 0 or below disables that specific threshold.
	 *
	 * @param {number} lowerThreshold - The lower threshold for max events per frame.
	 * @param {number} upperThreshold - The upper threshold for max events per frame.
	 * @param {Function} callback - The callback function to invoke when the alarm is triggered.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	setCallbackMaxEventsPerFrame(lowerThreshold, upperThreshold, callback) {
	    // Use the reusable helper method to set thresholds
	    this.#maxEventsPerFrameLowerThreshold = this.#helperSetThreshold(lowerThreshold);
	    this.#maxEventsPerFrameUpperThreshold = this.#helperSetThreshold(upperThreshold);
	    // Set or clear the callback based on validity
	    this.#maxEventsPerFrameAlarmCallback = ((this.#maxEventsPerFrameLowerThreshold > 0 || 
		this.#maxEventsPerFrameUpperThreshold > 0) && typeof callback === 'function') ? callback : null;
	    return this;
	}

	/**
	 * Sets a total time alarm with a specified threshold and callback.
	 * Setting a threshold to 0 or below disables the alarm.
	 *
	 * @param {number} threshold - The threshold for the total time alarm in seconds.
	 * @param {Function} callback - The callback function to invoke when the alarm is triggered.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	setCallbackTotalTime(threshold, callback) {
	    // Use the reusable helper method to validate and set the threshold
	    this.#totalTimeThreshold = this.#helperSetThreshold(threshold);
	    // Set or clear the callback based on validity
	    this.#totalTimeAlarmCallback = (this.#totalTimeThreshold > 0 && typeof callback === 'function') ? callback : null;
	    this.#totalTimeAlarmTriggered = false; 	// Reset flag that the running time callback has been triggered
	    return this;
	}

	/**
	 * Sets a total count alarm with a specified threshold and callback.
	 * Setting a threshold to 0 or below disables the alarm.
	 *
	 * @param {number} threshold - The threshold for the total count alarm.
	 * @param {Function} callback - The callback function to invoke when the alarm is triggered.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	setCallbackTotalCount(threshold, callback) {
	    // Use the reusable helper method to validate and set the threshold
	    this.#totalCountThreshold = this.#helperSetThreshold(threshold);
	    // Set or clear the callback based on validity
	    this.#totalCountAlarmCallback = (this.#totalCountThreshold > 0 && typeof callback === 'function') ? callback : null;
	    this.#totalCountAlarmTriggered = false;	// Reset flag that the event count callback has been triggered
	    return this;
	}

	/**
	 * Sets an interval-based time alarm with a specified interval and repeated callback.
	 * Setting an interval to 0 or below disables the alarm.
	 *
	 * @param {number} interval - The interval in milliseconds for the time alarm.
	 * @param {Function} callback - The callback function to invoke when the alarm is triggered.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	setCallbackIntervalTime(interval, callback) {
	    // Use the reusable helper method to validate and set the interval
	    this.#TotalTimeIntervalAlarm = this.#helperSetThreshold(interval);
	    // Set or clear the callback based on validity
	    if (this.#TotalTimeIntervalAlarm > 0 && typeof callback === 'function') {
		this.#IntervalTimeAlarmCallback = callback;
		// Update next threshold based on total running time and interval
		this.#intervalTimeThreshold = this.#metrics.micro.seconds + interval;
	    } else {
		this.#IntervalTimeAlarmCallback = null; // Clear if invalid or if interval is 0
		this.#intervalTimeThreshold = 0; // Reset time threshold as well
	    }
	    return this;
	}

	/**
	 * Sets an interval-based count alarm with a specified count interval and repeated callback.
	 * Setting an interval to 0 or below disables the alarm.
	 *
	 * @param {number} interval - The count interval for the count alarm.
	 * @param {Function} callback - The callback function to invoke when the alarm is triggered.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	setCallbackIntervalCount(interval, callback) {
	    // Use the reusable helper method to validate and set the interval
	    this.#EventCountIntervalAlarm = this.#helperSetThreshold(interval);
	    // Set or clear the callback based on validity
	    if (this.#EventCountIntervalAlarm > 0 && typeof callback === 'function') {
		this.#IntervalCountAlarmCallback = callback;
		// Update threshold based on total event count and interval
		this.#intervalCountThreshold = this.#metrics.micro.events + interval;
	    } else {
		this.#IntervalCountAlarmCallback = null; // Clear if invalid or if interval is 0
		this.#intervalCountThreshold = 0; // Reset count threshold as well
	    }
	    return this;
	}

	/**
	 * Toggles the activation state of the interval based count callback.
	 *
	 * @param {boolean} isActive - The state to set for the metadata change callback.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	setCallbackIsActivatedIntervalCount(isActive) {
	    this.#eventCallbackIntervalCountActivated = isActive; // Toggle the state for metadata change callback.
	    return this;
	}

	// ***** EventGear Public Interface ***** Configuration Setters *****

	/**
	 * Sets the active state of the event counter for debugging and manual control.
	 * Prefer using start(), stop() for normal operations.
	 *
	 * @param {boolean} isActive - True to activate, false to deactivate.
	 * @throws {Error} If an error occurs during state change.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	 setIsActive(isActive) {
	    const newState = Boolean(isActive);
	    if (this.#isActive !== newState) {
		try {
		    if (newState) {
		        this.start();
		    } else {
		        this.stop();
		    }
		    this.#isActive = newState;
		    console.log(`EventGear active state manually set to: ${newState}`);
		} catch (error) {
		    console.error(`Error changing EventGear active state: ${error.message}`);
		    // Attempt to force the inactive state if an error occurs
		    if (!newState) {
		        this.#isActive = false;
		        console.warn('EventGear forced to inactive state due to error');
		    }
		    throw new Error(`Failed to set EventGear active state: ${error.message}`);
		}
	    }
	    return this;
	}

	/**
	 * Sets the maximum history size for event tracking.
	 *
	 * @param {number} maxSize - The desired maximum history size.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	setMaxHistorySize(maxSize) {
	    this.#maxHistorySize = Math.max(0, Math.min(maxSize, EventGear.MAX_HISTORY_SIZE));
	    if (this.#maxHistorySize === 0) {
		// Clear history if max size is set to 0
		this.#frameHistory = [];
		this.#exceedancesHistory = [];
	    }
	    return this;
	}

	/**
	 * Sets the timeframe duration for event counting.
	 * Setting it to 0 disables timeframe calculations and resets current event tracking.
	 *
	 * @param {number} duration - The duration in seconds; use 0 to disable timeframe calculations.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	setFrameDuration(duration) {
	    if (this.#frameDuration === duration) return this;
	    this.#frameDuration = Math.max(0, duration);
	    if (this.#frameDuration === 0) {
		// Reset events if timeframe is disabled
		this.#metrics.frame.reset();
		this.#frameTimestampArray = [];
	        clearInterval(this.#IntervalIDframe); 		// Clear the timeframe-based interval
	    } else {
	        clearInterval(this.#IntervalIDframe); 		// Clear the timeframe-based interval
	        this.#timestampFrameStart = performance.now();	// Set new timeframe start timestamp
		this.#startIntervalTimeframe();			// Start synced internal interval

	    }
	    return this;
	}

	/**
	 * Sets the length of the independent update interval.
	 *
	 * @param {number} length - The desired length in milliseconds; a negative number will deactivate the timer by setting it to 0.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	setIndependentIntervalLength(length) {
	    if (length < 0) {
		this.#independentIntervalLength = 0; // Deactivate timer by setting length to 0
		clearInterval(this.#IntervalIDindependent);
	    } else {
	    	if (this.#independentIntervalLength === length) return this;
		this.#independentIntervalLength = length; // Set the new length
		if (this.#isActive) {
		    clearInterval(this.#IntervalIDindependent);
		    this.#startIntervalIndependent();
		}
	    }
	    return this;
	}

	/**
	 * Sets the performance metrics activation state.
	 *
	 * @param {boolean} isActive - True to activate performance metrics tracking, false to deactivate.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	setEventPerformanceMetricsActive(isActive) {
	    this.#eventPerformanceMetricsActive = Boolean(isActive); // Ensure the value is a boolean
	    return this;
	}

	/**
	 * Sets the short-term buffer size and adjusts the timestamp buffer accordingly.
	 * The buffer size is capped between 0 and EventGear.MAX_SHORT_BUFFER_SIZE.
	 * If newSize is not a positive integer, it sets the buffer size to 0 and clears existing timestamps.
	 *
	 * @param {number} newSize - The new size for the short-term buffer.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	setShortTermBufferSize(newSize) {
	    this.#shortTermBufferSize = Math.max(0, Math.min(Math.floor(newSize), EventGear.MAX_SHORT_BUFFER_SIZE));
	    if (this.#shortTermBufferSize === 0) {
		this.#shortTermEventTimestamps = [];
		this.#shortTermFrequency = 0;
		this.#shortTermJitter = 0;
	    } else {
		this.#shortTermEventTimestamps = this.#shortTermEventTimestamps.slice(-this.#shortTermBufferSize);
		// Recalculate short-term metrics if needed
		if (this.#shortTermEventTimestamps.length > 0) {
		    this.#updateShortTermFrequency(this.#shortTermEventTimestamps[this.#shortTermEventTimestamps.length - 1]);
		}
	    }
	    return this;
	}

	/**
	 * Sets the frequency smoothing factor for current timeframe analysis.
	 * This value should be between 0 and 1; values outside this range or non-numerical inputs will reset to the default smoothing factor.
	 *
	 * @param {number} frequencySmoothingFactor - The smoothing factor for frequency analysis (0 to 1).
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
  	setFrequencySmoothingFactor(frequencySmoothingFactor) {
	    if (typeof frequencySmoothingFactor !== 'number' || !Number.isFinite(frequencySmoothingFactor)) {
		this.#TimeframeFrequencySmoothFactor = EventGear.DEFAULT_SMOOTHING_FACTOR; // Reset on not numerical or missing parameter
	    }
	    if (frequencySmoothingFactor > 0 && frequencySmoothingFactor <= 1) { // Update to new setting
		this.#TimeframeFrequencySmoothFactor = frequencySmoothingFactor;
	    } else {
		this.#TimeframeFrequencySmoothFactor = EventGear.DEFAULT_SMOOTHING_FACTOR; // Reset on invalid parameter
		console.warn('Invalid value: frequencySmoothingFactor must be between 0 and 1.');
	    }
	    return this;
	}

	// ***** EventGear Public Interface ***** Getters *****

        /**
         * Universal getter for values, supporting both shortcuts and full paths
         */
        getValue(path) {
            if (typeof path !== 'string') {
                throw new TypeError('Argument must be a string representing the property path.');
            }
            if (path.startsWith('$')) {
                const getter = this.#shortcutLookup[path];
                if (getter) {
                    return getter();
                }
                throw new Error(`Shortcut '${path}' not found.`);
            }
            return this.getValueFromObject(path);
        }

	// Event Metadata
	getMetadata = () => this.#metadata; 						// Metadata of the latest event
	getMetadataPrevious = () => this.#metadataPrevious; 				// Metadata of previous event

	// General State of EventGear instance 
	getIsActive = () => !!this.#isActive; 						// Returns whether the counter is currently active
	getEventRegistrationInProgress = () => !!this.#isEventRegistrationInProgress; 	// Returns if actually an event registration is in progress

	// Settings and Config Information
	getMaxHistorySize = () => this.#maxHistorySize; 				// Returns the maximum size of the history arrays (timeframe and exceedances)
	getTimeframe = () => this.#frameDuration; 					// Returns the current timeframe duration in seconds
	getIndependentIntervalLength = () => this.#independentIntervalLength; 		// Returns the current independant interval duration in milliseconds
    	getShortTermBufferSize = () => this.#shortTermBufferSize; 			// Gets the current short-term buffer size
    	getFrequencySmoothingFactor = () => this.#TimeframeFrequencySmoothFactor; 	// Gets the current Frequency Smoothing Factor
	getEventPerformanceMetricsActive = () => !!this.#eventPerformanceMetricsActive; // Getter for Performance Metrics Activation State

	// Metrics Objects
	getMetrics = () => structuredClone(this.#metrics);				// Metrics object with all different sub sets
	getMetricsMicro = () => ({ ...this.#metrics.micro });				// Metrics for total, last millisecond and "now" timestamp
	getMetricsFrame = () => ({ ...this.#metrics.frame });				// Metrics for individual timeframe analysis

	// Event Execution Time Objects
	getDuration = () => structuredClone(this.#duration);				// Duration object with all different sub sets
	getDurationEvent = () => ({ ...this.#duration.event });				// Duration times for last event execution
	getDurationTotal = () => ({ ...this.#duration.total });				// Duration times for total execution since started
	getDurationFrame = () => ({ ...this.#duration.frame });				// Duration times for total execution since started
	
	// Timing Information
	getTimestampStartTime = () => this.#timestampStart; 				// The timestamp when the counter was started
	getTimestampLastEvent = () => this.#metrics.micro.timestampLast; 		// Timestamp of the last incoming event
	getTimestampTimeframe = () => this.#timestampFrameStart; 			// The timestamp when the open timeframe began
	getTotalRunningTime = () => this.#metrics.micro.seconds; 			// Total time the counter has been running (in seconds)
	getTimeframeCount = () => this.#totalFrameCount; 					// Number of completed timeframes since the counter started

	// Event Counts
	getEventCountTotal = () => this.#metrics.micro.events; 				// Total number of events registered since the counter started
	getEventCountLastSecond = () => this.#microTimestampBuffer.getCountInLastMilliseconds (1000); 	// Number of events in the last second
	getEventCountLastMinute = () => this.#microTimestampBuffer.getCountInLastMilliseconds (60000); 	// Number of events in the last minute
	getEventCountTimeframe = () => this.#metrics.frame.events; 					// Number of events in the current timeframe

	// Callback Activation States
	getCallbackIsActivatedMetadata = () => !!this.#eventCallbackMetadataActivated; 	// State if event metadata change callback response is activated
	getCallbackIsActivatedResponse = () => !!this.#eventCallbackResponseActivated; 	// State if event default callback response is activated
	getCallbackIsActivatedIntervalCount = () => !!this.#eventCallbackIntervalCountActivated; // State if interval count callback is activated

	// Frequency Data
	getShortTermFrequency = () => this.#shortTermFrequency; 			// Gets the current short-term frequency        
	getShortTermJitter = () => this.#shortTermJitter; 				// Gets the short term jitter
	getLastTimeframeFrequency = () => this.#frameFrequencyLast; 			// Frequency (Hz) of events in the last completed timeframe
	getTotalFrequency = () => this.#metrics.micro.frequency;			// Call the method to get the total frequency
	getMaxFrequency = () => this.#totalFrequencyMax; 					// Maximum frequency observed since the counter started
	getCurrentFrequencyPerMinute = () => this.#metrics.micro.frequency * 60;	// Current frequency (events per minute)
	getLastTimeframeFrequencyPerMinute = () => this.#frameFrequencyLast * 60;	// Last timeframe frequency converted to events per minute

	// Alarm Thresholds
	// These getters provide access to alarm thresholds for various metrics
	getCallbackTotalTimeThreshold = () => this.#totalTimeThreshold; 		// Threshold for total running time alarm (in seconds)
	getCallbackTotalTimeTriggered = () => this.#totalTimeAlarmTriggered; 		// Returns whether the total time alarm has been triggered
	getCallbackTotalCountThreshold = () => this.#totalCountThreshold; 		// Threshold for total event count alarm
	getCallbackTotalCountTriggered = () => this.#totalCountAlarmTriggered; 		// Returns whether the total count alarm has been triggered
	getCallbackJitterThreshold = () => this.#jitterThreshold; 			// Threshold for jitter alarms (in milliseconds)
	getCallbackFrequencyLowerThreshold = () => this.#frequencyLowerThreshold; 	// Lower threshold for frequency alarms (Hz)
	getCallbackFrequencyUpperThreshold = () => this.#frequencyUpperThreshold; 	// Upper threshold for frequency alarms (Hz)
	getCallbackMaxEventsPerFrameLowerThreshold = () => this.#maxEventsPerFrameLowerThreshold; // Lower threshold for max events per frame alarms
	getCallbackMaxEventsPerFrameUpperThreshold = () => this.#maxEventsPerFrameUpperThreshold; // Upper threshold for max events per frame alarms
	// Interval repeated Alarm Duration and next step threshold
	getCallbackTotalTimeIntervalDuration = () => this.#TotalTimeIntervalAlarm; 	// Duration of the time-based interval alarm in milliseconds
	getCallbackTotalTimeIntervalThreshold = () => this.#intervalTimeThreshold; 	// Next trigger step for repeated interval-based time alarms (in seconds)
	getCallbackEventCountIntervalDuration = () => this.#EventCountIntervalAlarm; 	// Duration of the count-based interval alarm in number of events
	getCallbackEventCountIntervalThreshold = () => this.#intervalCountThreshold; 	// Threshold for interval-based count alarms

	// Exceedance Counts
	getJittercheckTrueCount = () => this.#jittercheckTrueCount; 			// Number of times jitter exceeded its threshold
	getFrequencycheckTrueCountLower = () => this.#frequencycheckTrueCountLower; 	// Number of times frequency fell below its lower threshold
	getFrequencycheckTrueCountUpper = () => this.#frequencycheckTrueCountUpper; 	// Number of times frequency exceeded its upper threshold
	getMaxEventscheckTrueCountLower = () => this.#maxEventscheckTrueCountLower; 	// Number of times max events fell below its lower threshold
	getMaxEventscheckTrueCountUpper = () => this.#maxEventscheckTrueCountUpper; 	// Number of times max events exceeded its upper threshold

	// Elements and eventTypes linked from DOM
	getDOMelements = () => ([...this.#DOMelements]);				// DOM Element linked to Event listener
	getDOMeventTypes = () => ([...this.#DOMeventTypes]);				// DOM eventType linked to Event listener

	// Historical Data arrays
	getTimeframeHistory = () => [...this.#frameHistory]; 				// Returns an array of historical data for completed timeframes
	getExceedancesHistory = () => [...this.#exceedancesHistory]; 			// Returns an array of historical exceedances data

	// Raw Event Data timestamp buffers and arrays
	getMicroTimestamps = () => ([...this.#microTimestampBuffer.buffer]);		// Array of event timestamps paired with count from the micro metrics
	getShortTimestamps = () => ([...this.#shortTermEventTimestamps]); 		// Array of event timestamps in the short term
	getFrameTimestamps = () => ([...this.#frameTimestampArray]);			// Array of event timestamps in the current timeframe

	// ***** EventGear Public Interface ***** WebSocketBridge Control Methods *****

	/**
	 * Sets the URL and token for the incoming WebSocket connection.
	 * @param {string} url - The URL to listen for incoming events.
	 * @param {string} [token=null] - Authentication token for the WebSocket connection.
	 * @returns {EventGear} The EventGear instance for method chaining.
	 */
	websocketSetIncomingUrl(url, token = null) {
	    this.#websocket.setIncomingWebSocket(url, token);
	    return this;
	}

	/**
	 * Sets the authentication token for the incoming WebSocket connection.
	 * @param {string} [token=null] - Authentication token for the WebSocket connection.
	 * @returns {EventGear} The EventGear instance for method chaining.
	 */
	websocketSetIncomingToken(token = null) {
	    this.#websocket.setIncomingToken(token);
	    return this;
	}

	/**
	 * Sets the channel name for incoming events.
	 * @param {string} channelName - The name of the channel to listen for incoming events.
	 * @returns {EventGear} The EventGear instance for method chaining.
	 */
	websocketSetIncomingChannel(channelName) {
	    this.#websocket.setReceiveChannel(channelName);
	    return this;
	}

	/**
	 * Configures automatic reception of incoming events.
	 * @param {boolean} isActive - If true, automatically receive events from the specified channel.
	 * @returns {EventGear} The EventGear instance for method chaining.
	 */
	websocketSetAutoReceive(isActive) {
	    this.#websocket.setAutoReceive(!!isActive);
	    return this;
	}

	/**
	 * Sets the URL and token for the outgoing WebSocket connection.
	 * @param {string} url - The URL for sending outgoing events.
	 * @param {string} [token=null] - Authentication token for the WebSocket connection.
	 * @returns {EventGear} The EventGear instance for method chaining.
	 */
	websocketSetOutgoingUrl(url, token = null) {
	    this.#websocket.setOutgoingWebSocket(url, token);
	    return this;
	}

	/**
	 * Sets the authentication token for the outgoing WebSocket connection.
	 * @param {string} [token=null] - Authentication token for the WebSocket connection.
	 * @returns {EventGear} The EventGear instance for method chaining.
	 */
	websocketSetOutgoingToken(token = null) {
	    this.#websocket.setOutgoingToken(token);
	    return this;
	}

	/**
	 * Sets the channel name for outgoing events.
	 * @param {string} channelName - The name of the channel to send outgoing events.
	 * @returns {EventGear} The EventGear instance for method chaining.
	 */
	websocketSetOutgoingChannel(channelName) {
	    this.#websocket.setSendChannel(channelName);
	    return this;
	}

	/**
	 * Configures automatic sending of outgoing events.
	 * @param {boolean} isActive - If true, automatically send events to the specified channel.
	 * @returns {EventGear} The EventGear instance for method chaining.
	 */
	websocketSetAutoSend(isActive) {
	    this.#websocket.setAutoSend(!!isActive);
	    return this;
	}

	/**
	 * Configures automatic pass-through of incoming events to the outgoing channel.
	 * @param {boolean} isActive - If true, automatically forward incoming events to the outgoing channel.
	 * @returns {EventGear} The EventGear instance for method chaining.
	 */
	websocketSetAutoPassThrough(isActive) {
	    this.#websocket.setAutoPassThrough(!!isActive);
	    return this;
	}

	/**
	 * Resets all WebSocket configurations and disables auto-receive and auto-send.
	 * @returns {EventGear} The EventGear instance for method chaining.
	 */
	websocketReset() {
	    this.#websocket.reset();
	    return this;
	}

	/**
	 * Sends data with metadata through the predefined outgoing channel.
	 * @param {*} data - The data to send along with the event.
	 * @returns {EventGear} The EventGear instance for method chaining.
	 */
	websocketSendEvent(data) {
	    this.#websocket.sendEvent(data);
	    return this;
	}

	/**
	 * Sends data through a specified channel on the outgoing WebSocket.
	 * @param {string} channel - The channel to send on.
	 * @param {*} data - The data to send.
	 * @returns {EventGear} The EventGear instance for method chaining.
	 */
	websocketSend(channel, data) {
	    this.#websocket.send(channel, data);
	    return this;
	}

	/**
	 * Adds an event listener to the WebSocket.
	 * @param {string} event - The event name to listen for.
	 * @param {Function} callback - The callback function to execute when the event occurs.
	 * @returns {EventGear} The EventGear instance for method chaining.
	 */
	websocketEventListenerAdd(event, callback) {
	    this.#websocket.on(event, callback);
	    return this;
	}

	/**
	 * Removes an event listener from the WebSocket.
	 * @param {string} event - The event name to remove the listener from.
	 * @param {Function} callback - The callback function to remove.
	 * @returns {EventGear} The EventGear instance for method chaining.
	 */
	websocketEventListenerRemove(event, callback) {
	    this.#websocket.off(event, callback);
	    return this;
	}

	/**
	 * Emits an event on the WebSocket.
	 * @param {string} event - The event name to emit.
	 * @param {*} data - The data to emit with the event.
	 * @returns {EventGear} The EventGear instance for method chaining.
	 */
	websocketEventListenerEmit(event, data) {
	    this.#websocket.emit(event, data);
	    return this;
	}

   	// Getter methods for websocket.js integration properties
    	websocketGetIncomingWebSocketActive = () => !!this.#websocket.isIncomingWebSocketActive(); 	// Check if Incoming Websocket is active
    	websocketGetIncomingHasToken = () => !!this.#websocket.hasIncomingToken() 			// Check if Incoming Websocket has token
    	websocketGetOutgoingWebSocketActive = () => !!this.#websocket.isOutgoingWebSocketActive(); 	// Check if Outgoing Websocket is active
    	websocketGetOutgoingHasToken = () => !!this.#websocket.hasOutgoingToken() 			// Check if Incoming Websocket has token
    	websocketGetAutoReceive = () => !!this.#websocket.autoReceive; 					// Auto receive events from websocket flag
        websocketGetAutoSend = () => !!this.#websocket.autoSend; 					// Auto send events to websocket flag
	websocketGetAutoPassThrough = () => !!this.#websocket.autoPassThrough				// Auto-pass-through events from in to out websocket flag
    	websocketGetIncomingChannel = () => this.#websocket.channelIn; 					// Incoming channel name
    	websocketGetOutgoingChannel = () => this.#websocket.channelOut; 				// Outgoing channel name


	// ***** EventGear Public Interface ***** Node.js Bridge Control Methods *****

	/**
	 * node.js Bridge - Set the name of the incoming channel for event reception.
	 * @param {string} channelName - The name of the channel to listen for incoming events.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	nodeSetIncomingChannel(channelName) {
	    this.#node.setChannelIn(channelName);
	    return this;
	}

	/**
	 * node.js Bridge - Set the auto-receive flag for incoming events.
	 * @param {boolean} isActive - If true, automatically receive events from the specified channel.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	nodeSetAutoReceive(isActive) {
	    this.#node.setAutoReceive(!!isActive);
	    return this;
	}

	/**
	 * node.js Bridge - Set the name of the outgoing channel for event transmission.
	 * @param {string} channelName - The name of the channel to send outgoing events.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	nodeSetOutgoingChannel(channelName) {
	    this.#node.setChannelOut(channelName);
	    return this;
	}

	/**
	 * node.js Bridge - Set the auto-send flag for outgoing events.
	 * @param {boolean} isActive - If true, automatically send events to the specified channel.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	nodeSetAutoSend(isActive) {
	    this.#node.setAutoSend(!!isActive);
	    return this;
	}

	/**
	 * node.js Bridge - Set the auto-pass-through flag for sending incoming events to outgoing channel.
	 * @param {boolean} isActive - If true, automatically send events to the specified channel.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	nodeSetAutoPassThrough(isActive) {
	    this.#node.setAutoPassThrough(!!isActive);
	    return this;
	}

	/**
	 * node.js Bridge - Reset all configurations and switch off auto receive and send.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	nodeReset() {
	    this.#node.reset();
	    return this;
	}

	/**
	 * node.js Bridge - Send data with metadata through the predefined outgoing channel.
	 * @param {*} metadata - The metadata to send along with the event.
	 * @returns {EventGear} The EventGear instance for chaining.
	 */
	nodeSendEvent(metadata) {
	    this.#node.sendEvent(metadata);
	    return this;
	}

   	// Getter methods for Node.js integration properties
    	nodeGetIsActive = () => !!this.#node.nodeIsActive; 				// Check if Node.js environment is active
    	nodeGetAutoReceive = () => !!this.#node.autoReceive; 				// Auto receive events from node flag
        nodeGetAutoSend = () => !!this.#node.autoSend; 					// Auto send events to node flag
	nodeGetAutoPassThrough = () => !!this.#node.autoPassThrough			// Auto-pass-through events from in to out node flag
    	nodeGetIncomingChannel = () => this.#node.channelIn; 				// Incoming channel name
    	nodeGetOutgoingChannel = () => this.#node.channelOut; 				// Outgoing channel name
}

// ***** EventGear Module Export ***** 

// Check if we are in a Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS export for Node.js
    module.exports = EventGear; // Exports the class
}

// Provide a named export for version
const version = '0.5.8';
if (typeof module !== 'undefined' && module.exports) {
    module.exports.version = version; // For Node.js
} else if (typeof window !== 'undefined') {
    window.EventGearVersion = version; // For browser environments
}

// Default export for ES6 modules --- comment out for node integration
export default EventGear;

